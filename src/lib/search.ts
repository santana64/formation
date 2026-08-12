import { courses } from '../data';
import type { Block } from '../data/types';

export interface SearchHit {
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  /** Extrait de texte autour de la première occurrence. */
  excerpt: string;
  /** Nombre d'occurrences dans la leçon, utilisé pour le classement. */
  hits: number;
  /** Vrai si le terme apparaît dans le titre de la leçon ou de son module. */
  inTitle: boolean;
}

function blockText(block: Block): string {
  switch (block.type) {
    case 'p':
    case 'h2':
      return block.text;
    case 'list':
      return block.items.join(' ');
    case 'callout':
      return `${block.title} ${block.text}`;
    case 'definition':
      return `${block.term} ${block.text}`;
    case 'table':
      return [block.caption, ...block.head, ...block.rows.flat()].join(' ');
    case 'chart':
      return block.caption;
    case 'exercise':
      return block.title;
  }
}

/**
 * Retire les accents et met en minuscules, pour une recherche tolérante :
 * « delai » trouve « délai ». La classe de caractères ci-dessous couvre les
 * signes diacritiques combinants U+0300 à U+036F isolés par la normalisation NFD.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function makeExcerpt(text: string, normText: string, normQuery: string): string {
  const at = normText.indexOf(normQuery);
  if (at === -1) return text.slice(0, 160).trim() + '…';
  const start = Math.max(0, at - 70);
  const end = Math.min(text.length, at + normQuery.length + 90);
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}

/**
 * Recherche plein texte dans les leçons : titres, introductions et contenu.
 * Les résultats sont classés par pertinence (titre d'abord, puis fréquence).
 */
export function searchLessons(query: string): SearchHit[] {
  const q = normalize(query.trim());
  if (q.length < 3) return [];

  const results: SearchHit[] = [];

  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        const text = [lesson.intro, ...lesson.blocks.map(blockText)].join(' ');
        const normText = normalize(text);

        // Un module intitulé « La valeur acquise » doit répondre à cette
        // recherche, même si aucune de ses leçons ne reprend l'expression
        // mot pour mot dans son propre titre.
        const inTitle = normalize(lesson.title).includes(q) || normalize(mod.title).includes(q);
        const hits = normText.split(q).length - 1;
        if (!inTitle && hits === 0) continue;

        results.push({
          courseId: course.id,
          courseTitle: course.title,
          moduleId: mod.id,
          moduleTitle: mod.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          excerpt: makeExcerpt(text, normText, q),
          hits,
          inTitle,
        });
      }
    }
  }

  return results.sort((a, b) => {
    if (a.inTitle !== b.inTitle) return a.inTitle ? -1 : 1;
    return b.hits - a.hits;
  });
}
