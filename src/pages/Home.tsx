import { Link } from 'react-router-dom';
import { courses, courseLessonCount, courseQuestionCount, courseMinutes, formatMinutes } from '../data';
import { company } from '../data/company';
import { usePageMeta } from '../lib/meta';
import { useAuth } from '../lib/auth';
import CourseCard from '../components/CourseCard';
import { courseProgress, useProgress } from '../lib/progress';

export default function Home() {
  const { session } = useAuth();
  usePageMeta(
    'Formations en management de projet',
    'Cours écrits, QCM corrigés et vidéos en management de projet, par FGF Consultant. Accès libre, sans inscription.',
  );
  const progress = useProgress();
  const inProgress = courses
    .map((c) => ({ course: c, p: courseProgress(c, progress) }))
    .filter((x) => x.p.done > 0 && x.p.done < x.p.total);

  const totalLessons = courses.reduce((n, c) => n + courseLessonCount(c), 0);
  const totalQuestions = courses.reduce((n, c) => n + courseQuestionCount(c), 0);
  const totalMinutes = courses.reduce((n, c) => n + courseMinutes(c), 0);

  return (
    <>
      <section className="hero">
        <div className="wrap hero__inner">
          <div className="hero__text">
            <p className="kicker">{company.baseline}</p>
            <h1>
              Le management de projet,
              <br />
              appris comme il se pratique.
            </h1>
            <p className="hero__lead">
              La plateforme pédagogique de FGF Consultant, en accès libre : cours écrits par nos consultants, QCM
              corrigés avec explications et captations vidéo. Les parcours reprennent les thèmes que nous enseignons
              en entreprise, en école et à l’université depuis vingt-cinq ans.
            </p>
            <div className="hero__actions">
              <Link to="/formations" className="btn btn--primary btn--lg">
                Découvrir les parcours
              </Link>
              <Link to={session ? '/progression' : '/inscription'} className="btn btn--ghost btn--lg">
                {session ? 'Ma progression' : 'Créer un compte'}
              </Link>
            </div>
          </div>
          <aside className="hero__panel" aria-label="Contenu disponible">
            <h2>Ce que contient le campus</h2>
            <dl>
              <div>
                <dt>Parcours</dt>
                <dd className="mono">{courses.length}</dd>
              </div>
              <div>
                <dt>Leçons rédigées</dt>
                <dd className="mono">{totalLessons}</dd>
              </div>
              <div>
                <dt>Questions de QCM</dt>
                <dd className="mono">{totalQuestions}</dd>
              </div>
              <div>
                <dt>Travail en ligne</dt>
                <dd className="mono">{formatMinutes(totalMinutes)}</dd>
              </div>
            </dl>
            <p className="hero__panel-note">
              Le contenu est en accès libre. <Link to="/inscription">Créer un compte</Link> vous permet en plus de
              retrouver votre progression sur tous vos appareils, de gagner des badges et de recevoir vos
              attestations. Pour une session animée en présentiel ou une préparation aux certifications{' '}
              {company.certifications.join(', ')}, <Link to="/a-propos">contactez-nous</Link>.
            </p>
          </aside>
        </div>
      </section>

      {inProgress.length > 0 && (
        <section className="wrap section">
          <h2 className="section__title rule-top">Reprendre où vous en étiez</h2>
          <div className="resume-list">
            {inProgress.map(({ course, p }) => (
              <Link key={course.id} to={`/formations/${course.id}`} className="resume-item">
                <span className="resume-item__title">{course.title}</span>
                <span className="resume-item__meta mono">
                  {p.pct} % · {p.done}/{p.total} étapes
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <h2 className="section__title rule-top">Les parcours</h2>
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section__title rule-top">Comment se déroule un parcours</h2>
        <ol className="steps">
          <li>
            <span className="steps__num mono">01</span>
            <h3>Vous lisez la leçon</h3>
            <p>
              Chaque leçon est un cours écrit complet : définitions, méthode, exemples issus de nos missions et
              encadrés « à retenir ». Comptez 20 à 30 minutes par leçon.
            </p>
          </li>
          <li>
            <span className="steps__num mono">02</span>
            <h3>Vous validez par un QCM</h3>
            <p>
              Chaque module se termine par un QCM. La correction affiche l’explication de chaque réponse, y compris
              celles que vous avez réussies. Le module est validé à partir de 70 % de bonnes réponses.
            </p>
          </li>
          <li>
            <span className="steps__num mono">03</span>
            <h3>Vous suivez votre progression</h3>
            <p>
              Leçons terminées, QCM réussis et meilleurs scores sont conservés sur cet appareil. Vous reprenez
              exactement où vous vous étiez arrêté.
            </p>
          </li>
        </ol>
      </section>
    </>
  );
}
