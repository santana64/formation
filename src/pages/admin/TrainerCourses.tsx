import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { humanError } from '../../lib/supabase';
import {
  createCourse,
  deleteCourse,
  listCourses,
  statusLabels,
  updateCourse,
  type CourseRow,
} from '../../lib/admin';
import { usePageMeta } from '../../lib/meta';
import AdminNav from './AdminNav';

export default function TrainerCourses() {
  usePageMeta('Mes cours', 'Créer et publier des parcours sur FGF Campus.');
  const { profile } = useAuth();

  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const isAdmin = profile?.role === 'admin';

  async function reload() {
    setLoading(true);
    try {
      // L'administrateur voit tous les cours, le formateur uniquement les siens.
      setCourses(await listCourses(isAdmin ? undefined : profile?.id));
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
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
      await createCourse(profile.id, title.trim());
      setTitle('');
      setNotice({ kind: 'ok', text: 'Cours créé en brouillon.' });
      await reload();
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    }
  }

  async function changeStatus(course: CourseRow, status: CourseRow['status']) {
    if (status === 'publie' && !window.confirm('Publier ce cours ? Il deviendra visible par tous les apprenants.'))
      return;
    try {
      await updateCourse(course.id, { status });
      setNotice({ kind: 'ok', text: `Statut mis à jour : ${statusLabels[status]}.` });
      await reload();
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    }
  }

  async function remove(course: CourseRow) {
    if (
      !window.confirm(
        `Supprimer définitivement « ${course.title} » ?\n\nLes modules, leçons et questions seront supprimés avec lui. Cette action est irréversible.`,
      )
    )
      return;
    try {
      await deleteCourse(course.id);
      setNotice({ kind: 'ok', text: 'Cours supprimé.' });
      await reload();
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    }
  }

  return (
    <div className="wrap section">
      <AdminNav />

      <header className="page-head">
        <p className="kicker">Espace formateur</p>
        <h1>{isAdmin ? 'Tous les cours' : 'Mes cours'}</h1>
        <p className="page-head__lead">
          Créez vos parcours, structurez-les en modules et leçons, puis publiez-les. Un cours en brouillon n’est
          visible que par vous.
        </p>
      </header>

      {notice && (
        <p className={`auth-alert auth-alert--${notice.kind === 'ok' ? 'ok' : 'error'}`} role="status">
          {notice.text}
        </p>
      )}

      <form className="admin-inline-form" onSubmit={add}>
        <div className="field">
          <label htmlFor="new-course">Titre du nouveau cours</label>
          <input
            id="new-course"
            type="text"
            value={title}
            placeholder="Pilotage d’un portefeuille de projets"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn--primary" disabled={title.trim().length < 3}>
          Créer le cours
        </button>
      </form>

      {loading ? (
        <p className="muted" role="status">
          Chargement…
        </p>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h2>Aucun cours pour le moment</h2>
          <p>
            Créez votre premier parcours avec le formulaire ci-dessus. Vous pourrez ensuite y ajouter des modules,
            des leçons et un QCM par module.
          </p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Cours</th>
                <th scope="col">Statut</th>
                <th scope="col">Modifié le</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    <Link to={`/formateur/cours/${c.id}`}>{c.title}</Link>
                    <span className="admin-table__sub mono">{c.slug}</span>
                  </th>
                  <td data-label="Statut">
                    <select
                      aria-label={`Statut de ${c.title}`}
                      value={c.status}
                      onChange={(e) => void changeStatus(c, e.target.value as CourseRow['status'])}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Modifié le" className="mono">
                    {new Date(c.updated_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td data-label="Actions">
                    <Link to={`/formateur/cours/${c.id}`} className="btn btn--quiet">
                      Modifier
                    </Link>
                    <button type="button" className="btn btn--quiet admin-danger" onClick={() => void remove(c)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
