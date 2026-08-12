import { Link, useParams } from 'react-router-dom';
import { getCourse } from '../data';
import QuizEngine from '../components/QuizEngine';
import SyllabusRail from '../components/SyllabusRail';
import NotFound from './NotFound';
import { quizKey, useProgress } from '../lib/progress';
import { neighbours, stepHref } from '../lib/navigation';
import { usePageMeta } from '../lib/meta';

export default function QuizPage() {
  const { courseId, moduleId } = useParams();
  const course = getCourse(courseId);
  const moduleIndex = course?.modules.findIndex((m) => m.id === moduleId) ?? -1;
  const progress = useProgress();

  usePageMeta(
    course && moduleIndex !== -1 ? course.modules[moduleIndex].quiz.title : 'QCM introuvable',
    course && moduleIndex !== -1
      ? `QCM de validation du module « ${course.modules[moduleIndex].title} » — correction expliquée question par question.`
      : undefined,
  );

  if (!course || moduleIndex === -1) return <NotFound />;
  const module = course.modules[moduleIndex];

  const best = progress.quizResults[quizKey(course.id, module.id)];
  const { prev, next, position, total } = neighbours(course, { moduleId: module.id });

  return (
    <div className="wrap section lesson-layout">
      <aside className="lesson-aside">
        <Link to={`/formations/${course.id}`} className="lesson-aside__back">
          ← {course.title}
        </Link>
        <SyllabusRail course={course} current={{ moduleId: module.id, quiz: true }} />
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
            {module.quiz.questions.length} questions
          </p>
          <h1>{module.quiz.title}</h1>
          <p className="lesson__intro">
            Répondez aux {module.quiz.questions.length} questions puis validez : chaque réponse sera corrigée et
            expliquée. Le module est validé à partir de 70 % de bonnes réponses. Vous pouvez recommencer autant de
            fois que nécessaire — seul votre meilleur score est conservé.
          </p>
          {best && (
            <p className="quiz-best mono">
              Meilleur score enregistré : {best.score}/{best.total}
            </p>
          )}
        </header>

        <QuizEngine quiz={module.quiz} courseId={course.id} moduleId={module.id} />

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
            <Link to={stepHref(course.id, next)} className="lesson-nav__link lesson-nav__link--next">
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
