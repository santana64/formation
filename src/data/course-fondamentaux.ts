import type { Course } from './types';

export const fondamentaux: Course = {
  id: 'fondamentaux-management-projet',
  title: 'Fondamentaux du management de projet',
  level: 'Initiation',
  presentiel: '3 à 6 jours',
  audience: 'Chefs de projet débutants, contributeurs projet, managers prenant en charge leur premier projet.',
  pitch:
    "Maîtriser le cycle de vie complet d'un projet : cadrer, organiser, piloter et clôturer. Le socle indispensable avant toute spécialisation.",
  objectives: [
    'Distinguer un projet des opérations courantes et en identifier les acteurs',
    'Rédiger une charte de projet et formaliser le périmètre',
    "Construire un découpage (WBS) et un planning avec chemin critique",
    "Piloter l'avancement avec des indicateurs simples et fiables",
    'Clôturer un projet et capitaliser sur le retour d’expérience',
  ],
  prerequis: 'Aucun prérequis. Une première participation à un projet est un plus.',
  modules: [
    {
      id: 'cadrer',
      title: 'Cadrer le projet',
      summary: 'Comprendre ce qui fait un projet, clarifier la demande et poser des fondations solides avant de produire.',
      lessons: [
        {
          id: 'quest-ce-quun-projet',
          title: "Qu'est-ce qu'un projet ?",
          duration: 20,
          kind: 'texte',
          intro:
            "Avant d'outiller quoi que ce soit, il faut savoir reconnaître un projet — et surtout ce qui n'en est pas un. Cette leçon pose le vocabulaire commun utilisé dans tout le parcours.",
          blocks: [
            {
              type: 'definition',
              term: 'Projet',
              text: "Effort temporaire entrepris pour créer un produit, un service ou un résultat unique, avec un début, une fin, des ressources limitées et un objectif défini.",
            },
            {
              type: 'p',
              text: "Deux mots comptent dans cette définition : temporaire et unique. Une usine qui assemble chaque jour les mêmes véhicules mène des opérations ; l'équipe qui conçoit la prochaine ligne d'assemblage mène un projet. Les opérations se répètent et s'optimisent ; le projet, lui, n'a jamais été fait exactement ainsi — c'est ce qui crée son incertitude, et donc le besoin de le manager.",
            },
            {
              type: 'h2',
              text: 'Le triangle des contraintes',
            },
            {
              type: 'p',
              text: "Tout projet est tendu entre trois contraintes : le contenu (ce qu'on livre, à quel niveau de qualité), le délai (pour quand) et le coût (avec quels moyens). Tirer sur l'un des sommets déforme les deux autres : ajouter des fonctionnalités sans toucher au budget allonge le délai ; raccourcir le délai à contenu constant exige des moyens supplémentaires. Le rôle du chef de projet n'est pas de nier cette tension, mais de la rendre visible et d'arbitrer en connaissance de cause avec le commanditaire.",
            },
            {
              type: 'h2',
              text: 'Les acteurs incontournables',
            },
            {
              type: 'list',
              items: [
                "Le commanditaire (ou sponsor) : il porte le besoin, finance le projet et tranche les arbitrages majeurs.",
                "Le chef de projet : il organise, coordonne et pilote pour atteindre l'objectif dans les contraintes fixées.",
                "L'équipe projet : elle produit les livrables ; ses membres viennent souvent de métiers différents.",
                'Les parties prenantes : toute personne ou entité affectée par le projet ou capable de l’influencer — utilisateurs, direction, services support, fournisseurs, voire riverains.',
              ],
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "La première cause d'échec observée en mission n'est ni technique ni budgétaire : c'est un commanditaire absent ou introuvable. Avant d'accepter un projet, posez la question « qui tranchera si deux directions ne sont pas d'accord ? ». Si personne ne sait répondre, le cadrage n'est pas terminé.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Un projet = temporaire + unique + objectif défini. Trois contraintes en tension (contenu, délai, coût), quatre familles d'acteurs (commanditaire, chef de projet, équipe, parties prenantes).",
            },
          ],
        },
        {
          id: 'charte-de-projet',
          title: 'La charte de projet et le périmètre',
          duration: 25,
          kind: 'texte',
          intro:
            "La charte est le document fondateur : une page qui évite des mois de malentendus. Vous apprendrez ici à la rédiger et à délimiter ce qui est dans — et hors — du projet.",
          blocks: [
            {
              type: 'p',
              text: "Beaucoup de projets démarrent sur un couloir : « tu peux t'occuper de la migration ? ». Six mois plus tard, personne ne s'accorde sur ce qui était attendu. La charte de projet prévient ce scénario : c'est un document court — une à deux pages — validé par le commanditaire, qui officialise l'existence du projet et donne au chef de projet sa légitimité.",
            },
            { type: 'h2', text: 'Contenu type d’une charte' },
            {
              type: 'list',
              ordered: true,
              items: [
                'Contexte et justification : pourquoi ce projet, pourquoi maintenant.',
                "Objectif mesurable : le résultat attendu, formulé de façon vérifiable (« réduire le délai de traitement de 10 à 3 jours », pas « améliorer le traitement »).",
                'Périmètre : ce qui est inclus, et — tout aussi important — ce qui est explicitement exclu.',
                'Macro-jalons et échéance cible.',
                'Budget ou enveloppe de ressources.',
                'Chef de projet nommé et niveau de délégation.',
                'Risques et hypothèses majeurs connus à ce stade.',
              ],
            },
            { type: 'h2', text: 'Délimiter le périmètre' },
            {
              type: 'p',
              text: "Le périmètre se négocie en deux colonnes : « inclus » et « exclus ». La colonne des exclusions est celle qui protège le projet. Écrire noir sur blanc que « la formation des utilisateurs des filiales étrangères est hors périmètre » coûte une ligne aujourd'hui, et évite un conflit d'arbitrage en cours de route. Toute évolution ultérieure du périmètre devra passer par une demande de modification tracée, évaluée en impact délai et coût.",
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "La dérive du périmètre (scope creep) ne vient presque jamais d'une grande décision, mais d'une accumulation de « petits ajouts » acceptés oralement. Règle simple : aucune évolution de périmètre sans évaluation d'impact et accord écrit du commanditaire.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Une charte courte validée par le commanditaire vaut mieux qu'un cahier des charges de 80 pages que personne ne lit. Objectif mesurable, exclusions explicites, modifications tracées.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-cadrer',
        title: 'QCM — Cadrer le projet',
        questions: [
          {
            id: 'qcm-cadrer-q1',
            prompt: 'Parmi ces activités, laquelle relève d’un projet ?',
            choices: [
              'Traiter les factures fournisseurs chaque fin de mois',
              'Déployer un nouveau logiciel de facturation dans l’entreprise',
              'Assurer le support téléphonique des clients',
              'Réapprovisionner le stock chaque semaine',
            ],
            answer: 1,
            explanation:
              'Le déploiement d’un nouveau logiciel est temporaire (il a une fin) et unique (il n’a jamais été fait dans ce contexte) : c’est un projet. Les trois autres activités sont récurrentes — ce sont des opérations.',
          },
          {
            id: 'qcm-cadrer-q2',
            prompt: 'Quelles sont les trois contraintes du « triangle » du projet ?',
            choices: [
              'Qualité, communication, ressources humaines',
              'Contenu, délai, coût',
              'Risques, achats, parties prenantes',
              'Planification, exécution, clôture',
            ],
            answer: 1,
            explanation:
              'Le triangle contenu (périmètre/qualité) – délai – coût représente la tension fondamentale : modifier l’une des contraintes affecte mécaniquement les deux autres.',
          },
          {
            id: 'qcm-cadrer-q3',
            prompt: 'Quel est le rôle premier du commanditaire (sponsor) ?',
            choices: [
              'Rédiger le planning détaillé du projet',
              'Produire les livrables techniques',
              'Porter le besoin, financer le projet et trancher les arbitrages majeurs',
              'Animer les réunions d’équipe quotidiennes',
            ],
            answer: 2,
            explanation:
              'Le commanditaire porte le besoin et détient l’autorité de décision. Le planning et l’animation d’équipe relèvent du chef de projet ; la production des livrables relève de l’équipe.',
          },
          {
            id: 'qcm-cadrer-q4',
            prompt: 'Dans une charte de projet, à quoi sert la liste des exclusions de périmètre ?',
            choices: [
              'À allonger le document pour le rendre plus complet',
              'À prévenir les malentendus en écrivant ce que le projet ne couvrira pas',
              'À lister les risques du projet',
              'À justifier le budget demandé',
            ],
            answer: 1,
            explanation:
              'Les exclusions explicites protègent le projet contre la dérive du périmètre : ce qui est écrit comme « hors périmètre » ne pourra pas être exigé plus tard sans renégociation formelle.',
          },
          {
            id: 'qcm-cadrer-q5',
            prompt: 'Un objectif de projet bien formulé est…',
            choices: [
              '« Améliorer la satisfaction client »',
              '« Moderniser nos outils »',
              '« Réduire le délai de traitement des dossiers de 10 à 3 jours d’ici le 30 juin »',
              '« Travailler plus efficacement en équipe »',
            ],
            answer: 2,
            explanation:
              'Un objectif doit être mesurable et daté pour être vérifiable. « Réduire de 10 à 3 jours d’ici le 30 juin » permet de constater objectivement l’atteinte — les trois autres formulations sont des intentions invérifiables.',
          },
        ],
      },
    },
    {
      id: 'planifier',
      title: 'Organiser et planifier',
      summary: 'Découper le travail, estimer les charges et construire un planning qui résiste au réel.',
      lessons: [
        {
          id: 'decoupage-wbs',
          title: 'Le découpage du projet (WBS)',
          duration: 25,
          kind: 'texte',
          intro:
            "On ne planifie bien que ce qu'on a découpé. Le WBS transforme un objectif intimidant en une liste de travaux qu'une équipe peut estimer, répartir et suivre.",
          blocks: [
            {
              type: 'definition',
              term: 'WBS (Work Breakdown Structure)',
              text: "Décomposition hiérarchique de la totalité du travail du projet en lots de plus en plus fins, jusqu'à des éléments estimables et attribuables — l'organigramme des tâches.",
            },
            {
              type: 'p',
              text: "Le principe est simple : partir du livrable final et le décomposer en sous-ensembles, puis en lots de travaux, jusqu'à obtenir des éléments dont on peut dire qui les fait, combien de temps ils prennent et comment on saura qu'ils sont finis. La règle dite « des 100 % » impose que chaque niveau de découpage couvre l'intégralité du niveau supérieur : rien ne doit manquer, rien ne doit être en double.",
            },
            { type: 'h2', text: 'Jusqu’où découper ?' },
            {
              type: 'p',
              text: "Trop gros, un lot est impossible à piloter : « développer le module client — 60 jours » ne permet aucun suivi avant deux mois. Trop fin, le découpage devient une usine à gaz administrative. Repère pratique : un lot de travail terminal devrait représenter entre 1 et 10 jours d'effort, avoir un responsable unique et un critère d'achèvement vérifiable (la « définition de fini »).",
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Construisez le WBS en atelier avec l'équipe, jamais seul dans votre bureau. D'abord parce que l'équipe voit des travaux que vous oubliez (reprise de données, environnements de test, conduite du changement…), ensuite parce qu'un découpage co-construit est un découpage accepté.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "WBS = décomposition exhaustive (règle des 100 %) en lots de 1 à 10 jours, chacun avec un responsable unique et un critère de fin vérifiable. C'est le socle du planning, du budget et du suivi.",
            },
          ],
        },
        {
          id: 'planning-chemin-critique',
          title: 'Planning, dépendances et chemin critique',
          duration: 30,
          kind: 'video',
          intro:
            "Un planning n'est pas une liste de dates posées au feutre : c'est un réseau de dépendances. Comprendre le chemin critique vous dit où chaque jour perdu est un jour de retard.",
          blocks: [
            {
              type: 'p',
              text: "Une fois le travail découpé, chaque lot est estimé (en charge, puis en durée compte tenu des ressources disponibles) et relié aux autres : on ne peut pas tester ce qui n'est pas développé, ni former les utilisateurs sur un outil non recetté. Ces liens de dépendance, représentés dans un diagramme de Gantt ou un réseau d'activités, déterminent la durée totale du projet — bien plus que la somme des durées individuelles.",
            },
            {
              type: 'definition',
              term: 'Chemin critique',
              text: "La plus longue séquence de tâches dépendantes du projet. Tout retard sur une tâche du chemin critique retarde d'autant la date de fin du projet — ces tâches n'ont aucune marge.",
            },
            {
              type: 'p',
              text: "Les tâches hors chemin critique disposent d'une marge : elles peuvent glisser sans décaler la fin du projet, dans une certaine limite. Ce n'est pas un détail théorique, c'est votre outil d'arbitrage quotidien : quand deux sujets brûlent en même temps, la priorité va à celui qui est sur le chemin critique. Attention, le chemin critique se déplace : une tâche qui consomme toute sa marge devient critique à son tour. Recalculez-le à chaque mise à jour du planning.",
            },
            { type: 'h2', text: 'Estimer sans se raconter d’histoires' },
            {
              type: 'list',
              items: [
                "Faire estimer par ceux qui feront le travail, pas par la hiérarchie.",
                "Estimer en fourchette (optimiste / probable / pessimiste) plutôt qu'en valeur unique — la fourchette révèle l'incertitude.",
                "Prévoir une provision pour aléas explicite et visible, plutôt que de gonfler secrètement chaque tâche.",
                "S'appuyer sur les données réelles des projets passés quand elles existent.",
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Le planning « à rebours » : partir de la date promise au client et compresser les durées jusqu'à ce que ça rentre. Le planning devient un document de communication, plus un outil de pilotage. Si la date imposée est incompatible avec l'estimation, c'est un arbitrage contenu/moyens à remonter au commanditaire — pas une case à maquiller.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Durée du projet = chemin critique, pas somme des tâches. Les marges guident les arbitrages. Estimations en fourchette, provisions explicites, et jamais de compression cosmétique.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-planifier',
        title: 'QCM — Organiser et planifier',
        questions: [
          {
            id: 'qcm-planifier-q1',
            prompt: 'Que garantit la « règle des 100 % » dans un WBS ?',
            choices: [
              'Que le projet sera livré à 100 % dans les délais',
              'Que chaque niveau de découpage couvre tout le travail du niveau supérieur, sans oubli ni doublon',
              'Que toutes les tâches sont affectées à 100 % à une ressource',
              'Que le budget est consommé intégralement',
            ],
            answer: 1,
            explanation:
              'La règle des 100 % est une règle de complétude du découpage : la somme des lots enfants représente exactement le travail du niveau parent. Elle ne dit rien des délais, des affectations ni du budget.',
          },
          {
            id: 'qcm-planifier-q2',
            prompt: 'Quelle est la bonne maille pour un lot de travail terminal ?',
            choices: [
              'Moins d’une heure, pour un suivi très fin',
              'Entre 1 et 10 jours d’effort, avec un responsable unique et un critère de fin vérifiable',
              'Au moins 60 jours, pour limiter le nombre de lots',
              'La maille n’a aucune importance',
            ],
            answer: 1,
            explanation:
              'La maille 1–10 jours permet un suivi régulier sans bureaucratie. Un responsable unique et une « définition de fini » rendent le lot pilotable.',
          },
          {
            id: 'qcm-planifier-q3',
            prompt: 'Une tâche du chemin critique prend 2 jours de retard. Quelle est la conséquence directe ?',
            choices: [
              'Aucune, sa marge absorbe le retard',
              'Le budget augmente automatiquement de 2 jours-homme',
              'La date de fin du projet recule de 2 jours, sauf action corrective',
              'Le périmètre du projet est réduit',
            ],
            answer: 2,
            explanation:
              'Par définition, les tâches du chemin critique n’ont aucune marge : tout retard se répercute intégralement sur la date de fin du projet.',
          },
          {
            id: 'qcm-planifier-q4',
            prompt: 'Pourquoi estimer les charges en fourchette (optimiste / probable / pessimiste) ?',
            choices: [
              'Pour rendre l’incertitude visible et en tenir compte dans le planning',
              'Pour pouvoir choisir systématiquement la valeur optimiste',
              'Parce que les outils de planification l’exigent',
              'Pour tripler le temps passé à estimer',
            ],
            answer: 0,
            explanation:
              'La fourchette exprime l’incertitude de l’estimation : un écart large signale un travail mal connu qui mérite d’être creusé ou provisionné. Une valeur unique donne une illusion de précision.',
          },
          {
            id: 'qcm-planifier-q5',
            prompt: 'La date exigée par le client est incompatible avec vos estimations. Que faites-vous ?',
            choices: [
              'Vous compressez les durées du planning jusqu’à atteindre la date',
              'Vous remontez l’arbitrage au commanditaire : réduire le contenu, ajouter des moyens ou décaler la date',
              'Vous acceptez la date et comptez sur les heures supplémentaires',
              'Vous supprimez la phase de tests pour gagner du temps',
            ],
            answer: 1,
            explanation:
              'Un écart entre exigence et estimation est un arbitrage du triangle contenu/délai/coût — il appartient au commanditaire. Compresser le planning sans changer les données du problème ne fait que masquer le risque.',
          },
        ],
      },
    },
    {
      id: 'piloter',
      title: "Piloter l'exécution",
      summary: "Suivre l'avancement réel, animer la comitologie et garder les parties prenantes alignées.",
      lessons: [
        {
          id: 'suivi-indicateurs',
          title: "Suivre l'avancement : indicateurs et reste-à-faire",
          duration: 25,
          kind: 'texte',
          intro:
            "« On est à 90 % » — depuis trois semaines. Cette leçon remplace l'avancement déclaratif par des mesures fiables, centrées sur le reste-à-faire.",
          blocks: [
            {
              type: 'p',
              text: "Le pilotage commence par une discipline : comparer régulièrement le réalisé au planifié, et surtout réestimer le reste-à-faire. Le pourcentage d'avancement déclaré (« j'en suis à 80 % ») est notoirement trompeur — les derniers 20 % concentrent les difficultés. La bonne question n'est pas « combien as-tu fait ? » mais « combien de jours te faut-il encore, sachant ce que tu sais aujourd'hui ? ».",
            },
            { type: 'h2', text: 'Trois indicateurs qui suffisent souvent' },
            {
              type: 'list',
              items: [
                "Avancement physique : nombre de lots terminés (au sens de la définition de fini) sur nombre de lots prévus à date. Un lot est fini ou ne l'est pas — pas de 80 %.",
                'Tenue des jalons : pour chaque jalon à venir, tendance (tenu / menacé / glissé) et cause.',
                'Consommation budgétaire rapprochée de l’avancement physique : consommer 60 % du budget pour 30 % du travail terminé est une alerte, même si la trésorerie « tient ».',
              ],
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Le tableau de bord utile tient sur une page : météo générale, 3 indicateurs, top 5 des risques, décisions attendues. Au-delà, plus personne ne le lit. Un bon test : si le commanditaire peut prendre une décision en 5 minutes avec votre tableau de bord, il est bon.",
            },
            {
              type: 'h2',
              text: 'Traiter les écarts, pas les constater',
            },
            {
              type: 'p',
              text: "Un indicateur qui vire à l'orange n'a de valeur que s'il déclenche une action : replanification, renfort, réduction de contenu négociée, escalade. Chaque écart significatif doit repartir du comité avec un propriétaire, une action et une échéance. Un tableau de bord sans décisions associées est un rituel décoratif.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Mesurer le fini (pas le déclaré), réestimer le reste-à-faire, rapprocher budget et avancement physique, et transformer chaque écart en action nommée et datée.",
            },
          ],
        },
        {
          id: 'parties-prenantes-comitologie',
          title: 'Parties prenantes et comitologie',
          duration: 25,
          kind: 'texte',
          intro:
            "Un projet techniquement réussi peut échouer parce que les bonnes personnes n'ont pas été embarquées. Cartographier les parties prenantes et régler la comitologie, c'est du pilotage à part entière.",
          blocks: [
            {
              type: 'p',
              text: "Une partie prenante mécontente ne bloque pas toujours un projet frontalement : elle ne vient plus aux réunions, retarde ses validations, mobilise ses équipes ailleurs. D'où l'intérêt de cartographier tôt : qui est impacté, qui a du pouvoir sur le projet, qui y est favorable ou hostile ? La matrice pouvoir/intérêt donne quatre postures : les acteurs à fort pouvoir et fort intérêt se gèrent en partenaires rapprochés ; ceux à fort pouvoir mais faible intérêt doivent être maintenus satisfaits ; les autres sont informés régulièrement ou simplement surveillés.",
            },
            { type: 'h2', text: 'Une comitologie simple et tenue' },
            {
              type: 'list',
              items: [
                "Point d'équipe hebdomadaire (30–45 min) : avancement, obstacles, reste-à-faire. Opérationnel, sans slides.",
                'Comité de projet (bimensuel ou mensuel) : revue des indicateurs, des risques et des demandes de modification avec les responsables métier.',
                'Comité de pilotage (mensuel ou trimestriel) : instance de décision avec le commanditaire — arbitrages, ressources, périmètre.',
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Le comité de pilotage transformé en revue de détail technique. Si le commanditaire passe 50 minutes sur l'architecture et 5 minutes sur les arbitrages, les décisions ne se prennent pas — et le projet ralentit. Préparez chaque comité avec les décisions attendues listées en première page.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Cartographier pouvoir × intérêt, adapter l'effort de communication à chaque quadrant, et tenir trois niveaux d'instances avec un ordre du jour orienté décisions.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-piloter',
        title: 'QCM — Piloter l’exécution',
        questions: [
          {
            id: 'qcm-piloter-q1',
            prompt: 'Pourquoi l’avancement déclaratif (« je suis à 80 % ») est-il trompeur ?',
            choices: [
              'Parce que les équipes mentent systématiquement',
              'Parce que les dernières étapes concentrent souvent les difficultés non anticipées',
              'Parce qu’il faut toujours diviser les déclarations par deux',
              'Parce que seul le budget mesure l’avancement',
            ],
            answer: 1,
            explanation:
              'Les « derniers 20 % » (intégration, corrections, validations) révèlent les problèmes accumulés. C’est pourquoi on mesure les lots réellement terminés et on réestime le reste-à-faire, plutôt que de collecter des pourcentages déclarés.',
          },
          {
            id: 'qcm-piloter-q2',
            prompt: 'Le projet a consommé 60 % du budget pour 30 % de lots terminés. Que conclure ?',
            choices: [
              'Tout va bien tant qu’il reste du budget',
              'C’est une alerte : au rythme actuel, le budget ne suffira pas pour finir le contenu prévu',
              'Il faut immédiatement arrêter le projet',
              'C’est normal en début de projet, inutile d’analyser',
            ],
            answer: 1,
            explanation:
              'Rapprocher consommation et avancement physique révèle la dérive : ici, le coût à terminaison projeté est le double du budget. Cela exige une analyse de cause et un arbitrage — pas nécessairement un arrêt, mais sûrement pas le silence.',
          },
          {
            id: 'qcm-piloter-q3',
            prompt: 'Dans la matrice pouvoir/intérêt, comment gérer un acteur à fort pouvoir mais faible intérêt pour le projet ?',
            choices: [
              'L’ignorer puisqu’il ne s’intéresse pas au projet',
              'Le maintenir satisfait, sans le noyer d’informations',
              'L’intégrer à l’équipe projet à plein temps',
              'Lui transférer la responsabilité du projet',
            ],
            answer: 1,
            explanation:
              'Un acteur puissant mais peu intéressé peut bloquer le projet s’il est contrarié. On le maintient satisfait par une communication ciblée de haut niveau, sans chercher à l’impliquer dans le quotidien.',
          },
          {
            id: 'qcm-piloter-q4',
            prompt: 'Quel est le rôle propre du comité de pilotage ?',
            choices: [
              'Passer en revue le détail technique des livrables',
              'Remplacer le point d’équipe hebdomadaire',
              'Prendre les décisions et arbitrages majeurs avec le commanditaire',
              'Rédiger le compte rendu des réunions d’équipe',
            ],
            answer: 2,
            explanation:
              'Le comité de pilotage est l’instance de décision : arbitrages de périmètre, de ressources et de calendrier. Le détail opérationnel se traite dans les instances d’équipe et de projet.',
          },
          {
            id: 'qcm-piloter-q5',
            prompt: 'Un indicateur de votre tableau de bord passe à l’orange. Quelle est la suite correcte ?',
            choices: [
              'Le signaler dans le compte rendu et attendre le mois suivant',
              'Le repasser au vert en ajustant la méthode de calcul',
              'Définir une action corrective avec un responsable et une échéance',
              'Retirer l’indicateur du tableau de bord',
            ],
            answer: 2,
            explanation:
              'Un indicateur n’a de valeur que s’il déclenche une décision : chaque écart significatif doit ressortir du comité avec un propriétaire, une action et une date. Le reste est de la décoration.',
          },
        ],
      },
    },
    {
      id: 'cloturer',
      title: 'Clôturer et capitaliser',
      summary: "Terminer proprement, mesurer le résultat réel et transformer l'expérience en actif pour les projets suivants.",
      lessons: [
        {
          id: 'cloture-rex',
          title: 'Clôture et retour d’expérience',
          duration: 20,
          kind: 'texte',
          intro:
            "Les projets ne meurent pas, ils s'évaporent — sauf si on les clôture vraiment. Cette leçon couvre la recette finale, le transfert aux opérations et le retour d'expérience qui fait progresser toute l'organisation.",
          blocks: [
            {
              type: 'p',
              text: "La clôture est une phase à part entière, pas une formalité. Elle comprend : la vérification que les livrables sont acceptés formellement (recette signée, réserves listées et traitées), le transfert vers les équipes qui feront vivre le résultat (documentation, formation, support), la libération des ressources et le solde administratif et financier du projet.",
            },
            { type: 'h2', text: 'Mesurer le résultat, pas seulement la livraison' },
            {
              type: 'p',
              text: "Livrer n'est pas réussir : l'objectif de la charte était un résultat (« réduire le délai de traitement de 10 à 3 jours »), pas un livrable (« installer le logiciel »). La mesure des bénéfices intervient souvent plusieurs semaines ou mois après la mise en service — planifiez ce rendez-vous dès la clôture, avec un responsable désigné, sinon il n'aura jamais lieu.",
            },
            { type: 'h2', text: 'Le retour d’expérience (REX)' },
            {
              type: 'list',
              items: [
                "Organiser l'atelier REX à chaud (dans le mois suivant la fin), avec l'équipe au complet.",
                "Interroger les faits : qu'est-ce qui était prévu, que s'est-il passé, pourquoi ?",
                'Chercher des causes, jamais des coupables — sinon plus personne ne parlera.',
                'Produire 5 à 10 enseignements actionnables, affectés à un propriétaire (méthode, outil, contrat type à modifier).',
                "Verser les données réelles (charges, durées, aléas) dans le référentiel d'estimation des prochains projets.",
              ],
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Les REX qui finissent en slide oubliée ont un point commun : des enseignements sans propriétaire. « Mieux impliquer le métier » n'est pas un enseignement ; « ajouter une revue métier obligatoire au jalon de conception, responsable : PMO » en est un.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: 'Clôturer = recette formelle + transfert aux opérations + solde + REX. Le succès se mesure sur le résultat obtenu, pas sur le livrable posé. Un enseignement sans propriétaire est un vœu pieux.',
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-cloturer',
        title: 'QCM — Clôturer et capitaliser',
        questions: [
          {
            id: 'qcm-cloturer-q1',
            prompt: 'Que comprend une clôture de projet complète ?',
            choices: [
              'Uniquement un pot de départ avec l’équipe',
              'Recette formelle, transfert aux opérations, solde administratif et retour d’expérience',
              'La suppression des documents du projet',
              'Le lancement immédiat du projet suivant',
            ],
            answer: 1,
            explanation:
              'La clôture est une phase à part entière : acceptation formelle des livrables, transfert (documentation, formation, support), libération des ressources, solde financier et REX.',
          },
          {
            id: 'qcm-cloturer-q2',
            prompt: 'Pourquoi la mesure des bénéfices doit-elle être planifiée dès la clôture ?',
            choices: [
              'Parce qu’elle intervient après la fin du projet et qu’elle n’aura pas lieu sans responsable désigné',
              'Parce que c’est une obligation légale',
              'Pour occuper l’équipe pendant la clôture',
              'Parce que les bénéfices sont toujours visibles le jour de la livraison',
            ],
            answer: 0,
            explanation:
              'Les bénéfices réels (gains de délai, économies, adoption) se constatent des semaines ou mois après la mise en service. Sans rendez-vous planifié et sans responsable, personne ne mesure — et l’organisation ne sait pas si le projet a réussi.',
          },
          {
            id: 'qcm-cloturer-q3',
            prompt: 'Quelle règle d’animation est essentielle pour un atelier de retour d’expérience ?',
            choices: [
              'Identifier les coupables des retards pour les sanctionner',
              'Ne convier que le chef de projet et le commanditaire',
              'Chercher des causes et non des coupables, pour libérer la parole',
              'Ne retenir que les points positifs',
            ],
            answer: 2,
            explanation:
              'Si le REX cherche des coupables, les participants se protègent et l’information disparaît. On analyse les faits et les causes pour produire des enseignements actionnables.',
          },
          {
            id: 'qcm-cloturer-q4',
            prompt: 'Lequel de ces énoncés est un enseignement REX correctement formulé ?',
            choices: [
              '« Il faut mieux communiquer »',
              '« Le projet était difficile »',
              '« Ajouter une revue métier obligatoire au jalon de conception — responsable : PMO »',
              '« L’équipe doit être plus motivée »',
            ],
            answer: 2,
            explanation:
              'Un enseignement utile est actionnable et affecté : une modification concrète d’une méthode ou d’un outil, avec un propriétaire. Les généralités (« mieux communiquer ») ne changent rien aux projets suivants.',
          },
        ],
      },
    },
  ],
};
