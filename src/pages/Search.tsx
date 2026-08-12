import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchLessons } from '../lib/search';
import { usePageMeta } from '../lib/meta';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';

  usePageMeta(
    query ? `Recherche : ${query}` : 'Rechercher',
    'Rechercher un thème dans l’ensemble des leçons du campus FGF.',
  );

  const results = useMemo(() => searchLessons(query), [query]);
  const tooShort = query.trim().length > 0 && query.trim().length < 3;

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Recherche</p>
        <h1>Chercher dans les leçons</h1>
        <p className="page-head__lead">
          La recherche porte sur le titre, l’introduction et le contenu complet de chaque leçon — définitions,
          encadrés et tableaux compris.
        </p>
      </header>

      <form
        className="search-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="q">Votre recherche</label>
        <div className="search-form__row">
          <input
            id="q"
            type="search"
            value={query}
            autoFocus
            placeholder="valeur acquise, chemin critique, provision…"
            onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          />
          {query && (
            <button type="button" className="btn btn--ghost" onClick={() => setParams({}, { replace: true })}>
              Effacer
            </button>
          )}
        </div>
        <p className="search-form__hint" aria-live="polite">
          {tooShort
            ? 'Saisissez au moins trois caractères.'
            : query.trim().length >= 3
              ? `${results.length} leçon${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''}`
              : ' '}
        </p>
      </form>

      {query.trim().length >= 3 && results.length === 0 && (
        <div className="empty-state">
          <h2>Aucune leçon ne contient « {query} »</h2>
          <p>
            Essayez un terme plus court ou un synonyme. Les thèmes couverts sont le cadrage, la planification, les
            coûts, la valeur acquise, l’estimation, la rentabilité, les risques et les méthodes agiles.
          </p>
          <Link to="/formations" className="btn btn--ghost">
            Parcourir le catalogue
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <ol className="search-results">
          {results.map((r) => (
            <li key={`${r.courseId}/${r.moduleId}/${r.lessonId}`}>
              <Link
                to={`/formations/${r.courseId}/modules/${r.moduleId}/lecons/${r.lessonId}`}
                className="search-result"
              >
                <span className="search-result__path">
                  {r.courseTitle} · {r.moduleTitle}
                </span>
                <span className="search-result__title">{r.lessonTitle}</span>
                <span className="search-result__excerpt">{r.excerpt}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
