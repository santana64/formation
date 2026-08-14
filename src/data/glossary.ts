/**
 * Glossaire du management de projet.
 *
 * Le vocabulaire est repris des cinq parcours du campus : chaque entrée renvoie
 * vers la ou les leçons où la notion est enseignée. Les `id` servent d’ancres
 * publiques (`/glossaire#valeur-acquise`) : les renommer casse des liens
 * existants et les signets des apprenants.
 */

export type GlossaryCategory =
  | 'Cadrage'
  | 'Planification'
  | 'Coûts'
  | 'Risques'
  | 'Agile'
  | 'Organisation';

/** Renvoi vers une leçon d’un parcours — les trois identifiants forment son URL. */
export interface GlossaryLessonRef {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export interface GlossaryEntry {
  /** Kebab-case, unique : sert d’ancre dans l’URL de la page glossaire. */
  id: string;
  term: string;
  /** Sigles et formulations alternatives, pris en compte par la recherche. */
  aliases: string[];
  definition: string;
  category: GlossaryCategory;
  /** Identifiants d’autres entrées du glossaire. */
  related: string[];
  lessons: GlossaryLessonRef[];
}

/** Ordre d’affichage des filtres — du cadrage à la mise en œuvre. */
export const glossaryCategories: GlossaryCategory[] = [
  'Cadrage',
  'Planification',
  'Organisation',
  'Coûts',
  'Risques',
  'Agile',
];

const F = 'fondamentaux-management-projet';
const D = 'maitrise-des-depenses';
const E = 'estimation-couts-rentabilite';
const R = 'gestion-risques-projet';
const A = 'methodes-agiles-hybrides';

export const glossary: GlossaryEntry[] = [
  /* ————— Cadrage ————— */
  {
    id: 'projet',
    term: 'Projet',
    aliases: ['projet vs opérations'],
    definition:
      'Effort temporaire entrepris pour créer un produit, un service ou un résultat unique, avec un début, une fin, des ressources limitées et un objectif défini. Deux mots font la différence avec les opérations courantes : temporaire et unique. Une usine qui assemble chaque jour les mêmes véhicules mène des opérations ; l’équipe qui conçoit la prochaine ligne d’assemblage mène un projet. C’est cette part d’inédit qui crée l’incertitude, et donc le besoin de manager.',
    category: 'Cadrage',
    related: ['triangle-des-contraintes', 'charte-de-projet', 'chef-de-projet'],
    lessons: [{ courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' }],
  },
  {
    id: 'triangle-des-contraintes',
    term: 'Triangle des contraintes',
    aliases: ['contenu délai coût', 'triple contrainte'],
    definition:
      'Tension permanente entre les trois contraintes d’un projet : le contenu (ce qu’on livre et à quel niveau de qualité), le délai (pour quand) et le coût (avec quels moyens). Tirer sur l’un des sommets déforme les deux autres : ajouter des fonctionnalités à budget constant allonge le délai, raccourcir le délai à contenu constant exige des moyens supplémentaires. Le rôle du chef de projet n’est pas de nier cette tension mais de la rendre visible et de la faire arbitrer par le commanditaire.',
    category: 'Cadrage',
    related: ['projet', 'perimetre', 'demande-de-modification', 'commanditaire'],
    lessons: [{ courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' }],
  },
  {
    id: 'charte-de-projet',
    term: 'Charte de projet',
    aliases: ['note de cadrage', 'lettre de mission'],
    definition:
      'Document fondateur d’une à deux pages, validé par le commanditaire, qui officialise l’existence du projet et donne au chef de projet sa légitimité. Elle réunit le contexte, un objectif mesurable, le périmètre inclus et exclu, les macro-jalons, l’enveloppe de ressources, le nom du chef de projet et son niveau de délégation, ainsi que les risques et hypothèses connus. Une charte courte réellement validée vaut mieux qu’un cahier des charges de quatre-vingts pages que personne ne lit.',
    category: 'Cadrage',
    related: ['perimetre', 'hypothese-de-projet', 'commanditaire', 'projet'],
    lessons: [{ courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' }],
  },
  {
    id: 'perimetre',
    term: 'Périmètre',
    aliases: ['scope', 'contenu du projet'],
    definition:
      'Ce que le projet livre — et, tout aussi important, ce qu’il ne livre pas. Le périmètre se négocie en deux colonnes, « inclus » et « exclus » ; c’est la colonne des exclusions qui protège le projet. Écrire noir sur blanc qu’une formation ou un site sont hors périmètre coûte une ligne au cadrage et évite un conflit d’arbitrage en cours de route. Toute évolution ultérieure passe par une demande de modification évaluée en impact délai et coût.',
    category: 'Cadrage',
    related: ['charte-de-projet', 'derive-du-perimetre', 'demande-de-modification', 'wbs'],
    lessons: [{ courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' }],
  },
  {
    id: 'derive-du-perimetre',
    term: 'Dérive du périmètre',
    aliases: ['scope creep', 'dérive de contenu'],
    definition:
      'Élargissement progressif et non tracé de ce que le projet doit livrer. Elle ne vient presque jamais d’une grande décision, mais d’une accumulation de « petits ajouts » acceptés oralement, dont le cumul finit par consommer le budget et le délai. La parade est une règle unique et tenue : aucune évolution de périmètre sans évaluation d’impact et accord écrit du commanditaire.',
    category: 'Cadrage',
    related: ['perimetre', 'demande-de-modification', 'reference-budgetaire'],
    lessons: [{ courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' }],
  },
  {
    id: 'demande-de-modification',
    term: 'Demande de modification',
    aliases: ['change request', 'avenant', 'demande de changement'],
    definition:
      'Formalisation d’une évolution du contenu, du délai ou du budget, évaluée en impact avant d’être acceptée ou refusée. Elle est le seul moyen de faire évoluer un projet sans détruire sa référence de mesure : une modification approuvée met à jour le périmètre, le planning et le budget de référence de façon tracée et datée. Les demandes de modification sont revues en comité de projet avec les responsables métier.',
    category: 'Cadrage',
    related: ['perimetre', 'derive-du-perimetre', 'reference-budgetaire', 'comite-de-projet'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' },
      { courseId: F, moduleId: 'piloter', lessonId: 'parties-prenantes-comitologie' },
    ],
  },
  {
    id: 'hypothese-de-projet',
    term: 'Hypothèse de projet',
    aliases: ['hypothèse structurante'],
    definition:
      'Condition tenue pour vraie au moment du cadrage, faute de certitude — « le métier sera disponible deux jours par semaine », « la réglementation ne changera pas d’ici la mise en service ». Chaque hypothèse de la charte est un risque en puissance : il suffit de la retourner en question (« et si elle ne se vérifie pas ? ») pour alimenter l’identification des risques. Les hypothèses non écrites sont celles qui font dérailler les projets, parce que personne ne peut les contester à temps.',
    category: 'Cadrage',
    related: ['charte-de-projet', 'risque', 'analyse-de-sensibilite'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' },
      { courseId: R, moduleId: 'identifier', lessonId: 'identification' },
    ],
  },
  {
    id: 'etude-de-rentabilite',
    term: 'Étude de rentabilité',
    aliases: ['business case', 'dossier d’investissement'],
    definition:
      'Dossier qui justifie l’engagement d’un investissement en confrontant la dépense aux gains attendus, généralement par la valeur actuelle nette et le délai de récupération. Une étude solide teste la robustesse de ses hypothèses et présente séparément les critères non monétaires — conformité, sécurité, positionnement stratégique — plutôt que de les chiffrer artificiellement. Le signe d’une étude construite pour justifier une décision déjà prise : aucune analyse de sensibilité, ou une sensibilité qui ne teste que des variations favorables.',
    category: 'Cadrage',
    related: ['valeur-actuelle-nette', 'delai-de-recuperation', 'analyse-de-sensibilite', 'actualisation'],
    lessons: [
      { courseId: E, moduleId: 'rentabilite', lessonId: 'actualisation-van' },
      { courseId: E, moduleId: 'rentabilite', lessonId: 'criteres-decision' },
    ],
  },

  /* ————— Planification ————— */
  {
    id: 'wbs',
    term: 'WBS (organigramme des tâches)',
    aliases: ['WBS', 'Work Breakdown Structure', 'découpage', 'OT'],
    definition:
      'Décomposition hiérarchique de la totalité du travail du projet en lots de plus en plus fins, jusqu’à des éléments estimables et attribuables. La règle dite des 100 % impose que chaque niveau couvre l’intégralité du niveau supérieur : rien ne manque, rien n’est en double. Le WBS est le socle commun du planning, du budget et du suivi — c’est sur lui que se répartit l’argent et que se mesure l’avancement. Il se construit en atelier avec l’équipe, jamais seul.',
    category: 'Planification',
    related: ['lot-de-travail', 'compte-de-controle', 'perimetre', 'reference-budgetaire'],
    lessons: [{ courseId: F, moduleId: 'planifier', lessonId: 'decoupage-wbs' }],
  },
  {
    id: 'lot-de-travail',
    term: 'Lot de travail',
    aliases: ['work package', 'lot'],
    definition:
      'Élément terminal du découpage : la plus petite unité que l’on estime, attribue et suit. Repère pratique, un lot représente entre un et dix jours d’effort, a un responsable unique et un critère d’achèvement vérifiable. Trop gros, il ne permet aucun suivi avant des semaines ; trop fin, sa mise à jour coûte plus cher que l’information produite.',
    category: 'Planification',
    related: ['wbs', 'definition-de-fini', 'compte-de-controle', 'avancement-physique'],
    lessons: [{ courseId: F, moduleId: 'planifier', lessonId: 'decoupage-wbs' }],
  },
  {
    id: 'definition-de-fini',
    term: 'Définition de fini',
    aliases: ['definition of done', 'DoD', 'critère d’achèvement'],
    definition:
      'Liste des conditions qu’un travail doit remplir pour être déclaré terminé — codé, testé, documenté, déployable, recetté selon le contexte. Elle transforme l’avancement en fait vérifiable : un lot est fini ou ne l’est pas, il n’y a pas de 80 %. C’est le garde-fou de tout le système de mesure : sans définition de fini exigeante, l’avancement déclaré gonfle, la valeur acquise devient fausse et la vélocité ne mesure plus rien.',
    category: 'Planification',
    related: ['avancement-physique', 'lot-de-travail', 'valeur-acquise', 'velocite'],
    lessons: [
      { courseId: F, moduleId: 'planifier', lessonId: 'decoupage-wbs' },
      { courseId: A, moduleId: 'scrum', lessonId: 'roles-evenements-artefacts' },
      { courseId: D, moduleId: 'valeur-acquise', lessonId: 'indices-projection' },
    ],
  },
  {
    id: 'chemin-critique',
    term: 'Chemin critique',
    aliases: ['critical path'],
    definition:
      'La plus longue séquence de tâches dépendantes du projet. Tout retard sur une tâche du chemin critique retarde d’autant la date de fin — ces tâches n’ont aucune marge. La durée du projet est donnée par ce chemin, pas par la somme des durées individuelles. Il se déplace au fil du projet : une tâche qui consomme toute sa marge devient critique à son tour, d’où l’obligation de le recalculer à chaque mise à jour du planning.',
    category: 'Planification',
    related: ['marge', 'jalon', 'wbs'],
    lessons: [{ courseId: F, moduleId: 'planifier', lessonId: 'planning-chemin-critique' }],
  },
  {
    id: 'marge',
    term: 'Marge',
    aliases: ['flottement', 'float', 'slack'],
    definition:
      'Retard qu’une tâche peut absorber sans décaler la date de fin du projet. Les tâches hors chemin critique en disposent, dans une limite calculable ; les tâches critiques n’en ont aucune. C’est un outil d’arbitrage quotidien : quand deux sujets brûlent en même temps, la priorité va à celui qui est sur le chemin critique. Une marge consommée jusqu’au bout fait basculer la tâche dans le chemin critique.',
    category: 'Planification',
    related: ['chemin-critique', 'jalon'],
    lessons: [{ courseId: F, moduleId: 'planifier', lessonId: 'planning-chemin-critique' }],
  },
  {
    id: 'jalon',
    term: 'Jalon',
    aliases: ['milestone', 'macro-jalon'],
    definition:
      'Point de contrôle daté du projet, sans durée propre, qui matérialise un franchissement d’étape : fin de conception, entrée en recette, mise en service. Les jalons structurent le suivi (tenu, menacé, glissé) et servent de points de synchronisation entre chantiers menés selon des méthodes différentes. Chaque changement de phase jalonné appelle aussi une réidentification des risques, car la phase suivante apporte les siens.',
    category: 'Planification',
    related: ['chemin-critique', 'approche-hybride', 'registre-des-risques', 'avancement-physique'],
    lessons: [
      { courseId: F, moduleId: 'piloter', lessonId: 'suivi-indicateurs' },
      { courseId: R, moduleId: 'traiter', lessonId: 'revues-escalade' },
    ],
  },
  {
    id: 'estimation-en-fourchette',
    term: 'Estimation en fourchette',
    aliases: ['fourchette', 'optimiste probable pessimiste', 'plage d’estimation'],
    definition:
      'Expression d’une estimation par une plage plutôt que par un chiffre unique — « entre 4,2 et 5,8 M€ », ou optimiste / probable / pessimiste. La fourchette révèle l’incertitude au lieu de la masquer et permet au décideur d’arbitrer en connaissance de cause. Elle doit se resserrer à mesure que le projet avance : une fourchette identique entre l’opportunité et le lancement signale que le travail d’affinage n’a pas été fait.',
    category: 'Planification',
    related: [
      'estimation-par-analogie',
      'estimation-parametrique',
      'estimation-detaillee-ascendante',
      'provision-pour-aleas',
    ],
    lessons: [
      { courseId: F, moduleId: 'planifier', lessonId: 'planning-chemin-critique' },
      { courseId: E, moduleId: 'methodes-estimation', lessonId: 'base-de-donnees-precision' },
    ],
  },
  {
    id: 'avancement-physique',
    term: 'Avancement physique',
    aliases: ['avancement réel', 'pourcentage d’avancement'],
    definition:
      'Mesure de l’avancement fondée sur les lots réellement terminés au sens de la définition de fini, rapportés aux lots prévus à date. Elle s’oppose à l’avancement déclaratif — le fameux « on est à 90 % » depuis trois semaines — dont les derniers pourcents concentrent toutes les difficultés. C’est la mesure qui alimente la valeur acquise ; rapprochée de la consommation budgétaire, elle révèle immédiatement un projet qui dépense plus vite qu’il ne produit.',
    category: 'Planification',
    related: ['definition-de-fini', 'valeur-acquise', 'reste-a-faire', 'lot-de-travail'],
    lessons: [
      { courseId: F, moduleId: 'piloter', lessonId: 'suivi-indicateurs' },
      { courseId: D, moduleId: 'valeur-acquise', lessonId: 'principe-valeur-acquise' },
    ],
  },

  /* ————— Organisation ————— */
  {
    id: 'commanditaire',
    term: 'Commanditaire',
    aliases: ['sponsor', 'maître d’ouvrage', 'donneur d’ordre'],
    definition:
      'Acteur qui porte le besoin, finance le projet et tranche les arbitrages majeurs. Son absence est la première cause d’échec observée en mission : avant d’accepter un projet, il faut savoir qui tranchera si deux directions ne sont pas d’accord. C’est lui qui valide la charte, approuve les modifications de périmètre, détient la provision de gestion et fixe le seuil à partir duquel il souhaite être saisi.',
    category: 'Organisation',
    related: ['chef-de-projet', 'comite-de-pilotage', 'charte-de-projet', 'provision-de-gestion'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' },
      { courseId: F, moduleId: 'piloter', lessonId: 'parties-prenantes-comitologie' },
    ],
  },
  {
    id: 'chef-de-projet',
    term: 'Chef de projet',
    aliases: ['CDP', 'project manager'],
    definition:
      'Acteur qui organise, coordonne et pilote le projet pour atteindre l’objectif dans les contraintes fixées. Il ne décide ni du niveau d’appétence au risque, ni du taux d’actualisation, ni des arbitrages majeurs de périmètre : son métier est de rendre ces sujets visibles, chiffrés et décidables par le commanditaire. Il pilote la provision pour aléas risque par risque et escalade avec une proposition, jamais avec un simple problème.',
    category: 'Organisation',
    related: ['commanditaire', 'equipe-projet', 'comitologie', 'provision-pour-aleas'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' },
      { courseId: F, moduleId: 'piloter', lessonId: 'suivi-indicateurs' },
    ],
  },
  {
    id: 'equipe-projet',
    term: 'Équipe projet',
    aliases: ['équipe', 'contributeurs'],
    definition:
      'Ensemble des personnes qui produisent les livrables, souvent issues de métiers différents et rarement rattachées hiérarchiquement au chef de projet. C’est elle qui doit estimer le travail qu’elle réalisera, construire le découpage en atelier et réestimer le reste-à-faire — un découpage co-construit est un découpage accepté. En contexte agile, la même logique se durcit : l’équipe s’auto-organise sur le « comment ».',
    category: 'Organisation',
    related: ['chef-de-projet', 'wbs', 'reste-a-faire', 'sprint'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' },
      { courseId: F, moduleId: 'planifier', lessonId: 'decoupage-wbs' },
    ],
  },
  {
    id: 'partie-prenante',
    term: 'Partie prenante',
    aliases: ['stakeholder', 'parties prenantes'],
    definition:
      'Toute personne ou entité affectée par le projet ou capable de l’influencer : utilisateurs, direction, services support, fournisseurs, voire riverains. Une partie prenante mécontente bloque rarement de front — elle cesse de venir aux réunions, retarde ses validations, mobilise ses équipes ailleurs. On la cartographie tôt sur deux axes, pouvoir et intérêt : partenaires rapprochés en haut à droite, acteurs à maintenir satisfaits, acteurs informés, acteurs simplement surveillés.',
    category: 'Organisation',
    related: ['comitologie', 'commanditaire', 'risque'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' },
      { courseId: F, moduleId: 'piloter', lessonId: 'parties-prenantes-comitologie' },
    ],
  },
  {
    id: 'comitologie',
    term: 'Comitologie',
    aliases: ['instances', 'gouvernance projet'],
    definition:
      'Architecture des instances du projet et de leur rythme. Trois niveaux suffisent le plus souvent : un point d’équipe hebdomadaire de trente à quarante-cinq minutes, opérationnel et sans diaporama ; un comité de projet mensuel ou bimensuel avec les responsables métier ; un comité de pilotage périodique avec le commanditaire. Chaque instance a un ordre du jour orienté décisions, sans quoi elle devient un rituel décoratif.',
    category: 'Organisation',
    related: ['comite-de-projet', 'comite-de-pilotage', 'partie-prenante', 'tableau-de-bord'],
    lessons: [{ courseId: F, moduleId: 'piloter', lessonId: 'parties-prenantes-comitologie' }],
  },
  {
    id: 'comite-de-projet',
    term: 'Comité de projet',
    aliases: ['COPROJ', 'revue de projet'],
    definition:
      'Instance mensuelle ou bimensuelle réunissant le chef de projet et les responsables métier pour passer en revue les indicateurs, les risques et les demandes de modification. C’est là que se joue la vie du registre des risques : on y présente le top des risques, les cotations qui ont changé et les nouveaux entrants — le mouvement, pas la liste complète.',
    category: 'Organisation',
    related: ['comitologie', 'comite-de-pilotage', 'registre-des-risques', 'demande-de-modification'],
    lessons: [
      { courseId: F, moduleId: 'piloter', lessonId: 'parties-prenantes-comitologie' },
      { courseId: R, moduleId: 'traiter', lessonId: 'revues-escalade' },
    ],
  },
  {
    id: 'comite-de-pilotage',
    term: 'Comité de pilotage',
    aliases: ['COPIL', 'steering committee'],
    definition:
      'Instance de décision réunissant le commanditaire : arbitrages, ressources, périmètre, mobilisation de provision. Un comité de pilotage qui passe cinquante minutes sur l’architecture technique et cinq minutes sur les arbitrages ne décide rien et ralentit le projet. Il se prépare avec les décisions attendues listées en première page, chacune assortie d’options et d’une recommandation.',
    category: 'Organisation',
    related: ['commanditaire', 'comitologie', 'tableau-de-bord'],
    lessons: [
      { courseId: F, moduleId: 'piloter', lessonId: 'parties-prenantes-comitologie' },
      { courseId: D, moduleId: 'reste-a-faire', lessonId: 'tableau-de-bord-couts' },
    ],
  },
  {
    id: 'maitrise-douvrage',
    term: 'Maîtrise d’ouvrage',
    aliases: ['MOA', 'maitrise d’ouvrage', 'côté métier'],
    definition:
      'Partie qui exprime le besoin, finance l’ouvrage et en devient propriétaire : dans le vocabulaire des parcours, c’est le rôle porté par le commanditaire et les responsables métier. Elle valide la charte, arbitre le périmètre et prononce la recette des livrables. Distinguer la maîtrise d’ouvrage de la maîtrise d’œuvre évite la confusion la plus coûteuse du cadrage : celle qui laisse le réalisateur décider seul de ce qui doit être réalisé.',
    category: 'Organisation',
    related: ['maitrise-doeuvre', 'commanditaire', 'charte-de-projet', 'cloture-de-projet'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' },
      { courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' },
    ],
  },
  {
    id: 'maitrise-doeuvre',
    term: 'Maîtrise d’œuvre',
    aliases: ['MOE', 'maitrise d’oeuvre', 'côté réalisation'],
    definition:
      'Partie qui conçoit et réalise l’ouvrage pour le compte de la maîtrise d’ouvrage, en interne ou via des fournisseurs. Elle répond des délais, des coûts de réalisation et de la conformité aux exigences validées ; elle propose les solutions techniques mais ne décide pas du besoin. Sur un projet piloté au forfait, c’est aussi elle qui porte contractuellement une part des risques transférés.',
    category: 'Organisation',
    related: ['maitrise-douvrage', 'encouru', 'chef-de-projet'],
    lessons: [
      { courseId: F, moduleId: 'cadrer', lessonId: 'quest-ce-quun-projet' },
      { courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' },
    ],
  },
  {
    id: 'tableau-de-bord',
    term: 'Tableau de bord',
    aliases: ['reporting', 'dashboard'],
    definition:
      'Support d’une page conçu pour permettre une décision, pas pour rendre compte. Côté coûts, il s’organise en quatre blocs : situation (VP, VA, CR et écarts), projection (coût à terminaison, fourchette et hypothèse retenue), causes (les deux ou trois lots qui portent l’essentiel de l’écart) et décisions attendues avec recommandation. Bon test : si le commanditaire peut décider en cinq minutes, il est bon. Un tableau de bord entièrement vert jusqu’au mois où tout devient rouge signale un système d’information qui masque les dérives.',
    category: 'Organisation',
    related: ['comite-de-pilotage', 'cout-a-terminaison', 'avancement-physique'],
    lessons: [
      { courseId: F, moduleId: 'piloter', lessonId: 'suivi-indicateurs' },
      { courseId: D, moduleId: 'reste-a-faire', lessonId: 'tableau-de-bord-couts' },
    ],
  },
  {
    id: 'retour-dexperience',
    term: 'Retour d’expérience (REX)',
    aliases: ['REX', 'post-mortem', 'leçons apprises'],
    definition:
      'Atelier mené à chaud, dans le mois suivant la fin du projet, avec l’équipe au complet : ce qui était prévu, ce qui s’est passé, pourquoi. Il cherche des causes et jamais des coupables — sinon plus personne ne parle. Il produit cinq à dix enseignements actionnables affectés à un propriétaire, et verse les données réelles de charges, de durées et d’aléas dans le référentiel d’estimation. Un enseignement sans propriétaire est un vœu pieux.',
    category: 'Organisation',
    related: ['cloture-de-projet', 'base-de-donnees-de-couts', 'risque'],
    lessons: [
      { courseId: F, moduleId: 'cloturer', lessonId: 'cloture-rex' },
      { courseId: R, moduleId: 'identifier', lessonId: 'identification' },
    ],
  },
  {
    id: 'cloture-de-projet',
    term: 'Clôture de projet',
    aliases: ['clôture', 'recette finale', 'transfert aux opérations'],
    definition:
      'Phase à part entière, pas une formalité : acceptation formelle des livrables (recette signée, réserves listées et traitées), transfert vers les équipes qui feront vivre le résultat, libération des ressources, solde administratif et financier, puis retour d’expérience. Livrer n’est pas réussir : la mesure des bénéfices intervient souvent des semaines après la mise en service et doit être planifiée dès la clôture, avec un responsable désigné.',
    category: 'Organisation',
    related: ['retour-dexperience', 'etude-de-rentabilite', 'maitrise-douvrage'],
    lessons: [{ courseId: F, moduleId: 'cloturer', lessonId: 'cloture-rex' }],
  },

  /* ————— Coûts ————— */
  {
    id: 'compte-de-controle',
    term: 'Compte de contrôle',
    aliases: ['control account', 'point de mesure'],
    definition:
      'Point du découpage où l’on rapproche le contenu, le planning et le budget pour mesurer la performance. C’est le niveau auquel le projet est réellement suivi : trop fin, la mise à jour coûte plus cher que l’information produite ; trop global, les dérives se découvrent trop tard. Chaque compte de contrôle a un responsable identifié.',
    category: 'Coûts',
    related: ['wbs', 'lot-de-travail', 'reference-budgetaire'],
    lessons: [{ courseId: D, moduleId: 'budget-reference', lessonId: 'de-lestimation-au-budget' }],
  },
  {
    id: 'reference-budgetaire',
    term: 'Référence budgétaire',
    aliases: ['baseline', 'courbe en S'],
    definition:
      'Répartition du budget prévu dans le temps, contre laquelle tout écart est mesuré. Sa forme en S — lente au démarrage, rapide au milieu, lente en fin — reflète la vie du projet. Elle ne se modifie que par une décision formellement approuvée et tracée : une référence qui bouge chaque mois ne mesure plus rien.',
    category: 'Coûts',
    related: ['compte-de-controle', 'valeur-planifiee', 'demande-de-modification'],
    lessons: [{ courseId: D, moduleId: 'budget-reference', lessonId: 'de-lestimation-au-budget' }],
  },
  {
    id: 'encouru',
    term: 'Encouru',
    aliases: ['constaté', 'coût réel', 'CR'],
    definition:
      'Coût du travail effectivement réalisé, que la facture soit arrivée ou non. C’est la seule notion qui reflète la performance au moment où on la mesure — à distinguer de l’engagé (commande passée), du facturé et du comptabilisé. Piloter sur le facturé produit l’illusion la plus fréquente du suivi budgétaire : un projet qui paraît économe jusqu’à ce que toutes les factures tombent.',
    category: 'Coûts',
    related: ['engage', 'valeur-acquise', 'tableau-de-bord'],
    lessons: [{ courseId: D, moduleId: 'budget-reference', lessonId: 'engage-facture-encouru' }],
  },
  {
    id: 'engage',
    term: 'Engagé',
    aliases: ['commande passée'],
    definition:
      'Montant pour lequel une commande a été passée : l’argent n’est plus disponible pour autre chose, même si rien n’a encore été livré ni payé. Sert à anticiper la consommation et à éviter de réengager une enveloppe déjà utilisée, mais ne mesure pas la performance du projet.',
    category: 'Coûts',
    related: ['encouru'],
    lessons: [{ courseId: D, moduleId: 'budget-reference', lessonId: 'engage-facture-encouru' }],
  },
  {
    id: 'valeur-acquise',
    term: 'Valeur acquise',
    aliases: ['VA', 'earned value', 'EV'],
    definition:
      'Budget initialement prévu pour le travail effectivement réalisé à ce jour. Un lot budgété 100 k€ terminé à moitié vaut 50 k€ de valeur acquise, quel que soit son coût réel. C’est la grandeur qui manque à la comparaison prévu/consommé et qui permet de séparer un problème de rythme d’un problème de coût.',
    category: 'Coûts',
    related: ['valeur-planifiee', 'encouru', 'indice-de-performance-des-couts', 'avancement-physique'],
    lessons: [{ courseId: D, moduleId: 'valeur-acquise', lessonId: 'principe-valeur-acquise' }],
  },
  {
    id: 'valeur-planifiee',
    term: 'Valeur planifiée',
    aliases: ['VP', 'planned value', 'PV'],
    definition:
      'Budget qui devait être consommé à la date d’analyse, lu sur la référence budgétaire. Comparée à la valeur acquise, elle donne l’écart de délai exprimé en euros : un écart négatif signale qu’il manque de la production à cette date.',
    category: 'Coûts',
    related: ['valeur-acquise', 'reference-budgetaire', 'indice-de-performance-des-delais'],
    lessons: [{ courseId: D, moduleId: 'valeur-acquise', lessonId: 'principe-valeur-acquise' }],
  },
  {
    id: 'indice-de-performance-des-couts',
    term: 'Indice de performance des coûts',
    aliases: ['IPC', 'CPI'],
    definition:
      'Rapport de la valeur acquise au coût réel (VA ÷ CR). Au-dessus de 1, le projet produit plus de valeur qu’il ne dépense ; en dessous, l’inverse. À 0,76, chaque euro dépensé ne produit que 76 centimes de la valeur prévue. Contrairement aux écarts en euros, l’indice est comparable d’un mois et d’un projet à l’autre.',
    category: 'Coûts',
    related: ['valeur-acquise', 'encouru', 'cout-a-terminaison'],
    lessons: [{ courseId: D, moduleId: 'valeur-acquise', lessonId: 'indices-projection' }],
  },
  {
    id: 'indice-de-performance-des-delais',
    term: 'Indice de performance des délais',
    aliases: ['IPD', 'SPI'],
    definition:
      'Rapport de la valeur acquise à la valeur planifiée (VA ÷ VP). Il exprime le rythme de production réel par rapport au planning : à 0,80, l’équipe produit quatre cinquièmes de ce qui était prévu à cette date.',
    category: 'Coûts',
    related: ['valeur-acquise', 'valeur-planifiee'],
    lessons: [{ courseId: D, moduleId: 'valeur-acquise', lessonId: 'indices-projection' }],
  },
  {
    id: 'cout-a-terminaison',
    term: 'Coût à terminaison',
    aliases: ['CAT', 'EAC', 'atterrissage'],
    definition:
      'Projection du coût total du projet à son achèvement. Quand la dérive est structurelle, on projette à la performance observée : budget ÷ IPC. Quand elle est ponctuelle et traitée, on projette le reste-à-faire au budget prévu. Le choix entre les deux est un jugement sur la cause, pas un calcul — et présenter les deux scénarios vaut mieux qu’un chiffre unique arbitraire.',
    category: 'Coûts',
    related: ['indice-de-performance-des-couts', 'reste-a-faire'],
    lessons: [{ courseId: D, moduleId: 'valeur-acquise', lessonId: 'indices-projection' }],
  },
  {
    id: 'reste-a-faire',
    term: 'Reste-à-faire',
    aliases: ['RAF', 'ETC'],
    definition:
      'Estimation, à la date d’analyse, du coût et de la charge nécessaires pour achever le travail restant — réévaluée à partir de la connaissance acquise, et non déduite par soustraction du budget. Le consommé est irrécupérable ; seul le reste-à-faire engage l’avenir. La bonne question au responsable de lot porte sur ce qu’il lui faut encore, pas sur ce qu’il a fait.',
    category: 'Coûts',
    related: ['cout-a-terminaison', 'avancement-physique'],
    lessons: [{ courseId: D, moduleId: 'reste-a-faire', lessonId: 'logique-reste-a-faire' }],
  },
  {
    id: 'estimation-par-analogie',
    term: 'Estimation par analogie',
    aliases: ['analogie', 'estimation descendante'],
    definition:
      'Estimation obtenue en partant d’un projet passé comparable puis en ajustant. Rapide et peu coûteuse, c’est souvent la seule possible en phase d’opportunité, quand seul l’objectif est connu. Sa qualité dépend entièrement de la richesse des données historiques : sans base de retours d’expérience, elle se réduit à une intuition déguisée.',
    category: 'Coûts',
    related: ['estimation-parametrique', 'base-de-donnees-de-couts', 'estimation-en-fourchette'],
    lessons: [{ courseId: E, moduleId: 'methodes-estimation', lessonId: 'trois-familles' }],
  },
  {
    id: 'estimation-parametrique',
    term: 'Estimation paramétrique',
    aliases: ['paramétrique', 'ratio'],
    definition:
      'Estimation fondée sur une relation statistique entre une caractéristique mesurable du produit et son coût : coût au mètre carré, à la tonne, au point de fonction. Bien construite sur un historique suffisant, elle offre un bon compromis entre effort et fiabilité et se prête aux analyses de sensibilité.',
    category: 'Coûts',
    related: ['estimation-par-analogie', 'base-de-donnees-de-couts'],
    lessons: [{ courseId: E, moduleId: 'methodes-estimation', lessonId: 'trois-familles' }],
  },
  {
    id: 'estimation-detaillee-ascendante',
    term: 'Estimation détaillée ascendante',
    aliases: ['bottom-up', 'estimation par les lots'],
    definition:
      'Estimation obtenue en chiffrant chaque lot du découpage puis en agrégeant. C’est la méthode la plus précise, mais elle exige un périmètre stabilisé et représente un effort considérable : elle intervient donc tard, pour figer le budget de référence, et non pour décider de lancer ou non le projet. L’employer sur un périmètre encore flou produit une précision apparente redoutable — le chiffre paraît solide parce qu’il est détaillé, alors qu’il repose sur des hypothèses inventées.',
    category: 'Coûts',
    related: ['estimation-par-analogie', 'estimation-parametrique', 'wbs', 'reference-budgetaire'],
    lessons: [{ courseId: E, moduleId: 'methodes-estimation', lessonId: 'trois-familles' }],
  },
  {
    id: 'base-de-donnees-de-couts',
    term: 'Base de données de coûts',
    aliases: ['référentiel de coûts', 'historique'],
    definition:
      'Historique des projets clos conservant le coût réel décomposé, les paramètres qui l’expliquent, le contexte, et surtout l’écart avec l’estimation initiale accompagné de son explication. C’est cette dernière information, la plus précieuse, qui disparaît presque toujours à la clôture — quand l’équipe est déjà passée au projet suivant.',
    category: 'Coûts',
    related: ['estimation-parametrique', 'retour-dexperience'],
    lessons: [{ courseId: E, moduleId: 'methodes-estimation', lessonId: 'base-de-donnees-precision' }],
  },
  {
    id: 'actualisation',
    term: 'Actualisation',
    aliases: ['taux d’actualisation', 'discounting'],
    definition:
      'Ramène les flux financiers futurs à leur valeur d’aujourd’hui, en les divisant par (1 + t) puissance n. Un euro disponible maintenant peut être placé, porte moins de risque et n’a pas subi l’érosion monétaire. Plus un gain est lointain, plus il est déprécié — ce qui pénalise mécaniquement les projets à retour tardif.',
    category: 'Coûts',
    related: ['valeur-actuelle-nette', 'delai-de-recuperation'],
    lessons: [{ courseId: E, moduleId: 'rentabilite', lessonId: 'actualisation-van' }],
  },
  {
    id: 'valeur-actuelle-nette',
    term: 'Valeur actuelle nette',
    aliases: ['VAN', 'NPV'],
    definition:
      'Somme de tous les flux de trésorerie d’un projet ramenés à leur valeur d’aujourd’hui. Une VAN positive signale une création de valeur au-delà de l’exigence de rentabilité portée par le taux d’actualisation. Un écart de deux points sur ce taux suffit à inverser la conclusion sur un projet marginal, d’où l’intérêt de la présenter à plusieurs taux.',
    category: 'Coûts',
    related: ['actualisation', 'delai-de-recuperation', 'analyse-de-sensibilite', 'etude-de-rentabilite'],
    lessons: [{ courseId: E, moduleId: 'rentabilite', lessonId: 'actualisation-van' }],
  },
  {
    id: 'delai-de-recuperation',
    term: 'Délai de récupération',
    aliases: ['payback', 'délai de récupération actualisé'],
    definition:
      'Date à laquelle le cumul des flux actualisés redevient positif, c’est-à-dire le moment où l’organisation a récupéré sa mise. Complète la VAN, qui dit si le projet crée de la valeur mais pas quand. Décisif pour une organisation contrainte en trésorerie ou opérant dans un environnement instable.',
    category: 'Coûts',
    related: ['valeur-actuelle-nette', 'actualisation'],
    lessons: [{ courseId: E, moduleId: 'rentabilite', lessonId: 'criteres-decision' }],
  },
  {
    id: 'analyse-de-sensibilite',
    term: 'Analyse de sensibilité',
    aliases: ['point de bascule', 'scénarios'],
    definition:
      'Consiste à faire varier une à une les hypothèses d’une évaluation pour repérer celles qui font basculer la décision. Si une baisse de 10 % du gain annuel annule la VAN, le projet n’est pas rentable : il est fragile, et cette fragilité doit être présentée comme telle. Son absence trahit souvent une étude construite pour justifier une décision déjà prise.',
    category: 'Coûts',
    related: ['valeur-actuelle-nette', 'estimation-en-fourchette'],
    lessons: [{ courseId: E, moduleId: 'rentabilite', lessonId: 'criteres-decision' }],
  },

  /* ————— Risques ————— */
  {
    id: 'risque',
    term: 'Risque',
    aliases: ['menace', 'aléa'],
    definition:
      'Événement incertain qui, s’il survient, affecte au moins un objectif du projet. À distinguer du problème, déjà avéré : le risque peut encore être prévenu ou préparé. Son effet peut être défavorable (menace) ou favorable (opportunité). Se formule en cause – événement – conséquence, faute de quoi il reste trop vague pour être traité.',
    category: 'Risques',
    related: ['opportunite', 'criticite', 'registre-des-risques', 'hypothese-de-projet'],
    lessons: [{ courseId: R, moduleId: 'identifier', lessonId: 'identification' }],
  },
  {
    id: 'opportunite',
    term: 'Opportunité',
    aliases: ['risque favorable'],
    definition:
      'Risque à effet favorable sur les objectifs. Se gère avec des stratégies symétriques de celles des menaces : exploiter (rendre le gain certain), améliorer, partager avec un partenaire mieux placé, ou accepter. La plupart des équipes ne recensent que les menaces et laissent donc passer des gains qu’un peu de préparation aurait sécurisés.',
    category: 'Risques',
    related: ['risque', 'appetence-au-risque'],
    lessons: [{ courseId: R, moduleId: 'identifier', lessonId: 'opportunites-appetence' }],
  },
  {
    id: 'appetence-au-risque',
    term: 'Appétence au risque',
    aliases: ['tolérance au risque', 'seuil d’escalade'],
    definition:
      'Niveau d’incertitude qu’une organisation accepte volontairement de supporter. Elle se traduit par des seuils chiffrés qui déterminent ce qui remonte au commanditaire et ce que le chef de projet traite seul. La faire expliciter dès le cadrage évite les deux erreurs symétriques : alerter sur tout, ou découvrir trop tard que la tolérance était dépassée.',
    category: 'Risques',
    related: ['opportunite', 'escalade', 'criticite'],
    lessons: [{ courseId: R, moduleId: 'identifier', lessonId: 'opportunites-appetence' }],
  },
  {
    id: 'criticite',
    term: 'Criticité',
    aliases: ['probabilité × impact', 'matrice de criticité'],
    definition:
      'Produit de la probabilité d’un risque par son impact, qui permet de hiérarchiser. Les échelles doivent être définies en valeurs concrètes avant toute cotation — en semaines de retard ou en pourcentage de budget — sans quoi chacun projette sa propre idée de « majeur » et la matrice ne fait qu’habiller des intuitions.',
    category: 'Risques',
    related: ['risque', 'exposition', 'appetence-au-risque'],
    lessons: [{ courseId: R, moduleId: 'evaluer', lessonId: 'matrice-probabilite-impact' }],
  },
  {
    id: 'exposition',
    term: 'Exposition',
    aliases: ['valeur monétaire attendue', 'VME'],
    definition:
      'Probabilité multipliée par l’impact chiffré, exprimée en euros ou en jours. Ne prédit rien pour un risque isolé, mais donne un ordre de grandeur de provision pour l’ensemble du portefeuille — et rend le débat possible : un commanditaire peut contester une probabilité, pas une case orange.',
    category: 'Risques',
    related: ['criticite', 'provision-pour-aleas'],
    lessons: [{ courseId: R, moduleId: 'evaluer', lessonId: 'provisions-scenarios' }],
  },
  {
    id: 'provision-pour-aleas',
    term: 'Provision pour aléas',
    aliases: ['contingence', 'budget de contingence'],
    definition:
      'Enveloppe couvrant les risques identifiés, appartenant au budget du projet et pilotée risque par risque par le chef de projet. À distinguer de la provision de gestion, qui couvre l’inconnu non identifié et dont la mobilisation relève du commanditaire. Une provision visible et séparée vaut infiniment mieux qu’un matelas dispersé dans les estimations de tâches.',
    category: 'Risques',
    related: ['exposition', 'provision-de-gestion', 'reference-budgetaire'],
    lessons: [{ courseId: R, moduleId: 'evaluer', lessonId: 'provisions-scenarios' }],
  },
  {
    id: 'provision-de-gestion',
    term: 'Provision de gestion',
    aliases: ['management reserve'],
    definition:
      'Enveloppe couvrant ce qui n’a pas été identifié — les inconnues inconnues. Détenue par le commanditaire, sa mobilisation relève d’une décision de sa part et non du chef de projet.',
    category: 'Risques',
    related: ['provision-pour-aleas'],
    lessons: [{ courseId: R, moduleId: 'evaluer', lessonId: 'provisions-scenarios' }],
  },
  {
    id: 'registre-des-risques',
    term: 'Registre des risques',
    aliases: ['journal des risques'],
    definition:
      'Document vivant consolidant description, cotation, stratégie retenue, actions avec porteur et échéance, déclencheurs et état de chaque risque. Un registre figé depuis trois mois signale une gestion cosmétique ; le meilleur indicateur de santé n’est pas le nombre de lignes mais le nombre de risques clos parce que leur cause a été traitée.',
    category: 'Risques',
    related: ['risque', 'plan-de-contingence', 'escalade'],
    lessons: [{ courseId: R, moduleId: 'traiter', lessonId: 'strategies-registre' }],
  },
  {
    id: 'plan-de-contingence',
    term: 'Plan de contingence',
    aliases: ['plan B', 'déclencheur'],
    definition:
      'Ce que l’on fera si un risque survient malgré tout, assorti d’un déclencheur défini à l’avance sur un critère objectif. Décider du plan B à froid coûte toujours moins cher que l’improviser en crise, et le déclencheur dépersonnalise la décision d’activation.',
    category: 'Risques',
    related: ['registre-des-risques', 'risque'],
    lessons: [{ courseId: R, moduleId: 'traiter', lessonId: 'strategies-registre' }],
  },
  {
    id: 'escalade',
    term: 'Escalade',
    aliases: ['remontée au commanditaire'],
    definition:
      'Remontée d’un arbitrage au commanditaire, déclenchée par le dépassement d’un seuil convenu ou par une décision hors du mandat du chef de projet. C’est un acte de pilotage, pas un aveu d’échec — à condition d’escalader avec une proposition : le risque, son impact chiffré, deux options et une recommandation.',
    category: 'Risques',
    related: ['appetence-au-risque', 'comite-de-pilotage', 'registre-des-risques'],
    lessons: [{ courseId: R, moduleId: 'traiter', lessonId: 'revues-escalade' }],
  },

  /* ————— Agile ————— */
  {
    id: 'manifeste-agile',
    term: 'Manifeste agile',
    aliases: ['valeurs agiles'],
    definition:
      'Texte de 2001 énonçant quatre préférences : les individus et leurs interactions plutôt que les processus, un produit opérationnel plutôt qu’une documentation exhaustive, la collaboration avec le client plutôt que la négociation contractuelle, l’adaptation au changement plutôt que le suivi d’un plan. Le « plutôt que » établit une priorité, jamais une interdiction : être agile n’a jamais signifié « sans documentation » ni « sans plan ».',
    category: 'Agile',
    related: ['backlog', 'sprint', 'approche-hybride'],
    lessons: [{ courseId: A, moduleId: 'esprit-agile', lessonId: 'manifeste-principes' }],
  },
  {
    id: 'backlog',
    term: 'Backlog',
    aliases: ['carnet de produit', 'product backlog'],
    definition:
      'Liste unique et ordonnée par la valeur de tout ce qui pourrait améliorer le produit. Fine et précise en haut, volontairement grossière en bas : on n’affine que ce qui sera traité bientôt, car spécifier en détail un élément qui sera peut-être abandonné est un gaspillage. Un backlog sain se purge.',
    category: 'Agile',
    related: ['user-story', 'product-owner', 'sprint'],
    lessons: [{ courseId: A, moduleId: 'esprit-agile', lessonId: 'backlog-priorisation' }],
  },
  {
    id: 'user-story',
    term: 'User story',
    aliases: ['récit utilisateur'],
    definition:
      'Formulation courte d’un besoin du point de vue de celui qui s’en sert : « en tant que [rôle], je veux [action] afin de [bénéfice] ». Le « afin de » est la partie décisive : c’est elle qui autorise l’équipe à proposer une solution différente et meilleure. Une story n’est pas un contrat mais une promesse de conversation, figée ensuite en critères d’acceptation vérifiables.',
    category: 'Agile',
    related: ['backlog', 'definition-de-fini', 'product-owner'],
    lessons: [{ courseId: A, moduleId: 'esprit-agile', lessonId: 'backlog-priorisation' }],
  },
  {
    id: 'sprint',
    term: 'Sprint',
    aliases: ['itération', 'timebox'],
    definition:
      'Conteneur de durée fixe, une à quatre semaines, au terme duquel l’équipe livre un incrément potentiellement utilisable. Quatre événements le rythment : planification, mêlée quotidienne, revue avec les parties prenantes et rétrospective. Sa durée ne varie pas d’un sprint à l’autre.',
    category: 'Agile',
    related: ['increment', 'scrum-master', 'velocite', 'manifeste-agile'],
    lessons: [{ courseId: A, moduleId: 'scrum', lessonId: 'roles-evenements-artefacts' }],
  },
  {
    id: 'product-owner',
    term: 'Product Owner',
    aliases: ['PO', 'responsable produit'],
    definition:
      'Responsable de maximiser la valeur du produit : il ordonne le backlog, tranche les priorités et représente les utilisateurs. Un par produit, avec un vrai mandat de décision — un Product Owner sans autorité transforme le cadre en file d’attente.',
    category: 'Agile',
    related: ['backlog', 'scrum-master', 'user-story'],
    lessons: [{ courseId: A, moduleId: 'scrum', lessonId: 'roles-evenements-artefacts' }],
  },
  {
    id: 'scrum-master',
    term: 'Scrum Master',
    aliases: ['facilitateur'],
    definition:
      'Garant du cadre et de son efficacité : il lève les obstacles, protège l’équipe des interruptions et aide l’organisation à comprendre la démarche. Ce n’est ni un chef de projet renommé, ni un secrétaire de réunion.',
    category: 'Agile',
    related: ['product-owner', 'sprint'],
    lessons: [{ courseId: A, moduleId: 'scrum', lessonId: 'roles-evenements-artefacts' }],
  },
  {
    id: 'increment',
    term: 'Incrément',
    aliases: ['livraison utilisable'],
    definition:
      'Résultat utilisable d’un sprint, conforme à la définition de fini : codé, testé, documenté, déployable. Sans définition de fini exigeante, l’incrément n’est pas réellement utilisable, le feedback devient illusoire et la vélocité ne mesure plus rien.',
    category: 'Agile',
    related: ['definition-de-fini', 'sprint', 'velocite'],
    lessons: [{ courseId: A, moduleId: 'scrum', lessonId: 'roles-evenements-artefacts' }],
  },
  {
    id: 'velocite',
    term: 'Vélocité',
    aliases: ['points d’effort', 'story points'],
    definition:
      'Nombre de points effectivement terminés par l’équipe lors d’une itération. Mesurée sur plusieurs sprints, elle donne une fourchette permettant de projeter une date d’achèvement. Le point est une unité locale, propre à une équipe : comparer la vélocité de deux équipes n’a pas de sens, et en faire un objectif la fait gonfler — l’organisation perd alors son seul instrument de prévision.',
    category: 'Agile',
    related: ['sprint', 'increment', 'estimation-en-fourchette'],
    lessons: [{ courseId: A, moduleId: 'scrum', lessonId: 'estimation-velocite' }],
  },
  {
    id: 'approche-hybride',
    term: 'Approche hybride',
    aliases: ['hybride', 'prédictif-agile'],
    definition:
      'Montage combinant un cadrage et des jalons contractuels prédictifs avec une réalisation itérative entre ces jalons. Il ne fonctionne qu’explicité : qui travaille en itératif, qui en jalonné, et où sont les points de synchronisation. Le « faux hybride » — sprints internes invisibles du client, périmètre verrouillé, recette unique finale — cumule les coûts des deux approches sans les bénéfices d’aucune.',
    category: 'Agile',
    related: ['manifeste-agile', 'kanban', 'jalon'],
    lessons: [{ courseId: A, moduleId: 'choisir', lessonId: 'criteres-hybride' }],
  },
  {
    id: 'kanban',
    term: 'Kanban',
    aliases: ['pilotage par le flux', 'limite d’encours'],
    definition:
      'Pilotage par le flux continu plutôt que par l’itération : rendre le travail visible, limiter le travail en cours par un plafond explicite à chaque étape, et réduire le délai de traversée. La limite d’encours est la règle qui fait tout fonctionner — on termine plus vite en démarrant moins de choses à la fois. Adapté quand la charge est subie : support, maintenance, demandes au fil de l’eau.',
    category: 'Agile',
    related: ['approche-hybride', 'sprint'],
    lessons: [{ courseId: A, moduleId: 'choisir', lessonId: 'kanban-flux' }],
  },
];
