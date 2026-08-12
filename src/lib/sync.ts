import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { importProgress, useProgress, type QuizResult } from './progress';

/**
 * Pont entre la progression locale et la base.
 *
 * Le magasin local reste la source de vérité pendant la session : il fonctionne
 * hors ligne, sans compte, et toute l'interface s'appuie dessus. La base ne sert
 * qu'à conserver cette progression et à la retrouver sur un autre appareil.
 *
 * Le contenu livré dans `src/data` n'a pas d'identifiant en base : sa
 * progression est donc stockée telle quelle, en JSON, dans `local_progress`.
 * Les cours créés par les formateurs, eux, utilisent les tables relationnelles
 * (`lesson_progress`, `quiz_attempts`) et leurs fonctions serveur.
 */

interface Snapshot {
  lessonsDone: Record<string, true>;
  quizResults: Record<string, QuizResult>;
}

export type SyncState = 'inactif' | 'synchronisation' | 'a-jour' | 'erreur';

/** Fusionne deux instantanés en gardant le meilleur score de chaque QCM. */
function merge(a: Snapshot, b: Snapshot): Snapshot {
  const quizResults = { ...a.quizResults };
  for (const [key, result] of Object.entries(b.quizResults)) {
    const existing = quizResults[key];
    if (!existing || result.score > existing.score) quizResults[key] = result;
  }
  return { lessonsDone: { ...a.lessonsDone, ...b.lessonsDone }, quizResults };
}

async function pull(userId: string): Promise<Snapshot | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('local_progress')
    .select('payload')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.payload as Snapshot | undefined) ?? null;
}

async function push(userId: string, snapshot: Snapshot) {
  if (!supabase) return;
  const { error } = await supabase
    .from('local_progress')
    .upsert({ user_id: userId, payload: snapshot, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/**
 * Synchronise la progression dès qu'un utilisateur est connecté : à la première
 * exécution, l'état distant est fusionné avec l'état local et réinjecté ; les
 * modifications ultérieures sont renvoyées après une courte temporisation.
 *
 * En cas d'échec réseau, l'application continue de fonctionner sur le magasin
 * local et la synchronisation reprendra au prochain changement.
 */
export function useProgressSync(userId: string | undefined): SyncState {
  const local = useProgress();
  const [state, setState] = useState<SyncState>('inactif');
  const reconciled = useRef(false);
  // Évite de relancer la réconciliation à chaque changement de progression.
  const latest = useRef(local);
  latest.current = local;

  useEffect(() => {
    reconciled.current = false;
    if (!userId || !supabase) {
      setState('inactif');
      return;
    }

    let active = true;
    setState('synchronisation');

    void (async () => {
      try {
        const remote = await pull(userId);
        if (!active) return;

        if (remote) {
          const merged = merge(remote, latest.current);
          await push(userId, merged);
          // importProgress fusionne et notifie proprement tous les abonnés.
          importProgress(JSON.stringify(remote));
        } else {
          await push(userId, latest.current);
        }

        if (!active) return;
        reconciled.current = true;
        setState('a-jour');
      } catch {
        if (active) setState('erreur');
      }
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !supabase || !reconciled.current) return;

    // Temporisation : évite une écriture à chaque case cochée pendant la lecture.
    const timer = setTimeout(() => {
      void (async () => {
        try {
          setState('synchronisation');
          await push(userId, latest.current);
          setState('a-jour');
        } catch {
          setState('erreur');
        }
      })();
    }, 1500);

    return () => clearTimeout(timer);
  }, [userId, local]);

  return state;
}

export const syncLabels: Record<SyncState, string> = {
  inactif: '',
  synchronisation: 'Synchronisation…',
  'a-jour': 'Progression synchronisée sur votre compte',
  erreur: 'Synchronisation indisponible — votre progression reste enregistrée sur cet appareil',
};
