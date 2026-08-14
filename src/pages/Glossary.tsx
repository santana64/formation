import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { glossary, glossaryCategories, type GlossaryCategory } from '../data/glossary';
import { getLessonRef } from '../data';
import { usePageMeta } from '../lib/meta';

/** Même normalisation que la recherche du site : « delai » trouve « délai ». */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const byTerm = new Map(glossary.map((e) => [e.id, e]));

export default function Glossary() {
  usePageMeta(
    'Glossaire du management de projet',
    'Les termes du management de projet définis et reliés aux leçons du campus FGF : WBS, valeur acquise, VAN, chemin critique, provision pour aléas.',
  );

  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const category = (params.get('c') as GlossaryCategory | null) ?? null;

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return glossary.filter((entry) => {
      if (category && entry.category !== category) return false;
      if (!q) return true;
      return (
        normalize(entry.term).includes(q) ||
        entry.aliases.some((a) => normalize(a).includes(q)) ||
        normalize(entry.definition).includes(q)
      );
    });
  }, [query, category]);

  const lettres = useMemo(() => {
    const set = new Set(results.map((e) => e.term.charAt(0).toUpperCase()));
    return [...set].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [results]);

  const parLettre = useMemo(() => {
    const groups = new Map<string, typeof glossary>();
    for (const entry of [...results].sort((a, b) => a.term.localeCompare(b.term, 'fr'))) {
      const letter = entry.term.charAt(0).toUpperCase();
      groups.set(letter, [...(groups.get(letter) ?? []), entry]);
    }
    return groups;
  }, [results]);

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Référence</p>
        <h1>Glossaire du management de projet</h1>
        <p className="page-head__lead">
          {glossary.length} termes définis à partir des parcours du campus. Chaque entrée renvoie vers la ou les
          leçons où la notion est enseignée — le glossaire se lit avant, pendant ou longtemps après la formation.
        </p>
      </header>

      <div className="glossary-tools">
        <div className="field">
          <label htmlFor="g-search">Rechercher un terme</label>
          <input
            id="g-search"
            type="search"
            value={query}
            placeholder="valeur acquise, MOE, VAN, encouru…"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filters" role="group" aria-label="Filtrer par domaine">
          <button
            type="button"
            className={`filter${category === null ? ' is-active' : ''}`}
            aria-pressed={category === null}
            onClick={() => setParams({}, { replace: true })}
          >
            Tous
          </button>
          {glossaryCategories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter${category === c ? ' is-active' : ''}`}
              aria-pressed={category === c}
              onClick={() => setParams({ c }, { replace: true })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="glossary-count" aria-live="polite">
        {results.length} terme{results.length > 1 ? 's' : ''}
      </p>

      {lettres.length > 1 && (
        <nav className="glossary-index" aria-label="Index alphabétique">
          {lettres.map((l) => (
            <a key={l} href={`#lettre-${l}`}>
              {l}
            </a>
          ))}
        </nav>
      )}

      {results.length === 0 ? (
        <div className="empty-state">
          <h2>Aucun terme ne correspond</h2>
          <p>
            Essayez un sigle (MOE, WBS, IPC, VAN) ou retirez le filtre de domaine. Vous pouvez aussi chercher
            directement dans le texte des leçons.
          </p>
          <Link to="/recherche" className="btn btn--ghost">
            Chercher dans les leçons
          </Link>
        </div>
      ) : (
        [...parLettre.entries()].map(([lettre, entries]) => (
          <section key={lettre} className="glossary-group">
            <h2 id={`lettre-${lettre}`} className="glossary-group__letter">
              {lettre}
            </h2>
            <dl className="glossary-list">
              {entries.map((entry) => (
                <div key={entry.id} id={entry.id} className="glossary-entry">
                  <dt>
                    <span className="glossary-entry__term">{entry.term}</span>
                    <span className="glossary-entry__category">{entry.category}</span>
                    {entry.aliases.length > 0 && (
                      <span className="glossary-entry__aliases">{entry.aliases.join(' · ')}</span>
                    )}
                  </dt>
                  <dd>
                    <p>{entry.definition}</p>

                    {entry.lessons.length > 0 && (
                      <p className="glossary-entry__links">
                        <span className="glossary-entry__label">Traité dans</span>
                        {/* Le titre réel de la leçon, et non un libellé
                            générique : plusieurs entrées renvoient vers deux ou
                            trois leçons différentes, que des liens identiques
                            rendraient indiscernables — y compris au lecteur
                            d'écran, qui les énumère hors contexte. */}
                        {entry.lessons.map((l, i) => {
                          const ref = getLessonRef(l.courseId, l.moduleId, l.lessonId);
                          return (
                            <span key={`${l.courseId}/${l.lessonId}`}>
                              {i > 0 && ' · '}
                              <Link to={`/formations/${l.courseId}/modules/${l.moduleId}/lecons/${l.lessonId}`}>
                                {ref ? ref.lesson.title : 'la leçon correspondante'}
                              </Link>
                            </span>
                          );
                        })}
                      </p>
                    )}

                    {entry.related.length > 0 && (
                      <p className="glossary-entry__links">
                        <span className="glossary-entry__label">Voir aussi</span>
                        {entry.related
                          .filter((id) => byTerm.has(id))
                          .map((id, i) => (
                            <span key={id}>
                              {i > 0 && ' · '}
                              <a href={`#${id}`}>{byTerm.get(id)!.term}</a>
                            </span>
                          ))}
                      </p>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </div>
  );
}
