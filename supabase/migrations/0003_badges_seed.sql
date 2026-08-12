-- Catalogue de badges. Les `slug` sont référencés par award_badges() :
-- en ajouter un ici suppose d'ajouter la règle correspondante dans la fonction.

insert into badges (slug, label, description, position) values
  ('premiere-lecon',    'Première leçon',      'Vous avez terminé votre première leçon.', 10),
  ('dix-lecons',        'Dix leçons',          'Dix leçons terminées : le socle est en place.', 20),
  ('vingt-cinq-lecons', 'Vingt-cinq leçons',   'Vingt-cinq leçons terminées sur l''ensemble du campus.', 30),
  ('premier-qcm',       'Premier QCM validé',  'Vous avez validé un module à 70 % ou plus.', 40),
  ('cinq-qcm',          'Cinq modules validés','Cinq modules validés : la méthode est acquise.', 50),
  ('sans-faute',        'Sans faute',          'Un QCM réussi sans aucune erreur.', 60),
  ('trois-sans-faute',  'Triple sans faute',   'Trois QCM réussis sans aucune erreur.', 70),
  ('parcours-acheve',   'Parcours achevé',     'Un parcours complet terminé, QCM compris.', 80),
  ('trois-parcours',    'Trois parcours',      'Trois parcours complets achevés.', 90),
  ('examen-reussi',     'Examen réussi',       'Vous avez réussi un examen blanc FGF Campus.', 100)
on conflict (slug) do nothing;
