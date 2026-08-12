import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { company } from './data/company';

/**
 * À chaque changement de page, remonte en haut et déplace le focus sur la zone
 * de contenu : sans cela, un utilisateur au clavier ou au lecteur d'écran reste
 * positionné sur le lien cliqué et doit re-parcourir toute la navigation.
 */
function useRouteChangeFocus(target: React.RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (first.current) {
      first.current = false;
      return;
    }
    target.current?.focus();
  }, [pathname, target]);
}

const navItems = [
  { to: '/formations', label: 'Formations' },
  { to: '/recherche', label: 'Rechercher' },
  { to: '/progression', label: 'Ma progression' },
  { to: '/a-propos', label: 'À propos' },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useRouteChangeFocus(mainRef);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <header className="site-header">
        <div className="wrap site-header__inner">
          <Link to="/" className="brand" aria-label="FGF Campus — accueil">
            <span className="brand__name">
              FGF <em>Campus</em>
            </span>
            <span className="brand__tag">Management de projet</span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="nav-principal"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
          <nav id="nav-principal" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navigation principale">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="contenu" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="site-footer__grid">
            <div>
              <h3>FGF Consultant</h3>
              <p>
                {company.baseline}, depuis 2005.
                <br />
                {company.address.join(' — ')}
              </p>
              <p className="site-footer__contact">
                <a href={`mailto:${company.email}`}>{company.email}</a>
                <br />
                <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              </p>
            </div>
            <div>
              <h3>Se former</h3>
              <ul>
                <li>
                  <Link to="/formations">Catalogue des parcours</Link>
                </li>
                <li>
                  <Link to="/recherche">Rechercher une notion</Link>
                </li>
                <li>
                  <Link to="/progression">Ma progression</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>L’entreprise</h3>
              <ul>
                <li>
                  <Link to="/a-propos">À propos &amp; contact</Link>
                </li>
                <li>
                  <a href="http://www.fgfconsultant.fr" target="_blank" rel="noreferrer">
                    fgfconsultant.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="site-footer__legal">
            FGF Consultant — {company.legal.forme} au capital de {company.legal.capital}, {company.legal.rcs},
            SIREN {company.legal.siren}. Convention collective {company.legal.convention}.
            <br />
            FGF Campus est la plateforme pédagogique de FGF Consultant. Aucune donnée de progression ne quitte votre
            appareil.
          </p>
        </div>
      </footer>
    </>
  );
}
