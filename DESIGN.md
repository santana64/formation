# FGF Campus — Design Contract

Plateforme e-learning de FGF Consultant (Arsac, Médoc — études, conseil et formation en management de projet depuis 2005).

## Concept visuel
« Le cahier de formation du consultant » : une interface éditoriale et rigoureuse, qui évoque le
support de cours imprimé de qualité — hiérarchie typographique franche, densité utile, structures
de syllabus visibles. Pas de SaaS générique.

La couleur reprend l'identité du site institutionnel fgfconsultant.fr : bleu marine `#03045E`
dominant, bleu vif `#0000FD` pour les liens, fond froid dérivé de leur `#E7ECEF`. Le serif des
titres apporte le registre pédagogique que le site institutionnel (Arial) n'a pas besoin de porter.

## Palette
| Token | Valeur | Usage |
|---|---|---|
| `--canvas` | `#F1F4F8` | fond de page |
| `--surface` | `#FFFFFF` | cartes, panneaux |
| `--ink` | `#131A2E` | texte courant |
| `--display-color` | `#03045E` | titres (marine de marque) |
| `--muted` | `#545E75` | texte secondaire |
| `--line` | `#DBE2EC` | bordures, filets |
| `--accent` | `#03045E` | boutons primaires, marqueurs |
| `--accent-deep` | `#02033F` | hover accent |
| `--accent-bright` | `#0000FD` | liens, affordance interactive |
| `--success` | `#1F6B4F` | validation, réussite |
| `--warn` | `#8A5A16` | avertissement, à revoir |

Contrastes mesurés dans le navigateur : minimum 5,18:1, titres à 16:1 — WCAG AA exige 4,5:1.

Dark mode : non (produit de lecture longue, papier assumé). `prefers-reduced-motion` respecté.

## Typographie
- Display / titres : Georgia, 'Times New Roman', serif — éditorial, crédible.
- Body / UI : system-ui stack. 16px base, line-height 1.65 pour la prose de cours.
- Utility / data (scores, durées, numéros de module) : ui-monospace.
- Échelle : 13 / 14 / 16 / 18 / 22 / 28 / 38 / 52. Letter-spacing négatif léger sur les displays.

## Géométrie
- Largeur contenu : 1160px max ; prose de leçon : 720px max.
- Spacing scale : 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Radii : 6px (contrôles), 10px (cartes). Pas de pilules décoratives.
- Bordures 1px `--line` ; ombres quasi nulles (papier), une seule élévation pour les menus.

## Signature
**Le rail de syllabus** : dans toute vue de parcours/leçon, un rail vertical numéroté
(01, 02, …) avec état de progression (à faire / en cours / acquis) relié par un filet.
La numérotation éditoriale est justifiée : le contenu est réellement séquentiel.
Marqueur secondaire : filet marine de 3px en tête des blocs importants.

## Motion
Transitions 150–200ms sur hover/focus uniquement ; révélation du feedback QCM en 200ms.
Aucune animation de reveal au scroll.

## États
Boutons/liens : default, hover, active, focus-visible (anneau accent 2px), disabled.
QCM : non répondu, sélectionné, correct, incorrect (icône + couleur + texte — jamais couleur seule).
Progression : vide (invitation à commencer), partielle, complète.
Vidéos : clairement signalées « à venir » tant que FGF n'a pas fourni les fichiers — aucun faux player.
Recherche : requête trop courte, aucun résultat (avec pistes de reformulation), résultats classés.
Sauvegarde : succès, erreur explicite, confirmation obligatoire avant effacement.

## Impression
La feuille `features.css` traite l'impression comme une sortie de première classe : les leçons et
l'attestation s'impriment sans navigation, sans rail ni boutons, avec les encadrés et tableaux
insécables et l'URL des liens externes rendue lisible. La captation vidéo est masquée — elle n'a
pas de sens sur papier, la version écrite la remplace.

## Microcopy
Français professionnel, vouvoiement. Verbes précis : « Commencer le module », « Valider mes réponses »,
« Reprendre où j'en étais ». Vocabulaire constant : parcours > module > leçon > QCM.

## Anti-patterns spécifiques
Pas de gradients violets, pas de glassmorphism, pas d'icônes en cercles colorés,
pas de hero à gros chiffre creux, pas de données inventées.

Règle forte sur le contenu institutionnel : **rien n'est affiché qui ne soit vérifiable**, soit sur
fgfconsultant.fr, soit au registre du commerce. Pas de faux témoignages, pas de logos clients
inventés, pas de certification non attestée. Tout est centralisé dans `src/data/company.ts`.
De même, les emplacements vidéo affichent leur indisponibilité réelle plutôt qu'un lecteur factice.
