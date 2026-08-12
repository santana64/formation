import { beforeEach, describe, expect, it, vi } from 'vitest';

/** localStorage minimal, le module de révision le lit dès son chargement. */
function installStorage(initial?: Map<string, string>) {
  const store = initial ?? new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  });
  return store;
}

/** Recharge le module pour repartir d'une file vide entre deux tests. */
async function freshModule() {
  vi.resetModules();
  installStorage();
  return import('./review');
}

/** Recharge le module en conservant le stockage : simule une nouvelle visite. */
async function reloadModule(store: Map<string, string>) {
  vi.resetModules();
  installStorage(store);
  return import('./review');
}

beforeEach(() => {
  installStorage();
});

describe('entrée dans la file', () => {
  it('enregistre une question ratée avec sa date et son compteur', async () => {
    const r = await freshModule();
    expect(r.pendingCount()).toBe(0);

    r.recordWrong('c', 'm', 'q1');

    expect(r.pendingCount()).toBe(1);
    expect(r.isPending('c', 'm', 'q1')).toBe(true);
    expect(r.reviewQueue()[0]).toMatchObject({
      courseId: 'c',
      moduleId: 'm',
      questionId: 'q1',
      wrongCount: 1,
      streak: 0,
    });
    expect(Date.parse(r.reviewQueue()[0].lastWrong)).not.toBeNaN();
  });

  it('cumule les échecs sur une même question sans la dupliquer', async () => {
    const r = await freshModule();
    r.recordWrong('c', 'm', 'q1');
    r.recordWrong('c', 'm', 'q1');

    expect(r.pendingCount()).toBe(1);
    expect(r.reviewQueue()[0].wrongCount).toBe(2);
  });
});

describe('sortie de la file', () => {
  it('sort après deux réussites consécutives', async () => {
    const r = await freshModule();
    r.recordWrong('c', 'm', 'q1');

    r.recordRight('c', 'm', 'q1');
    expect(r.pendingCount()).toBe(1);
    expect(r.reviewQueue()[0].streak).toBe(1);

    r.recordRight('c', 'm', 'q1');
    expect(r.pendingCount()).toBe(0);
    expect(r.isPending('c', 'm', 'q1')).toBe(false);
  });

  it('remet le compteur à zéro après un nouvel échec', async () => {
    const r = await freshModule();
    r.recordWrong('c', 'm', 'q1');
    r.recordRight('c', 'm', 'q1');

    r.recordWrong('c', 'm', 'q1');
    expect(r.reviewQueue()[0]).toMatchObject({ streak: 0, wrongCount: 2 });

    // Une seule bonne réponse ne suffit plus : il en faut de nouveau deux.
    r.recordRight('c', 'm', 'q1');
    expect(r.pendingCount()).toBe(1);
    r.recordRight('c', 'm', 'q1');
    expect(r.pendingCount()).toBe(0);
  });

  it('ignore une réussite sur une question absente de la file', async () => {
    const r = await freshModule();
    r.recordRight('c', 'm', 'jamais-ratee');
    expect(r.pendingCount()).toBe(0);
  });

  it('retire une question à la demande et vide la file', async () => {
    const r = await freshModule();
    r.recordWrong('c', 'm', 'q1');
    r.recordWrong('c', 'm', 'q2');

    r.forget('c', 'm', 'q1');
    expect(r.pendingCount()).toBe(1);

    r.resetReview();
    expect(r.pendingCount()).toBe(0);
  });
});

describe('ordre de la file', () => {
  it('classe par nombre d’échecs décroissant', async () => {
    const r = await freshModule();
    r.recordWrong('c', 'm', 'une-fois');
    r.recordWrong('c', 'm', 'trois-fois');
    r.recordWrong('c', 'm', 'trois-fois');
    r.recordWrong('c', 'm', 'trois-fois');
    r.recordWrong('c', 'm', 'deux-fois');
    r.recordWrong('c', 'm', 'deux-fois');

    expect(r.reviewQueue().map((i) => i.questionId)).toEqual(['trois-fois', 'deux-fois', 'une-fois']);
  });

  it('replace en tête une question ratée de nouveau', async () => {
    const r = await freshModule();
    r.recordWrong('a', 'm', 'q1');
    r.recordWrong('b', 'm', 'q2');
    expect(r.reviewQueue()[0].questionId).toBe('q1');

    r.recordWrong('b', 'm', 'q2');
    expect(r.reviewQueue()[0].questionId).toBe('q2');
  });
});

describe('persistance', () => {
  it('retrouve la file après rechargement', async () => {
    const store = installStorage();
    vi.resetModules();
    const r = await import('./review');
    r.recordWrong('c', 'm', 'q1');
    r.recordWrong('c', 'm', 'q1');
    r.recordWrong('c', 'm', 'q2');
    r.recordRight('c', 'm', 'q2');

    const r2 = await reloadModule(store);
    expect(r2.pendingCount()).toBe(2);
    expect(r2.reviewQueue()[0]).toMatchObject({ questionId: 'q1', wrongCount: 2, streak: 0 });
    expect(r2.reviewQueue()[1]).toMatchObject({ questionId: 'q2', wrongCount: 1, streak: 1 });
  });

  it('repart d’une file vide si le contenu stocké est illisible', async () => {
    const store = installStorage();
    store.set('fgf-campus-review-v1', 'pas du json');
    const r = await reloadModule(store);
    expect(r.pendingCount()).toBe(0);

    const store2 = installStorage();
    store2.set('fgf-campus-review-v1', JSON.stringify({ items: { bidon: { courseId: 'c' } } }));
    const r2 = await reloadModule(store2);
    expect(r2.pendingCount()).toBe(0);
  });
});
