import type { Course } from './types';

export const agile: Course = {
  id: 'methodes-agiles-hybrides',
  title: 'Méthodes agiles et approches hybrides',
  level: 'Perfectionnement',
  audience: 'Chefs de projet, product owners, managers d’équipes projet évoluant en contexte incertain ou mixte.',
  pitch:
    "Comprendre ce que l'agilité change réellement, pratiquer Scrum sans caricature, et choisir en connaissance de cause entre prédictif, agile et hybride.",
  objectives: [
    "Expliquer les principes agiles au-delà des slogans",
    'Décrire les rôles, événements et artefacts de Scrum et leur fonction',
    'Choisir une approche (prédictive, agile, hybride) adaptée au contexte du projet',
    'Combiner jalons contractuels et itérations sans trahir ni l’un ni l’autre',
  ],
  prerequis: 'Avoir suivi « Fondamentaux du management de projet » ou disposer d’une expérience équivalente.',
  modules: [
    {
      id: 'esprit-agile',
      title: "L'état d'esprit agile",
      summary: 'Ce que disent vraiment le Manifeste agile et ses principes — et ce qu’ils ne disent pas.',
      lessons: [
        {
          id: 'manifeste-principes',
          title: 'Le Manifeste agile, sans les slogans',
          duration: 20,
          kind: 'texte',
          intro:
            "« On est agiles » est devenu un mot de passe social. Revenons au texte : quatre valeurs, des préférences plutôt que des interdits, et une logique profonde — réduire le coût de l'erreur en contexte incertain.",
          blocks: [
            {
              type: 'p',
              text: "Le Manifeste agile (2001) formule quatre préférences : les individus et leurs interactions plutôt que les processus et les outils ; un logiciel opérationnel plutôt qu'une documentation exhaustive ; la collaboration avec le client plutôt que la négociation contractuelle ; l'adaptation au changement plutôt que le suivi d'un plan. La subtilité tient dans le « plutôt que » : les éléments de droite gardent de la valeur — le Manifeste établit une priorité, pas une interdiction. Être agile n'a jamais signifié « sans documentation » ni « sans plan ».",
            },
            { type: 'h2', text: 'La logique économique sous-jacente' },
            {
              type: 'p',
              text: "L'approche prédictive (dite « cycle en V » ou « waterfall ») mise tout sur la qualité de la spécification initiale : elle excelle quand le besoin est stable et connu. Quand le besoin est incertain — nouveau produit, utilisateurs qu'on découvre, marché mouvant — chaque hypothèse fausse coûte d'autant plus cher qu'elle est découverte tard. L'agilité répond par des boucles courtes : livrer un incrément réellement utilisable, le confronter à de vrais utilisateurs, apprendre, ajuster. On ne supprime pas l'erreur ; on en réduit radicalement le coût unitaire.",
            },
            {
              type: 'list',
              items: [
                "Itératif et incrémental : le produit grandit par tranches utilisables, pas par couches techniques.",
                'Priorisation par la valeur : à chaque boucle, on traite d’abord ce qui apporte le plus.',
                "Équipe responsabilisée : ceux qui font décident du comment ; le quoi et le pourquoi restent pilotés.",
                'Amélioration continue : le processus lui-même est inspecté et ajusté à chaque itération.',
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "L'« agilité » alibi : des post-its et des réunions debout plaqués sur un fonctionnement inchangé — périmètre figé au contrat, validation en fin de projet, équipe sans pouvoir de décision. Sans boucle de feedback réelle avec des utilisateurs, il n'y a pas d'agilité, seulement son vocabulaire.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Quatre préférences, pas des interdits. L'agilité est une réponse économique à l'incertitude : boucles courtes, feedback réel, priorisation par la valeur. Les rituels sans feedback ne sont que du décor.",
            },
          ],
        },
        {
          id: 'backlog-priorisation',
          title: 'Backlog, valeur et priorisation',
          duration: 25,
          kind: 'texte',
          intro:
            "Tout repose sur une liste ordonnée. Cette leçon montre comment exprimer un besoin sous forme utilisable par l'équipe, et comment décider ce qui passe en premier sans se battre à chaque sprint.",
          blocks: [
            {
              type: 'p',
              text: "Le backlog n'est pas un cahier des charges découpé : c'est une liste d'intentions ordonnées par la valeur, dont le haut est fin et précis et le bas volontairement grossier. On n'affine que ce qui va être traité bientôt — investir des jours à spécifier un élément qui sera peut-être abandonné dans six mois est un gaspillage caractéristique.",
            },
            { type: 'h2', text: 'Exprimer le besoin par l’usage' },
            {
              type: 'definition',
              term: 'User story',
              text: "Formulation courte d'un besoin du point de vue de celui qui s'en sert : « En tant que [rôle], je veux [action] afin de [bénéfice] ». Le « afin de » est la partie la plus importante : c'est elle qui permet à l'équipe de proposer une solution différente et meilleure.",
            },
            {
              type: 'p',
              text: "Une story n'est pas un contrat, c'est une promesse de conversation : elle tient en une phrase parce que le détail se construit en discutant avec le PO, et se fige dans des critères d'acceptation vérifiables. Une story utile est indépendante, négociable, porteuse de valeur pour l'utilisateur, estimable, suffisamment petite pour tenir dans une itération, et testable.",
            },
            { type: 'h2', text: 'Décider de l’ordre' },
            {
              type: 'list',
              items: [
                "MoSCoW : classer en indispensable, important, souhaitable, exclu de cette version. Simple, efficace pour cadrer une échéance — à condition de tenir la discipline (tout ne peut pas être « indispensable »).",
                "Valeur / effort : traiter en premier ce qui apporte beaucoup pour peu de travail. Le réflexe le plus rentable, et le plus souvent négligé.",
                "Le risque comme critère : traiter tôt ce qui est incertain, même si la valeur immédiate est faible — un doute technique levé au sprint 2 coûte cent fois moins qu'au sprint 12.",
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Le backlog qui enfle indéfiniment parce que rien n'est jamais retiré. Une liste de 400 éléments dont 300 ne seront jamais faits ne se priorise plus : elle se subit. Un backlog sain se purge — ce qui n'a pas été jugé prioritaire depuis six mois ne le sera probablement jamais.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Backlog = liste ordonnée par la valeur, fine en haut, grossière en bas. La story exprime un usage et un bénéfice ; le détail se construit par la conversation et se fige en critères d'acceptation. Prioriser par valeur/effort et par risque, et purger régulièrement.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-esprit-agile',
        title: 'QCM — L’état d’esprit agile',
        questions: [
          {
            id: 'qcm-esprit-agile-q1',
            prompt: 'Que signifie le « plutôt que » des quatre valeurs du Manifeste agile ?',
            choices: [
              'Les éléments de droite (processus, documentation, contrat, plan) sont interdits',
              'Les éléments de gauche sont prioritaires, mais ceux de droite conservent de la valeur',
              'Il faut choisir une seule des quatre valeurs',
              'Le Manifeste ne concerne que les développeurs',
            ],
            answer: 1,
            explanation:
              'Le Manifeste exprime des préférences hiérarchisées : « nous reconnaissons la valeur des seconds éléments, mais privilégions les premiers ». Être agile sans aucune documentation ni plan est un contresens.',
          },
          {
            id: 'qcm-esprit-agile-q2',
            prompt: 'Dans quel contexte l’approche prédictive (waterfall) reste-t-elle pertinente ?',
            choices: [
              'Quand le besoin est incertain et évolutif',
              'Quand le besoin est stable, connu et que les technologies sont maîtrisées',
              'Jamais, elle est obsolète',
              'Uniquement pour les projets informatiques',
            ],
            answer: 1,
            explanation:
              'Le prédictif excelle quand la spécification initiale peut être fiable : besoin stable, domaine connu, contraintes réglementaires fortes. L’agile répond au contexte inverse — l’incertitude.',
          },
          {
            id: 'qcm-esprit-agile-q3',
            prompt: 'Quel est le mécanisme central par lequel l’agilité réduit le risque ?',
            choices: [
              'La suppression de la documentation',
              'Des réunions quotidiennes debout',
              'Des boucles courtes de livraison et de feedback qui réduisent le coût de chaque erreur',
              'L’absence de planification',
            ],
            answer: 2,
            explanation:
              'Le cœur de l’agilité est la boucle : livrer un incrément utilisable, le confronter au réel, apprendre, ajuster. Les erreurs sont découvertes tôt, quand elles coûtent encore peu. Les rituels ne sont que des supports de cette boucle.',
          },
          {
            id: 'qcm-esprit-agile-q4',
            prompt: 'Qu’est-ce qui caractérise une « agilité alibi » ?',
            choices: [
              'Des itérations courtes avec démonstrations aux utilisateurs',
              'Les rituels agiles (post-its, stand-ups) plaqués sur un fonctionnement inchangé, sans feedback réel',
              'Un backlog priorisé par la valeur',
              'Une équipe qui décide de son organisation',
            ],
            answer: 1,
            explanation:
              'Le signe distinctif est l’absence de boucle de feedback : périmètre figé, validation uniquement en fin de projet, équipe sans autonomie. Les trois autres réponses décrivent au contraire une agilité réelle.',
          },
          {
            id: 'qcm-esprit-agile-q5',
            prompt: 'Dans une user story, quelle est la partie la plus utile à l’équipe ?',
            choices: [
              'Le rôle (« en tant que… »)',
              'L’action demandée (« je veux… »)',
              'Le bénéfice visé (« afin de… »), qui permet de proposer une meilleure solution',
              'Le numéro de la story',
            ],
            answer: 2,
            explanation:
              'Connaître le bénéfice recherché autorise l’équipe à proposer une réponse différente et plus efficace que la solution imaginée par le demandeur. Sans le « afin de », la story n’est qu’une commande à exécuter.',
          },
          {
            id: 'qcm-esprit-agile-q6',
            prompt: 'Pourquoi n’affine-t-on que le haut du backlog ?',
            choices: [
              'Parce que le bas du backlog est réservé au commanditaire',
              'Parce que spécifier en détail des éléments qui seront peut-être abandonnés est un gaspillage',
              'Parce que l’outil ne permet pas d’éditer les éléments anciens',
              'Parce que le bas du backlog est traité par une autre équipe',
            ],
            answer: 1,
            explanation:
              'Le détail se périme : un élément affiné aujourd’hui mais traité dans huit mois devra de toute façon être revu. On investit l’effort d’affinage juste avant d’avoir besoin de l’élément.',
          },
        ],
      },
    },
    {
      id: 'scrum',
      title: 'Scrum en pratique',
      summary: 'Rôles, événements, artefacts : la mécanique complète d’un sprint et la fonction de chaque pièce.',
      lessons: [
        {
          id: 'roles-evenements-artefacts',
          title: 'Rôles, événements et artefacts de Scrum',
          duration: 30,
          kind: 'video',
          intro:
            "Scrum est un cadre minimaliste : trois responsabilités, cinq événements, trois artefacts. Chaque pièce a une fonction précise — c'est en la comprenant qu'on évite de pratiquer un Scrum vidé de son sens.",
          blocks: [
            { type: 'h2', text: 'Trois responsabilités' },
            {
              type: 'list',
              items: [
                "Product Owner : responsable de maximiser la valeur du produit. Il ordonne le backlog, tranche les priorités et représente les utilisateurs et parties prenantes. Un PO par produit, avec un vrai mandat.",
                "Développeurs : l'équipe pluridisciplinaire (l'équipe Scrum complète compte typiquement dix personnes ou moins) qui transforme le backlog en incrément utilisable. Elle s'auto-organise sur le « comment ».",
                "Scrum Master : garant du cadre et de son efficacité. Il lève les obstacles, protège l'équipe des interruptions et aide l'organisation à comprendre Scrum. Ce n'est ni un chef de projet renommé, ni un secrétaire de réunion.",
              ],
            },
            { type: 'h2', text: 'Le sprint et ses événements' },
            {
              type: 'p',
              text: "Le sprint est un conteneur de durée fixe (1 à 4 semaines, 2 le plus souvent) au terme duquel l'équipe livre un incrément potentiellement utilisable. Quatre événements le rythment : la planification de sprint (que peut-on livrer, et comment ?), la mêlée quotidienne (15 minutes pour synchroniser l'équipe et détecter les obstacles — pas un reporting au chef), la revue de sprint (démonstration de l'incrément aux parties prenantes et recueil du feedback qui alimentera le backlog) et la rétrospective (l'équipe inspecte sa façon de travailler et choisit une amélioration concrète pour le sprint suivant).",
            },
            { type: 'h2', text: 'Trois artefacts' },
            {
              type: 'list',
              items: [
                'Product backlog : liste unique, ordonnée et vivante de tout ce qui pourrait améliorer le produit. Ordonnée par la valeur — pas un cahier des charges figé.',
                'Sprint backlog : ce que l’équipe a sélectionné pour le sprint, avec son plan pour y parvenir. Il appartient aux développeurs.',
                "Incrément : le résultat utilisable du sprint, conforme à la définition de fini (codé, testé, documenté, déployable). Sans définition de fini exigeante, la « vélocité » ne mesure rien.",
              ],
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Les deux dérives les plus fréquentes en mission : la mêlée quotidienne devenue reporting au manager (les développeurs parlent au chef, plus entre eux), et la revue de sprint sans utilisateurs (on se démontre le produit à soi-même). Dans les deux cas, la boucle de feedback est cassée — le cadre tourne à vide.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: 'PO = valeur et priorités ; développeurs = comment ; Scrum Master = efficacité du cadre. Sprint = boucle complète : planifier, synchroniser chaque jour, démontrer, s’améliorer. La définition de fini est le garde-fou de tout le système.',
            },
          ],
        },
        {
          id: 'estimation-velocite',
          title: 'Estimation, vélocité et prévisibilité',
          duration: 25,
          kind: 'texte',
          intro:
            "« Quand est-ce que ce sera fini ? » La question reste légitime en agile. Cette leçon explique comment y répondre honnêtement — et pourquoi la vélocité devient nuisible dès qu'on en fait un objectif.",
          blocks: [
            {
              type: 'p',
              text: "Les équipes agiles estiment le plus souvent en points relatifs plutôt qu'en jours : on compare les éléments entre eux (« celui-ci est deux fois plus gros que celui-là ») au lieu de prédire une durée absolue. L'intérêt est double : la comparaison est un exercice cognitif où les humains sont bien meilleurs que la prédiction, et le point n'est pas un engagement de temps que l'on pourra reprocher plus tard.",
            },
            {
              type: 'definition',
              term: 'Vélocité',
              text: "Nombre de points effectivement terminés par l'équipe lors d'une itération. Mesurée sur plusieurs sprints, elle donne une fourchette qui permet de projeter une date d'achèvement du backlog restant.",
            },
            {
              type: 'p',
              text: "La projection est simple : si l'équipe termine entre 22 et 30 points par sprint et qu'il reste 180 points, l'achèvement se situe entre 6 et 9 sprints. Communiquer cette fourchette — et non une date unique — est la façon honnête de répondre au commanditaire. La fourchette se resserre naturellement à mesure que le backlog se réduit et que l'historique s'allonge.",
            },
            { type: 'h2', text: 'Estimer en équipe' },
            {
              type: 'list',
              items: [
                "Estimer collectivement : ceux qui feront le travail, tous ensemble, chacun révélant son estimation en même temps que les autres pour éviter l'effet d'ancrage.",
                'Discuter les écarts plutôt que moyenner : un écart de 1 à 13 signale que deux personnes ne parlent pas de la même chose.',
                "Réestimer un élément seulement si sa compréhension a changé — pas pour rattraper un retard.",
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Transformer la vélocité en objectif de performance ou comparer la vélocité de deux équipes. Les points sont une unité locale, propre à une équipe et à sa façon de comparer : ils ne sont pas transférables. Dès que la vélocité devient un objectif, elle est gonflée — et l'organisation perd son seul instrument de prévision fiable.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Estimation relative en équipe, sans ancrage ; vélocité observée sur plusieurs sprints ; projection communiquée en fourchette. La vélocité est un instrument de mesure, jamais un objectif ni un outil de comparaison entre équipes.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-scrum',
        title: 'QCM — Scrum en pratique',
        questions: [
          {
            id: 'qcm-scrum-q1',
            prompt: 'Qui ordonne le product backlog ?',
            choices: ['Le Scrum Master', 'Le Product Owner', 'Les développeurs', 'Le commanditaire du projet'],
            answer: 1,
            explanation:
              'Le Product Owner est responsable de maximiser la valeur : il ordonne le backlog et tranche les priorités. Les développeurs décident du « comment » ; le Scrum Master veille à l’efficacité du cadre.',
          },
          {
            id: 'qcm-scrum-q2',
            prompt: 'Quelle est la fonction de la mêlée quotidienne (daily scrum) ?',
            choices: [
              'Faire un reporting d’avancement au manager',
              'Permettre à l’équipe de se synchroniser et de détecter les obstacles, en 15 minutes',
              'Renégocier le contenu du sprint chaque matin',
              'Évaluer individuellement les développeurs',
            ],
            answer: 1,
            explanation:
              'La mêlée appartient aux développeurs : ils s’y coordonnent entre eux. Dès qu’elle devient un reporting au chef, elle perd sa fonction — et souvent sa sincérité.',
          },
          {
            id: 'qcm-scrum-q3',
            prompt: 'Pourquoi la « définition de fini » est-elle décisive dans Scrum ?',
            choices: [
              'Elle fixe la date de fin du projet',
              'Elle garantit que chaque incrément est réellement utilisable — sans elle, vélocité et démos ne mesurent rien',
              'Elle remplace les tests',
              'Elle est rédigée par le client en fin de sprint',
            ],
            answer: 1,
            explanation:
              'Si « fini » signifie « codé mais ni testé ni intégré », l’incrément n’est pas utilisable et le feedback est illusoire. Une définition de fini exigeante et partagée est le garde-fou de toute la mécanique.',
          },
          {
            id: 'qcm-scrum-q4',
            prompt: 'Une revue de sprint sans utilisateurs ni parties prenantes est problématique parce que…',
            choices: [
              'la réunion dure moins longtemps',
              'la boucle de feedback est cassée : l’équipe se démontre le produit à elle-même',
              'le Scrum Master ne peut pas remplir son rapport',
              'ce n’est pas prévu par le Guide Scrum',
            ],
            answer: 1,
            explanation:
              'La revue existe pour confronter l’incrément au regard de ceux qui s’en serviront et en ajuster le backlog. Sans eux, on perd l’apprentissage — qui est la raison d’être des boucles courtes.',
          },
          {
            id: 'qcm-scrum-q5',
            prompt: 'L’équipe termine 22 à 30 points par sprint et il reste 180 points. Que répondez-vous au commanditaire ?',
            choices: [
              '« Ce sera fini dans exactement 7 sprints »',
              '« Entre 6 et 9 sprints selon notre vélocité observée, fourchette qui se resserrera »',
              '« Impossible à dire, nous sommes en agile »',
              '« 180 points, donc 180 jours »',
            ],
            answer: 1,
            explanation:
              'La vélocité observée sur plusieurs sprints donne une fourchette de projection. Communiquer la fourchette — et son resserrement attendu — est plus honnête et plus utile qu’une date unique fausse ou qu’un refus de répondre.',
          },
          {
            id: 'qcm-scrum-q6',
            prompt: 'Pourquoi ne faut-il pas comparer la vélocité de deux équipes ?',
            choices: [
              'Parce que c’est interdit par le Guide Scrum',
              'Parce que le point est une unité locale, propre à chaque équipe — et qu’un objectif de vélocité pousse à gonfler les estimations',
              'Parce que les équipes n’ont pas le même nombre de développeurs',
              'Parce que la vélocité n’a aucune utilité',
            ],
            answer: 1,
            explanation:
              'Les points expriment une comparaison interne à une équipe : ils ne sont pas transférables. Dès que la vélocité devient un objectif de performance, elle est inflatée et l’organisation perd son instrument de prévision.',
          },
        ],
      },
    },
    {
      id: 'choisir',
      title: 'Choisir : prédictif, agile ou hybride',
      summary: 'Décider de l’approche selon le contexte réel du projet, et assembler un hybride qui tient la route.',
      lessons: [
        {
          id: 'criteres-hybride',
          title: "Critères de choix et montages hybrides",
          duration: 25,
          kind: 'texte',
          intro:
            "La bonne question n'est pas « faut-il être agile ? » mais « quel est le degré d'incertitude de ce projet, et que permet mon contexte ? ». Cette leçon donne une grille de décision et les règles d'un hybride honnête.",
          blocks: [
            { type: 'h2', text: 'Une grille de décision' },
            {
              type: 'table',
              caption: 'Critères orientant le choix de l’approche',
              head: ['Critère', 'Plutôt prédictif', 'Plutôt agile'],
              rows: [
                ['Stabilité du besoin', 'Besoin stable, spécifiable', 'Besoin évolutif, découvert en marchant'],
                ['Maîtrise technique', 'Technologies éprouvées', 'Innovation, incertitude technique'],
                ['Livraison', 'Tout-ou-rien (usine, bâtiment)', 'Livrable par incréments utilisables'],
                ['Accès aux utilisateurs', 'Feedback tardif acceptable', 'Utilisateurs disponibles pour tester tôt'],
                ['Cadre contractuel', 'Forfait ferme, réglementation forte', 'Contrat souple, confiance établie'],
              ],
            },
            {
              type: 'p',
              text: "La plupart des projets réels combinent les deux mondes : un cœur incertain qui bénéficie d'itérations, et des pans stables ou contraints (infrastructure, réglementaire, marchés publics) qui relèvent du prédictif. D'où les montages hybrides : par exemple un cadrage et des jalons contractuels prédictifs, avec une réalisation itérative entre les jalons ; ou un chantier logiciel mené en Scrum pendant que le déploiement matériel suit un planning classique coordonné par des jalons communs.",
            },
            { type: 'h2', text: 'Les règles d’un hybride qui fonctionne' },
            {
              type: 'list',
              items: [
                "Expliciter le montage : qui travaille en itératif, qui en jalonné, et où sont les points de synchronisation. Un hybride implicite devient vite un malentendu contractuel.",
                "Protéger la boucle de feedback : si les incréments ne sont jamais montrés à de vrais utilisateurs avant le jalon final, la partie « agile » n'apporte plus rien.",
                "Unifier le suivi des risques et du budget au niveau projet, quelle que soit la méthode de chaque chantier.",
                "Adapter le contrat : sur un forfait ferme à périmètre figé, l'itératif ne peut porter que sur l'ordre et la finesse de réalisation — le dire clairement au client évite les déceptions.",
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Le « faux hybride » : des sprints internes invisibles du client, un périmètre verrouillé au contrat et une recette unique en fin de projet. On cumule alors les coûts des deux approches (rituels agiles + rigidité contractuelle) sans les bénéfices d'aucune.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Le choix se fait critère par critère (besoin, technique, livraison, utilisateurs, contrat), pas par idéologie. Un hybride se conçoit explicitement : boucles de feedback réelles, synchronisation par jalons, suivi unifié des risques.",
            },
          ],
        },
        {
          id: 'kanban-flux',
          title: "Kanban : quand l'itération n'est pas la bonne maille",
          duration: 20,
          kind: 'texte',
          intro:
            "Toutes les activités ne se découpent pas en sprints. Pour le support, la maintenance ou les demandes qui arrivent au fil de l'eau, le pilotage par le flux est souvent plus juste que le pilotage par l'itération.",
          blocks: [
            {
              type: 'p',
              text: "Scrum suppose qu'on puisse s'engager sur un contenu pour deux semaines. Une équipe qui reçoit des incidents urgents chaque jour ne le peut pas : elle passerait son temps à casser ses sprints. Kanban répond à ce contexte en abandonnant l'itération au profit d'un flux continu, piloté par trois règles simples.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                "Rendre le travail visible : chaque demande est une carte sur un tableau qui reproduit les étapes réelles du processus, de la demande à la mise en service.",
                "Limiter le travail en cours : un plafond explicite par colonne (par exemple trois éléments maximum en développement). C'est la règle qui fait tout fonctionner.",
                "Piloter le délai de traversée : mesurer le temps qu'une demande met à traverser le système, et travailler à le réduire et à le rendre prévisible.",
              ],
            },
            {
              type: 'p',
              text: "La limitation du travail en cours est contre-intuitive : on produit davantage en démarrant moins de choses à la fois. Une équipe qui mène huit sujets de front les termine tous tard, multiplie les changements de contexte et accumule du travail à moitié fait — qui ne vaut rien tant qu'il n'est pas livré. En plafonnant, on force les blocages à devenir visibles et à être traités au lieu d'être contournés en commençant autre chose.",
            },
            {
              type: 'table',
              caption: 'Deux logiques de pilotage complémentaires',
              head: ['', 'Scrum', 'Kanban'],
              rows: [
                ['Rythme', 'Itérations de durée fixe', 'Flux continu'],
                ['Engagement', 'Contenu du sprint', 'Aucun engagement de lot'],
                ['Régulateur', 'Capacité du sprint', 'Limite de travail en cours'],
                ['Indicateur clé', 'Vélocité', 'Délai de traversée'],
                ['Contexte adapté', 'Développement produit planifiable', 'Support, maintenance, flux imprévisible'],
              ],
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Beaucoup d'équipes qui « font du Scrum » gagneraient à passer en Kanban : elles n'ont jamais tenu un engagement de sprint parce que leur charge est majoritairement subie. Reconnaître la nature réelle du flux évite de vivre chaque sprint comme un échec.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Kanban pilote le flux : visualiser, limiter le travail en cours, réduire le délai de traversée. Il convient quand la demande est imprévisible et qu'un engagement de lot n'a pas de sens. Le régulateur n'est plus la capacité du sprint mais la limite d'encours.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-choisir',
        title: 'QCM — Choisir son approche',
        questions: [
          {
            id: 'qcm-choisir-q1',
            prompt: 'Quel contexte plaide le plus fortement pour une approche agile ?',
            choices: [
              'Besoin parfaitement spécifié et technologies éprouvées',
              'Besoin évolutif, utilisateurs disponibles pour tester tôt, livraison possible par incréments',
              'Construction d’un bâtiment livré en une fois',
              'Réglementation imposant une validation documentaire exhaustive avant tout développement',
            ],
            answer: 1,
            explanation:
              'L’agile crée de la valeur quand l’incertitude est forte et que la boucle de feedback est possible : incréments utilisables + utilisateurs accessibles. Les trois autres contextes favorisent le prédictif.',
          },
          {
            id: 'qcm-choisir-q2',
            prompt: 'Dans un montage hybride typique, comment coexistent jalons et itérations ?',
            choices: [
              'Les jalons remplacent les itérations',
              'Cadrage et jalons contractuels prédictifs, réalisation itérative entre les jalons, synchronisation explicite',
              'Chaque équipe choisit sa méthode sans coordination',
              'Les itérations ne servent qu’à préparer les slides des jalons',
            ],
            answer: 1,
            explanation:
              'L’hybride honnête garde des points de rendez-vous contractuels tout en itérant entre eux — à condition que le montage soit explicite et que les incréments soient réellement montrés et testés.',
          },
          {
            id: 'qcm-choisir-q3',
            prompt: 'Qu’est-ce qui caractérise un « faux hybride » ?',
            choices: [
              'Des démonstrations régulières au client',
              'Des sprints internes invisibles du client, un périmètre verrouillé et une recette unique finale',
              'Un suivi des risques unifié au niveau projet',
              'Des jalons de synchronisation entre chantiers',
            ],
            answer: 1,
            explanation:
              'Sans feedback client avant la recette finale, les sprints ne sont qu’une organisation interne du travail : on paie les rituels agiles sans en récolter l’apprentissage. C’est le cumul des coûts des deux mondes.',
          },
          {
            id: 'qcm-choisir-q4',
            prompt: 'Sur un forfait ferme à périmètre figé, que peut réellement apporter l’itératif ?',
            choices: [
              'La liberté de changer le périmètre sans avenant',
              'Rien, il faut le refuser systématiquement',
              'Maîtriser l’ordre de réalisation et détecter tôt les problèmes de qualité et d’intégration',
              'Supprimer la recette contractuelle',
            ],
            answer: 2,
            explanation:
              'À périmètre contractuellement figé, l’itératif ne redonne pas la flexibilité du contenu, mais il sécurise l’exécution : priorisation, intégration continue, détection précoce des écarts. Le dire au client évite les malentendus.',
          },
          {
            id: 'qcm-choisir-q5',
            prompt: 'Quelle est la règle centrale du pilotage par le flux (Kanban) ?',
            choices: [
              'Tenir des sprints de deux semaines',
              'Limiter le travail en cours par un plafond explicite à chaque étape',
              'Estimer chaque demande en points',
              'Interdire les demandes urgentes',
            ],
            answer: 1,
            explanation:
              'La limite d’encours est le régulateur du système : en démarrant moins de choses à la fois, l’équipe termine plus vite, réduit les changements de contexte et rend les blocages visibles au lieu de les contourner.',
          },
          {
            id: 'qcm-choisir-q6',
            prompt: 'Une équipe reçoit chaque jour des incidents urgents et ne tient jamais son engagement de sprint. Que recommander ?',
            choices: [
              'Allonger les sprints à six semaines',
              'Interdire les incidents pendant le sprint',
              'Passer à un pilotage par le flux (Kanban), plus adapté à une charge subie',
              'Augmenter la vélocité cible',
            ],
            answer: 2,
            explanation:
              'Quand la demande est majoritairement imprévisible, l’engagement de lot n’a pas de sens et chaque sprint est vécu comme un échec. Kanban pilote alors le délai de traversée plutôt que le contenu d’une itération.',
          },
        ],
      },
    },
  ],
};
