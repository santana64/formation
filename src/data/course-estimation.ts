import type { Course } from './types';

export const estimation: Course = {
  id: 'estimation-couts-rentabilite',
  title: 'Estimation des coûts et évaluation de la rentabilité',
  level: 'Expertise',
  presentiel: '3 à 5 jours',
  audience:
    'Chefs de projet, estimateurs, cost engineers, contrôleurs de gestion projet et décideurs appelés à valider des investissements.',
  pitch:
    "Produire une estimation défendable et savoir dire ce qu'elle vaut, puis évaluer la rentabilité d'un investissement par l'actualisation et la valeur actuelle nette.",
  objectives: [
    "Choisir la méthode d'estimation adaptée à la maturité du projet",
    "Constituer et exploiter une base de données de retours d'expérience",
    "Exprimer la précision d'une estimation et la faire évoluer avec le projet",
    'Calculer une valeur actuelle nette et un délai de récupération',
    'Comparer des variantes d’investissement sur des bases homogènes',
  ],
  prerequis:
    'Avoir suivi « Fondamentaux du management de projet ». Le parcours « Maîtrise des dépenses » constitue un complément naturel mais n’est pas exigé.',
  modules: [
    {
      id: 'methodes-estimation',
      title: "Les méthodes d'estimation",
      summary:
        "Estimer avec la méthode que la maturité du projet autorise — de l'analogie rapide au détaillé ascendant.",
      lessons: [
        {
          id: 'trois-familles',
          title: 'Trois familles de méthodes, trois moments du projet',
          duration: 30,
          kind: 'video',
          intro:
            "Estimer un projet dont on ne sait presque rien et estimer un projet entièrement spécifié ne relèvent pas des mêmes techniques. Cette leçon associe chaque méthode au moment où elle est légitime.",
          blocks: [
            {
              type: 'p',
              text: "L'erreur la plus coûteuse en estimation n'est pas de se tromper : c'est d'employer une méthode que la connaissance disponible ne justifie pas. Détailler ligne par ligne un projet dont le périmètre reste flou produit une précision apparente redoutable — le chiffre paraît solide parce qu'il est détaillé, alors qu'il repose sur des hypothèses inventées.",
            },
            { type: 'h2', text: "L'estimation par analogie" },
            {
              type: 'p',
              text: "On part d'un projet passé comparable et on ajuste. Rapide, peu coûteuse, elle est la seule possible en tout début de cycle, quand seul l'objectif est connu. Sa qualité dépend entièrement de la pertinence de la comparaison et de la richesse des données historiques : sans base de retours d'expérience, l'analogie se réduit à une intuition déguisée.",
            },
            { type: 'h2', text: "L'estimation paramétrique" },
            {
              type: 'p',
              text: "On établit une relation statistique entre une caractéristique mesurable du produit et son coût : coût au mètre carré, au point de fonction, à la tonne, au kilomètre de voie. Bien construite sur un historique suffisant, elle offre un bon compromis entre effort et fiabilité, et se prête aux analyses de sensibilité — que se passe-t-il si la surface augmente de 15 % ?",
            },
            { type: 'h2', text: "L'estimation détaillée ascendante" },
            {
              type: 'p',
              text: "On estime chaque lot du découpage, puis on agrège. C'est la méthode la plus précise, mais elle exige un périmètre stabilisé et représente un effort considérable. Elle intervient donc tard, pour figer le budget de référence, et non pour décider de lancer ou non le projet.",
            },
            {
              type: 'table',
              caption: 'Choisir sa méthode selon la maturité du projet',
              head: ['Moment', 'Connaissance disponible', 'Méthode', 'Précision typique'],
              rows: [
                ['Opportunité', 'Objectif et ordre de grandeur', 'Analogie', '− 30 % à + 50 %'],
                ['Faisabilité', 'Caractéristiques principales', 'Paramétrique', '− 20 % à + 30 %'],
                ['Conception', 'Solution définie', 'Paramétrique affinée ou mixte', '− 10 % à + 15 %'],
                ['Lancement', 'Périmètre figé, découpage complet', 'Détaillée ascendante', '− 5 % à + 10 %'],
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Communiquer une estimation d'opportunité comme s'il s'agissait d'un budget. Le chiffre annoncé en phase d'opportunité devient la référence dans toutes les têtes, et chaque affinage ultérieur sera perçu comme une dérive du projet — alors qu'il n'est qu'un gain de précision. Annoncez toujours une fourchette et sa méthode.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Analogie en amont, paramétrique au milieu, détaillée ascendante quand le périmètre est figé. La précision annoncée doit correspondre à la méthode employée — et une estimation se communique en fourchette, jamais en chiffre unique.",
            },
          ],
        },
        {
          id: 'base-de-donnees-precision',
          title: "Base de données de coûts et expression de la précision",
          duration: 25,
          kind: 'texte',
          intro:
            "Une estimation ne vaut que par les données qui la nourrissent et par l'honnêteté avec laquelle on annonce son incertitude. Deux chantiers qui font la différence entre un estimateur et un devineur.",
          blocks: [
            {
              type: 'p',
              text: "Toute méthode d'estimation, sauf la plus détaillée, s'appuie sur l'historique. Or la plupart des organisations perdent leurs données de projet à la clôture : les coûts réels ne sont pas rapprochés des estimations initiales, les écarts ne sont pas expliqués, et chaque nouveau projet réestime à partir de rien. Constituer une base de données de coûts est l'investissement le plus rentable d'une direction de projets — et le plus souvent différé.",
            },
            { type: 'h2', text: 'Ce qu’une base utile contient' },
            {
              type: 'list',
              items: [
                "Le coût réel final, décomposé sur une structure stable d'un projet à l'autre.",
                "Les caractéristiques physiques et fonctionnelles qui expliquent ce coût (les paramètres : surface, volume, complexité, effectif).",
                "Le contexte : secteur, année, conditions particulières — sans quoi les données ne sont pas comparables.",
                "L'écart avec l'estimation initiale et son explication, qui est l'information la plus précieuse et la plus rarement conservée.",
              ],
            },
            { type: 'h2', text: 'Dire ce que vaut son estimation' },
            {
              type: 'p',
              text: "Une estimation sans indication de précision est inexploitable pour décider. Deux formulations la rendent utilisable : la fourchette (« entre 4,2 et 5,8 M€ ») et le niveau de confiance associé à un montant. Un décideur peut alors arbitrer en connaissance de cause : retenir la valeur basse pour lancer un projet peu risqué, provisionner jusqu'à la valeur haute sur un investissement critique.",
            },
            {
              type: 'p',
              text: "Cette précision doit se resserrer à mesure que le projet avance — c'est le signe d'une démarche saine. Une estimation dont la fourchette ne bouge pas entre l'opportunité et le lancement indique que le travail d'affinage n'a pas été fait, ou que les données nécessaires n'ont jamais été collectées.",
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Constituer la base ne demande pas un outil dédié pour commencer : une feuille par projet clos, remplie à la clôture avec une dizaine de champs, suffit à créer un historique exploitable en deux ou trois ans. Ce qui manque n'est jamais l'outil, c'est la discipline de remplir la feuille au moment où plus personne n'a envie de s'occuper du projet terminé.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Une base de coûts conserve le réel, les paramètres explicatifs, le contexte et l'écart expliqué. Toute estimation s'accompagne d'une fourchette ; cette fourchette doit se resserrer au fil du projet, sinon l'affinage n'a pas eu lieu.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-methodes-estimation',
        title: "QCM — Les méthodes d'estimation",
        questions: [
          {
            id: 'qcm-methodes-estimation-q1',
            prompt: 'En phase d’opportunité, seul l’objectif du projet est connu. Quelle méthode employer ?',
            choices: [
              'L’estimation détaillée ascendante, pour être précis dès le départ',
              'L’estimation par analogie avec des projets passés comparables',
              'Aucune, il faut attendre la conception',
              'La moyenne des estimations de chaque membre du comité',
            ],
            answer: 1,
            explanation:
              'L’analogie est la seule méthode praticable quand la connaissance se limite à l’objectif. Le détaillé ascendant exigerait un découpage complet qui n’existe pas encore — et produirait une précision illusoire.',
          },
          {
            id: 'qcm-methodes-estimation-q2',
            prompt: 'Pourquoi détailler ligne par ligne un projet au périmètre encore flou est-il dangereux ?',
            choices: [
              'Parce que cela prend du temps',
              'Parce que le chiffre paraît solide du fait de son détail, alors qu’il repose sur des hypothèses inventées',
              'Parce que les outils ne le permettent pas',
              'Parce que le résultat est toujours trop bas',
            ],
            answer: 1,
            explanation:
              'Le détail crée une précision apparente : le lecteur accorde au chiffre une confiance que la connaissance disponible ne justifie pas. La méthode doit rester en rapport avec la maturité réelle du projet.',
          },
          {
            id: 'qcm-methodes-estimation-q3',
            prompt: 'Sur quoi repose une estimation paramétrique ?',
            choices: [
              'Sur l’avis d’un expert unique',
              'Sur une relation établie entre une caractéristique mesurable du produit et son coût',
              'Sur le budget disponible',
              'Sur le nombre de personnes dans l’équipe projet',
            ],
            answer: 1,
            explanation:
              'Coût au mètre carré, à la tonne, au point de fonction : la paramétrique relie une grandeur physique ou fonctionnelle au coût, à partir d’un historique. Elle permet en outre des analyses de sensibilité.',
          },
          {
            id: 'qcm-methodes-estimation-q4',
            prompt: 'Quelle information d’une base de données de coûts est la plus précieuse et la plus souvent perdue ?',
            choices: [
              'Le nom du chef de projet',
              'L’écart entre estimation initiale et coût réel, accompagné de son explication',
              'La date de début du projet',
              'Le nombre de réunions tenues',
            ],
            answer: 1,
            explanation:
              'L’écart expliqué est ce qui permet de corriger les biais d’estimation de l’organisation. C’est aussi ce que personne n’a envie de documenter à la clôture, quand l’équipe est déjà passée au projet suivant.',
          },
          {
            id: 'qcm-methodes-estimation-q5',
            prompt: 'La fourchette d’une estimation reste identique entre l’opportunité et le lancement. Qu’en conclure ?',
            choices: [
              'L’estimation initiale était excellente',
              'Le travail d’affinage n’a pas été fait ou les données nécessaires n’ont pas été collectées',
              'Le projet est peu risqué',
              'C’est le comportement normal d’une estimation',
            ],
            answer: 1,
            explanation:
              'La précision doit se resserrer avec la connaissance acquise. Une fourchette figée signale que l’estimation n’a pas été retravaillée à mesure que le périmètre se précisait.',
          },
        ],
      },
    },
    {
      id: 'rentabilite',
      title: 'Évaluer la rentabilité',
      summary:
        "Comparer des flux financiers étalés dans le temps et décider si l'investissement mérite d'être engagé.",
      lessons: [
        {
          id: 'actualisation-van',
          title: 'Actualisation et valeur actuelle nette',
          duration: 30,
          kind: 'texte',
          intro:
            "Un euro encaissé dans cinq ans ne vaut pas un euro dépensé aujourd'hui. L'actualisation traduit cette évidence en calcul, et la valeur actuelle nette en critère de décision.",
          blocks: [
            {
              type: 'p',
              text: "Un projet d'investissement se traduit par une dépense immédiate et des gains étalés sur plusieurs années. Comparer directement ces montants n'a pas de sens : l'argent disponible aujourd'hui peut être placé, il porte un risque moindre, et l'inflation érode les montants futurs. L'actualisation ramène tous les flux à leur valeur d'aujourd'hui pour les rendre comparables.",
            },
            {
              type: 'definition',
              term: 'Valeur actuelle nette (VAN)',
              text: "Somme de tous les flux de trésorerie du projet, ramenés à leur valeur d'aujourd'hui par un taux d'actualisation. Une VAN positive signifie que le projet crée de la valeur au-delà de l'exigence de rentabilité représentée par ce taux.",
            },
            {
              type: 'p',
              text: "Le mécanisme est simple : un flux perçu dans n années est divisé par (1 + t) puissance n, où t est le taux d'actualisation. À 8 %, 100 k€ perçus dans trois ans valent aujourd'hui environ 79 k€. Plus le gain est lointain, plus il est déprécié — ce qui pénalise mécaniquement les projets à retour tardif, et c'est précisément l'effet recherché.",
            },
            {
              type: 'table',
              caption: 'Exemple : investissement de 300 k€, gains sur quatre ans, taux 8 %',
              head: ['Année', 'Flux', 'Coefficient', 'Valeur actualisée'],
              rows: [
                ['0', '− 300 k€', '1,000', '− 300 k€'],
                ['1', '+ 90 k€', '0,926', '+ 83 k€'],
                ['2', '+ 120 k€', '0,857', '+ 103 k€'],
                ['3', '+ 130 k€', '0,794', '+ 103 k€'],
                ['4', '+ 110 k€', '0,735', '+ 81 k€'],
                ['VAN', '—', '—', '+ 70 k€'],
              ],
            },
            {
              type: 'p',
              text: "Ici, la somme brute des gains atteint 450 k€ pour 300 k€ investis, ce qui paraît confortable ; après actualisation, la création de valeur se réduit à 70 k€. Le projet reste rentable — la VAN est positive — mais la marge est bien plus étroite que ne le suggérait la lecture immédiate. C'est exactement le service que rend le calcul.",
            },
            { type: 'h2', text: 'Le choix du taux' },
            {
              type: 'p',
              text: "Le taux d'actualisation traduit l'exigence de rentabilité de l'organisation et le risque du projet : coût du capital pour une entreprise, taux de référence pour un investissement public, majoré lorsque le projet est risqué. Il n'appartient pas au chef de projet de le fixer, mais il doit savoir qu'un écart de deux points suffit à inverser la conclusion sur un projet marginal — d'où l'intérêt de présenter systématiquement la VAN à plusieurs taux.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "L'actualisation ramène les flux futurs à aujourd'hui : flux ÷ (1 + t)ⁿ. Une VAN positive signale une création de valeur au-delà de l'exigence portée par le taux. Présenter la VAN à plusieurs taux, car la conclusion peut s'inverser.",
            },
          ],
        },
        {
          id: 'criteres-decision',
          title: 'Délai de récupération, sensibilité et décision',
          duration: 25,
          kind: 'texte',
          intro:
            "La VAN ne suffit pas à décider seule. Cette leçon complète la panoplie avec le délai de récupération, l'analyse de sensibilité et les critères que le calcul ne capture jamais.",
          blocks: [
            {
              type: 'p',
              text: "La VAN dit si le projet crée de la valeur, pas quand l'organisation récupère sa mise. Le délai de récupération — la date à laquelle le cumul des flux actualisés redevient positif — répond à cette seconde question. Il intéresse particulièrement les organisations contraintes en trésorerie ou opérant dans un environnement instable, où un retour à sept ans est difficilement défendable même avec une VAN excellente.",
            },
            { type: 'h2', text: 'Tester la robustesse' },
            {
              type: 'p',
              text: "Une évaluation repose sur des hypothèses : volume d'activité, prix, gains de productivité, durée de vie de la solution. L'analyse de sensibilité consiste à faire varier chacune d'elles pour repérer celles qui font basculer la décision. Si une baisse de 10 % du gain annuel annule la VAN, le projet n'est pas rentable : il est fragile, et cette fragilité doit être présentée comme telle au décideur.",
            },
            {
              type: 'list',
              items: [
                'Faire varier une hypothèse à la fois pour identifier les variables critiques.',
                'Construire trois scénarios cohérents — prudent, attendu, favorable — plutôt qu’un cas unique.',
                'Chercher le point de bascule : à partir de quel niveau de gain le projet cesse-t-il d’être rentable ?',
              ],
            },
            { type: 'h2', text: 'Ce que le calcul ne dit pas' },
            {
              type: 'p',
              text: "Beaucoup de projets se justifient par des effets que la VAN capture mal ou pas : conformité réglementaire, sécurité des personnes, dette technique évitée, positionnement stratégique, image. Les traiter en les chiffrant artificiellement décrédibilise l'analyse ; les taire prive le décideur d'éléments essentiels. La pratique la plus solide consiste à présenter séparément l'évaluation financière et les critères non monétaires, en assumant que l'arbitrage final combine les deux.",
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "L'étude de rentabilité construite pour justifier une décision déjà prise. On ajuste les hypothèses de gains jusqu'à obtenir une VAN présentable, et le document devient un exercice de conviction. Le signe qui ne trompe pas : aucune analyse de sensibilité, ou une sensibilité qui ne teste que des variations favorables.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Compléter la VAN par le délai de récupération et par une analyse de sensibilité qui cherche le point de bascule. Présenter séparément les critères non monétaires plutôt que de les chiffrer artificiellement.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-rentabilite',
        title: 'QCM — Évaluer la rentabilité',
        questions: [
          {
            id: 'qcm-rentabilite-q1',
            prompt: 'Pourquoi actualiser les flux futurs d’un projet ?',
            choices: [
              'Pour tenir compte de l’inflation uniquement',
              'Parce qu’un montant disponible aujourd’hui n’a pas la même valeur qu’un montant perçu dans plusieurs années',
              'Pour rendre le calcul plus complexe et plus rigoureux',
              'Parce que la comptabilité l’impose',
            ],
            answer: 1,
            explanation:
              'L’argent disponible aujourd’hui peut être placé, porte moins de risque et n’a pas subi l’érosion monétaire. L’actualisation ramène tous les flux à une même date pour les rendre comparables.',
          },
          {
            id: 'qcm-rentabilite-q2',
            prompt: 'Que signifie une VAN positive ?',
            choices: [
              'Le projet sera livré dans les délais',
              'Le projet crée de la valeur au-delà de l’exigence de rentabilité portée par le taux d’actualisation',
              'Le projet ne présente aucun risque',
              'Les gains bruts dépassent l’investissement initial',
            ],
            answer: 1,
            explanation:
              'La VAN compare les flux actualisés à l’investissement : positive, elle indique que le projet rapporte davantage que l’exigence de rentabilité représentée par le taux. Des gains bruts supérieurs à l’investissement ne suffisent pas à le garantir.',
          },
          {
            id: 'qcm-rentabilite-q3',
            prompt: 'Un investissement de 300 k€ rapporte 450 k€ bruts sur quatre ans. Après actualisation à 8 %, la VAN tombe à 70 k€. Comment interpréter ?',
            choices: [
              'Le calcul est erroné, la VAN devrait être de 150 k€',
              'Le projet reste rentable, mais avec une marge nettement plus étroite que ne le suggérait la lecture brute',
              'Le projet est déficitaire',
              'L’actualisation ne s’applique pas à ce type de projet',
            ],
            answer: 1,
            explanation:
              'L’actualisation déprécie les gains lointains. La VAN reste positive — le projet crée de la valeur — mais la marge réelle est bien inférieure à ce que laissait croire la différence brute de 150 k€.',
          },
          {
            id: 'qcm-rentabilite-q4',
            prompt: 'Une baisse de 10 % du gain annuel annule la VAN. Que conclure ?',
            choices: [
              'Le projet est très rentable',
              'Le projet est fragile : sa rentabilité dépend d’une hypothèse peu robuste, ce qui doit être présenté au décideur',
              'Il faut augmenter le taux d’actualisation',
              'Il faut refaire l’estimation des coûts',
            ],
            answer: 1,
            explanation:
              'L’analyse de sensibilité sert exactement à cela : identifier les hypothèses qui font basculer la décision. Une rentabilité qui disparaît avec 10 % d’écart doit être annoncée comme fragile, pas présentée comme acquise.',
          },
          {
            id: 'qcm-rentabilite-q5',
            prompt: 'Comment traiter les bénéfices non monétaires (conformité, sécurité, image) ?',
            choices: [
              'Les chiffrer artificiellement pour les intégrer à la VAN',
              'Les passer sous silence puisqu’ils ne sont pas calculables',
              'Les présenter séparément de l’évaluation financière, en assumant que l’arbitrage combine les deux',
              'Les convertir en années de délai de récupération',
            ],
            answer: 2,
            explanation:
              'Les chiffrer artificiellement décrédibilise l’analyse ; les taire prive le décideur d’éléments souvent déterminants. La présentation séparée préserve la rigueur du calcul et l’intégralité de l’information.',
          },
          {
            id: 'qcm-rentabilite-q6',
            prompt: 'Quel signe trahit une étude de rentabilité construite pour justifier une décision déjà prise ?',
            choices: [
              'La présence de trois scénarios cohérents',
              'L’absence d’analyse de sensibilité, ou une sensibilité ne testant que des variations favorables',
              'Un taux d’actualisation élevé',
              'Un délai de récupération inférieur à trois ans',
            ],
            answer: 1,
            explanation:
              'Une étude sincère cherche le point de bascule et teste ce qui pourrait invalider la conclusion. Une étude d’opportunité politique évite soigneusement ces tests.',
          },
        ],
      },
    },
  ],
};
