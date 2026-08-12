import { Link } from 'react-router-dom';
import type { Course } from '../data/types';
import { isQuizPassed, lessonKey, useProgress } from '../lib/progress';

interface Props {
  course: Course;
  /** Étape actuellement affichée, pour la marquer dans le rail. */
  current?: { moduleId: string; lessonId?: string; quiz?: boolean };
}

/**
 * Signature visuelle du produit : le rail de syllabus numéroté,
 * avec l'état de chaque étape (à faire / en cours / acquis).
 */
export default function SyllabusRail({ course, current }: Props) {
  const progress = useProgress();

  return (
    <nav className="rail" aria-label="Programme du parcours">
      {course.modules.map((mod, mi) => {
        const num = String(mi + 1).padStart(2, '0');
        return (
          <section key={mod.id} className="rail__module">
            {/* Volontairement pas un titre de section : le rail est un repère de
                navigation, il ne doit pas s'insérer dans le plan de titres de la page. */}
            <p className="rail__module-title">
              <span className="rail__num mono" aria-hidden="true">
                {num}
              </span>
              {mod.title}
            </p>
            <ol className="rail__steps">
              {mod.lessons.map((lesson) => {
                const done = !!progress.lessonsDone[lessonKey(course.id, mod.id, lesson.id)];
                const isCurrent = current?.moduleId === mod.id && current?.lessonId === lesson.id;
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/formations/${course.id}/modules/${mod.id}/lecons/${lesson.id}`}
                      className={`rail__step${done ? ' is-done' : ''}${isCurrent ? ' is-current' : ''}`}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      <span className="rail__dot" aria-hidden="true">
                        {done ? '✓' : ''}
                      </span>
                      <span className="rail__label">
                        {lesson.title}
                        <span className="rail__meta mono">
                          {lesson.kind === 'video' ? 'Vidéo' : 'Cours'} · {lesson.duration} min
                          {done ? ' · acquis' : ''}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
              {(() => {
                const passed = isQuizPassed(course.id, mod.id, progress);
                const isCurrent = current?.moduleId === mod.id && current?.quiz;
                return (
                  <li>
                    <Link
                      to={`/formations/${course.id}/modules/${mod.id}/qcm`}
                      className={`rail__step rail__step--quiz${passed ? ' is-done' : ''}${isCurrent ? ' is-current' : ''}`}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      <span className="rail__dot" aria-hidden="true">
                        {passed ? '✓' : '?'}
                      </span>
                      <span className="rail__label">
                        QCM de validation
                        <span className="rail__meta mono">
                          {mod.quiz.questions.length} questions{passed ? ' · réussi' : ''}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })()}
            </ol>
          </section>
        );
      })}
    </nav>
  );
}
