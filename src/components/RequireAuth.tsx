import { Link, Navigate, useLocation } from 'react-router-dom';
import { hasRole, useAuth } from '../lib/auth';
import type { UserRole } from '../lib/supabase';

interface Props {
  children: React.ReactNode;
  /** Rôles autorisés. Vide = toute personne connectée. L'admin passe toujours. */
  roles?: UserRole[];
}

/**
 * Garde de route. Elle protège l'expérience utilisateur, pas les données :
 * la véritable protection est assurée par les policies RLS de la base, qui
 * s'appliquent même si quelqu'un contourne cette barrière côté navigateur.
 */
export default function RequireAuth({ children, roles }: Props) {
  const { ready, session, profile, enabled } = useAuth();
  const location = useLocation();

  if (!enabled) {
    return (
      <div className="wrap section">
        <div className="empty-state empty-state--page">
          <p className="kicker">Espace indisponible</p>
          <h1>Les comptes ne sont pas activés</h1>
          <p>
            Cette installation du campus fonctionne sans serveur : le contenu et les QCM restent accessibles, et
            votre progression est conservée dans ce navigateur. Les comptes, badges et attestations nécessitent la
            configuration du backend.
          </p>
          <div className="empty-state__actions">
            <Link to="/formations" className="btn btn--primary">
              Retour aux parcours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="wrap section">
        <p className="muted" role="status">
          Chargement de votre session…
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length > 0 && !hasRole(profile, ...roles)) {
    return (
      <div className="wrap section">
        <div className="empty-state empty-state--page">
          <p className="kicker">Accès refusé</p>
          <h1>Cet espace ne vous est pas ouvert</h1>
          <p>
            Votre compte ne dispose pas des droits nécessaires. Si vous pensez qu’il s’agit d’une erreur, demandez à
            un administrateur de vérifier votre rôle.
          </p>
          <div className="empty-state__actions">
            <Link to="/compte" className="btn btn--primary">
              Mon compte
            </Link>
            <Link to="/formations" className="btn btn--ghost">
              Retour aux parcours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
