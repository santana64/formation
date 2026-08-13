-- FGF Campus — schéma initial
--
-- Quatre rôles : apprenant, formateur, admin (super administrateur) et
-- referent_entreprise. Le rôle vit dans `profiles.role` et n'est jamais
-- modifiable par son porteur : seule une fonction réservée à l'admin le change.
--
-- Toutes les tables sont protégées par Row Level Security. Le principe retenu :
-- refuser par défaut, puis ouvrir explicitement. Aucune policy ne fait confiance
-- à une valeur envoyée par le client.

-- Sur Supabase, pgcrypto est déjà installée dans le schéma `extensions` :
-- `if not exists` ne fait alors rien et l'extension n'atterrit pas dans `public`.
-- Les appels doivent donc être qualifiés, faute de quoi la migration échoue sur
-- « function gen_random_bytes(integer) does not exist ».
create extension if not exists pgcrypto with schema extensions;

-- ─────────────────────────────────────────────────────────────
-- Types
-- ─────────────────────────────────────────────────────────────

create type user_role as enum ('apprenant', 'formateur', 'admin', 'referent_entreprise');
create type course_status as enum ('brouillon', 'en_relecture', 'publie', 'archive');
create type credential_kind as enum ('attestation', 'certificat');

-- ─────────────────────────────────────────────────────────────
-- Organisations (entreprises clientes)
-- ─────────────────────────────────────────────────────────────

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  siren text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Profils
-- ─────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null default '',
  role user_role not null default 'apprenant',
  organization_id uuid references organizations on delete set null,
  -- Nom tel qu'il doit figurer sur les attestations. Distinct de full_name car
  -- l'apprenant peut vouloir son nom d'état civil sur un document officiel.
  -- Ce champ est repris tel quel sur un document vérifiable publiquement : on
  -- le borne pour qu'il ne serve pas à y glisser un titre ou une mention.
  credential_name text,
  constraint credential_name_raisonnable check (
    credential_name is null
    or (length(credential_name) between 2 and 80 and credential_name !~ '[[:cntrl:]]')
  ),
  created_at timestamptz not null default now()
);

create index on profiles (organization_id);
create index on profiles (role);

-- Crée le profil à l'inscription. SECURITY DEFINER car auth.users n'est pas
-- accessible au rôle applicatif. Le rôle est forcé à 'apprenant' : une
-- inscription ne peut jamais s'auto-attribuer de privilèges.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'apprenant');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Helpers de sécurité
--
-- Ces fonctions sont appelées dans les policies. SECURITY DEFINER + STABLE :
-- elles lisent profiles sans déclencher récursivement les policies de profiles,
-- ce qui provoquerait une boucle infinie.
-- ─────────────────────────────────────────────────────────────

create function current_role_of()
returns user_role
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select coalesce((select role from public.profiles where id = auth.uid()) = 'admin', false);
$$;

create function current_organization()
returns uuid
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

-- Les deux helpers suivants existent pour une raison précise : une policy qui
-- interroge directement une autre table dont la policy interroge la première
-- crée un cycle que PostgreSQL détecte à la réécriture de la requête, avant
-- toute évaluation (« infinite recursion detected in policy »). Le cycle est
-- structurel : aucune condition placée en amont ne le court-circuite. Passer
-- par une fonction SECURITY DEFINER rompt la chaîne, car son corps s'exécute
-- sans appliquer les policies.

create function is_learner_of_current_trainer(p_profile uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.enrollments e
    join public.courses c on c.id = e.course_id
    where e.user_id = p_profile and c.author_id = auth.uid()
  );
$$;

