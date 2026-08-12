/** Bloc de contenu d'une leçon écrite. */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant: 'repere' | 'terrain' | 'attention'; title: string; text: string }
  | { type: 'definition'; term: string; text: string }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] };

export interface Question {
  id: string;
  prompt: string;
  choices: string[];
  /** Index de la bonne réponse dans `choices`. */
  answer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

/**
 * Média d'une leçon vidéo. Tant que `src` n'est pas renseigné, la leçon affiche
 * un emplacement signalant que la captation n'est pas encore disponible —
 * jamais un lecteur factice.
 */
export interface Video {
  /** URL du fichier (MP4 H.264 recommandé), relative à /public ou absolue. */
  src?: string;
  /** Image d'attente affichée avant lecture. */
  poster?: string;
  /** Piste de sous-titres WebVTT — obligatoire dès qu'une vidéo est publiée. */
  captions?: string;
  /** Transcription textuelle, proposée en complément des sous-titres. */
  transcript?: string;
}

export interface Lesson {
  id: string;
  title: string;
  /** Durée indicative en minutes. */
  duration: number;
  kind: 'texte' | 'video';
  /** Renseigné pour les leçons `kind: 'video'`. */
  video?: Video;
  intro: string;
  blocks: Block[];
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
  quiz: Quiz;
}

export interface Course {
  id: string;
  title: string;
  level: 'Initiation' | 'Perfectionnement' | 'Expertise';
  /**
   * Durée de la formation correspondante animée en présentiel par FGF Consultant,
   * telle que publiée sur fgfconsultant.fr. Absente pour les parcours proposés
   * uniquement en ligne.
   */
  presentiel?: string;
  audience: string;
  pitch: string;
  objectives: string[];
  prerequis: string;
  modules: Module[];
}
