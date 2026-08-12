import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { humanError, roleLabels, supabase } from '../lib/supabase';
import { usePageMeta } from '../lib/meta';

interface Badge {
  slug: string;
  label: string;
  description: string;
  awarded_at: string | null;
}

export default function Account() {
  usePageMeta('Mon compte', 'Vos informations, vos badges et vos attestations sur FGF Campus.');
  const { profile, session, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [credentialName, setCredentialName] = useState('');
  const [badges, setBadges] = useState<Badge[]>([]);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setCredentialName(profile.credential_name ?? '');
    }
  }, [profile]);

  useEffect(() => {
    if (!supabase || !session) return;
    void (async () => {
      const { data: all } = await supabase.from('badges').select('slug, label, description, position').order('position');
      const { data: mine } = await supabase.from('user_badges').select('badge_id, awarded_at, badges(slug)');

      // PostgREST renvoie la relation jointe sous forme de tableau, même
      // lorsqu'elle ne peut contenir qu'un seul élément.
      const awarded = new Map<string, string>();
      for (const row of (mine ?? []) as { awarded_at: string; badges: { slug: string }[] }[]) {
        for (const badge of row.badges ?? []) awarded.set(badge.slug, row.awarded_at);
      }

      setBadges(
        ((all ?? []) as { slug: string; label: string; description: string }[]).map((b) => ({
          ...b,
          awarded_at: awarded.get(b.slug) ?? null,
        })),
      );
    })();
  }, [session]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      await updateProfile({ full_name: fullName.trim(), credential_name: credentialName.trim() || null });
      setNotice({ kind: 'ok', text: 'Vos informations ont été enregistrées.' });
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    } finally {
      setBusy(false);
    }
  }

  const obtained = badges.filter((b) => b.awarded_at);

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Mon compte</p>
        <h1>{profile?.full_name || 'Mon compte'}</h1>
        <p className="page-head__lead">
          {session?.user.email}
          {profile && <> · {roleLabels[profile.role]}</>}
        </p>
      </header>

      <div className="account-grid">
        <section className="account-card">
          <h2>Mes informations</h2>
          <form onSubmit={save} noValidate>
            <div className="field">
              <label htmlFor="fullName">Prénom et nom</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="credentialName">Nom sur les attestations</label>
              <input
                id="credentialName"
                type="text"
                value={credentialName}
                placeholder={fullName || 'Identique au nom ci-dessus'}
                onChange={(e) => setCredentialName(e.target.value)}
              />
              <p className="field__hint">
                Laissez vide pour utiliser votre nom courant. Utile si votre nom d’état civil diffère.
              </p>
            </div>
            {notice && (
              <p className={`auth-alert auth-alert--${notice.kind === 'ok' ? 'ok' : 'error'}`} role="status">
                {notice.text}
              </p>
            )}
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>

          <div className="account-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
            >
              Se déconnecter
            </button>
          </div>
        </section>

        <section className="account-card">
          <h2>Mes badges</h2>
          <p className="account-card__lead">
            {obtained.length} badge{obtained.length > 1 ? 's' : ''} obtenu{obtained.length > 1 ? 's' : ''} sur{' '}
            {badges.length}. Ils s’obtiennent automatiquement en progressant : les badges sont attribués par le
            serveur à partir de vos résultats réels.
          </p>
          <ul className="badge-grid">
            {badges.map((b) => (
              <li key={b.slug} className={`badge-item${b.awarded_at ? ' is-earned' : ''}`}>
                <span className="badge-item__medal" aria-hidden="true">
                  {b.awarded_at ? '★' : '☆'}
                </span>
                <span className="badge-item__body">
                  <span className="badge-item__label">{b.label}</span>
                  <span className="badge-item__desc">{b.description}</span>
                  <span className="badge-item__state">
                    {b.awarded_at
                      ? `Obtenu le ${new Date(b.awarded_at).toLocaleDateString('fr-FR')}`
                      : 'Pas encore obtenu'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {badges.length === 0 && (
            <p className="muted">Le catalogue de badges n’a pas encore été chargé.</p>
          )}
        </section>
      </div>

      <p className="account-footnote">
        Besoin de retrouver votre progression suivie sans compte ? Elle reste dans ce navigateur :{' '}
        <Link to="/progression">exportez-la depuis « Ma progression »</Link>.
      </p>
    </div>
  );
}
