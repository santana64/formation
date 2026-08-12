import { Link, useParams } from 'react-router-dom';
import {
  getCourse,
  courseLessonCount,
  courseQuestionCount,
  courseSteps,
  courseMinutes,
  formatMinutes,
} from '../data';
import SyllabusRail from '../components/SyllabusRail';
import ProgressBar from '../components/ProgressBar';
import NotFound from './NotFound';
import { courseProgress, isQuizPassed, lessonKey, useProgress } from '../lib/progress';
import { usePageMeta } from '../lib/meta';

export default function CoursePage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const progress = useProgress();

  usePageMeta(course ? course.title : 'Parcours introuvable', course?.pitch);

  if (!course) return <NotFound />;

  const { done, total } = courseProgress(course, progress);
  const steps = courseSteps(course);

  // Première étape non terminée : point de reprise.
  const nextStep = steps.find((s) =>
    s.kind === 'lesson'
      ? !progress.lessonsDone[lessonKey(course.id, s.moduleId, s.lessonId)]
      : !isQuizPassed(course.id, s.moduleId, progress),
  );
  const nextHref = nextStep
    ? nextStep.kind === 'lesson'
      ? `/formations/${course.id}/modules/${nextStep.moduleId}/lecons/${nextStep.lessonId}`
      : `/formations/${course.id}/modules/${nextStep.moduleId}/qcm`
    : undefined;

  return (
    <div className="wrap section">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/formations">Formations</Link>
        <span aria-hidden="true">/</span>
        <span>{course.title}</span>
      </nav>

      <header className="course-head">
        <div>
          <p className="kicker">
            {course.level} · {course.modules.length} modules · {courseLessonCount(course)} leçons ·{' '}
            {formatMinutes(courseMinutes(course))} en ligne
          </p>
          <h1>{course.title}</h1>
          <p className="course-head__pitch">{course.pitch}</p>
          <div className="course-head__actions">
            {nextHref ? (
              <Link to={nextHref} className="btn btn--primary btn--lg">
                {done > 0 ? 'Reprendre où j’en étais' : 'Commencer le parcours'}
              </Link>
            ) : (
              <span className="course-head__complete">Parcours terminé — toutes les étapes sont validées.</span>
            )}
          </div>
          {done > 0 && <ProgressBar done={done} total={total} label="Votre progression" />}
        </div>

        <aside className="course-meta" aria-label="Informations pratiques">
          <h2>En pratique</h2>
          <dl>
            <dt>Public visé</dt>
            <dd>{course.audience}</dd>
            <dt>Prérequis</dt>
            <dd>{course.prerequis}</dd>
            <dt>Volume en ligne</dt>
            <dd>
              {courseLessonCount(course)} leçons · {courseQuestionCount(course)} questions de QCM ·{' '}
              {formatMinutes(courseMinutes(course))} estimées
            </dd>
            <dt>Formation présentielle</dt>
            <dd>
              {course.presentiel
                ? `${course.presentiel} — durée de la formation correspondante animée par FGF Consultant`
                : 'Parcours proposé en ligne uniquement. Pour une session animée sur ce thème, contactez-nous.'}
            </dd>
            <dt>Validation</dt>
            <dd>70 % de bonnes réponses par QCM de module</dd>
          </dl>
        </aside>
      </header>

      <section className="course-objectives">
        <h2 className="section__title rule-top">Objectifs pédagogiques</h2>
        <ul className="objectives">
          {course.objectives.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </section>

      <section className="course-program">
        <h2 className="section__title rule-top">Programme détaillé</h2>
        <div className="course-program__grid">
          <SyllabusRail course={course} />
          <div className="course-program__summaries">
            {course.modules.map((mod, i) => (
              <article key={mod.id} className="module-summary">
                <h3>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span> {mod.title}
                </h3>
                <p>{mod.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
