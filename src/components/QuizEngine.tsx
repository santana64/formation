import { useEffect, useMemo, useRef, useState } from 'react';
import type { Quiz } from '../data/types';
import { saveQuizResult } from '../lib/progress';
import { shuffleChoices } from '../lib/shuffle';
import { recordRight, recordWrong } from '../lib/review';

interface Props {
  quiz: Quiz;
  courseId: string;
  moduleId: string;
  /** Appelé après validation, avec le score obtenu. */
  onFinished?: (score: number, total: number) => void;
}

/**
 * Moteur de QCM : une passe complète (répondre à tout), correction question
 * par question avec explication, score final et possibilité de recommencer.
 */
export default function QuizEngine({ quiz, courseId, moduleId, onFinished }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showMissing, setShowMissing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Après validation, on amène le focus sur le résultat : l'utilisateur au
  // clavier ou au lecteur d'écran entend son score au lieu de rester sur un
  // bouton disparu. Uniquement à la bascule, pas à chaque rendu.
  useEffect(() => {
    if (submitted) resultRef.current?.focus();
  }, [submitted]);

  // Les propositions sont mélangées de façon déterministe : sans cela, la bonne
  // réponse se trouvait presque toujours en deuxième position et le QCM était
  // soluble sans connaître le sujet. L'ordre reste stable d'un affichage à
  // l'autre, une question revue en révision se présente donc à l'identique.
  const questions = useMemo(
    () =>
      quiz.questions.map((q) => {
        const { choices, answer } = shuffleChoices(`${quiz.id}/${q.id}`, q.choices, q.answer);
        return { ...q, choices, answer };
      }),
    [quiz],
  );

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const score = questions.filter((q) => answers[q.id] === q.answer).length;

  function select(questionId: string, choiceIndex: number) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [questionId]: choiceIndex }));
    setShowMissing(false);
  }

  function submit() {
    if (answered < total) {
      setShowMissing(true);
      return;
    }
    setSubmitted(true);
    saveQuizResult(courseId, moduleId, score, total);

    // Alimente la file de révision : sans cela, la page /revision reste vide
    // alors qu'elle annonce reprendre « chaque question ratée dans un QCM ».
    for (const q of questions) {
      if (answers[q.id] === q.answer) recordRight(courseId, moduleId, q.id);
      else recordWrong(courseId, moduleId, q.id);
    }

    onFinished?.(score, total);
    window.scrollTo({ top: 0 });
  }

  function restart() {
    setAnswers({});
    setSubmitted(false);
    setShowMissing(false);
    window.scrollTo({ top: 0 });
  }

  const passed = score / total >= 0.7;

  return (
    <div className="quiz">
      {submitted && (
        <div
          className={`quiz-result ${passed ? 'quiz-result--passed' : 'quiz-result--failed'}`}
          role="status"
          aria-live="polite"
          tabIndex={-1}
          ref={resultRef}
        >
          <p className="quiz-result__score">
            <span className="mono">
              {score}/{total}
            </span>{' '}
            bonnes réponses — {passed ? 'module validé' : 'module non validé'}
          </p>
          <p>
            {passed
              ? 'Bravo. Le seuil de validation est de 70 % : ce module est acquis. Les explications ci-dessous restent consultables.'
              : 'Le seuil de validation est de 70 %. Relisez les explications ci-dessous, revenez aux leçons si besoin, puis recommencez le QCM.'}
          </p>
          <button type="button" className="btn btn--ghost" onClick={restart}>
            Recommencer le QCM
          </button>
        </div>
      )}

      <ol className="quiz__questions">
        {questions.map((q, qi) => {
          const chosen = answers[q.id];
          const missing = showMissing && chosen === undefined;
          return (
            <li key={q.id} className="quiz-question">
              <fieldset>
                <legend>
                  <span className="quiz-question__num mono">Question {qi + 1}</span>
                  {q.prompt}
                </legend>
                {missing && <p className="quiz-question__missing">Répondez à cette question avant de valider.</p>}
                <div className="quiz-question__choices">
                  {q.choices.map((choice, ci) => {
                    const isChosen = chosen === ci;
                    const isCorrect = q.answer === ci;
                    let stateClass = '';
                    if (submitted) {
                      if (isCorrect) stateClass = ' is-correct';
                      else if (isChosen) stateClass = ' is-incorrect';
                    } else if (isChosen) {
                      stateClass = ' is-selected';
                    }
                    return (
                      <label key={ci} className={`quiz-choice${stateClass}`}>
                        <input
                          type="radio"
                          name={q.id}
                          checked={isChosen}
                          disabled={submitted}
                          onChange={() => select(q.id, ci)}
                        />
                        <span className="quiz-choice__text">{choice}</span>
                        {submitted && isCorrect && <span className="quiz-choice__badge">Bonne réponse</span>}
                        {submitted && isChosen && !isCorrect && (
                          <span className="quiz-choice__badge quiz-choice__badge--wrong">Votre réponse</span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {submitted && (
                  <p className={`quiz-question__explanation${chosen === q.answer ? ' is-right' : ''}`}>
                    <strong>{chosen === q.answer ? 'Exact. ' : 'Explication : '}</strong>
                    {q.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {!submitted && (
        <div className="quiz__footer">
          <p className="muted mono">
            {answered}/{total} questions répondues
          </p>
          {showMissing && answered < total && (
            <p className="quiz__missing-hint" role="alert">
              Il reste {total - answered} question{total - answered > 1 ? 's' : ''} sans réponse.
            </p>
          )}
          <button type="button" className="btn btn--primary btn--lg" onClick={submit}>
            Valider mes réponses
          </button>
        </div>
      )}
    </div>
  );
}
