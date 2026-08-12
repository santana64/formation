import { useSyncExternalStore } from 'react';

/** Une question ratée, en attente de révision. */
export interface ReviewItem {
  courseId: string;
  moduleId: string;
  questionId: string;
  /** Date ISO du dernier échec sur cette question. */
  lastWrong: string;
  /** Nombre total d'échecs — sert de priorité dans la file. */
  wrongCount: number;
  /** Réussites consécutives depuis le dernier échec. */
  streak: number;
}

interface ReviewState {
  items: Record<string, ReviewItem>;
}

const STORAGE_KEY = 'fgf-campus-review-v1';

/** Réussites consécutives nécessaires pour qu'une question quitte la file. */
export const MASTERY_STREAK = 2;

export const reviewKey = (courseId: string, moduleId: string, questionId: string) =>
  `${courseId}/${moduleId}/${questionId}`;

function isItem(value: unknown): value is ReviewItem {
  if (typeof value !== 'object' || value === null) return false;
  const it = value as Partial<ReviewItem>;
  return (
    typeof it.courseId === 'string' &&
    typeof it.moduleId === 'string' &&
    typeof it.questionId === 'string' &&
    typeof it.wrongCount === 'number' &&
    typeof it.streak === 'number'
  );
}

function load(): ReviewState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ReviewState>;
      const items: Record<string, ReviewItem> = {};
      for (const [key, value] of Object.entries(parsed?.items ?? {})) {
        if (isItem(value)) items[key] = value;
      }
      return { items };
    }
  } catch {
    /* stockage indisponible ou contenu illisible : on repart d'une file vide */
  }
  return { items: {} };
}

/**
 * Priorité décroissante : d'abord les questions les plus souvent ratées, puis
 * les erreurs les plus anciennes, pour qu'aucune ne reste indéfiniment en fond
 * de file. L'identifiant tranche les derniers ex æquo — l'ordre reste stable
 * d'un rendu à l'autre.
 */
function sortQueue(items: Record<string, ReviewItem>): ReviewItem[] {
  return Object.values(items).sort(
    (a, b) =>
      b.wrongCount - a.wrongCount ||
      a.lastWrong.localeCompare(b.lastWrong) ||
      reviewKey(a.courseId, a.moduleId, a.questionId).localeCompare(
        reviewKey(b.courseId, b.moduleId, b.questionId),
      ),
  );
}

let state: ReviewState = load();
// Instantané mémorisé : `useSyncExternalStore` compare les références, un tri
// recalculé à chaque lecture provoquerait une boucle de rendu.
let queue: ReviewItem[] = sortQueue(state.items);
const listeners = new Set<() => void>();

function commit(items: Record<string, ReviewItem>) {
  state = { items };
  queue = sortQueue(items);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* mode privé ou quota : la file reste en mémoire pour la session */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** File de révision triée par priorité décroissante. */
export function reviewQueue(): ReviewItem[] {
  return queue;
}

/** Nombre de questions en attente de révision. */
export function pendingCount(): number {
  return queue.length;
}

/** File de révision réactive, triée par priorité décroissante. */
export function useReviewQueue(): ReviewItem[] {
  return useSyncExternalStore(subscribe, reviewQueue);
}

/** Vrai si la question est actuellement dans la file. */
export function isPending(courseId: string, moduleId: string, questionId: string): boolean {
  return !!state.items[reviewKey(courseId, moduleId, questionId)];
}

/**
 * Enregistre un échec : la question entre dans la file si elle n'y était pas,
 * sa priorité monte, et son compteur de réussites consécutives repart de zéro.
 */
export function recordWrong(courseId: string, moduleId: string, questionId: string) {
  const key = reviewKey(courseId, moduleId, questionId);
  const prev = state.items[key];
  commit({
    ...state.items,
    [key]: {
      courseId,
      moduleId,
      questionId,
      lastWrong: new Date().toISOString(),
      wrongCount: (prev?.wrongCount ?? 0) + 1,
      streak: 0,
    },
  });
}

/**
 * Enregistre une réussite. Sans effet si la question n'est pas en file : seules
 * les questions déjà ratées se révisent. Au bout de `MASTERY_STREAK` réussites
 * consécutives, la question en sort.
 */
export function recordRight(courseId: string, moduleId: string, questionId: string) {
  const key = reviewKey(courseId, moduleId, questionId);
  const prev = state.items[key];
  if (!prev) return;

  const streak = prev.streak + 1;
  if (streak >= MASTERY_STREAK) {
    const items = { ...state.items };
    delete items[key];
    commit(items);
    return;
  }
  commit({ ...state.items, [key]: { ...prev, streak } });
}

/** Retire une question de la file sans attendre les réussites consécutives. */
export function forget(courseId: string, moduleId: string, questionId: string) {
  const key = reviewKey(courseId, moduleId, questionId);
  if (!state.items[key]) return;
  const items = { ...state.items };
  delete items[key];
  commit(items);
}

/** Vide la file de révision sur cet appareil. */
export function resetReview() {
  commit({});
}
