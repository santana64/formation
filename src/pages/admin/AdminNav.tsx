import { NavLink } from 'react-router-dom';
import { hasRole, useAuth } from '../../lib/auth';
import { roleLabels } from '../../lib/supabase';

/** Barre de navigation des espaces d'encadrement, filtrée selon le rôle. */
export default function AdminNav() {
  const { profile } = useAuth();
  if (!profile) return null;

  const links: { to: string; label: string; visible: boolean }[] = [
    { to: '/formateur', label: 'Mes cours', visible: hasRole(profile, 'formateur') },
    { to: '/formateur/examens', label: 'Examens', visible: hasRole(profile, 'formateur') },
    { to: '/entreprise', label: 'Mes apprenants', visible: hasRole(profile, 'referent_entreprise') },
    { to: '/admin/comptes', label: 'Comptes et rôles', visible: profile.role === 'admin' },
  ].filter((l) => l.visible);

  if (links.length === 0) return null;

  return (
    <nav className="admin-nav" aria-label="Espaces d’encadrement">
      <span className="admin-nav__role">{roleLabels[profile.role]}</span>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
