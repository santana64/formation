import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { humanError } from '../lib/supabase';
import { usePageMeta } from '../lib/meta';

export default function SignIn() {
  usePageMeta('Connexion', 'Accédez à votre compte FGF Campus.');
  const { signIn, resetPassword, session, enabled } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/progression';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to={from} replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(humanError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  async function forgotten() {
    if (!email.trim()) {
      setError('Saisissez d’abord votre adresse électronique.');
      return;
    }
    setError(null);
    try {
      await resetPassword(email);
      setNotice('Si un compte existe pour cette adresse, un courriel de réinitialisation vient d’être envoyé.');
    } catch (err) {
      setError(humanError(err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <div className="wrap section auth-page">
      <div className="auth-card">
        <p className="kicker">Espace apprenant</p>
        <h1>Connexion</h1>
        <p className="auth-card__lead">
          Un compte permet de retrouver votre progression sur tous vos appareils, de gagner des badges et de recevoir
          vos attestations. Le contenu reste consultable sans compte.
        </p>

        {!enabled && (
          <p className="auth-alert auth-alert--warn" role="status">
            Les comptes ne sont pas activés sur cette installation.
          </p>
        )}

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="email">Adresse électronique</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="auth-alert auth-alert--error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="auth-alert auth-alert--ok" role="status">
              {notice}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={busy || !enabled}>
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" className="btn btn--quiet" onClick={forgotten} disabled={!enabled}>
            Mot de passe oublié
          </button>
          <span>
            Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
