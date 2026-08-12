-- FGF Campus — schéma initial
--
-- Quatre rôles : apprenant, formateur, admin (super administrateur) et
-- referent_entreprise. Le rôle vit dans `profiles.role` et n'est jamais
-- modifiable par son porteur : seule une fonction réservée à l'admin le change.
--
-- Toutes les tables sont protégées par Row Level Security. Le principe retenu :
-- refuser par défaut, puis ouvrir explicitement. Aucune policy ne fait confiance
-- à une valeur envoyée par le client.

create extension if not exists "pgcrypto";

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
  credential_name text,
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
set search_path = public
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
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()) = 'admin', false);
$$;

create function current_organization()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid();
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
  constraint answer_dans_les_bornes check (answer >= 0 and answer < jsonb_array_length(choices))
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

create table exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  exam_id uuid not null references exams on delete cascade,
  score int not null,
  total int not null,
  passed boolean not null,
  duration_seconds int,
  detail jsonb not null default '{}'::jsonb,
  taken_at timestamptz not null default now()
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
  verification_code text not null unique default upper(substr(encode(gen_random_bytes(9), 'base64'), 1, 12)),
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
  using (
    current_role_of() = 'formateur'
    and exists (
      select 1 from enrollments e
      join courses c on c.id = e.course_id
      where e.user_id = profiles.id and c.author_id = auth.uid()
    )
  );

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
set search_path = public
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

-- Inscriptions et progression : l'apprenant est maître de ses données.
create policy inscriptions_soi on enrollments for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy inscriptions_lecture_encadrants on enrollments for select
  using (
    is_admin()
    or exists (select 1 from courses c where c.id = course_id and c.author_id = auth.uid())
    or (current_role_of() = 'referent_entreprise'
        and exists (select 1 from profiles p where p.id = user_id
                    and p.organization_id = current_organization()))
  );

create policy progression_soi on lesson_progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy progression_lecture_encadrants on lesson_progress for select
  using (
    is_admin()
    or exists (select 1 from lessons l join modules m on m.id = l.module_id
               join courses c on c.id = m.course_id
               where l.id = lesson_id and c.author_id = auth.uid())
    or (current_role_of() = 'referent_entreprise'
        and exists (select 1 from profiles p where p.id = user_id
                    and p.organization_id = current_organization()))
  );

create policy tentatives_soi on quiz_attempts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy tentatives_lecture_encadrants on quiz_attempts for select
  using (
    is_admin()
    or exists (select 1 from modules m join courses c on c.id = m.course_id
               where m.id = module_id and c.author_id = auth.uid())
    or (current_role_of() = 'referent_entreprise'
        and exists (select 1 from profiles p where p.id = user_id
                    and p.organization_id = current_organization()))
  );

-- Examens
create policy examens_lecture on exams for select
  using (status = 'publie' or author_id = auth.uid() or is_admin());
create policy examens_ecriture on exams for all
  using ((current_role_of() in ('formateur', 'admin')) and (author_id = auth.uid() or is_admin()))
  with check ((current_role_of() in ('formateur', 'admin')) and (author_id = auth.uid() or is_admin()));

create policy examens_tentatives_soi on exam_attempts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy examens_tentatives_encadrants on exam_attempts for select
  using (
    is_admin()
    or exists (select 1 from exams e where e.id = exam_id and e.author_id = auth.uid())
    or (current_role_of() = 'referent_entreprise'
        and exists (select 1 from profiles p where p.id = user_id
                    and p.organization_id = current_organization()))
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
