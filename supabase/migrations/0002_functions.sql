-- FGF Campus — logique métier côté serveur
--
-- Règle de conception : tout ce qui pourrait être triché depuis le navigateur
-- est calculé ici. Les bonnes réponses ne sont jamais envoyées au client avant
-- correction, les scores ne sont jamais acceptés tels quels, et l'émission d'une
-- attestation vérifie elle-même que les conditions sont réunies.

-- ─────────────────────────────────────────────────────────────
-- Passage d'un QCM
-- ─────────────────────────────────────────────────────────────

-- Renvoie les questions d'un module sans la bonne réponse ni l'explication.
create function get_quiz(p_module_id uuid)
-- « position » est un mot réservé PostgreSQL : il doit être cité pour nommer
-- une colonne de retour, sans quoi la création de la fonction échoue.
returns table (id uuid, prompt text, choices jsonb, "position" int)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select q.id, q.prompt, q.choices, q.position
  from questions q
  join modules m on m.id = q.module_id
  join courses c on c.id = m.course_id
  where q.module_id = p_module_id
    and (c.status = 'publie' or c.author_id = auth.uid() or is_admin())
  order by q.position;
$$;

-- Corrige une copie. `p_answers` est un objet {question_id: index_choisi}.
-- Le score est calculé ici : le client ne peut pas l'inventer.
create function submit_quiz(p_module_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_total int;
  v_score int := 0;
  v_wrong jsonb := '[]'::jsonb;
  v_detail jsonb := '[]'::jsonb;
  r record;
  v_given int;
begin
  if v_user is null then
    raise exception 'Authentification requise.';
  end if;

  -- Contrôle d'accès explicite : la fonction est SECURITY DEFINER, elle
  -- contourne donc la policy qui protège la table `questions`.
  if not exists (
    select 1 from modules m
    join courses c on c.id = m.course_id
    where m.id = p_module_id
      and (c.status = 'publie' or c.author_id = auth.uid() or is_admin())
  ) then
    raise exception 'Module inaccessible.';
  end if;

  select count(*) into v_total from questions where module_id = p_module_id;
  if v_total = 0 then
    raise exception 'Ce module ne comporte aucune question.';
  end if;

  for r in
    select id, answer, explanation from questions where module_id = p_module_id order by position
  loop
    v_given := nullif(p_answers ->> r.id::text, '')::int;

    -- Une question laissée sans réponse ne donne lieu à aucune divulgation :
    -- sans cette réserve, un appel avec un objet vide renverrait le corrigé
    -- intégral du module à qui le demande.
    if v_given is null then
      v_wrong := v_wrong || to_jsonb(r.id);
      continue;
    end if;

    if v_given = r.answer then
      v_score := v_score + 1;
    else
      v_wrong := v_wrong || to_jsonb(r.id);
    end if;

    v_detail := v_detail || jsonb_build_object(
      'question_id', r.id,
      'given', v_given,
      'answer', r.answer,
      'correct', (v_given = r.answer),
      'explanation', r.explanation
    );
  end loop;

  insert into quiz_attempts (user_id, module_id, score, total, wrong_question_ids)
  values (v_user, p_module_id, v_score, v_total, v_wrong);

  perform award_badges();

  return jsonb_build_object(
    'score', v_score,
    'total', v_total,
    'passed', (v_score::numeric / v_total) >= 0.7,
    'detail', v_detail
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Examens
-- ─────────────────────────────────────────────────────────────

-- Tire au sort les questions d'une épreuve, sans les réponses, et conserve le
-- tirage côté serveur. La session retournée est le seul moyen de soumettre.
create function start_exam(p_exam_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_exam exams;
  v_ids uuid[];
  v_session uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentification requise.';
  end if;

  select * into v_exam from exams where exams.id = p_exam_id;
  if v_exam is null then
    raise exception 'Épreuve introuvable.';
  end if;
  if v_exam.status <> 'publie' and not is_admin() and v_exam.author_id <> auth.uid() then
    raise exception 'Cette épreuve n''est pas ouverte.';
  end if;

  select array_agg(q.id) into v_ids
  from (
    select q.id
    from questions q
    join modules m on m.id = q.module_id
    join courses c on c.id = m.course_id
    where m.course_id in (select (jsonb_array_elements_text(v_exam.course_ids))::uuid)
      -- Un parcours encore en brouillon ne doit pas alimenter une épreuve ouverte.
      and c.status = 'publie'
    order by random()
    limit v_exam.question_count
  ) q;

  if v_ids is null or array_length(v_ids, 1) = 0 then
    raise exception 'Aucune question disponible pour cette épreuve.';
  end if;

  insert into exam_sessions (user_id, exam_id, question_ids)
  values (auth.uid(), p_exam_id, to_jsonb(v_ids))
  returning id into v_session;

  return jsonb_build_object(
    'session_id', v_session,
    'duration_minutes', v_exam.duration_minutes,
    'questions', (
      select coalesce(jsonb_agg(jsonb_build_object('id', q.id, 'prompt', q.prompt, 'choices', q.choices)), '[]'::jsonb)
      from questions q where q.id = any(v_ids)
    )
  );
end;
$$;

create function submit_exam(p_session_id uuid, p_answers jsonb, p_duration_seconds int default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_session exam_sessions;
  v_exam exams;
  v_total int := 0;
  v_score int := 0;
  v_detail jsonb := '[]'::jsonb;
  v_passed boolean;
  r record;
  v_given int;
begin
  if v_user is null then
    raise exception 'Authentification requise.';
  end if;

  -- La correction porte sur le tirage enregistré au démarrage, jamais sur la
  -- liste envoyée par le client : sinon il suffirait de soumettre une seule
  -- question juste pour obtenir 100 % et déclencher un certificat.
  select * into v_session from exam_sessions where id = p_session_id and user_id = v_user;
  if v_session is null then
    raise exception 'Session d''épreuve introuvable.';
  end if;
  if v_session.submitted_at is not null then
    raise exception 'Cette épreuve a déjà été rendue.';
  end if;

  select * into v_exam from exams where exams.id = v_session.exam_id;

  if now() > v_session.started_at + (v_exam.duration_minutes || ' minutes')::interval + interval '2 minutes' then
    raise exception 'Le temps imparti est écoulé.';
  end if;

  v_total := jsonb_array_length(v_session.question_ids);

  for r in
    select q.id, q.answer, q.explanation, q.prompt
    from questions q
    where q.id = any (select (jsonb_array_elements_text(v_session.question_ids))::uuid)
  loop
    v_given := nullif(p_answers ->> r.id::text, '')::int;
    if v_given is not null and v_given = r.answer then
      v_score := v_score + 1;
    end if;
    v_detail := v_detail || jsonb_build_object(
      'question_id', r.id,
      'prompt', r.prompt,
      'given', v_given,
      'answer', r.answer,
      'correct', (v_given is not null and v_given = r.answer),
      'explanation', r.explanation
    );
  end loop;

  update exam_sessions set submitted_at = now() where id = p_session_id;

  v_passed := (v_score::numeric / v_total) * 100 >= v_exam.pass_threshold;

  insert into exam_attempts (user_id, exam_id, score, total, passed, duration_seconds, detail)
  values (v_user, v_session.exam_id, v_score, v_total, v_passed, p_duration_seconds,
          jsonb_build_object('questions', v_detail));

  -- La réussite d'un examen déclenche l'émission du certificat interne.
  if v_passed then
    perform issue_credential('certificat', null, v_session.exam_id);
  end if;

  perform award_badges();

  return jsonb_build_object(
    'score', v_score,
    'total', v_total,
    'passed', v_passed,
    'threshold', v_exam.pass_threshold,
    'detail', v_detail
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Badges
--
-- Les règles sont volontairement évaluées côté serveur à partir des tentatives
-- réellement enregistrées. Un badge ne peut pas être réclamé par le client.
-- ─────────────────────────────────────────────────────────────

create function award_badges()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_lessons int;
  v_quizzes_passed int;
  v_perfect int;
  v_courses_done int;
  v_exams_passed int;
begin
  if v_user is null then
    return;
  end if;

  select count(*) into v_lessons from lesson_progress where user_id = v_user;

  select count(distinct module_id) into v_quizzes_passed
  from quiz_attempts where user_id = v_user and (score::numeric / total) >= 0.7;

  select count(*) into v_perfect
  from quiz_attempts where user_id = v_user and score = total;

  select count(*) into v_courses_done
  from enrollments where user_id = v_user and completed_at is not null;

  select count(*) into v_exams_passed
  from exam_attempts where user_id = v_user and passed;

  insert into user_badges (user_id, badge_id)
  select v_user, b.id
  from badges b
  where
    case b.slug
      when 'premiere-lecon'    then v_lessons >= 1
      when 'dix-lecons'        then v_lessons >= 10
      when 'vingt-cinq-lecons' then v_lessons >= 25
      when 'premier-qcm'       then v_quizzes_passed >= 1
      when 'cinq-qcm'          then v_quizzes_passed >= 5
      when 'sans-faute'        then v_perfect >= 1
      when 'trois-sans-faute'  then v_perfect >= 3
      when 'parcours-acheve'   then v_courses_done >= 1
      when 'trois-parcours'    then v_courses_done >= 3
      when 'examen-reussi'     then v_exams_passed >= 1
      else false
    end
  on conflict do nothing;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Attestations et certificats
--
-- Terminologie : « attestation » constate un suivi, « certificat » constate la
-- réussite d'un examen interne à FGF Consultant. Ni l'un ni l'autre n'est un
-- diplôme ou une certification professionnelle enregistrée au RNCP.
-- ─────────────────────────────────────────────────────────────

create function issue_credential(
  p_kind credential_kind,
  p_course_id uuid default null,
  p_exam_id uuid default null
)
returns credentials
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_profile profiles;
  v_title text;
  v_score int;
  v_total int;
  v_existing credentials;
  v_row credentials;
begin
  if v_user is null then
    raise exception 'Authentification requise.';
  end if;

  select * into v_profile from profiles where id = v_user;

  if p_kind = 'attestation' then
    if p_course_id is null then
      raise exception 'Parcours requis pour une attestation.';
    end if;
    -- On ne délivre que si le parcours est réellement achevé.
    if not exists (
      select 1 from enrollments
      where user_id = v_user and course_id = p_course_id and completed_at is not null
    ) then
      raise exception 'Ce parcours n''est pas encore achevé.';
    end if;
    select title into v_title from courses where id = p_course_id;
  else
    if p_exam_id is null then
      raise exception 'Épreuve requise pour un certificat.';
    end if;
    select e.title into v_title from exams e where e.id = p_exam_id;
    select a.score, a.total into v_score, v_total
    from exam_attempts a
    where a.user_id = v_user and a.exam_id = p_exam_id and a.passed
    order by a.score desc, a.taken_at desc
    limit 1;
    if v_total is null then
      raise exception 'Aucune réussite enregistrée pour cette épreuve.';
    end if;
  end if;

  -- Un seul document par parcours ou par épreuve : on renvoie l'existant.
  select * into v_existing from credentials
  where user_id = v_user
    and kind = p_kind
    and course_id is not distinct from p_course_id
    and exam_id is not distinct from p_exam_id
    and revoked_at is null;
  if v_existing.id is not null then
    return v_existing;
  end if;

  insert into credentials (kind, user_id, course_id, exam_id, holder_name, title, score, total)
  values (
    p_kind,
    v_user,
    p_course_id,
    p_exam_id,
    coalesce(nullif(v_profile.credential_name, ''), nullif(v_profile.full_name, ''), 'Apprenant'),
    coalesce(v_title, 'Parcours FGF Campus'),
    v_score,
    v_total
  )
  returning * into v_row;

  return v_row;
end;
$$;

-- Vérification publique d'un document par son code. Ne renvoie que le strict
-- nécessaire : ni identifiant interne, ni adresse, ni score détaillé.
create function verify_credential(p_code text)
returns jsonb
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select case
    when c.id is null then jsonb_build_object('valide', false)
    when c.revoked_at is not null then jsonb_build_object('valide', false, 'motif', 'révoqué')
    else jsonb_build_object(
      'valide', true,
      'type', c.kind,
      'titulaire', c.holder_name,
      'intitule', c.title,
      'delivre_le', c.issued_at
    )
  end
  from (select * from credentials where verification_code = upper(trim(p_code))) c
  right join (select 1) dummy on true;
$$;

-- ─────────────────────────────────────────────────────────────
-- Suivi par l'entreprise cliente
-- ─────────────────────────────────────────────────────────────

-- Le référent d'entreprise ne lit pas les tables de tentatives : elles portent
-- le détail des copies, et le RLS ne sait pas masquer une colonne. Cette
-- fonction ne renvoie que les compteurs affichés par l'interface.
create function org_learner_summary()
returns table (
  user_id uuid,
  full_name text,
  role user_role,
  lessons_done bigint,
  quizzes_passed bigint,
  exams_passed bigint
)
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare
  v_org uuid := current_organization();
begin
  if not (current_role_of() = 'referent_entreprise' or is_admin()) then
    raise exception 'Réservé aux référents d''entreprise.';
  end if;
  if v_org is null and not is_admin() then
    raise exception 'Aucune entreprise rattachée à votre compte.';
  end if;

  return query
    select
      p.id,
      p.full_name,
      p.role,
      (select count(*) from lesson_progress lp where lp.user_id = p.id),
      (select count(distinct qa.module_id) from quiz_attempts qa
        where qa.user_id = p.id and qa.total > 0 and qa.score::numeric / qa.total >= 0.7),
      (select count(*) from exam_attempts ea where ea.user_id = p.id and ea.passed)
    from profiles p
    where p.organization_id is not distinct from v_org
      and p.organization_id is not null
    order by p.full_name;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Administration
-- ─────────────────────────────────────────────────────────────

-- Seul point d'entrée pour changer un rôle. Interdit de se retirer soi-même le
-- rôle d'administrateur, ce qui laisserait la plateforme sans gestionnaire.
create function set_user_role(p_user_id uuid, p_role user_role)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not is_admin() then
    raise exception 'Réservé aux administrateurs.';
  end if;
  if p_user_id = auth.uid() and p_role <> 'admin' then
    raise exception 'Un administrateur ne peut pas retirer son propre rôle.';
  end if;
  update profiles set role = p_role where id = p_user_id;
end;
$$;

create function set_user_organization(p_user_id uuid, p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not is_admin() then
    raise exception 'Réservé aux administrateurs.';
  end if;
  update profiles set organization_id = p_organization_id where id = p_user_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Droits d'exécution
-- ─────────────────────────────────────────────────────────────

-- PostgreSQL accorde EXECUTE à PUBLIC par défaut : sans révocation préalable,
-- un GRANT ciblé ne restreint rien.
revoke all on function get_quiz(uuid) from public;
revoke all on function start_exam(uuid) from public;
revoke all on function org_learner_summary() from public;
revoke all on function submit_quiz(uuid, jsonb) from public;
revoke all on function submit_exam(uuid, jsonb, int) from public;
revoke all on function issue_credential(credential_kind, uuid, uuid) from public;
revoke all on function set_user_role(uuid, user_role) from public;
revoke all on function set_user_organization(uuid, uuid) from public;
revoke all on function award_badges() from public;

grant execute on function get_quiz(uuid) to authenticated, anon;
grant execute on function org_learner_summary() to authenticated;
grant execute on function verify_credential(text) to authenticated, anon;
grant execute on function submit_quiz(uuid, jsonb) to authenticated;
grant execute on function start_exam(uuid) to authenticated;
grant execute on function submit_exam(uuid, jsonb, int) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Privilèges de table
--
-- Supabase accorde par défaut ALL sur les tables du schéma public à anon et
-- authenticated : le RLS devient alors l'unique barrière, et toute table créée
-- plus tard sans policy serait ouverte en écriture. On repart donc de zéro et
-- on n'accorde que le nécessaire. Effet de bord utile : le schéma reste
-- fonctionnel sur une instance PostgreSQL ordinaire.
-- ─────────────────────────────────────────────────────────────

revoke all on all tables in schema public from anon, authenticated;

grant select on organizations, courses, modules, lessons, exams, badges to anon, authenticated;
grant select, update on profiles to authenticated;
grant select on enrollments, lesson_progress, quiz_attempts, exam_attempts,
                user_badges, credentials to authenticated;
grant insert on enrollments to authenticated;
grant insert, delete on lesson_progress to authenticated;

-- Le formateur édite son catalogue par requêtes directes ; les policies
-- restreignent chaque ligne à l'auteur du cours.
grant insert, update, delete on courses, modules, lessons, questions, exams to authenticated;
grant insert, update, delete on organizations to authenticated;

-- `questions` n'est jamais lisible directement : les apprenants passent par
-- get_quiz(), qui omet la bonne réponse. Le formateur y accède en écriture
-- ci-dessus et en lecture via sa policy.
grant select on questions to authenticated;
grant execute on function issue_credential(credential_kind, uuid, uuid) to authenticated;
grant execute on function award_badges() to authenticated;
grant execute on function set_user_role(uuid, user_role) to authenticated;
grant execute on function set_user_organization(uuid, uuid) to authenticated;
