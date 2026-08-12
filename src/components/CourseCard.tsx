import { Link } from 'react-router-dom';
import type { Course } from '../data/types';
import { courseLessonCount, courseQuestionCount, courseMinutes, formatMinutes } from '../data';
import { courseProgress, useProgress } from '../lib/progress';
import ProgressBar from './ProgressBar';

export default function CourseCard({ course }: { course: Course }) {
  const progress = useProgress();
  const { done, total } = courseProgress(course, progress);
  const started = done > 0;

  return (
    <article className="course-card">
      <div className="course-card__head">
        <span className="course-card__level">{course.level}</span>
        <span className="course-card__hours mono">{formatMinutes(courseMinutes(course))} en ligne</span>
      </div>
      <h3 className="course-card__title">
        <Link to={`/formations/${course.id}`}>{course.title}</Link>
      </h3>
      <p className="course-card__pitch">{course.pitch}</p>
      {course.presentiel && (
        <p className="course-card__presentiel">
          Également animé en présentiel — {course.presentiel}
        </p>
      )}
      <dl className="course-card__facts">
        <div>
          <dt>Modules</dt>
          <dd className="mono">{course.modules.length}</dd>
        </div>
        <div>
          <dt>Leçons</dt>
          <dd className="mono">{courseLessonCount(course)}</dd>
        </div>
        <div>
          <dt>Questions</dt>
          <dd className="mono">{courseQuestionCount(course)}</dd>
        </div>
      </dl>
      {started ? (
        <ProgressBar done={done} total={total} label="Progression" />
      ) : (
        <p className="course-card__notstarted">Parcours non commencé</p>
      )}
      <Link to={`/formations/${course.id}`} className="btn btn--ghost course-card__cta">
        {started ? 'Reprendre le parcours' : 'Voir le programme'}
      </Link>
    </article>
  );
}