create function is_in_my_organization(p_profile uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_profile
      and p.organization_id is not null
      and p.organization_id = (select organization_id from public.profiles where id = auth.uid())
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- Catalogue
--
-- Le contenu pédagogique livré avec l'application reste dans le code source
-- (src/data). Ces tables accueillent les cours créés depuis l'interface
-- formateur. `source_id` fait le lien avec un parcours du code lorsque le cours
-- en est issu, pour que la progression reste continue.
-- ─────────────────────────────────────────────────────────────

create table courses (
  id uuid primary key default gen_random_uuid(),
  source_id text unique,
  slug text not null unique,
  title text not null,
  level text not null default 'Initiation',
  pitch text not null default '',
  audience text not null default '',
  prerequis text not null default '',
  presentiel text,
  objectives jsonb not null default '[]'::jsonb,
  status course_status not null default 'brouillon',
  author_id uuid not null references profiles on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on courses (status);
create index on courses (author_id);

create table modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  position int not null default 0,
  unique (course_id, slug)
);

create index on modules (course_id);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules on delete cascade,
  slug text not null,
  title text not null,
  intro text not null default '',
  duration int not null default 20,
  kind text not null default 'texte',
  blocks jsonb not null default '[]'::jsonb,
  video jsonb,
  position int not null default 0,
  unique (module_id, slug)
);

create index on lessons (module_id);

create table questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules on delete cascade,
  prompt text not null,
  choices jsonb not null,
  -- Index de la bonne réponse. Jamais exposé aux apprenants : la correction
  -- passe par la fonction submit_quiz(), qui ne renvoie que le résultat.
  answer int not null,
  explanation text not null default '',
  position int not null default 0,
  -- jsonb_array_length lève une erreur sur autre chose qu'un tableau : on teste
  -- d'abord le type, sinon le formateur reçoit un message incompréhensible.
  constraint answer_dans_les_bornes check (
    jsonb_typeof(choices) = 'array'
    and answer >= 0
    and answer < jsonb_array_length(choices)
  )
);

create index on questions (module_id);

-- ─────────────────────────────────────────────────────────────
-- Inscriptions et progression
-- ─────────────────────────────────────────────────────────────

create table enrollments (
  user_id uuid not null references profiles on delete cascade,
  course_id uuid not null references courses on delete cascade,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, course_id)
);

create table lesson_progress (
  user_id uuid not null references profiles on delete cascade,
  lesson_id uuid not null references lessons on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  module_id uuid not null references modules on delete cascade,
  score int not null,
  total int not null,
  wrong_question_ids jsonb not null default '[]'::jsonb,
  taken_at timestamptz not null default now(),
  constraint score_coherent check (score >= 0 and score <= total and total > 0)
);

create index on quiz_attempts (user_id, module_id);

-- ─────────────────────────────────────────────────────────────
-- Examens
-- ─────────────────────────────────────────────────────────────

create table exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  -- Parcours dont les questions alimentent l'épreuve.
  course_ids jsonb not null default '[]'::jsonb,
  question_count int not null default 20,
  duration_minutes int not null default 45,
  pass_threshold int not null default 70,
  status course_status not null default 'brouillon',
  author_id uuid not null references profiles on delete restrict,
  created_at timestamptz not null default now(),
  constraint seuil_valide check (pass_threshold between 1 and 100)
);

-- Tirage d'une épreuve, conservé côté serveur.
--
-- Sans cette table, la correction ne peut porter que sur ce que le client
-- renvoie : il lui suffit de soumettre une seule question juste pour obtenir
-- 100 % et déclencher l'émission d'un certificat. Le tirage fait ici foi.
create table exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  exam_id uuid not null references exams on delete cascade,
  question_ids jsonb not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index on exam_sessions (user_id, exam_id);

create table exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  exam_id uuid not null references exams on delete cascade,
  score int not null,
  total int not null,
  passed boolean not null,
  duration_seconds int,
  detail jsonb not null default '{}'::jsonb,
  taken_at timestamptz not null default now(),
  constraint exam_score_coherent check (score >= 0 and score <= total and total > 0)
);

create index on exam_attempts (user_id, exam_id);

-- ─────────────────────────────────────────────────────────────
-- Badges
-- ─────────────────────────────────────────────────────────────

create table badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text not null,
  -- Règle d'obtention, évaluée côté serveur par award_badges().
  rule jsonb not null default '{}'::jsonb,
  position int not null default 0
);

