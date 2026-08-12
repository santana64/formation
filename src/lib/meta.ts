import { useEffect } from 'react';

const SUFFIX = 'FGF Campus';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Renseigne le titre, la description et les balises de partage de la page courante.
 * L'application étant rendue côté client, ces valeurs ne sont pas lues par les
 * aperçus de réseaux sociaux, qui s'appuient sur le HTML initial — elles servent
 * l'onglet du navigateur, l'historique, les favoris et les lecteurs d'écran.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const full = title === SUFFIX ? title : `${title} — ${SUFFIX}`;
    document.title = full;
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
  }, [title, description]);
}
