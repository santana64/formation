import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data';
import type { Question } from '../data/types';
import { usePageMeta } from '../lib/meta';
import { recordRight, recordWrong } from '../lib/review';

interface ExamQuestion {
  key: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId?: string;
  question: Question;
}

type Scope = 'all' | string;
type Size = 20 | 40 | 'all';

interface CourseScore {
  courseId: string;
  courseTitle: string;
  right: number;
  total: number;
}

interface ExamResult {
  right: number;
  total: number;
  seconds: number;
  byCourse: CourseScore[];
  missed: { entry: ExamQuestion; chosen: number | undefined }[];
}

function buildPool(scope: Scope): ExamQuestion[] {
  const pool: ExamQuestion[] = [];
  for (const course of courses) {
    if (scope !== 'all' && course.id !== scope) continue;
    for (const mod of course.modules) {
      for (const question of mod.quiz.questions) {
        pool.push({
          key: `${course.id}/${mod.id}/${question.id}`,
          courseId: course.id,
          courseTitle: course.title,
          moduleId: mod.id,
          moduleTitle: mod.title,
          lessonId: mod.lessons[0]?.id,
          question,
        });
      }
    }
  }
  return pool;
}

/** Mélange de Fisher-Yates sur une copie : tirage sans répétition. */
function shuffle<T>(items: T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clock(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return h > 0 ? `${h}:${mmss}` : mmss;
}

function spokenDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return m === 0 ? `${h} h` : `${h} h ${m} min`;
  if (m === 0) return `${s} seconde${s > 1 ? 's' : ''}`;
  return s === 0 ? `${m} minute${m > 1 ? 's' : ''}` : `${m} min ${s} s`;
}

