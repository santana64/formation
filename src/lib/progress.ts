import { useSyncExternalStore } from 'react';
import type { Course } from '../data/types';

export interface QuizResult {
  score: number;
  total: number;
  date: string;
}

interface ProgressState {
  lessonsDone: Record<string, true>;
  quizResults: Record<string, QuizResult>;
}

const STORAGE_KEY = 'fgf-campus-progress-v1';

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProgressState;
  } catch {
    /* stockage indisponible : on repart d'un état vide */
  }
  return { lessonsDone: {}, quizResults: {} };
}

let state: ProgressState = load();
const listeners = new Set<() => void>();

function commit(next: ProgressState) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* mode privé ou quota : la progression reste en mémoire pour la session */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, () => state);
}

export const lessonKey = (courseId: string, moduleId: string, lessonId: string) =>
  `${courseId}/${moduleId}/${lessonId}`;

export const quizKey = (courseId: string, moduleId: string) => `${courseId}/${moduleId}`;

export function markLessonDone(courseId: string, moduleId: string, lessonId: string) {
  const key = lessonKey(courseId, moduleId, lessonId);
  if (state.lessonsDone[key]) return;
  commit({ ...state, lessonsDone: { ...state.lessonsDone, [key]: true } });
}

export function unmarkLessonDone(courseId: string, moduleId: string, lessonId: string) {
  const key = lessonKey(courseId, moduleId, lessonId);
  if (!state.lessonsDone[key]) return;
  const next = { ...state.lessonsDone };
  delete next[key];
  commit({ ...state, lessonsDone: next });
}

export function saveQuizResult(courseId: string, moduleId: string, score: number, total: number) {
  const key = quizKey(courseId, moduleId);
  const prev = state.quizResults[key];
  // On conserve le meilleur score obtenu.
  if (prev && prev.score >= score) return;
  commit({
    ...state,
    quizResults: {
      ...state.quizResults,
      [key]: { score, total, date: new Date().toISOString() },
    },
  });
}

/** Efface toute la progression enregistrée sur cet appareil. */
export function resetProgress() {
  commit({ lessonsDone: {}, quizResults: {} });
}

/** Export de la progression, pour la transférer sur un autre appareil. */
export function exportProgress(): string {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2);
}

/**
 * Réimporte une progression exportée. Fusionne avec l'existant plutôt que de
 * l'écraser : les leçons terminées s'additionnent et le meilleur score est conservé.
 * Renvoie un message d'erreur lisible si le fichier n'est pas exploitable.
 */
export function importProgress(json: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Ce fichier n’est pas un JSON valide.' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, error: 'Ce fichier ne contient pas une progression FGF Campus.' };
  }

  const incoming = parsed as Partial<ProgressState>;
  if (typeof incoming.lessonsDone !== 'object' || typeof incoming.quizResults !== 'object') {
    return { ok: false, error: 'Ce fichier ne contient pas une progression FGF Campus.' };
  }

  const lessonsDone = { ...state.lessonsDone, ...incoming.lessonsDone };
  const quizResults = { ...state.quizResults };
  for (const [key, result] of Object.entries(incoming.quizResults ?? {})) {
    if (!result || typeof result.score !== 'number' || typeof result.total !== 'number') continue;
    const existing = quizResults[key];
    if (!existing || result.score > existing.score) quizResults[key] = result;
  }

  commit({ lessonsDone, quizResults });
  return { ok: true };
}

/** Progression d'un parcours : leçons terminées + QCM réussis (>= 70 %). */
export function courseProgress(course: Course, p: ProgressState) {
  let doneSteps = 0;
  let totalSteps = 0;
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      totalSteps += 1;
      if (p.lessonsDone[lessonKey(course.id, mod.id, lesson.id)]) doneSteps += 1;
    }
    totalSteps += 1;
    const r = p.quizResults[quizKey(course.id, mod.id)];
    if (r && r.score / r.total >= 0.7) doneSteps += 1;
  }
  return { done: doneSteps, total: totalSteps, pct: totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0 };
}

export function isQuizPassed(courseId: string, moduleId: string, p: ProgressState) {
  const r = p.quizResults[quizKey(courseId, moduleId)];
  return !!r && r.score / r.total >= 0.7;
}
