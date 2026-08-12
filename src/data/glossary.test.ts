import { describe, expect, it } from 'vitest';
import { glossary, glossaryCategories } from './glossary';
import { getLessonRef } from './index';

/**
 * Le glossaire renvoie vers des leçons par identifiants textuels : rien dans le
 * typage n'empêche d'écrire un identifiant qui n'existe pas. Ces tests couvrent
 * précisément cet angle mort, ainsi que les ancres publiques, qui sont des URL
 * et ne doivent donc jamais casser.
 */

describe('glossaire', () => {
  it('contient un nombre significatif de termes', () => {
    expect(glossary.length).toBeGreaterThanOrEqual(50);
  });

  it('n’a pas d’identifiant en double', () => {
    const ids = glossary.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('utilise des identifiants exploitables comme ancres d’URL', () => {
    for (const entry of glossary) {
      expect(entry.id, entry.term).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('n’a pas de terme en double', () => {
    const termes = glossary.map((e) => e.term.toLowerCase());
    expect(new Set(termes).size).toBe(termes.length);
  });

  it('définit chaque terme de façon utile', () => {
    for (const entry of glossary) {
      expect(entry.term.length, entry.id).toBeGreaterThan(2);
      expect(entry.definition.length, entry.id).toBeGreaterThan(80);
    }
  });

  it('n’utilise que des catégories déclarées', () => {
    for (const entry of glossary) {
      expect(glossaryCategories, entry.id).toContain(entry.category);
    }
  });

  it('couvre chaque catégorie — un filtre ne doit jamais renvoyer une liste vide', () => {
    for (const category of glossaryCategories) {
      const n = glossary.filter((e) => e.category === category).length;
      expect(n, `catégorie « ${category} » vide`).toBeGreaterThan(0);
    }
  });

  it('ne renvoie qu’à des termes existants', () => {
    const ids = new Set(glossary.map((e) => e.id));
    for (const entry of glossary) {
      for (const related of entry.related) {
        expect(ids.has(related), `${entry.id} → ${related}`).toBe(true);
      }
      expect(entry.related, entry.id).not.toContain(entry.id);
    }
  });

  it('ne renvoie qu’à des leçons réellement présentes dans le catalogue', () => {
    for (const entry of glossary) {
      for (const ref of entry.lessons) {
        const lesson = getLessonRef(ref.courseId, ref.moduleId, ref.lessonId);
        expect(lesson, `${entry.id} → ${ref.courseId}/${ref.moduleId}/${ref.lessonId}`).toBeDefined();
      }
    }
  });
});