export default function Exam() {
  usePageMeta(
    'Entraînement type examen',
    'Épreuve d’entraînement composée à partir des parcours FGF Campus : tirage aléatoire, chronomètre, correction en fin d’épreuve.',
  );

  const [scope, setScope] = useState<Scope>('all');
  const [size, setSize] = useState<Size>(20);
  const [paper, setPaper] = useState<ExamQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<ExamResult | null>(null);
  const startedAt = useRef(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const running = paper !== null && result === null;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds(Math.round((Date.now() - startedAt.current) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  const poolSize = buildPool(scope).length;

  function start() {
    const pool = shuffle(buildPool(scope));
    const drawn = size === 'all' ? pool : pool.slice(0, Math.min(size, pool.length));
    startedAt.current = Date.now();
    setSeconds(0);
    setPaper(drawn);
    setAnswers({});
    setIndex(0);
    setConfirmFinish(false);
    setResult(null);
    window.scrollTo({ top: 0 });
  }

  function finish() {
    if (!paper) return;
    const elapsed = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    const byCourse = new Map<string, CourseScore>();
    const missed: ExamResult['missed'] = [];
    let right = 0;

    for (const entry of paper) {
      const chosen = answers[entry.key];
      const ok = chosen === entry.question.answer;
      if (ok) right += 1;
      else missed.push({ entry, chosen });

      const line = byCourse.get(entry.courseId) ?? {
        courseId: entry.courseId,
        courseTitle: entry.courseTitle,
        right: 0,
        total: 0,
      };
      line.total += 1;
      if (ok) line.right += 1;
      byCourse.set(entry.courseId, line);

      // Une bonne réponse ne fait sortir de la file que les questions qui y
      // étaient déjà : `recordRight` est sans effet sur les autres.
      if (ok) recordRight(entry.courseId, entry.moduleId, entry.question.id);
      else recordWrong(entry.courseId, entry.moduleId, entry.question.id);
    }

    setResult({ right, total: paper.length, seconds: elapsed, byCourse: [...byCourse.values()], missed });
    setSeconds(elapsed);
    window.scrollTo({ top: 0 });
  }

  const answered = paper ? paper.filter((e) => answers[e.key] !== undefined).length : 0;
  const current = paper?.[index];

  const disclaimer = (
    <aside className="exam-disclaimer">
      <h2>Ceci n’est pas un examen officiel</h2>
      <p>
        FGF Consultant prépare aux certifications PMI, IPMA et ICEC, mais cette épreuve est un entraînement interne à
        FGF Campus. Elle n’est affiliée à aucun de ces organismes, n’en reprend ni les logos ni la nomenclature
        d’examen, et ne délivre aucune certification ni équivalence. Le score obtenu n’a aucune valeur officielle : il
        sert uniquement à repérer vos points faibles.
      </p>
    </aside>
  );

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Ancrage</p>
        <h1>Entraînement type examen</h1>
        <p className="page-head__lead">
          Une épreuve composée au hasard à partir des questions de plusieurs parcours, sans correction en cours de
          route. Le bilan détaille votre score par parcours et alimente votre file de révision.
        </p>
      </header>

      {!paper && (
        <>
          {disclaimer}
          <div className="exam-setup">
            <h2>Composer l’épreuve</h2>

            <div className="exam-field">
              <label htmlFor="exam-scope">Périmètre</label>
              <select
                id="exam-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="exam-select"
              >
                <option value="all">Tous les parcours</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <p className="exam-field__hint">
                <span className="mono">{poolSize}</span> questions disponibles dans ce périmètre.
              </p>
            </div>

            <fieldset className="exam-field">
              <legend>Nombre de questions</legend>
              <div className="exam-sizes">
                {([20, 40, 'all'] as Size[]).map((option) => (
                  <label key={String(option)} className={`exam-size${size === option ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="exam-size"
                      checked={size === option}
                      onChange={() => setSize(option)}
                    />
                    <span>{option === 'all' ? `Toutes (${poolSize})` : `${option} questions`}</span>
                  </label>
                ))}
              </div>
              {size !== 'all' && poolSize < size && (
                <p className="exam-field__hint">
                  Ce périmètre ne contient que {poolSize} questions : l’épreuve en comptera {poolSize}.
                </p>
              )}
            </fieldset>

            <button type="button" className="btn btn--primary btn--lg" onClick={start} disabled={poolSize === 0}>
              Démarrer l’épreuve
            </button>
            <p className="exam-field__hint">
              Le chronomètre démarre immédiatement. Vous pouvez revenir sur vos réponses tant que l’épreuve n’est pas
              terminée.
            </p>
          </div>
        </>
      )}

      {running && current && (
        <div className="quiz exam-run">
          <div className="exam-bar">
            <p className="mono">
              Question {index + 1} sur {paper.length}
            </p>
            <p className="mono exam-bar__answered">{answered} répondue{answered > 1 ? 's' : ''}</p>
            <p className="exam-timer mono" role="timer" aria-live="off">
              <span className="visually-hidden">Temps écoulé : </span>
              {clock(seconds)}
            </p>
          </div>

          <div className="quiz-question">
            <fieldset>
              <legend>
                <span className="quiz-question__num mono">Question {index + 1}</span>
                {current.question.prompt}
              </legend>
              <div className="quiz-question__choices">
                {current.question.choices.map((choice, ci) => (
                  <label key={ci} className={`quiz-choice${answers[current.key] === ci ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name={current.key}
                      checked={answers[current.key] === ci}
                      onChange={() => setAnswers((a) => ({ ...a, [current.key]: ci }))}
                    />
                    <span className="quiz-choice__text">{choice}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="exam-nav">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setIndex((i) => i - 1)}
              disabled={index === 0}
            >
              Question précédente
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setIndex((i) => i + 1)}
              disabled={index + 1 >= paper.length}
            >
              Question suivante
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => (answered < paper.length ? setConfirmFinish(true) : finish())}
            >
              Terminer l’épreuve
            </button>
          </div>

          {confirmFinish && answered < paper.length && (
            <div className="exam-confirm" role="alert">
              <p>
                Il reste {paper.length - answered} question{paper.length - answered > 1 ? 's' : ''} sans réponse.
                Elles seront comptées comme fausses.
              </p>
              <div className="exam-confirm__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setConfirmFinish(false)}>
                  Continuer l’épreuve
                </button>
                <button type="button" className="btn btn--primary" onClick={finish}>
                  Terminer quand même
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="exam-result">
          <div
            className="exam-score"
            role="status"
            aria-live="polite"
            tabIndex={-1}
            ref={resultRef}
          >
            <p className="exam-score__value">
              <span className="mono">
                {result.right}/{result.total}
              </span>{' '}
              bonnes réponses — {Math.round((result.right / result.total) * 100)} %
            </p>
            <p>
              Épreuve terminée en {spokenDuration(result.seconds)}. Résultat d’entraînement, sans valeur de
              certification.
            </p>
          </div>

          <section className="exam-block">
            <h2>Score par parcours</h2>
            <div className="table-scroll">
              <table className="exam-table">
                <thead>
                  <tr>
                    <th scope="col">Parcours</th>
                    <th scope="col">Score</th>
                    <th scope="col">Taux</th>
                  </tr>
                </thead>
                <tbody>
                  {result.byCourse.map((line) => (
                    <tr key={line.courseId}>
                      <th scope="row">
                        <Link to={`/formations/${line.courseId}`}>{line.courseTitle}</Link>
                      </th>
                      <td className="mono" data-label="Score">
                        {line.right}/{line.total}
                      </td>
                      <td className="mono" data-label="Taux">
                        {Math.round((line.right / line.total) * 100)} %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="exam-block">
            <h2>
              Questions ratées <span className="mono">({result.missed.length})</span>
            </h2>
            {result.missed.length === 0 ? (
              <p className="muted">Aucune erreur sur cette épreuve.</p>
            ) : (
              <>
                <p className="muted">
                  Ces questions rejoignent votre <Link to="/revision">file de révision</Link>.
                </p>
                <ol className="exam-missed">
                  {result.missed.map(({ entry, chosen }) => (
                    <li key={entry.key} className="quiz-question">
                      <p className="quiz-question__num mono">
                        {entry.courseTitle} · {entry.moduleTitle}
                      </p>
                      <p className="exam-missed__prompt">{entry.question.prompt}</p>
                      <p className="exam-missed__answer">
                        <strong>Votre réponse : </strong>
                        {chosen === undefined ? 'aucune' : entry.question.choices[chosen]}
                      </p>
                      <p className="exam-missed__answer">
                        <strong>Bonne réponse : </strong>
                        {entry.question.choices[entry.question.answer]}
                      </p>
                      <p className="quiz-question__explanation">
                        <strong>Explication : </strong>
                        {entry.question.explanation}
                      </p>
                      {entry.lessonId && (
                        <p className="exam-missed__link">
                          <Link to={`/formations/${entry.courseId}/modules/${entry.moduleId}/lecons/${entry.lessonId}`}>
                            Revoir la leçon correspondante
                          </Link>
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>

          {disclaimer}

          <div className="exam-result__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                setPaper(null);
                setResult(null);
                setSeconds(0);
              }}
            >
              Composer une nouvelle épreuve
            </button>
            <Link to="/revision" className="btn btn--ghost">
              Réviser mes erreurs
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
