import type { ReactNode } from 'react';

/**
 * ─────────────────────────────────────────────────────────────
 *   INFORMATIONS QUE FGF CONSULTANT DOIT COMPLÉTER
 * ─────────────────────────────────────────────────────────────
 *
 * Ces valeurs ne sont pas connues au moment de la rédaction des pages
 * légales. Elles restent volontairement à `null` : les pages affichent alors
 * un encart « à compléter par FGF Consultant » plutôt qu'une information
 * plausible mais fausse. Une mention légale inventée est une fausse
 * déclaration ; une mention légale manquante est un travail en cours, visible
 * comme tel.
 *
 * Pour publier : remplacer `null` par la valeur réelle, vérifiée à la source.
 * Rien d'autre n'est à modifier — l'encart disparaît de lui-même et
 * l'information prend sa place.
 */
export const aCompleter = {
  /**
   * Hébergeur du site. La loi pour la confiance dans l'économie numérique
   * (art. 6 III) impose d'indiquer sa dénomination, son adresse et son
   * téléphone. L'hébergeur retenu pour campus.fgfconsultant.fr n'est pas connu.
   */
  hebergeur: null as { nom: string; adresse: string; telephone: string } | null,

  /**
   * Numéro de déclaration d'activité de prestataire de formation, enregistré
   * auprès de la DREETS (art. L. 6351-1 du code du travail), suivi de la région
   * d'enregistrement. Exemple de forme attendue : « 75 33 XXXXX 33 ».
   * Non communiqué à ce jour.
   */
  declarationActivite: null as string | null,

  /**
   * Certification Qualiopi : numéro de certificat, organisme certificateur,
   * date de validité et catégories d'actions couvertes. On ignore si FGF
   * Consultant en est titulaire — ne rien affirmer sans le certificat sous
   * les yeux.
   */
  qualiopi: null as string | null,

  /**
   * Durée de conservation des comptes inactifs, lorsque les comptes sont
   * activés. Aucune purge automatique n'est programmée dans le schéma de base
   * de données : la durée doit être décidée par FGF Consultant, puis inscrite
   * ici et mise en œuvre.
   */
  dureeConservationComptes: null as string | null,
};

/** Date de rédaction des trois pages légales. À réviser à chaque modification. */
export const derniereMiseAJour = '12 août 2026';

/**
 * Encart signalant une information légale manquante. Le libellé en capitales
 * et le liseré discontinu portent le message : l'état n'est jamais signalé par
 * la seule couleur.
 */
export function ACompleter({ quoi, children }: { quoi: string; children: ReactNode }) {
  return (
    <p className="legal-todo">
      <strong className="legal-todo__label">À compléter par FGF Consultant</strong>
      <span className="legal-todo__what">{quoi} — </span>
      {children}
    </p>
  );
}
