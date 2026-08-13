import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { humanError, roleLabels, supabase } from '../../lib/supabase';
import { usePageMeta } from '../../lib/meta';
import AdminNav from './AdminNav';

interface Learner {
  id: string;
  full_name: string;
  role: string;
  lessons: number;
  quizzesPassed: number;
  exams: number;
}

/**
 * Vue du référent d'une entreprise cliente. Il consulte l'avancement de ses
 * salariés et ne peut rien modifier : les policies RLS limitent d'elles-mêmes
 * la lecture aux comptes rattachés à son organisation.
 */
export default function OrgLearners() {
  usePageMeta('Mes apprenants', 'Suivi de la progression des salariés inscrits.');
  const { profile } = useAuth();

  const [learners, setLearners] = useState<Learner[]>([]);
  const [orgName, setOrgName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !profile) return;
    void (async () => {
      setLoading(true);
      try {
        // Le détail des copies n'est pas accessible au référent : la base ne
        // lui expose que ces compteurs, via une fonction dédiée.
        const [{ data: rows, error: rowsError }, { data: org }] = await Promise.all([
          supabase.rpc('org_learner_summary'),
          profile.organization_id
            ? supabase.from('organizations').select('name').eq('id', profile.organization_id).single()
            : Promise.resolve({ data: null }),
        ]);
        if (rowsError) throw rowsError;

        setOrgName((org as { name?: string } | null)?.name ?? '');

        setLearners(
          ((rows ?? []) as {
            user_id: string;
            full_name: string;
            role: string;
            lessons_done: number;
            quizzes_passed: number;
            exams_passed: number;
          }[]).map((r) => ({
            id: r.user_id,
            full_name: r.full_name || 'Sans nom',
            role: r.role,
            lessons: Number(r.lessons_done),
            quizzesPassed: Number(r.quizzes_passed),
            exams: Number(r.exams_passed),
          })),
        );
      } catch (err) {
        setError(humanError(err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    })();
  }, [profile?.organization_id, profile?.id]);

  if (profile && !profile.organization_id && profile.role !== 'admin') {
    return (
      <div className="wrap section">
        <AdminNav />
        <div className="empty-state empty-state--page">
          <h1>Aucune entreprise rattachée</h1>
          <p>
            Votre compte n’est rattaché à aucune entreprise. Demandez à un administrateur du campus de vous
            rattacher à la vôtre pour accéder au suivi de vos salariés.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap section">
      <AdminNav />

      <header className="page-head">
        <p className="kicker">Espace entreprise</p>
        <h1>{orgName || 'Mes apprenants'}</h1>
        <p className="page-head__lead">
          Avancement des comptes rattachés à votre entreprise. Ces données sont consultables uniquement ; les
          résultats détaillés question par question restent privés.
        </p>
      </header>

      {error && (
        <p className="auth-alert auth-alert--error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="muted" role="status">
          Chargement…
        </p>
      ) : learners.length === 0 ? (
        <div className="empty-state">
          <h2>Aucun apprenant rattaché</h2>
          <p>
            Dès qu’un salarié créera son compte et sera rattaché à votre entreprise par un administrateur, il
            apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Apprenant</th>
                <th scope="col">Leçons terminées</th>
                <th scope="col">QCM validés</th>
                <th scope="col">Examens réussis</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((l) => (
                <tr key={l.id}>
                  <th scope="row">
                    {l.full_name}
                    {l.role !== 'apprenant' && (
                      <span className="admin-table__sub">{roleLabels[l.role as keyof typeof roleLabels]}</span>
                    )}
                  </th>
                  <td data-label="Leçons terminées" className="mono">
                    {l.lessons}
                  </td>
                  <td data-label="QCM validés" className="mono">
                    {l.quizzesPassed}
                  </td>
                  <td data-label="Examens réussis" className="mono">
                    {l.exams}
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
