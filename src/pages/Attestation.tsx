import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourse, courseLessonCount, courseQuestionCount } from '../data';
import { company } from '../data/company';
import { courseProgress, isQuizPassed, quizKey, useProgress } from '../lib/progress';
import { usePageMeta } from '../lib/meta';
import NotFound from './NotFound';

/**
 * Attestation de suivi imprimable, générée localement.
 *
 * Ce n'est pas un document certifiant : la plateforme ne vérifie pas l'identité
 * de l'apprenant et la progression est déclarative. Le document le dit
 * explicitement, pour ne pas laisser croire à une valeur qu'il n'a pas.
 */
export default function Attestation() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const progress = useProgress();
  const [name, setName] = useState('');

  usePageMeta(course ? `Attestation — ${course.title}` : 'Attestation');

  if (!course) return <NotFound />;

  const { done, total, pct } = courseProgress(course, progress);
  const complete = done === total;
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const passedQuizzes = course.modules.filter((m) => isQuizPassed(course.id, m.id, progress));
  const totalScore = passedQuizzes.reduce((n, m) => n + (progress.quizResults[quizKey(course.id, m.id)]?.score ?? 0), 0);
  const totalQuestions = passedQuizzes.reduce(
    (n, m) => n + (progress.quizResults[quizKey(course.id, m.id)]?.total ?? 0),
    0,
  );

  if (!complete) {
    return (
      <div className="wrap section">
        <div className="empty-state empty-state--page">
          <p className="kicker">Attestation de suivi</p>
          <h1>Parcours non terminé</h1>
          <p>
            L’attestation est disponible lorsque toutes les étapes du parcours sont validées : chaque leçon marquée
            comme terminée et chaque QCM réussi à 70 % au moins. Vous en êtes à {pct} % ({done} étapes sur {total}).
          </p>
          <div className="empty-state__actions">
            <Link to={`/formations/${course.id}`} className="btn btn--primary">
              Reprendre le parcours
            </Link>
            <Link to="/progression" className="btn btn--ghost">
              Voir ma progression
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap section">
      <div className="attestation-tools no-print">
        <div>
          <label htmlFor="learner">Nom à faire figurer sur l’attestation</label>
          <input
            id="learner"
            type="text"
            value={name}
            placeholder="Prénom et nom"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn--primary" onClick={() => window.print()}>
          Imprimer ou enregistrer en PDF
        </button>
      </div>

      <article className="attestation">
        <header className="attestation__head">
          <p className="attestation__brand">
            FGF <em>Campus</em>
          </p>
          <p className="attestation__baseline">{company.baseline}</p>
        </header>

        <h1>Attestation de suivi</h1>

        <p className="attestation__body">
          {name.trim() ? <strong>{name.trim()}</strong> : <span className="attestation__blank">…………………………………</span>} a
          suivi l’intégralité du parcours en ligne
        </p>

        <p className="attestation__course">{course.title}</p>

        <dl className="attestation__facts">
          <div>
            <dt>Niveau</dt>
            <dd>{course.level}</dd>
          </div>
          <div>
            <dt>Contenu</dt>
            <dd>
              {course.modules.length} modules · {courseLessonCount(course)} leçons ·{' '}
              {courseQuestionCount(course)} questions
            </dd>
          </div>
          <div>
            <dt>QCM validés</dt>
            <dd className="mono">
              {passedQuizzes.length}/{course.modules.length} — {totalScore}/{totalQuestions} bonnes réponses
            </dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{today}</dd>
          </div>
        </dl>

        <section className="attestation__program">
          <h2>Programme suivi</h2>
          <ol>
            {course.modules.map((m) => (
              <li key={m.id}>
                {m.title}
                <span className="muted"> — {m.summary}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="attestation__foot">
          <p>
            <strong>Portée de ce document.</strong> Cette attestation de suivi est générée automatiquement à partir
            de la progression enregistrée dans le navigateur de l’apprenant. Elle atteste d’un parcours effectué en
            autonomie : elle ne constitue ni une certification, ni un diplôme, et l’identité déclarée n’a pas été
            vérifiée. Pour une formation certifiante ou une session animée par un consultant, contactez FGF
            Consultant.
          </p>
          <p className="attestation__legal">
            {company.name} — {company.legal.forme}, {company.legal.rcs}, SIREN {company.legal.siren} ·{' '}
            {company.email} · {company.phone}
          </p>
        </footer>
      </article>

      <p className="no-print attestation__back">
        <Link to="/progression">← Retour à ma progression</Link>
      </p>
    </div>
  );
}
