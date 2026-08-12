import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data';
import ProgressBar from '../components/ProgressBar';
import {
  courseProgress,
  exportProgress,
  importProgress,
  isQuizPassed,
  lessonKey,
  quizKey,
  resetProgress,
  useProgress,
} from '../lib/progress';
import { usePageMeta } from '../lib/meta';
import { useAuth } from '../lib/auth';
import { syncLabels, useProgressSync } from '../lib/sync';

export default function Dashboard() {
  usePageMeta('Ma progression', 'Suivi de vos leçons terminées et de vos scores de QCM sur FGF Campus.');
  const progress = useProgress();
  const { session, enabled } = useAuth();
  const syncState = useProgressSync(session?.user.id);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function download() {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fgf-campus-progression-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice({ kind: 'ok', text: 'Progression exportée. Conservez ce fichier pour la restaurer ailleurs.' });
  }

  async function upload(file: File) {
    const result = importProgress(await file.text());
    setNotice(
      result.ok
        ? { kind: 'ok', text: 'Progression importée et fusionnée avec celle de cet appareil.' }
        : { kind: 'error', text: result.error },
    );
  }

  function clearAll() {
    if (!window.confirm('Effacer toute votre progression sur cet appareil ? Cette action est irréversible.')) return;
    resetProgress();
    setNotice({ kind: 'ok', text: 'Progression effacée.' });
  }
  const rows = courses.map((c) => ({ course: c, p: courseProgress(c, progress) }));
  const anyProgress = rows.some((r) => r.p.done > 0);

  const lessonsDone = Object.keys(progress.lessonsDone).length;
  const quizzesPassed = courses.reduce(
    (n, c) => n + c.modules.filter((m) => isQuizPassed(c.id, m.id, progress)).length,
    0,
  );

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Tableau de bord</p>
        <h1>Ma progression</h1>
        <p className="page-head__lead">
          {session
            ? 'Votre avancement est enregistré sur votre compte : vous le retrouvez sur tous vos appareils.'
            : 'Votre avancement est enregistré dans ce navigateur, sur cet appareil. Aucune donnée n’est transmise à FGF Consultant.'}
        </p>
        {syncState !== 'inactif' && (
          <p className={`sync-state sync-state--${syncState}`} role="status">
            {syncLabels[syncState]}
          </p>
        )}
        {enabled && !session && (
          <p className="sync-invite">
            <Link to="/inscription">Créez un compte</Link> pour conserver cette progression, gagner des badges et
            recevoir vos attestations. Votre avancement actuel sera repris automatiquement.
          </p>
        )}
      </header>

      {!anyProgress ? (
        <div className="empty-state empty-state--page">
          <h2>Vous n’avez pas encore commencé</h2>
          <p>
            Dès que vous terminerez une leçon ou passerez un QCM, vous retrouverez ici votre avancement par parcours,
            vos scores et le point exact où reprendre.
          </p>
          <div className="empty-state__actions">
            <Link to="/formations" className="btn btn--primary">
              Choisir un parcours
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="stat-row">
            <div className="stat">
              <span className="stat__value mono">{lessonsDone}</span>
              <span className="stat__label">leçons terminées</span>
            </div>
            <div className="stat">
              <span className="stat__value mono">{quizzesPassed}</span>
              <span className="stat__label">QCM validés (≥ 70 %)</span>
            </div>
            <div className="stat">
              <span className="stat__value mono">
                {rows.filter((r) => r.p.done === r.p.total).length}/{courses.length}
              </span>
              <span className="stat__label">parcours achevés</span>
            </div>
          </div>

          <div className="dash-courses">
            {rows.map(({ course, p }) => (
              <section key={course.id} className="dash-course">
                <div className="dash-course__head">
                  <h2>
                    <Link to={`/formations/${course.id}`}>{course.title}</Link>
                  </h2>
                  <ProgressBar done={p.done} total={p.total} />
                </div>
                {p.done === p.total && (
                  <p className="dash-course__done">
                    Parcours terminé —{' '}
                    <Link to={`/formations/${course.id}/attestation`}>éditer l’attestation de suivi</Link>
                  </p>
                )}
                <div className="table-scroll">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th scope="col">Module</th>
                        <th scope="col">Leçons</th>
                        <th scope="col">QCM</th>
                        <th scope="col">Score</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.modules.map((mod) => {
                        const doneLessons = mod.lessons.filter(
                          (l) => progress.lessonsDone[lessonKey(course.id, mod.id, l.id)],
                        ).length;
                        const result = progress.quizResults[quizKey(course.id, mod.id)];
                        const passed = isQuizPassed(course.id, mod.id, progress);
                        return (
                          <tr key={mod.id}>
                            <th scope="row">{mod.title}</th>
                            <td className="mono" data-label="Leçons">
                              {doneLessons}/{mod.lessons.length}
                            </td>
                            <td data-label="QCM">
                              {result ? (
                                <span className={`badge ${passed ? 'badge--ok' : 'badge--warn'}`}>
                                  {passed ? 'Validé' : 'À repasser'}
                                </span>
                              ) : (
                                <span className="badge badge--todo">Non passé</span>
                              )}
                            </td>
                            <td className="mono" data-label="Score">
                              {result ? `${result.score}/${result.total}` : '—'}
                            </td>
                            <td data-label="Action">
                              <Link
                                to={
                                  doneLessons < mod.lessons.length
                                    ? `/formations/${course.id}/modules/${mod.id}/lecons/${mod.lessons[doneLessons].id}`
                                    : `/formations/${course.id}/modules/${mod.id}/qcm`
                                }
                                className="btn btn--quiet"
                              >
                                {doneLessons === 0
                                  ? 'Commencer le module'
                                  : doneLessons < mod.lessons.length
                                    ? 'Reprendre la leçon'
                                    : passed
                                      ? 'Refaire le QCM'
                                      : 'Passer le QCM'}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          <section className="dash-backup">
            <h2>Sauvegarder ou transférer ma progression</h2>
            <p>
              Votre avancement est stocké dans ce navigateur uniquement. Exportez-le pour le conserver ou le
              reprendre sur un autre appareil — l’import fusionne avec l’existant et garde le meilleur score de
              chaque QCM.
            </p>
            <div className="dash-backup__actions">
              <button type="button" className="btn btn--ghost" onClick={download}>
                Exporter (fichier JSON)
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => fileInput.current?.click()}>
                Importer une sauvegarde
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                className="visually-hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                  e.target.value = '';
                }}
              />
              <button type="button" className="btn btn--danger" onClick={clearAll}>
                Tout effacer
              </button>
            </div>
            <p className={`dash-backup__notice${notice ? ` is-${notice.kind}` : ''}`} role="status">
              {notice?.text ?? ' '}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
