import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { humanError, roleLabels, type UserRole } from '../../lib/supabase';
import {
  createOrganization,
  listOrganizations,
  listUsers,
  setUserOrganization,
  setUserRole,
  type OrganizationRow,
  type UserRow,
} from '../../lib/admin';
import { usePageMeta } from '../../lib/meta';
import AdminNav from './AdminNav';

const roles: UserRole[] = ['apprenant', 'formateur', 'referent_entreprise', 'admin'];

export default function AdminUsers() {
  usePageMeta('Comptes et rôles', 'Administration des comptes du campus FGF.');
  const { profile } = useAuth();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [orgs, setOrgs] = useState<OrganizationRow[]>([]);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'tous'>('tous');
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newOrg, setNewOrg] = useState({ name: '', siren: '' });

  async function reload() {
    setLoading(true);
    try {
      const [u, o] = await Promise.all([listUsers(), listOrganizations()]);
      setUsers(u);
      setOrgs(o);
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function changeRole(user: UserRow, role: UserRole) {
    if (
      !window.confirm(
        `Attribuer le rôle « ${roleLabels[role]} » à ${user.full_name || 'ce compte'} ?` +
          (role === 'admin' ? '\n\nUn super administrateur peut tout gérer sur la plateforme.' : ''),
      )
    )
      return;
    try {
      await setUserRole(user.id, role);
      setNotice({ kind: 'ok', text: `Rôle mis à jour : ${roleLabels[role]}.` });
      await reload();
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    }
  }

  async function changeOrg(user: UserRow, organizationId: string) {
    try {
      await setUserOrganization(user.id, organizationId || null);
      setNotice({ kind: 'ok', text: 'Organisation mise à jour.' });
      await reload();
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    }
  }

  async function addOrg(e: React.FormEvent) {
    e.preventDefault();
    if (newOrg.name.trim().length < 2) return;
    try {
      await createOrganization(newOrg.name.trim(), newOrg.siren.trim() || null);
      setNewOrg({ name: '', siren: '' });
      setNotice({ kind: 'ok', text: 'Entreprise ajoutée.' });
      await reload();
    } catch (err) {
      setNotice({ kind: 'error', text: humanError(err instanceof Error ? err.message : String(err)) });
    }
  }

  const visible = users.filter((u) => {
    const matchRole = roleFilter === 'tous' || u.role === roleFilter;
    const q = filter.trim().toLowerCase();
    const matchText = !q || (u.full_name ?? '').toLowerCase().includes(q);
    return matchRole && matchText;
  });

  const counts = roles.map((r) => ({ role: r, n: users.filter((u) => u.role === r).length }));

  return (
    <div className="wrap section">
      <AdminNav />

      <header className="page-head">
        <p className="kicker">Super administration</p>
        <h1>Comptes et rôles</h1>
        <p className="page-head__lead">
          Attribuez les rôles et rattachez les apprenants à leur entreprise. Un changement de rôle prend effet
          immédiatement, y compris sur les droits d’accès aux données.
        </p>
      </header>

      {notice && (
        <p className={`auth-alert auth-alert--${notice.kind === 'ok' ? 'ok' : 'error'}`} role="status">
          {notice.text}
        </p>
      )}

      <div className="stat-row">
        {counts.map((c) => (
          <div key={c.role} className="stat">
            <span className="stat__value mono">{c.n}</span>
            <span className="stat__label">{roleLabels[c.role].toLowerCase()}s</span>
          </div>
        ))}
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="search">Rechercher un compte</label>
          <input id="search" type="search" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="role-filter">Filtrer par rôle</label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'tous')}
          >
            <option value="tous">Tous les rôles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="muted" role="status">
          Chargement des comptes…
        </p>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <h2>Aucun compte ne correspond</h2>
          <p>Modifiez votre recherche ou le filtre de rôle.</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Rôle</th>
                <th scope="col">Entreprise</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id}>
                  <th scope="row">
                    {u.full_name || <span className="muted">Sans nom</span>}
                    {u.id === profile?.id && <span className="badge badge--ok admin-you">vous</span>}
                  </th>
                  <td data-label="Rôle">
                    <select
                      aria-label={`Rôle de ${u.full_name || 'ce compte'}`}
                      value={u.role}
                      onChange={(e) => void changeRole(u, e.target.value as UserRole)}
                      disabled={u.id === profile?.id}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {roleLabels[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Entreprise">
                    <select
                      aria-label={`Entreprise de ${u.full_name || 'ce compte'}`}
                      value={u.organization_id ?? ''}
                      onChange={(e) => void changeOrg(u, e.target.value)}
                    >
                      <option value="">Aucune</option>
                      {orgs.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="admin-panel">
        <h2>Entreprises clientes</h2>
        <p className="muted">
          Chaque entreprise dispose d’un référent, qui suit la progression de ses salariés sans pouvoir modifier les
          cours.
        </p>
        <ul className="org-list">
          {orgs.map((o) => (
            <li key={o.id}>
              <strong>{o.name}</strong>
              {o.siren && <span className="mono muted"> · SIREN {o.siren}</span>}
              <span className="muted"> · {users.filter((u) => u.organization_id === o.id).length} compte(s)</span>
            </li>
          ))}
          {orgs.length === 0 && <li className="muted">Aucune entreprise enregistrée.</li>}
        </ul>

        <form className="admin-inline-form" onSubmit={addOrg}>
          <div className="field">
            <label htmlFor="org-name">Nom de l’entreprise</label>
            <input
              id="org-name"
              type="text"
              value={newOrg.name}
              onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="org-siren">SIREN (facultatif)</label>
            <input
              id="org-siren"
              type="text"
              inputMode="numeric"
              value={newOrg.siren}
              onChange={(e) => setNewOrg({ ...newOrg, siren: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn--ghost">
            Ajouter
          </button>
        </form>
      </section>
    </div>
  );
}
