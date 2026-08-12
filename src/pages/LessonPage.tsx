import { Link, useParams } from 'react-router-dom';
import { getLessonRef } from '../data';
import LessonBlocks from '../components/LessonBlocks';
import SyllabusRail from '../components/SyllabusRail';
import VideoPlayer from '../components/VideoPlayer';
import NotFound from './NotFound';
import { lessonKey, markLessonDone, unmarkLessonDone, useProgress } from '../lib/progress';
import { neighbours, stepHref } from '../lib/navigation';
import { usePageMeta } from '../lib/meta';

export default function LessonPage() {
  const { courseId, moduleId, lessonId } = useParams();
  const ref = getLessonRef(courseId, moduleId, lessonId);
  const progress = useProgress();

  usePageMeta(ref ? ref.lesson.title : 'Leçon introuvable', ref?.lesson.intro);

  if (!ref) return <NotFound />;
  const { course, module, lesson, moduleIndex } = ref;

  const done = !!progress.lessonsDone[lessonKey(course.id, module.id, lesson.id)];
  const { prev, next, position, total } = neighbours(course, { moduleId: module.id, lessonId: lesson.id });

  function toggleDone() {
    if (done) unmarkLessonDone(course.id, module.id, lesson.id);
    else markLessonDone(course.id, module.id, lesson.id);
  }

  return (
    <div className="wrap section lesson-layout">
      <aside className="lesson-aside">
        <Link to={`/formations/${course.id}`} className="lesson-aside__back">
          ← {course.title}
        </Link>
        <SyllabusRail course={course} current={{ moduleId: module.id, lessonId: lesson.id }} />
      </aside>

      <article className="lesson">
        <nav className="breadcrumb" aria-label="Fil d’Ariane">
          <Link to="/formations">Formations</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/formations/${course.id}`}>{course.title}</Link>
          <span aria-hidden="true">/</span>
          <span>{module.title}</span>
        </nav>

        <header className="lesson__head">
          <p className="kicker">
            Module {String(moduleIndex + 1).padStart(2, '0')} · Étape {position} sur {total} ·{' '}
            {lesson.kind === 'video' ? 'Vidéo + cours écrit' : 'Cours écrit'} · {lesson.duration} min
          </p>
          <h1>{lesson.title}</h1>
          <p className="lesson__intro">{lesson.intro}</p>
        </header>

        {lesson.kind === 'video' && (
          <VideoPlayer title={lesson.title} duration={lesson.duration} video={lesson.video} />
        )}

        <div className="prose">
          <LessonBlocks blocks={lesson.blocks} />
        </div>

        <div className="lesson__done">
          <label className="checkbox">
            <input type="checkbox" checked={done} onChange={toggleDone} />
            <span>J’ai terminé cette leçon</span>
          </label>
          {done && <p className="lesson__done-note">Leçon marquée comme acquise. Vous pouvez revenir la relire à tout moment.</p>}
        </div>

        <nav className="lesson-nav" aria-label="Navigation dans le parcours">
          {prev ? (
            <Link to={stepHref(course.id, prev)} className="lesson-nav__link lesson-nav__link--prev">
              <span className="lesson-nav__dir">Précédent</span>
              <span className="lesson-nav__label">{prev.label}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={stepHref(course.id, next)}
              className="lesson-nav__link lesson-nav__link--next"
              onClick={() => markLessonDone(course.id, module.id, lesson.id)}
            >
              <span className="lesson-nav__dir">Suivant</span>
              <span className="lesson-nav__label">{next.label}</span>
            </Link>
          ) : (
            <Link to={`/formations/${course.id}`} className="lesson-nav__link lesson-nav__link--next">
              <span className="lesson-nav__dir">Fin du parcours</span>
              <span className="lesson-nav__label">Revenir au programme</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
