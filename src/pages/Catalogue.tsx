import { useState } from 'react';
import { courses } from '../data';
import CourseCard from '../components/CourseCard';
import type { Course } from '../data/types';
import { usePageMeta } from '../lib/meta';

const levels: (Course['level'] | 'Tous')[] = ['Tous', 'Initiation', 'Perfectionnement', 'Expertise'];

export default function Catalogue() {
  usePageMeta(
    'Nos parcours de formation',
    'Les parcours en ligne de FGF Consultant : fondamentaux, maîtrise des dépenses, estimation des coûts, gestion des risques, méthodes agiles.',
  );
  const [level, setLevel] = useState<(typeof levels)[number]>('Tous');
  const filtered = level === 'Tous' ? courses : courses.filter((c) => c.level === level);

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Catalogue</p>
        <h1>Nos parcours de formation</h1>
        <p className="page-head__lead">
          Ces parcours reprennent les thèmes que FGF Consultant enseigne en présentiel, construits à partir de nos
          missions de conseil en management de projet. Ils se suivent dans l’ordre proposé, ou séparément selon votre
          expérience.
        </p>
      </header>

      <div className="filters" role="group" aria-label="Filtrer par niveau">
        {levels.map((l) => (
          <button
            key={l}
            type="button"
            className={`filter${level === l ? ' is-active' : ''}`}
            aria-pressed={level === l}
            onClick={() => setLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>Aucun parcours à ce niveau pour l’instant</h2>
          <p>
            Notre catalogue « {level} » est en préparation. Consultez les autres niveaux ou contactez-nous pour un
            programme sur mesure.
          </p>
          <button type="button" className="btn btn--ghost" onClick={() => setLevel('Tous')}>
            Voir tous les parcours
          </button>
        </div>
      ) : (
        <div className="course-grid">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
