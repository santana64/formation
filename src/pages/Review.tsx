import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourse } from '../data';
import type { Course, Module, Question } from '../data/types';
import { usePageMeta } from '../lib/meta';
import {
  isPending,
  MASTERY_STREAK,
  recordRight,
  recordWrong,
  reviewQueue,
  useReviewQueue,
  type ReviewItem,
} from '../lib/review';

interface ResolvedItem {
  item: ReviewItem;
  course: Course;
  module: Module;
  question: Question;
}

/** Une question dont le contenu a changé depuis l'échec est simplement ignorée. */
function resolve(item: ReviewItem): ResolvedItem | undefined {
  const course = getCourse(item.courseId);
  const mod = course?.modules.find((m) => m.id === item.moduleId);
  const question = mod?.quiz.questions.find((q) => q.id === item.questionId);
  if (!course || !mod || !question) return undefined;
  return { item, course, module: mod, question };
}

function buildSession(): ResolvedItem[] {
  return reviewQueue()
    .map(resolve)
    .filter((r): r is ResolvedItem => r !== undefined);
}

interface Outcome {
  correct: boolean;
  cleared: boolean;
}

export default function Review() {
  usePageMeta(
    'Révision des erreurs',
    'Rejouez les questions ratées dans vos QCM, par ordre de priorité, avec la correction et l’explication.',
  );

  const pending = useReviewQueue();
  const [session, setSession] = useState<ResolvedItem[]>(buildSession);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | undefined>(undefined);
  const [checked, setChecked] = useState(false);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const verdictRef = useRef<HTMLDivElement>(null);

  const current = session[index];
  const finished = session.length > 0 && index >= session.length;

  // Le verdict remplace le bouton « Vérifier » : sans ce déplacement, la
  // navigation au clavier retombe en haut du document.
  useEffect(() => {
    if (checked) verdictRef.current?.focus();
  }, [checked]);

  function restart() {
    setSession(buildSession());
    setIndex(0);
    setChosen(undefined);
    setChecked(false);
    setOutcomes([]);
    window.scrollTo({ top: 0 });
  }

  function check() {
    if (!current || chosen === undefined) return;
    const correct = chosen === current.question.answer;
    const { courseId, moduleId, questionId } = current.item;
    if (correct) recordRight(courseId, moduleId, questionId);
    else recordWrong(courseId, moduleId, questionId);
    setOutcomes((o) => [...o, { correct, cleared: correct && !isPending(courseId, moduleId, questionId) }]);
    setChecked(true);
  }

  function next() {
    setIndex((i) => i + 1);
    setChosen(undefined);
    setChecked(false);
    window.scrollTo({ top: 0 });
  }

  const cleared = outcomes.filter((o) => o.cleared).length;
  const rightCount = outcomes.filter((o) => o.correct).length;

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Ancrage</p>
        <h1>Révision des erreurs</h1>
        <p className="page-head__lead">
          Chaque question ratée dans un QCM revient ici, les plus manquées en premier. Une question quitte la file
          après {MASTERY_STREAK} bonnes réponses consécutives ; une nouvelle erreur remet ce compteur à zéro.
        </p>
      </header>

      <p className="review-pending">
        <span className="mono">{pending.length}</span>{' '}
        {pending.length > 1 ? 'questions en attente de révision' : 'question en attente de révision'}
      </p>

      {session.length === 0 ? (
        <div className="empty-state empty-state--page">
          <h2>{pending.length === 0 ? 'Rien à réviser pour l’instant' : 'File de révision indisponible'}</h2>
          <p>
            {pending.length === 0
              ? 'Aucune erreur en attente : vos QCM sont à jour. Continuez un parcours ou passez un entraînement — les questions ratées atterriront automatiquement ici.'
              : 'Les questions enregistrées ne correspondent plus au contenu actuel des parcours. Repassez les QCM concernés pour reconstituer votre file.'}
          </p>
          <div className="empty-state__actions">
            <Link to="/formations" className="btn btn--primary">
              Reprendre un parcours
            </Link>
            <Link to="/entrainement" className="btn btn--ghost">
              Passer un entraînement
            </Link>
          </div>
        </div>
      ) : finished ? (
        <div className="review-summary">
          <h2>Séance terminée</h2>
          <p>
            <span className="mono">
              {rightCount}/{outcomes.length}
            </span>{' '}
            bonnes réponses. <span className="mono">{cleared}</span>{' '}
            {cleared > 1 ? 'questions sont sorties' : 'question est sortie'} de la file, il en reste{' '}
            <span className="mono">{pending.length}</span>.
          </p>
          <div className="review-summary__actions">
            {pending.length > 0 && (
              <button type="button" className="btn btn--primary" onClick={restart}>
                Enchaîner une séance
              </button>
            )}
            <Link to="/progression" className="btn btn--ghost">
              Voir ma progression
            </Link>
          </div>
        </div>
      ) : (
        current && (
          <div className="quiz review-card">
            <p className="review-progress mono">
              Question {index + 1} sur {session.length}
            </p>

            <p className="review-context">
              <Link to={`/formations/${current.course.id}`}>{current.course.title}</Link>
              <span aria-hidden="true"> · </span>
              <span className="review-context__module">{current.module.title}</span>
              {current.module.lessons[0] && (
                <>
                  <span aria-hidden="true"> · </span>
                  <Link
                    to={`/formations/${current.course.id}/modules/${current.module.id}/lecons/${current.module.lessons[0].id}`}
                  >
                    Revoir la leçon
                  </Link>
                </>
              )}
            </p>

            <div className="quiz-question">
              <fieldset>
                <legend>
                  <span className="quiz-question__num mono">
                    Ratée {current.item.wrongCount} fois
                    {current.item.streak > 0 ? ` · ${current.item.streak} réussite consécutive` : ''}
                  </span>
                  {current.question.prompt}
                </legend>
                <div className="quiz-question__choices">
                  {current.question.choices.map((choice, ci) => {
                    const isChosen = chosen === ci;
                    const isCorrect = current.question.answer === ci;
                    let stateClass = '';
                    if (checked) {
                      if (isCorrect) stateClass = ' is-correct';
                      else if (isChosen) stateClass = ' is-incorrect';
                    } else if (isChosen) {
                      stateClass = ' is-selected';
                    }
                    return (
                      <label key={ci} className={`quiz-choice${stateClass}`}>
                        <input
                          type="radio"
                          name={`${current.item.questionId}-${index}`}
                          checked={isChosen}
                          disabled={checked}
                          onChange={() => setChosen(ci)}
                        />
                        <span className="quiz-choice__text">{choice}</span>
                        {checked && isCorrect && <span className="quiz-choice__badge">Bonne réponse</span>}
                        {checked && isChosen && !isCorrect && (
                          <span className="quiz-choice__badge quiz-choice__badge--wrong">Votre réponse</span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {checked && (
                  <p
                    className={`quiz-question__explanation${chosen === current.question.answer ? ' is-right' : ''}`}
                  >
                    <strong>{chosen === current.question.answer ? 'Exact. ' : 'Explication : '}</strong>
                    {current.question.explanation}
                  </p>
                )}
              </fieldset>
            </div>

            {checked ? (
              <div
                className={`review-verdict ${outcomes[outcomes.length - 1]?.correct ? 'review-verdict--right' : 'review-verdict--wrong'}`}
                role="status"
                aria-live="polite"
                tabIndex={-1}
                ref={verdictRef}
              >
                <p className="review-verdict__label">
                  {outcomes[outcomes.length - 1]?.correct ? 'Bonne réponse.' : 'Réponse incorrecte.'}{' '}
                  {outcomes[outcomes.length - 1]?.cleared
                    ? 'Cette question sort de la file de révision.'
                    : outcomes[outcomes.length - 1]?.correct
                      ? 'Encore une bonne réponse d’affilée et elle sortira de la file.'
                      : 'Elle repasse en priorité haute, avec un compteur remis à zéro.'}
                </p>
                <button type="button" className="btn btn--primary" onClick={next}>
                  {index + 1 < session.length ? 'Question suivante' : 'Terminer la séance'}
                </button>
              </div>
            ) : (
              <div className="quiz__footer">
                <p className="muted">
                  {chosen === undefined ? 'Choisissez une réponse.' : 'Réponse sélectionnée.'}
                </p>
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={check}
                  disabled={chosen === undefined}
                >
                  Vérifier
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
