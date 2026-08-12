import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap section">
      <div className="empty-state empty-state--page">
        <p className="kicker">Erreur 404</p>
        <h1>Cette page n’existe pas</h1>
        <p>
          Le lien que vous avez suivi est peut-être obsolète, ou le parcours a été renommé. Le catalogue reste le
          meilleur point de départ.
        </p>
        <div className="empty-state__actions">
          <Link to="/formations" className="btn btn--primary">
            Voir le catalogue
          </Link>
          <Link to="/" className="btn btn--ghost">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
