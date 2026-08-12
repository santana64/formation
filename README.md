# FGF Campus

Plateforme e-learning de **FGF Consultant** (Arsac, Gironde) — cours écrits, QCM corrigés et
emplacements vidéo sur le management de projet.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 33 tests (contenu pédagogique, progression, recherche)
npm run build    # génère dist/ + sitemap.xml + robots.txt
npm run preview  # sert le build de production
```

## Fonctionnalités

- **Cours écrits** structurés en blocs typés : paragraphes, définitions, encadrés
  (« à retenir », « vu sur le terrain », « piège classique »), listes et tableaux.
- **QCM corrigés** par module : correction question par question avec explication, y compris
  sur les bonnes réponses ; validation à 70 %, meilleur score conservé, reprises illimitées.
- **Emplacements vidéo** prêts à recevoir les captations (voir plus bas).
- **Recherche plein texte** dans toutes les leçons, insensible aux accents et à la casse.
- **Suivi de progression** par appareil, avec export/import JSON pour changer de navigateur.
- **Attestation de suivi** imprimable une fois un parcours entièrement validé.
- **Impression** : feuille de style dédiée, les leçons et l'attestation sortent proprement.

## Contenu

Cinq parcours, 29 leçons, 81 questions de QCM — environ 13 h 30 de travail en ligne. Les quatre
premiers reprennent des thèmes du catalogue présentiel publié sur fgfconsultant.fr :

| Parcours | Niveau | Modules | Leçons | Questions | Présentiel |
|---|---|---|---|---|---|
| Fondamentaux du management de projet | Initiation | 4 | 7 | 19 | 3 à 6 jours |
| Maîtrise des dépenses : budget, valeur acquise, reste à faire | Perfectionnement | 3 | 6 | 15 | 3 à 5 jours |
| Estimation des coûts et évaluation de la rentabilité | Expertise | 2 | 4 | 11 | 3 à 5 jours |
| Gestion des risques projet | Perfectionnement | 3 | 6 | 18 | 1 à 3 jours |
| Méthodes agiles et approches hybrides | Perfectionnement | 3 | 6 | 18 | en ligne uniquement |

Deux thèmes du catalogue FGF ne sont volontairement pas déclinés en ligne parce qu'ils supposent
une session animée : la préparation aux certifications PMI / IPMA / ICEC et la formation aux
solutions logicielles de gestion de projet. Ils sont mentionnés et renvoient au contact.

## Ajouter ou modifier du contenu

Tout le contenu pédagogique est typé et vit dans `src/data/` — aucune base de données.

- `src/data/types.ts` — modèle : `Course > Module > Lesson | Quiz`, et les blocs de contenu
  disponibles (`p`, `h2`, `list`, `callout`, `definition`, `table`).
- `src/data/course-*.ts` — un fichier par parcours.
- `src/data/index.ts` — registre des parcours et helpers de calcul.
- `src/data/company.ts` — informations sur FGF Consultant (coordonnées, valeurs, secteurs,
  partenaires, mentions légales). **Toutes proviennent de fgfconsultant.fr ou du registre du
  commerce ; ne rien y ajouter sans source.**

Pour créer un parcours : dupliquer un fichier `course-*.ts`, l'ajouter au tableau `courses`
dans `index.ts`. Les identifiants (`id`) servent d'URL, ils doivent rester stables.

### Brancher les vidéos

La tuyauterie est en place : il ne reste qu'à déposer les fichiers et à renseigner le champ
`video` de la leçon concernée. Aucun autre fichier n'est à modifier.

```ts
{
  id: 'planning-chemin-critique',
  kind: 'video',
  video: {
    src: '/videos/chemin-critique.mp4',      // MP4 H.264, déposé dans public/videos/
    poster: '/videos/chemin-critique.jpg',   // image d'attente
    captions: '/videos/chemin-critique.vtt', // sous-titres WebVTT — obligatoires
    transcript: '/videos/chemin-critique.txt', // optionnel
  },
  // …
}
```

Tant que `video.src` est absent, la leçon affiche un emplacement indiquant que la captation
n'est pas encore disponible — jamais un lecteur factice — et la version écrite reste
intégralement lisible. Un test automatisé vérifie qu'une vidéo publiée est toujours sous-titrée.

## Progression

La progression (leçons terminées, meilleurs scores de QCM) est conservée dans le `localStorage`
du navigateur, sous la clé `fgf-campus-progress-v1`. Aucune donnée ne quitte l'appareil : il n'y a
ni compte, ni serveur, ni traceur. Le store est exposé via `src/lib/progress.ts`
(`useSyncExternalStore`), donc toutes les vues se mettent à jour ensemble.

Pour brancher un vrai backend plus tard, seul `src/lib/progress.ts` est à réécrire — l'interface
(`useProgress`, `markLessonDone`, `saveQuizResult`) reste identique.

L'apprenant peut exporter sa progression en JSON depuis « Ma progression » et la réimporter sur
un autre appareil. L'import **fusionne** avec l'existant et conserve le meilleur score de chaque
QCM ; il ne remplace jamais silencieusement les données en place.

### Attestation de suivi

Une fois toutes les étapes d'un parcours validées, une attestation imprimable devient accessible
depuis le tableau de bord. Elle indique explicitement sa portée : document de suivi généré
localement, sans vérification d'identité, qui ne constitue ni certification ni diplôme. Ne pas
retirer cette mention sans validation de FGF Consultant.

## Tests

```bash
npm test
```

33 tests couvrent ce que TypeScript ne peut pas voir :

- **Contenu pédagogique** — identifiants uniques et compatibles avec une URL, index de bonne
  réponse dans les bornes, choix non dupliqués, explication présente sur chaque question,
  lignes de tableau alignées sur les en-têtes, chaque leçon close par un encadré « à retenir »,
  vidéo publiée toujours sous-titrée.
- **Progression** — meilleur score conservé, seuil de validation à 70 % exactement,
  calcul d'avancement, fusion à l'import, rejet des fichiers invalides.
- **Recherche** — insensibilité aux accents, classement par pertinence, couverture des
  définitions, encadrés et tableaux.

## SEO

`npm run build` génère `sitemap.xml` (54 URLs, une par leçon et par QCM) et `robots.txt` à partir
du contenu réel, via `scripts/sitemap.ts`. L'URL publique se surcharge au build :

```bash
SITE_URL=https://campus.fgfconsultant.fr npm run build
```

Les balises Open Graph de `index.html` et l'image de partage `public/og-image.svg` doivent être
mises à jour si le domaine change. L'application étant rendue côté client, les aperçus de réseaux
sociaux lisent ces balises statiques — pas celles posées par `usePageMeta` à la navigation.

## Design

Le contrat de design est documenté dans [DESIGN.md](DESIGN.md) : palette, typographie, géométrie,
signature visuelle (le rail de syllabus) et anti-patterns. Les tokens vivent dans
`src/styles/global.css`.

## Déploiement

Application statique : servir `dist/` avec une réécriture vers `index.html` pour le routage
côté client. Les fichiers `public/_redirects` (Netlify) et `vercel.json` (Vercel) sont fournis.
Pour Apache/nginx, configurer l'équivalent.

## Accessibilité

- Navigation clavier complète, lien d'évitement, focus visible.
- Le focus est déplacé sur `<main>` à chaque changement de page : sans cela, un utilisateur
  au clavier resterait positionné sur le lien cliqué.
- Après validation d'un QCM, le focus va sur le bloc de résultat, annoncé en région live.
- États jamais signalés par la seule couleur (icône et texte en complément).
- Contrastes vérifiés dans le navigateur : minimum 5,18:1, titres à 16:1 (WCAG AA exige 4,5:1).
- Tableaux : défilement horizontal contenu sur desktop, cartes empilées sous 760 px.

## Vérifications effectuées

- `npm test` : 33 tests au vert. `tsc -b` et `npm run build` sans erreur.
- Parcours QCM complet exercé dans le navigateur : garde de validation, correction avec
  explications, échec sous 70 %, reprise, conservation du meilleur score, persistance.
- Recherche, attestation (dont le garde-fou « parcours non terminé »), export, import fusionné
  et rejet d'un fichier invalide exercés dans le navigateur.
- Absence de débordement horizontal sur l'ensemble des routes en 1440 / 1024 / 390 px.
- Déplacement du focus au changement de route confirmé.

Limite connue : les captures d'écran n'ont pas pu être produites dans l'environnement de
développement utilisé. La géométrie, les contrastes et les comportements ont été mesurés
directement dans le DOM, mais le rendu visuel n'a pas fait l'objet d'une revue à l'œil.

## Sources

Le contenu institutionnel du site provient de deux sources, à jour au 12 août 2026 :

- **fgfconsultant.fr** — positionnement, catalogue de formation et durées, expertises conseil,
  travaux de recherche, valeurs, secteurs d'intervention, partenaires, coordonnées.
  Le site est une application Vue.js : son contenu n'est pas visible par simple extraction du HTML,
  il faut le charger dans un navigateur.
- **Registre du commerce** (Pappers, Societe.com) — forme juridique, capital, immatriculation,
  SIREN, code NAF, dirigeant, convention collective.

Le contenu pédagogique (leçons et QCM) est en revanche rédigé pour ce campus et n'est pas
extrait du site institutionnel.