create table user_badges (
  user_id uuid not null references profiles on delete cascade,
  badge_id uuid not null references badges on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ─────────────────────────────────────────────────────────────
-- Attestations et certificats
--
-- Terminologie volontairement prudente : FGF Consultant n'est pas un
-- organisme certificateur enregistré au RNCP. « attestation » constate un
-- suivi, « certificat » constate la réussite d'un examen interne. Aucun de ces
-- documents n'est un diplôme ni une certification professionnelle.
-- ─────────────────────────────────────────────────────────────

create table credentials (
  id uuid primary key default gen_random_uuid(),
  -- Code court vérifiable publiquement, sans exposer l'identifiant interne.
  -- Le base64 produit « + » et « / », qui se transportent mal dans une URL de
  -- vérification : on les remplace par des lettres.
  verification_code text not null unique
    default upper(translate(encode(extensions.gen_random_bytes(9), 'base64'), '+/=', 'XYZ')),
  kind credential_kind not null,
  user_id uuid not null references profiles on delete cascade,
  course_id uuid references courses on delete set null,
  exam_id uuid references exams on delete set null,
  holder_name text not null,
  title text not null,
  score int,
  total int,
  issued_at timestamptz not null default now(),
  issued_by uuid references profiles on delete set null,
  revoked_at timestamptz
);

create index on credentials (user_id);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table quiz_attempts enable row level security;
alter table exams enable row level security;
alter table exam_sessions enable row level security;
alter table exam_attempts enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table credentials enable row level security;

-- Profils : chacun voit et modifie le sien. Le formateur voit ses apprenants
-- inscrits, le référent voit son organisation, l'admin voit tout.
create policy profils_lecture_soi on profiles for select
  using (id = auth.uid());

create policy profils_lecture_organisation on profiles for select
  using (
    current_role_of() = 'referent_entreprise'
    and organization_id is not null
    and organization_id = current_organization()
  );

create policy profils_lecture_formateur on profiles for select
  using (current_role_of() = 'formateur' and is_learner_of_current_trainer(profiles.id));

create policy profils_lecture_admin on profiles for select using (is_admin());

-- Le porteur met à jour son nom, jamais son rôle ni son organisation :
-- la contrainte est garantie par le trigger ci-dessous.
create policy profils_maj_soi on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

create policy profils_maj_admin on profiles for update
  using (is_admin()) with check (is_admin());

create function protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role
       or new.organization_id is distinct from old.organization_id then
      raise exception 'Seul un administrateur peut modifier le rôle ou l''organisation.';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_privileges
  before update on profiles
  for each row execute function protect_profile_privileges();

-- Organisations
create policy organisations_lecture on organizations for select
  using (is_admin() or id = current_organization());
create policy organisations_ecriture_admin on organizations for all
  using (is_admin()) with check (is_admin());

-- Catalogue : lecture publique des contenus publiés, écriture réservée à
-- l'auteur formateur et à l'admin.
create policy cours_lecture_publie on courses for select
  using (status = 'publie' or author_id = auth.uid() or is_admin());
create policy cours_creation on courses for insert
  with check ((current_role_of() in ('formateur', 'admin')) and author_id = auth.uid());
create policy cours_maj_auteur on courses for update
  using (author_id = auth.uid() or is_admin())
  with check (author_id = auth.uid() or is_admin());
create policy cours_suppression on courses for delete
  using (author_id = auth.uid() or is_admin());

create policy modules_lecture on modules for select
  using (exists (select 1 from courses c where c.id = course_id
    and (c.status = 'publie' or c.author_id = auth.uid() or is_admin())));
create policy modules_ecriture on modules for all
  using (exists (select 1 from courses c where c.id = course_id and (c.author_id = auth.uid() or is_admin())))
  with check (exists (select 1 from courses c where c.id = course_id and (c.author_id = auth.uid() or is_admin())));

create policy lecons_lecture on lessons for select
  using (exists (select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and (c.status = 'publie' or c.author_id = auth.uid() or is_admin())));
create policy lecons_ecriture on lessons for all
  using (exists (select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and (c.author_id = auth.uid() or is_admin())))
  with check (exists (select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and (c.author_id = auth.uid() or is_admin())));

-- Questions : seuls l'auteur et l'admin lisent la table directement, car elle
-- contient les bonnes réponses. Les apprenants passent par get_quiz() et
-- submit_quiz(), qui ne divulguent jamais `answer` avant correction.
create policy questions_lecture_auteur on questions for select
  using (exists (select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and (c.author_id = auth.uid() or is_admin())));
create policy questions_ecriture on questions for all
  using (exists (select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and (c.author_id = auth.uid() or is_admin())))
  with check (exists (select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and (c.author_id = auth.uid() or is_admin())));

-- Inscriptions et progression.
--
-- L'apprenant lit ses données, mais n'écrit pas librement celles qui servent de
-- preuve. Une policy « for all » couvre INSERT, UPDATE et DELETE : elle
-- permettrait d'inscrire un score parfait dans quiz_attempts ou de poser soi-même
-- completed_at sur une inscription, puis d'appeler issue_credential(), qui
-- vérifie précisément ces lignes. Le certificat obtenu serait authentique en
-- base et confirmé par verify_credential() à quiconque saisirait son code.
-- L'écriture de ces tables passe donc exclusivement par les fonctions serveur.
create policy inscriptions_lecture_soi on enrollments for select
  using (user_id = auth.uid());
create policy inscriptions_creation_soi on enrollments for insert
  with check (user_id = auth.uid() and completed_at is null);
create policy inscriptions_lecture_encadrants on enrollments for select
  using (
    is_admin()
    or exists (select 1 from courses c where c.id = course_id and c.author_id = auth.uid())
    or (current_role_of() = 'referent_entreprise' and is_in_my_organization(user_id))
  );

-- La progression de lecture reste déclarative : la fausser ne procure rien,
-- puisque l'achèvement d'un parcours est constaté par une fonction serveur.
create policy progression_lecture_soi on lesson_progress for select
  using (user_id = auth.uid());
create policy progression_ecriture_soi on lesson_progress for insert
  with check (user_id = auth.uid());
create policy progression_retrait_soi on lesson_progress for delete
  using (user_id = auth.uid());
create policy progression_lecture_encadrants on lesson_progress for select
  using (
    is_admin()
    or exists (select 1 from lessons l join modules m on m.id = l.module_id
               join courses c on c.id = m.course_id
               where l.id = lesson_id and c.author_id = auth.uid())
    or (current_role_of() = 'referent_entreprise' and is_in_my_organization(user_id))
  );

create policy tentatives_lecture_soi on quiz_attempts for select
  using (user_id = auth.uid());
-- Le référent d'entreprise est volontairement absent de cette policy : le RLS
-- s'applique à la ligne entière, pas colonne par colonne, et ces lignes portent
-- le détail des réponses. L'interface lui promet des compteurs, pas des copies :
-- il passe donc par org_learner_summary(), qui n'expose que des totaux.
create policy tentatives_lecture_encadrants on quiz_attempts for select
  using (
    is_admin()
    or exists (select 1 from modules m join courses c on c.id = m.course_id
               where m.id = module_id and c.author_id = auth.uid())
  );

-- Examens
create policy examens_lecture on exams for select
  using (status = 'publie' or author_id = auth.uid() or is_admin());
create policy examens_ecriture on exams for all
  using ((current_role_of() in ('formateur', 'admin')) and (author_id = auth.uid() or is_admin()))
  with check ((current_role_of() in ('formateur', 'admin')) and (author_id = auth.uid() or is_admin()));

create policy examens_tentatives_lecture_soi on exam_attempts for select
  using (user_id = auth.uid());
-- Même raison que pour quiz_attempts : la colonne `detail` contient l'énoncé,
-- la réponse donnée et la bonne réponse de chaque question.
create policy examens_tentatives_encadrants on exam_attempts for select
  using (
    is_admin()
    or exists (select 1 from exams e where e.id = exam_id and e.author_id = auth.uid())
  );

-- Badges : catalogue lisible par tous, attribution réservée au serveur.
create policy badges_lecture on badges for select using (true);
create policy badges_ecriture_admin on badges for all
  using (is_admin()) with check (is_admin());

create policy badges_obtenus_lecture on user_badges for select
  using (user_id = auth.uid() or is_admin());

-- Attestations : le porteur lit les siennes, l'admin toutes. L'émission passe
-- exclusivement par issue_credential(), jamais par un insert direct.
create policy attestations_lecture on credentials for select
  using (user_id = auth.uid() or is_admin());
create policy attestations_admin on credentials for all
  using (is_admin()) with check (is_admin());
