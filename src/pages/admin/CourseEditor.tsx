import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { humanError } from '../../lib/supabase';
import {
  createLesson,
  createModule,
  deleteLesson,
  deleteModule,
  deleteQuestion,
  listCourses,
  listLessons,
  listModules,
  listQuestions,
  saveQuestion,
  updateCourse,
  updateModule,
  type CourseRow,
  type LessonRow,
  type ModuleRow,
  type QuestionRow,
} from '../../lib/admin';
import { usePageMeta } from '../../lib/meta';
import AdminNav from './AdminNav';

const emptyQuestion = (moduleId: string, position: number): QuestionRow => ({
  id: '',
  module_id: moduleId,
  prompt: '',
  choices: ['', '', '', ''],
  answer: 0,
  explanation: '',
  position,
});

export default function CourseEditor() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [lessons, setLessons] = useState<Record<string, LessonRow[]>>({});
  const [questions, setQuestions] = useState<Record<string, QuestionRow[]>>({});
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuestionRow | null>(null);
  const [newModule, setNewModule] = useState('');
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta(course ? `Édition — ${course.title}` : 'Édition d’un cours');

  const fail = (err: unknown) =>
    setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });

  const loadModules = useCallback(async (id: string) => {
    const list = await listModules(id);
    setModules(list);
    const byModule: Record<string, LessonRow[]> = {};
    const questionsByModule: Record<string, QuestionRow[]> = {};
    for (const m of list) {
      byModule[m.id] = await listLessons(m.id);
      questionsByModule[m.id] = await listQuestions(m.id);
    }
    setLessons(byModule);
    setQuestions(questionsByModule);
  }, []);

  useEffect(() => {
    if (!courseId) return;
    void (async () => {
      setLoading(true);
      try {
        const all = await listCourses();
        setCourse(all.find((c) => c.id === courseId) ?? null);
        await loadModules(courseId);
      } catch (err) {
        fail(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, loadModules]);

  async function saveCourseField(patch: Partial<CourseRow>) {
    if (!course) return;
    try {
      await updateCourse(course.id, patch);
      setCourse({ ...course, ...patch });
      setNotice({ kind: 'ok', text: 'Cours enregistré.' });
    } catch (err) {
      fail(err);
    }
  }

  async function addModule(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId || newModule.trim().length < 3) return;
    try {
      await createModule(courseId, newModule.trim(), modules.length);
      setNewModule('');
      await loadModules(courseId);
    } catch (err) {
      fail(err);
    }
  }

  async function addLesson(moduleId: string, title: string) {
    if (!courseId || title.trim().length < 3) return;
    try {
      await createLesson(moduleId, title.trim(), (lessons[moduleId] ?? []).length);
      await loadModules(courseId);
    } catch (err) {
      fail(err);
    }
  }

  async function persistQuestion() {
    if (!editingQuestion || !courseId) return;
    const q = editingQuestion;
    const filled = q.choices.filter((c) => c.trim());
    if (q.prompt.trim().length < 10) {
      setNotice({ kind: 'error', text: 'L’énoncé doit être explicite (10 caractères minimum).' });
      return;
    }
    if (filled.length < 3) {
      setNotice({ kind: 'error', text: 'Proposez au moins trois réponses.' });
      return;
    }
    if (!q.choices[q.answer]?.trim()) {
      setNotice({ kind: 'error', text: 'La bonne réponse désignée est vide.' });
      return;
    }
    if (q.explanation.trim().length < 20) {
      setNotice({ kind: 'error', text: 'L’explication est ce qui fait apprendre : rédigez-la.' });
      return;
    }
    try {
      await saveQuestion({ ...q, choices: q.choices.filter((c) => c.trim()), id: q.id || undefined });
      setEditingQuestion(null);
      setNotice({ kind: 'ok', text: 'Question enregistrée.' });
      await loadModules(courseId);
    } catch (err) {
      fail(err);
    }
  }

  if (loading) {
    return (
      <div className="wrap section">
        <p className="muted" role="status">
          Chargement du cours…
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="wrap section">
        <div className="empty-state empty-state--page">
          <h1>Cours introuvable</h1>
          <p>Ce cours n’existe pas, ou il ne vous appartient pas.</p>
          <Link to="/formateur" className="btn btn--primary">
            Retour à mes cours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap section">
      <AdminNav />

      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/formateur">Mes cours</Link>
        <span aria-hidden="true">/</span>
        <span>{course.title}</span>
      </nav>

      <header className="page-head">
        <p className="kicker">Édition</p>
        <h1>{course.title}</h1>
      </header>

      {notice && (
        <p className={`auth-alert auth-alert--${notice.kind === 'ok' ? 'ok' : 'error'}`} role="status">
          {notice.text}
        </p>
      )}

      <section className="admin-panel">
        <h2>Présentation</h2>
        <div className="field">
          <label htmlFor="c-title">Titre</label>
          <input
            id="c-title"
            type="text"
            defaultValue={course.title}
            onBlur={(e) => void saveCourseField({ title: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="c-pitch">Accroche</label>
          <textarea
            id="c-pitch"
            rows={3}
            defaultValue={course.pitch}
            onBlur={(e) => void saveCourseField({ pitch: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="c-level">Niveau</label>
          <select
            id="c-level"
            defaultValue={course.level}
            onChange={(e) => void saveCourseField({ level: e.target.value })}
          >
            <option>Initiation</option>
            <option>Perfectionnement</option>
            <option>Expertise</option>
          </select>
        </div>
        <p className="field__hint">Les modifications sont enregistrées quand vous quittez le champ.</p>
      </section>

      <section className="admin-panel">
        <h2>Modules, leçons et QCM</h2>

        {modules.length === 0 && (
          <p className="muted">Aucun module. Commencez par en créer un ci-dessous.</p>
        )}

        {modules.map((m, i) => {
          const open = openModule === m.id;
          const moduleQuestions = questions[m.id] ?? [];
          return (
            <article key={m.id} className="module-editor">
              <div className="module-editor__head">
                <button
                  type="button"
                  className="module-editor__toggle"
                  aria-expanded={open}
                  onClick={() => setOpenModule(open ? null : m.id)}
                >
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span> {m.title}
                  <span className="muted">
                    {' '}
                    — {(lessons[m.id] ?? []).length} leçon(s), {moduleQuestions.length} question(s)
                  </span>
                </button>
                <button
                  type="button"
                  className="btn btn--quiet admin-danger"
                  onClick={async () => {
                    if (!window.confirm(`Supprimer le module « ${m.title} » et tout son contenu ?`)) return;
                    try {
                      await deleteModule(m.id);
                      await loadModules(course.id);
                    } catch (err) {
                      fail(err);
                    }
                  }}
                >
                  Supprimer
                </button>
              </div>

              {open && (
                <div className="module-editor__body">
                  <div className="field">
                    <label htmlFor={`sum-${m.id}`}>Résumé du module</label>
                    <textarea
                      id={`sum-${m.id}`}
                      rows={2}
                      defaultValue={m.summary}
                      onBlur={async (e) => {
                        try {
                          await updateModule(m.id, { summary: e.target.value });
                        } catch (err) {
                          fail(err);
                        }
                      }}
                    />
                  </div>

                  <h3>Leçons</h3>
                  <ul className="editor-list">
                    {(lessons[m.id] ?? []).map((l) => (
                      <li key={l.id}>
                        <span>
                          {l.title} <span className="muted mono">· {l.duration} min · {l.kind}</span>
                        </span>
                        <button
                          type="button"
                          className="btn btn--quiet admin-danger"
                          onClick={async () => {
                            if (!window.confirm(`Supprimer la leçon « ${l.title} » ?`)) return;
                            try {
                              await deleteLesson(l.id);
                              await loadModules(course.id);
                            } catch (err) {
                              fail(err);
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </li>
                    ))}
                    {(lessons[m.id] ?? []).length === 0 && <li className="muted">Aucune leçon.</li>}
                  </ul>
                  <form
                    className="admin-inline-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem('lesson') as HTMLInputElement;
                      void addLesson(m.id, input.value).then(() => (input.value = ''));
                    }}
                  >
                    <div className="field">
                      <label htmlFor={`lesson-${m.id}`}>Nouvelle leçon</label>
                      <input id={`lesson-${m.id}`} name="lesson" type="text" />
                    </div>
                    <button type="submit" className="btn btn--ghost">
                      Ajouter
                    </button>
                  </form>

                  <h3>Questions du QCM</h3>
                  <ul className="editor-list">
                    {moduleQuestions.map((q) => (
                      <li key={q.id}>
                        <span>{q.prompt}</span>
                        <span>
                          <button type="button" className="btn btn--quiet" onClick={() => setEditingQuestion(q)}>
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="btn btn--quiet admin-danger"
                            onClick={async () => {
                              if (!window.confirm('Supprimer cette question ?')) return;
                              try {
                                await deleteQuestion(q.id);
                                await loadModules(course.id);
                              } catch (err) {
                                fail(err);
                              }
                            }}
                          >
                            Supprimer
                          </button>
                        </span>
                      </li>
                    ))}
                    {moduleQuestions.length === 0 && <li className="muted">Aucune question.</li>}
                  </ul>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setEditingQuestion(emptyQuestion(m.id, moduleQuestions.length))}
                  >
                    Ajouter une question
                  </button>
                </div>
              )}
            </article>
          );
        })}

        <form className="admin-inline-form" onSubmit={addModule}>
          <div className="field">
            <label htmlFor="new-module">Nouveau module</label>
            <input id="new-module" type="text" value={newModule} onChange={(e) => setNewModule(e.target.value)} />
          </div>
          <button type="submit" className="btn btn--primary" disabled={newModule.trim().length < 3}>
            Ajouter le module
          </button>
        </form>
      </section>

      {editingQuestion && (
        <section className="admin-panel question-editor">
          <h2>{editingQuestion.id ? 'Modifier la question' : 'Nouvelle question'}</h2>
          <div className="field">
            <label htmlFor="q-prompt">Énoncé</label>
            <textarea
              id="q-prompt"
              rows={2}
              value={editingQuestion.prompt}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, prompt: e.target.value })}
            />
          </div>

          <fieldset className="choices-field">
            <legend>Réponses — cochez la bonne</legend>
            {editingQuestion.choices.map((choice, i) => (
              <div key={i} className="choice-row">
                <input
                  type="radio"
                  name="answer"
                  id={`ans-${i}`}
                  checked={editingQuestion.answer === i}
                  onChange={() => setEditingQuestion({ ...editingQuestion, answer: i })}
                />
                <label htmlFor={`ans-${i}`} className="visually-hidden">
                  Réponse {i + 1} correcte
                </label>
                <input
                  type="text"
                  aria-label={`Texte de la réponse ${i + 1}`}
                  value={choice}
                  onChange={(e) => {
                    const choices = [...editingQuestion.choices];
                    choices[i] = e.target.value;
                    setEditingQuestion({ ...editingQuestion, choices });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() =>
                setEditingQuestion({ ...editingQuestion, choices: [...editingQuestion.choices, ''] })
              }
            >
              Ajouter une réponse
            </button>
          </fieldset>

          <div className="field">
            <label htmlFor="q-expl">Explication</label>
            <textarea
              id="q-expl"
              rows={3}
              value={editingQuestion.explanation}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
            />
            <p className="field__hint">
              Elle s’affiche après correction, y compris en cas de bonne réponse. C’est elle qui fait apprendre.
            </p>
          </div>

          <div className="admin-actions">
            <button type="button" className="btn btn--primary" onClick={() => void persistQuestion()}>
              Enregistrer la question
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setEditingQuestion(null)}>
              Annuler
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
