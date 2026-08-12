import { describe, expect, it } from 'vitest';
import { searchLessons } from './search';

describe('recherche dans les leçons', () => {
  it('ignore les requêtes trop courtes', () => {
    expect(searchLessons('')).toEqual([]);
    expect(searchLessons('va')).toEqual([]);
  });

  it('trouve une notion présente dans le contenu', () => {
    const hits = searchLessons('chemin critique');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].lessonTitle.toLowerCase()).toContain('chemin critique');
  });

  it('est insensible aux accents et à la casse', () => {
    const avec = searchLessons('délai');
    const sans = searchLessons('DELAI');
    expect(sans.length).toBe(avec.length);
    expect(sans.length).toBeGreaterThan(0);
  });

  it('classe les leçons dont le titre correspond en premier', () => {
    const hits = searchLessons('valeur acquise');
    expect(hits[0].inTitle).toBe(true);
  });

  it('renvoie un extrait contextuel non vide', () => {
    for (const hit of searchLessons('risque').slice(0, 5)) {
      expect(hit.excerpt.length).toBeGreaterThan(10);
    }
  });

  it('cherche aussi dans les définitions, encadrés et tableaux', () => {
    // « Compte de contrôle » n'apparaît que dans un bloc de définition.
    expect(searchLessons('compte de contrôle').length).toBeGreaterThan(0);
  });

  it('ne renvoie rien pour un terme absent', () => {
    expect(searchLessons('zzzzquelquechosedintrouvable')).toEqual([]);
  });

  it('pointe vers des identifiants exploitables en URL', () => {
    for (const hit of searchLessons('projet').slice(0, 3)) {
      expect(hit.courseId).toMatch(/^[a-z0-9-]+$/);
      expect(hit.moduleId).toMatch(/^[a-z0-9-]+$/);
      expect(hit.lessonId).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
