/**
 * Mélange déterministe des propositions d'une question.
 *
 * Motivation : les questions ont été rédigées en plaçant presque toujours la
 * bonne réponse en deuxième position (60 fois sur 81) et jamais en quatrième.
 * Cocher systématiquement la deuxième proposition suffisait à obtenir 74 %,
 * soit au-dessus du seuil de validation — l'évaluation ne mesurait plus la
 * connaissance mais la capacité à repérer ce motif.
 *
 * Le mélange est dérivé de l'identifiant de la question : l'ordre est donc
 * stable d'un affichage à l'autre, ce qui évite qu'une question revue en
 * révision paraisse différente, tout en supprimant le biais de position.
 */

/** Hachage FNV-1a : court, sans dépendance, suffisant pour amorcer un tirage. */
function hash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Générateur congruentiel linéaire, amorcé par le hachage. */
function nextRandom(state: number): [number, number] {
  const next = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return [next / 0x100000000, next];
}

export interface ShuffledChoices {
  /** Propositions dans leur ordre d'affichage. */
  choices: string[];
  /** Index de la bonne réponse, dans l'ordre d'affichage. */
  answer: number;
  /** Ordre d'affichage → index d'origine, pour retrouver la donnée source. */
  toOriginal: number[];
}

export function shuffleChoices(seed: string, choices: string[], answer: number): ShuffledChoices {
  const order = choices.map((_, i) => i);

  // Fisher-Yates, alimenté par la suite pseudo-aléatoire amorcée par `seed`.
  let state = hash(seed);
  for (let i = order.length - 1; i > 0; i--) {
    const [r, nextState] = nextRandom(state);
    state = nextState;
    const j = Math.floor(r * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  return {
    choices: order.map((i) => choices[i]),
    answer: order.indexOf(answer),
    toOriginal: order,
  };
}
