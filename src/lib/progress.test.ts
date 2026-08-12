import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Course } from '../data/types';

/** localStorage minimal, le module de progression le lit dès son chargement. */
function installStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  });
  return store;
}

/** Recharge le module pour repartir d'un état vide entre deux tests. */
async function freshModule() {
  vi.resetModules();
  installStorage();
  return import('./progress');
}

const course: Course = {
  id: 'test',
  title: 'Parcours de test',
  level: 'Initiation',
  audience: 'test',
  pitch: 'test',
  objectives: [],
  prerequis: 'aucun',
  modules: [
    {
      id: 'm1',
      title: 'Module 1',
      summary: 's',
      lessons: [
        { id: 'l1', title: 'L1', duration: 10, kind: 'texte', intro: 'i', blocks: [] },
        { id: 'l2', title: 'L2', duration: 10, kind: 'texte', intro: 'i', blocks: [] },
      ],
      quiz: {
        id: 'q',
        title: 'QCM',
        questions: [
          { id: 'q1', prompt: 'p', choices: ['a', 'b'], answer: 0, explanation: 'e' },
          { id: 'q2', prompt: 'p', choices: ['a', 'b'], answer: 0, explanation: 'e' },
          { id: 'q3', prompt: 'p', choices: ['a', 'b'], answer: 0, explanation: 'e' },
          { id: 'q4', prompt: 'p', choices: ['a', 'b'], answer: 0, explanation: 'e' },
          { id: 'q5', prompt: 'p', choices: ['a', 'b'], answer: 0, explanation: 'e' },
        ],
      },
    },
  ],
};

beforeEach(() => {
  installStorage();
});

describe('leçons terminées', () => {
  it('marque et démarque une leçon', async () => {
    const p = await freshModule();
    p.markLessonDone('c', 'm', 'l');
    expect(p.exportProgress()).toContain('c/m/l');

    p.unmarkLessonDone('c', 'm', 'l');
    expect(JSON.parse(p.exportProgress()).lessonsDone).toEqual({});
  });

  it('est idempotent', async () => {
    const p = await freshModule();
    p.markLessonDone('c', 'm', 'l');
    p.markLessonDone('c', 'm', 'l');
    expect(Object.keys(JSON.parse(p.exportProgress()).lessonsDone)).toHaveLength(1);
  });
});

describe('résultats de QCM', () => {
  it('conserve le meilleur score et ignore les tentatives inférieures', async () => {
    const p = await freshModule();
    p.saveQuizResult('c', 'm', 3, 5);
    expect(JSON.parse(p.exportProgress()).quizResults['c/m'].score).toBe(3);

    p.saveQuizResult('c', 'm', 5, 5);
    expect(JSON.parse(p.exportProgress()).quizResults['c/m'].score).toBe(5);

    p.saveQuizResult('c', 'm', 2, 5);
    expect(JSON.parse(p.exportProgress()).quizResults['c/m'].score).toBe(5);
  });

  it('valide un module à partir de 70 % exactement', async () => {
    const p = await freshModule();

    p.saveQuizResult('c', 'seuil-bas', 6, 10); // 60 %
    p.saveQuizResult('c', 'seuil-pile', 7, 10); // 70 %
    const state = { lessonsDone: {}, quizResults: JSON.parse(p.exportProgress()).quizResults };

    expect(p.isQuizPassed('c', 'seuil-bas', state)).toBe(false);
    expect(p.isQuizPassed('c', 'seuil-pile', state)).toBe(true);
    expect(p.isQuizPassed('c', 'jamais-passe', state)).toBe(false);
  });
});

describe('progression d’un parcours', () => {
  it('compte les leçons terminées et les QCM réussis', async () => {
    const p = await freshModule();
    const read = () => ({ ...JSON.parse(p.exportProgress()) });

    // 3 étapes : 2 leçons + 1 QCM.
    expect(p.courseProgress(course, read())).toMatchObject({ done: 0, total: 3, pct: 0 });

    p.markLessonDone('test', 'm1', 'l1');
    expect(p.courseProgress(course, read())).toMatchObject({ done: 1, total: 3, pct: 33 });

    // Un QCM échoué ne compte pas comme étape acquise.
    p.saveQuizResult('test', 'm1', 2, 5);
    expect(p.courseProgress(course, read()).done).toBe(1);

    p.saveQuizResult('test', 'm1', 5, 5);
    p.markLessonDone('test', 'm1', 'l2');
    expect(p.courseProgress(course, read())).toMatchObject({ done: 3, total: 3, pct: 100 });
  });
});

describe('export et import', () => {
  it('réimporte une progression exportée', async () => {
    const p = await freshModule();
    p.markLessonDone('c', 'm', 'l1');
    p.saveQuizResult('c', 'm', 4, 5);
    const backup = p.exportProgress();

    const p2 = await freshModule();
    expect(p2.importProgress(backup)).toEqual({ ok: true });
    const restored = JSON.parse(p2.exportProgress());
    expect(restored.lessonsDone['c/m/l1']).toBe(true);
    expect(restored.quizResults['c/m'].score).toBe(4);
  });

  it('fusionne sans écraser et garde le meilleur score', async () => {
    const p = await freshModule();
    p.markLessonDone('c', 'm', 'ancienne');
    p.saveQuizResult('c', 'm', 5, 5);

    p.importProgress(
      JSON.stringify({ lessonsDone: { 'c/m/nouvelle': true }, quizResults: { 'c/m': { score: 2, total: 5, date: '' } } }),
    );

    const merged = JSON.parse(p.exportProgress());
    expect(merged.lessonsDone['c/m/ancienne']).toBe(true);
    expect(merged.lessonsDone['c/m/nouvelle']).toBe(true);
    expect(merged.quizResults['c/m'].score).toBe(5);
  });

  it('refuse un fichier invalide avec un message lisible', async () => {
    const p = await freshModule();
    expect(p.importProgress('pas du json')).toEqual({
      ok: false,
      error: 'Ce fichier n’est pas un JSON valide.',
    });
    expect(p.importProgress('{"autre":1}').ok).toBe(false);
    expect(p.importProgress('null').ok).toBe(false);
  });
});

describe('remise à zéro', () => {
  it('efface tout', async () => {
    const p = await freshModule();
    p.markLessonDone('c', 'm', 'l');
    p.saveQuizResult('c', 'm', 5, 5);
    p.resetProgress();

    const empty = JSON.parse(p.exportProgress());
    expect(empty.lessonsDone).toEqual({});
    expect(empty.quizResults).toEqual({});
  });
});
