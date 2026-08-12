import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { humanError } from '../lib/supabase';
import { usePageMeta } from '../lib/meta';

export default function SignUp() {
  usePageMeta('Créer un compte', 'Créez votre compte FGF Campus pour suivre votre progression.');
  const { signUp, session, enabled } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/progression" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError('Indiquez votre nom, il figurera sur vos attestations.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setBusy(true);
    try {
      const { needsConfirmation } = await signUp(email, password, fullName.trim());
      if (needsConfirmation) setConfirmationSent(true);
      else navigate('/progression', { replace: true });
    } catch (err) {
      setError(humanError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  if (confirmationSent) {
    return (
      <div className="wrap section auth-page">
        <div className="auth-card">
          <p className="kicker">Dernière étape</p>
          <h1>Confirmez votre adresse</h1>
          <p className="auth-card__lead">
            Un courriel vient d’être envoyé à <strong>{email}</strong>. Ouvrez-le et suivez le lien pour activer
            votre compte, puis revenez vous connecter.
          </p>
          <Link to="/connexion" className="btn btn--primary">
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap section auth-page">
      <div className="auth-card">
        <p className="kicker">Espace apprenant</p>
        <h1>Créer un compte</h1>
        <p className="auth-card__lead">
          Gratuit et sans engagement. Nous ne collectons que votre nom et votre adresse électronique, uniquement pour
          gérer votre parcours et vos attestations — voir la <Link to="/confidentialite">politique de
          confidentialité</Link>.
        </p>

        {!enabled && (
          <p className="auth-alert auth-alert--warn" role="status">
            Les comptes ne sont pas activés sur cette installation.
          </p>
        )}

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="name">Prénom et nom</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <p className="field__hint">Ce nom figurera sur vos attestations. Vous pourrez le modifier ensuite.</p>
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="field__hint">Au moins 8 caractères.</p>
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirmer le mot de passe</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && (
            <p className="auth-alert auth-alert--error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={busy || !enabled}>
            {busy ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-links">
          <span>
            Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
