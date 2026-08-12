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
    related: ['perimetre', 'demande-de-modification', 'budget-de-reference'],
    lessons: [{ courseId: F, moduleId: 'cadrer', lessonId: 'charte-de-projet' }],
  },
  {
    id: 'demande-de-modification',
    term: 'Demande de modification',
    aliases: ['change request', 'avenant', 'demande de changement'],
    definition:
      'Formalisation d’une évolution du contenu, du délai ou du budget, évaluée en impact avant d’être acceptée ou refusée. Elle est le seul moyen de faire évoluer un projet sans détruire sa référence de mesure : une modification approuvée met à jour le périmètre, le planning et le budget de référence de façon tracée et datée. Les demandes de modification sont revues en comité de projet avec les responsables métier.',
    category: 'Cadrage',
    related: ['perimetre', 'derive-du-perimetre', 'budget-de-reference', 'comite-de-projet'],
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
    related: ['charte-de-projet', 'risque-projet', 'analyse-de-sensibilite'],
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
    related: ['van', 'delai-de-recuperation', 'analyse-de-sensibilite', 'actualisation'],
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
    related: ['lot-de-travail', 'compte-de-controle', 'perimetre', 'budget-de-reference'],
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
    related: ['chef-de-projet', 'wbs', 'reste-a-faire', 'scrum'],
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
    related: ['comitologie', 'commanditaire', 'risque-projet', 'revue-de-sprint'],
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
    related: ['commanditaire', 'comitologie', 'tableau-de-bord', 'seuil-descalade'],
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
    related: ['maitrise-douvrage', 'strategie-de-reponse', 'encouru', 'chef-de-projet'],
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
    related: ['comite-de-pilotage', 'cout-a-terminaison', 'ecart-de-cout', 'avancement-physique'],
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
    related: ['cloture-de-projet', 'base-de-donnees-de-couts', 'risque-projet', 'retrospective'],
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
];
