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
set search_path = public
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
set search_path = public
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

  select count(*) into v_total from questions where module_id = p_module_id;
  if v_total = 0 then
    raise exception 'Ce module ne comporte aucune question.';
  end if;

  for r in
    select id, answer, explanation from questions where module_id = p_module_id order by position
  loop
    v_given := nullif(p_answers ->> r.id::text, '')::int;

    if v_given is not null and v_given = r.answer then
      v_score := v_score + 1;
    else
      v_wrong := v_wrong || to_jsonb(r.id);
    end if;

    -- La correction complète n'est renvoyée qu'ici, après validation.
    v_detail := v_detail || jsonb_build_object(
      'question_id', r.id,
      'given', v_given,
      'answer', r.answer,
      'correct', (v_given is not null and v_given = r.answer),
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

-- Tire au sort les questions d'une épreuve, sans les réponses.
create function start_exam(p_exam_id uuid)
returns table (id uuid, prompt text, choices jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exam exams;
begin
  select * into v_exam from exams where exams.id = p_exam_id;
  if v_exam is null then
    raise exception 'Épreuve introuvable.';
  end if;
  if v_exam.status <> 'publie' and not is_admin() and v_exam.author_id <> auth.uid() then
    raise exception 'Cette épreuve n''est pas ouverte.';
  end if;

  return query
    select q.id, q.prompt, q.choices
    from questions q
    join modules m on m.id = q.module_id
    where m.course_id in (
      select (jsonb_array_elements_text(v_exam.course_ids))::uuid
    )
    order by random()
    limit v_exam.question_count;
end;
$$;

create function submit_exam(p_exam_id uuid, p_answers jsonb, p_duration_seconds int default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
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

  select * into v_exam from exams where exams.id = p_exam_id;
  if v_exam is null then
    raise exception 'Épreuve introuvable.';
  end if;

  -- On ne corrige que les questions réellement soumises : l'épreuve est tirée
  -- au sort, le serveur ne connaît pas d'avance la liste exacte.
  for r in
    select q.id, q.answer, q.explanation, q.prompt
    from questions q
    where q.id::text in (select jsonb_object_keys(p_answers))
  loop
    v_total := v_total + 1;
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

  if v_total = 0 then
    raise exception 'Aucune réponse soumise.';
  end if;

  v_passed := (v_score::numeric / v_total) * 100 >= v_exam.pass_threshold;

  insert into exam_attempts (user_id, exam_id, score, total, passed, duration_seconds, detail)
  values (v_user, p_exam_id, v_score, v_total, v_passed, p_duration_seconds,
          jsonb_build_object('questions', v_detail));

  -- La réussite d'un examen déclenche l'émission du certificat interne.
  if v_passed then
    perform issue_credential('certificat', null, p_exam_id);
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
set search_path = public
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
set search_path = public
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
set search_path = public
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
-- Administration
-- ─────────────────────────────────────────────────────────────

-- Seul point d'entrée pour changer un rôle. Interdit de se retirer soi-même le
-- rôle d'administrateur, ce qui laisserait la plateforme sans gestionnaire.
create function set_user_role(p_user_id uuid, p_role user_role)
returns void
language plpgsql
security definer
set search_path = public
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
set search_path = public
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

revoke all on function submit_quiz(uuid, jsonb) from public;
revoke all on function submit_exam(uuid, jsonb, int) from public;
revoke all on function issue_credential(credential_kind, uuid, uuid) from public;
revoke all on function set_user_role(uuid, user_role) from public;
revoke all on function set_user_organization(uuid, uuid) from public;
revoke all on function award_badges() from public;

grant execute on function get_quiz(uuid) to authenticated, anon;
grant execute on function verify_credential(text) to authenticated, anon;
grant execute on function submit_quiz(uuid, jsonb) to authenticated;
grant execute on function start_exam(uuid) to authenticated;
grant execute on function submit_exam(uuid, jsonb, int) to authenticated;
grant execute on function issue_credential(credential_kind, uuid, uuid) to authenticated;
grant execute on function award_badges() to authenticated;
grant execute on function set_user_role(uuid, user_role) to authenticated;
grant execute on function set_user_organization(uuid, uuid) to authenticated;
