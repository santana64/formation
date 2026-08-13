-- Progression du contenu livré avec l'application.
--
-- Les parcours de `src/data` n'ont pas de ligne dans `courses` : leurs
-- identifiants sont des chaînes du code source, pas des UUID. Plutôt que de
-- fabriquer de fausses lignes relationnelles, on conserve cet instantané tel
-- quel, en JSON. Les cours créés par les formateurs utilisent les tables
-- relationnelles (`lesson_progress`, `quiz_attempts`) et leurs fonctions.

create table local_progress (
  user_id uuid primary key references profiles on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table local_progress enable row level security;

-- Strictement personnel : même un administrateur n'a pas à lire le détail de
-- la progression d'un apprenant sur le contenu public.
create policy progression_locale_soi on local_progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 0002 a révoqué les privilèges par défaut du schéma : cette table étant créée
-- après, elle doit accorder les siens explicitement.
grant select, insert, update, delete on local_progress to authenticated;
