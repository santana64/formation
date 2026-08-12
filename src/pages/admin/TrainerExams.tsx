import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { humanError } from '../../lib/supabase';
import {
  createExam,
  deleteExam,
  listCourses,
  listExams,
  statusLabels,
  updateExam,
  type CourseRow,
  type ExamRow,
} from '../../lib/admin';
import { usePageMeta } from '../../lib/meta';
import AdminNav from './AdminNav';

export default function TrainerExams() {
  usePageMeta('Examens', 'Créer et publier des examens sur FGF Campus.');
  const { profile } = useAuth();

  const [exams, setExams] = useState<ExamRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const isAdmin = profile?.role === 'admin';
  const fail = (err: unknown) =>
    setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });

  async function reload() {
    setLoading(true);
    try {
      const [e, c] = await Promise.all([listExams(isAdmin ? undefined : profile?.id), listCourses()]);
      setExams(e);
      setCourses(c);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profile) void reload();
  }, [profile?.id, isAdmin]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || title.trim().length < 3) return;
    try {
      await createExam(profile.id, title.trim());
      setTitle('');
      await reload();
    } catch (err) {
      fail(err);
    }
  }

  async function patch(exam: ExamRow, changes: Partial<ExamRow>) {
    try {
      await updateExam(exam.id, changes);
      await reload();
    } catch (err) {
      fail(err);
    }
  }

  function toggleCourse(exam: ExamRow, courseId: string) {
    const next = exam.course_ids.includes(courseId)
      ? exam.course_ids.filter((id) => id !== courseId)
      : [...exam.course_ids, courseId];
    void patch(exam, { course_ids: next });
  }

  return (
    <div className="wrap section">
      <AdminNav />

      <header className="page-head">
        <p className="kicker">Espace formateur</p>
        <h1>Examens</h1>
        <p className="page-head__lead">
          Un examen tire au sort des questions parmi les cours sélectionnés. La réussite délivre automatiquement un
          certificat interne FGF.
        </p>
      </header>

      <p className="auth-alert auth-alert--warn">
        <strong>Rappel réglementaire.</strong> Ces examens sont internes à FGF Consultant. Ils ne sont affiliés ni au
        PMI, ni à l’IPMA, ni à l’ICEC, et ne délivrent ni diplôme ni certification professionnelle enregistrée au
        RNCP. Le document remis est un certificat interne.
      </p>

      {notice && (
        <p className={`auth-alert auth-alert--${notice.kind === 'ok' ? 'ok' : 'error'}`} role="status">
          {notice.text}
        </p>
      )}

      <form className="admin-inline-form" onSubmit={add}>
        <div className="field">
          <label htmlFor="new-exam">Titre du nouvel examen</label>
          <input
            id="new-exam"
            type="text"
            value={title}
            placeholder="Examen blanc — fondamentaux"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn--primary" disabled={title.trim().length < 3}>
          Créer l’examen
        </button>
      </form>

      {loading ? (
        <p className="muted" role="status">
          Chargement…
        </p>
      ) : exams.length === 0 ? (
        <div className="empty-state">
          <h2>Aucun examen</h2>
          <p>Créez-en un ci-dessus, puis choisissez les cours qui alimenteront le tirage des questions.</p>
        </div>
      ) : (
        exams.map((exam) => (
          <section key={exam.id} className="admin-panel">
            <div className="module-editor__head">
              <h2>{exam.title}</h2>
              <button
                type="button"
                className="btn btn--quiet admin-danger"
                onClick={async () => {
                  if (!window.confirm(`Supprimer l’examen « ${exam.title} » ?`)) return;
                  try {
                    await deleteExam(exam.id);
                    await reload();
                  } catch (err) {
                    fail(err);
                  }
                }}
              >
                Supprimer
              </button>
            </div>

            <div className="exam-grid">
              <div className="field">
                <label htmlFor={`n-${exam.id}`}>Nombre de questions</label>
                <input
                  id={`n-${exam.id}`}
                  type="number"
                  min={5}
                  max={100}
                  defaultValue={exam.question_count}
                  onBlur={(e) => void patch(exam, { question_count: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label htmlFor={`d-${exam.id}`}>Durée (minutes)</label>
                <input
                  id={`d-${exam.id}`}
                  type="number"
                  min={5}
                  max={240}
                  defaultValue={exam.duration_minutes}
                  onBlur={(e) => void patch(exam, { duration_minutes: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label htmlFor={`s-${exam.id}`}>Seuil de réussite (%)</label>
                <input
                  id={`s-${exam.id}`}
                  type="number"
                  min={1}
                  max={100}
                  defaultValue={exam.pass_threshold}
                  onBlur={(e) => void patch(exam, { pass_threshold: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label htmlFor={`st-${exam.id}`}>Statut</label>
                <select
                  id={`st-${exam.id}`}
                  defaultValue={exam.status}
                  onChange={(e) => void patch(exam, { status: e.target.value })}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="choices-field">
              <legend>Cours qui alimentent le tirage</legend>
              {courses.map((c) => (
                <label key={c.id} className="choice-row choice-row--check">
                  <input
                    type="checkbox"
                    checked={exam.course_ids.includes(c.id)}
                    onChange={() => toggleCourse(exam, c.id)}
                  />
                  <span>{c.title}</span>
                </label>
              ))}
              {courses.length === 0 && <p className="muted">Aucun cours disponible.</p>}
            </fieldset>
          </section>
        ))
      )}
    </div>
  );
}
