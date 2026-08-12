import type { Course } from './types';

export const depenses: Course = {
  id: 'maitrise-des-depenses',
  title: 'Maîtrise des dépenses : budget, valeur acquise et reste à faire',
  level: 'Perfectionnement',
  presentiel: '3 à 5 jours',
  audience:
    'Chefs de projet, contrôleurs de projet, cost engineers, responsables de lots et PMO en charge du suivi budgétaire.',
  pitch:
    "Savoir à tout moment où en est réellement votre budget : construire une référence solide, mesurer l'avancement par la valeur acquise et projeter le coût à terminaison sans se mentir.",
  objectives: [
    'Construire un budget de projet structuré et une référence de mesure (baseline)',
    'Distinguer engagé, facturé, comptabilisé et encouru — et savoir lequel utiliser',
    'Calculer et interpréter les écarts de coût et de délai par la valeur acquise',
    'Projeter un coût et une date à terminaison défendables devant un comité',
    'Piloter par le reste-à-faire plutôt que par le consommé',
  ],
  prerequis:
    'Avoir suivi « Fondamentaux du management de projet » ou piloter un projet doté d’un budget. Aucune compétence comptable n’est requise.',
  modules: [
    {
      id: 'budget-reference',
      title: 'Construire le budget et sa référence',
      summary:
        "Passer de l'estimation au budget opérationnel, puis figer une référence contre laquelle tout sera mesuré.",
      lessons: [
        {
          id: 'de-lestimation-au-budget',
          title: "De l'estimation au budget : structurer pour pouvoir mesurer",
          duration: 25,
          kind: 'texte',
          intro:
            "Un budget n'est pas un montant, c'est une structure. Cette leçon montre comment organiser l'argent du projet pour qu'il devienne mesurable, et non simplement dépensable.",
          blocks: [
            {
              type: 'p',
              text: "Beaucoup de projets disposent d'une enveloppe globale — « 1,2 million » — et d'aucun moyen de savoir, six mois plus tard, si elle sera tenue. La raison est simple : un montant unique ne se compare à rien. Pour piloter, il faut répartir le budget sur la même structure que le travail, c'est-à-dire sur le découpage (WBS) : chaque lot de travail porte sa part de budget, et devient l'unité élémentaire de mesure.",
            },
            {
              type: 'definition',
              term: 'Compte de contrôle',
              text: "Point du découpage où l'on rapproche le contenu, le planning et le budget pour mesurer la performance. C'est le niveau auquel on suit réellement le projet — ni trop fin (ingérable), ni trop global (aveugle).",
            },
            {
              type: 'p',
              text: "Le choix du niveau de contrôle est un arbitrage : trop fin, la mise à jour coûte plus cher que l'information qu'elle produit ; trop global, on découvre les dérives trop tard. En pratique, on vise quelques dizaines de comptes de contrôle sur un projet de taille moyenne, chacun avec un responsable identifié qui répond de la performance de son périmètre.",
            },
            { type: 'h2', text: 'Répartir dans le temps' },
            {
              type: 'p',
              text: "Un budget n'est pas seulement réparti par lot, il l'est aussi dans le temps : à chaque période, on sait ce qui devait être dépensé. Cette courbe cumulée — souvent appelée courbe en S à cause de sa forme, lente au démarrage, rapide au milieu, lente à la fin — constitue la référence. Sans elle, comparer le consommé à quoi que ce soit est impossible : dépenser 400 k€ au bout de six mois n'est ni bon ni mauvais tant qu'on ne sait pas ce qui était prévu à cette date.",
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "La référence que l'on modifie discrètement pour rattraper les écarts. Une référence qui bouge chaque mois ne mesure plus rien. Elle ne doit évoluer que par une modification formellement approuvée — évolution de périmètre, mobilisation de provision — et chaque révision doit être tracée et datée.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Le budget se structure sur le découpage du travail et se répartit dans le temps pour former une référence. Les comptes de contrôle sont les points de mesure, chacun avec un responsable. La référence ne se modifie que formellement.",
            },
          ],
        },
        {
          id: 'engage-facture-encouru',
          title: 'Engagé, facturé, comptabilisé, encouru : ne pas confondre',
          duration: 25,
          kind: 'texte',
          intro:
            "La question « combien avons-nous dépensé ? » a quatre réponses différentes, toutes exactes. Confondre ces notions est la première cause de pilotage budgétaire erroné.",
          blocks: [
            {
              type: 'p',
              text: "Entre le moment où le projet décide une dépense et celui où elle apparaît dans la comptabilité, plusieurs mois peuvent s'écouler. Piloter avec la mauvaise notion, c'est piloter avec un décalage — et découvrir des dépassements largement constitués.",
            },
            {
              type: 'table',
              caption: 'Quatre lectures d’une même dépense',
              head: ['Notion', 'Ce qu’elle mesure', 'Usage principal'],
              rows: [
                [
                  'Engagé',
                  'La commande est passée : l’argent n’est plus disponible pour autre chose',
                  'Anticiper la consommation, éviter de réengager une enveloppe déjà utilisée',
                ],
                [
                  'Encouru (ou constaté)',
                  'Le travail a été réalisé, que la facture soit arrivée ou non',
                  'Mesurer la performance réelle du projet — c’est la notion du pilotage',
                ],
                [
                  'Facturé',
                  'Le fournisseur a émis sa facture',
                  'Suivi fournisseur et trésorerie',
                ],
                [
                  'Comptabilisé (décaissé)',
                  'La dépense est enregistrée et payée',
                  'Comptabilité et trésorerie, rarement le pilotage projet',
                ],
              ],
            },
            {
              type: 'p',
              text: "Le pilotage de projet se fait sur l'encouru : ce qui compte est le travail effectivement réalisé et donc la ressource consommée, indépendamment du calendrier administratif des factures. Un prestataire ayant travaillé trois semaines a coûté trois semaines, même si sa facture arrivera dans deux mois. Ignorer cela produit l'illusion la plus fréquente du suivi budgétaire : un projet qui paraît sous-consommé jusqu'au jour où toutes les factures tombent.",
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Demandez systématiquement à vos fournisseurs une déclaration mensuelle du travail réalisé, indépendante de leur facturation. C'est souvent la seule façon d'obtenir l'encouru dans les délais du pilotage, et cela coûte beaucoup moins cher qu'une découverte tardive.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Engagé anticipe, encouru mesure la performance, facturé et comptabilisé servent la trésorerie. Le pilotage projet se fait sur l'encouru — sinon on découvre les dépassements avec le décalage des factures.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-budget-reference',
        title: 'QCM — Budget et référence',
        questions: [
          {
            id: 'q1',
            prompt: 'Pourquoi répartir le budget sur le découpage du travail (WBS) ?',
            choices: [
              'Pour respecter une obligation comptable',
              'Pour que chaque lot devienne une unité de mesure comparable au prévu',
              'Pour augmenter le montant total disponible',
              'Pour éviter d’avoir à faire un planning',
            ],
            answer: 1,
            explanation:
              'Un montant global ne se compare à rien. En répartissant le budget sur les lots de travail, chaque élément porte sa part et devient mesurable — c’est la condition de tout suivi de performance.',
          },
          {
            id: 'q2',
            prompt: 'Qu’est-ce que la courbe en S d’un projet ?',
            choices: [
              'La courbe des risques identifiés au fil du temps',
              'La répartition cumulée du budget prévu dans le temps, qui sert de référence de mesure',
              'La courbe de satisfaction des utilisateurs',
              'Le graphique des effectifs affectés au projet',
            ],
            answer: 1,
            explanation:
              'La courbe cumulée du budget prévu — lente au démarrage, rapide au milieu, lente en fin — est la référence contre laquelle on compare le réalisé. Sans elle, un montant consommé n’est ni bon ni mauvais.',
          },
          {
            id: 'q3',
            prompt: 'Sur quelle notion de dépense pilote-t-on la performance d’un projet ?',
            choices: ['L’engagé', 'Le facturé', 'L’encouru', 'Le décaissé'],
            answer: 2,
            explanation:
              'L’encouru correspond au travail effectivement réalisé, indépendamment du calendrier des factures. C’est la seule notion qui reflète la performance du projet au moment où on la mesure.',
          },
          {
            id: 'q4',
            prompt: 'Un projet paraît nettement sous-consommé depuis quatre mois. Quelle hypothèse vérifier en premier ?',
            choices: [
              'Que l’équipe travaille bien plus vite que prévu',
              'Que le suivi se fait sur le facturé, et que du travail réalisé n’est pas encore encouru',
              'Que le budget initial était trop élevé',
              'Que les fournisseurs ont abandonné le projet',
            ],
            answer: 1,
            explanation:
              'C’est l’illusion la plus fréquente du suivi budgétaire : les factures arrivent avec plusieurs semaines ou mois de retard, et le projet semble économe jusqu’à ce que tout tombe d’un coup. On la lève en collectant le travail réalisé, pas les factures.',
          },
          {
            id: 'q5',
            prompt: 'Que faire lorsqu’un écart important apparaît par rapport à la référence budgétaire ?',
            choices: [
              'Ajuster la référence pour supprimer l’écart',
              'Analyser la cause et, si le périmètre change, réviser la référence par une modification formellement approuvée et tracée',
              'Attendre la fin du projet pour analyser',
              'Répartir l’écart sur les lots non encore démarrés',
            ],
            answer: 1,
            explanation:
              'Une référence qu’on ajuste pour faire disparaître les écarts ne mesure plus rien. Elle n’évolue que par une décision formelle (évolution de périmètre, mobilisation de provision), tracée et datée.',
          },
        ],
      },
    },
    {
      id: 'valeur-acquise',
      title: 'La valeur acquise',
      summary:
        "La méthode qui répond enfin à « où en sommes-nous vraiment ? » en croisant travail réalisé, budget et planning.",
      lessons: [
        {
          id: 'principe-valeur-acquise',
          title: 'Le principe : trois courbes, deux écarts',
          duration: 30,
          kind: 'video',
          intro:
            "La valeur acquise est la seule méthode qui mesure simultanément l'avancement physique, la performance de coût et la performance de délai. Son principe tient en trois grandeurs.",
          blocks: [
            {
              type: 'p',
              text: "Comparer le consommé au prévu ne dit rien : un projet qui a dépensé moins que prévu peut simplement avoir pris du retard. Il manque une troisième information — combien de travail a réellement été accompli. La valeur acquise l'apporte en valorisant l'avancement physique au budget initial.",
            },
            {
              type: 'definition',
              term: 'Valeur acquise (VA)',
              text: "Budget initialement prévu pour le travail effectivement réalisé à ce jour. Si un lot budgété 100 k€ est terminé à moitié, sa valeur acquise est de 50 k€ — quel que soit le montant réellement dépensé pour l'obtenir.",
            },
            { type: 'h2', text: 'Trois grandeurs' },
            {
              type: 'list',
              items: [
                'Valeur planifiée (VP) : le budget qui devait être consommé à cette date, lu sur la référence.',
                'Valeur acquise (VA) : le budget correspondant au travail réellement accompli.',
                'Coût réel (CR) : ce qui a effectivement été encouru pour accomplir ce travail.',
              ],
            },
            {
              type: 'p',
              text: "De ces trois grandeurs découlent deux écarts d'une clarté redoutable. L'écart de coût vaut VA − CR : positif, le travail accompli a coûté moins que prévu ; négatif, il a coûté davantage. L'écart de délai vaut VA − VP : positif, on a produit plus que prévu à cette date ; négatif, on est en retard. En une lecture, on sait si le problème est un problème d'argent, de rythme, ou des deux.",
            },
            {
              type: 'table',
              caption: 'Exemple : projet budgété 500 k€, mesuré au sixième mois',
              head: ['Grandeur', 'Valeur', 'Lecture'],
              rows: [
                ['Valeur planifiée (VP)', '200 k€', 'On devait avoir produit pour 200 k€'],
                ['Valeur acquise (VA)', '160 k€', 'On a réellement produit pour 160 k€'],
                ['Coût réel (CR)', '210 k€', 'Ce travail a coûté 210 k€'],
                ['Écart de coût (VA − CR)', '− 50 k€', 'Surcoût : on paie 210 ce qui en valait 160'],
                ['Écart de délai (VA − VP)', '− 40 k€', 'Retard : il manque 40 k€ de production'],
              ],
            },
            {
              type: 'p',
              text: "Cet exemple décrit un projet à la fois en retard et en dépassement — situation qu'un simple suivi budgétaire aurait masquée, puisque le consommé (210 k€) paraissait proche du prévu (200 k€). C'est exactement l'intérêt de la méthode : elle rend visible ce que la comparaison prévu/consommé dissimule.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Trois grandeurs (VP, VA, CR), deux écarts : coût = VA − CR, délai = VA − VP. La valeur acquise valorise le travail accompli au budget prévu, ce qui permet de séparer un problème de rythme d'un problème de coût.",
            },
          ],
        },
        {
          id: 'indices-projection',
          title: 'Indices de performance et coût à terminaison',
          duration: 30,
          kind: 'texte',
          intro:
            "Constater un écart est utile ; projeter la fin l'est davantage. Cette leçon transforme les écarts en indices, puis les indices en prévision d'atterrissage défendable.",
          blocks: [
            {
              type: 'p',
              text: "Les écarts en euros dépendent de la taille du projet ; les indices, eux, sont comparables d'un projet à l'autre et d'un mois à l'autre. L'indice de performance des coûts (IPC) vaut VA ÷ CR : au-dessus de 1, on produit plus de valeur qu'on ne dépense ; en dessous, l'inverse. L'indice de performance des délais (IPD) vaut VA ÷ VP, sur le même principe.",
            },
            {
              type: 'p',
              text: "Sur l'exemple précédent, l'IPC vaut 160 ÷ 210 ≈ 0,76 et l'IPD 160 ÷ 200 = 0,80. Autrement dit, chaque euro dépensé ne produit que 76 centimes de valeur prévue. Cette lecture est brutale, et c'est sa vertu : elle interdit les discours rassurants.",
            },
            { type: 'h2', text: 'Projeter le coût à terminaison' },
            {
              type: 'p',
              text: "La projection la plus courante suppose que la performance observée se poursuivra : coût à terminaison = budget total ÷ IPC. Sur un projet budgété 500 k€ avec un IPC de 0,76, l'atterrissage se situe autour de 658 k€, soit un dépassement prévisible de plus de 30 %. Cette hypothèse est pessimiste si la cause de la dérive est ponctuelle et traitée ; elle est réaliste si la cause est structurelle — une sous-estimation initiale, par exemple, qui continuera de produire ses effets.",
            },
            {
              type: 'list',
              items: [
                "Dérive ponctuelle et corrigée : projeter le reste-à-faire au budget prévu — le dépassement reste limité à l'écart déjà constaté.",
                'Dérive structurelle : projeter le reste-à-faire à la performance observée (division par l’IPC).',
                "Doute : présenter les deux scénarios au comité. Une fourchette argumentée vaut mieux qu'un chiffre unique arbitraire.",
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Réestimer le reste-à-faire en conservant les hypothèses qui ont déjà été démenties. Si les six premiers mois ont coûté 30 % de plus que prévu pour des raisons qui n'ont pas disparu, annoncer que les six suivants tiendront le budget initial n'est pas une prévision : c'est un espoir. Les comités finissent toujours par s'en apercevoir, et la crédibilité du chef de projet ne s'en remet pas.",
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "La valeur acquise n'exige pas un outil coûteux : un tableur et une mesure honnête de l'avancement physique suffisent à démarrer. En revanche elle exige une définition de fini rigoureuse par lot — sans cela, l'avancement déclaré gonfle et tous les indices deviennent faux.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "IPC = VA ÷ CR, IPD = VA ÷ VP. Coût à terminaison ≈ budget ÷ IPC quand la dérive est structurelle. Choisir l'hypothèse de projection en fonction de la cause, et présenter une fourchette argumentée plutôt qu'un chiffre unique.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-valeur-acquise',
        title: 'QCM — La valeur acquise',
        questions: [
          {
            id: 'q1',
            prompt: 'Un lot budgété 100 k€ est réalisé à 50 %. Sa valeur acquise est de…',
            choices: ['100 k€', '50 k€', 'le montant réellement dépensé', '0 k€ tant qu’il n’est pas terminé'],
            answer: 1,
            explanation:
              'La valeur acquise valorise le travail accompli au budget initialement prévu : 50 % de 100 k€ = 50 k€, indépendamment de ce que ce travail a réellement coûté.',
          },
          {
            id: 'q2',
            prompt: 'VA = 160 k€, CR = 210 k€, VP = 200 k€. Comment se porte le projet ?',
            choices: [
              'En avance et en économie',
              'À l’heure et dans le budget',
              'En retard et en dépassement',
              'En avance mais en dépassement',
            ],
            answer: 2,
            explanation:
              'Écart de coût = VA − CR = − 50 k€ (dépassement) ; écart de délai = VA − VP = − 40 k€ (retard). Un suivi limité au consommé (210 contre 200 prévus) aurait laissé croire à une situation presque normale.',
          },
          {
            id: 'q3',
            prompt: 'Que signifie un IPC de 0,76 ?',
            choices: [
              'Le projet est réalisé à 76 %',
              'Chaque euro dépensé ne produit que 76 centimes de la valeur prévue',
              'Il reste 76 % du budget',
              'Le projet a 24 % d’avance',
            ],
            answer: 1,
            explanation:
              'L’indice de performance des coûts (VA ÷ CR) exprime le rendement de la dépense. À 0,76, la production de valeur est inférieure d’un quart à la dépense engagée.',
          },
          {
            id: 'q4',
            prompt: 'Projet budgété 500 k€, IPC de 0,80 et dérive structurelle. Quel coût à terminaison projeter ?',
            choices: ['400 k€', '500 k€', 'environ 625 k€', 'environ 540 k€'],
            answer: 2,
            explanation:
              'Quand la cause de la dérive persiste, on projette le reste-à-faire à la performance observée : 500 ÷ 0,80 = 625 k€. Si la dérive était ponctuelle et traitée, on projetterait le reste au budget prévu.',
          },
          {
            id: 'q5',
            prompt: 'Quelle condition rend les indices de valeur acquise fiables ?',
            choices: [
              'Disposer d’un logiciel spécialisé',
              'Une définition de fini rigoureuse par lot, faute de quoi l’avancement déclaré gonfle',
              'Un budget supérieur à un million d’euros',
              'Une équipe d’au moins dix personnes',
            ],
            answer: 1,
            explanation:
              'Toute la méthode repose sur la mesure de l’avancement physique. Si « fini » n’est pas défini strictement, l’avancement est surestimé, la valeur acquise gonfle et les indices deviennent faux — un tableur suffit, mais pas une mesure complaisante.',
          },
        ],
      },
    },
    {
      id: 'reste-a-faire',
      title: 'Piloter par le reste-à-faire',
      summary:
        "Réorienter le pilotage vers la seule question qui engage l'avenir : que reste-t-il à faire, et à quel coût ?",
      lessons: [
        {
          id: 'logique-reste-a-faire',
          title: 'Du consommé au reste-à-faire',
          duration: 25,
          kind: 'texte',
          intro:
            "Le passé est un coût irrécupérable ; seul le reste-à-faire est actionnable. Cette leçon installe le réflexe qui distingue les projets pilotés des projets subis.",
          blocks: [
            {
              type: 'p',
              text: "Un comité qui passe une heure à commenter le consommé du trimestre écoulé n'a rien décidé : cet argent est dépensé. La question qui engage l'organisation est autre — compte tenu de ce que nous savons aujourd'hui, combien faut-il encore pour terminer, et sommes-nous toujours prêts à le payer au regard des bénéfices attendus ?",
            },
            {
              type: 'definition',
              term: 'Reste-à-faire',
              text: "Estimation, à la date d'analyse, du coût et de la charge nécessaires pour achever le travail restant — réévaluée à partir de la connaissance acquise, et non déduite mécaniquement du budget initial moins le consommé.",
            },
            {
              type: 'p',
              text: "La nuance est capitale. Le reste-à-faire calculé par soustraction (budget − consommé) ne contient aucune information nouvelle : il suppose que le budget initial reste valable, alors même que l'expérience du projet a démontré le contraire. Le reste-à-faire réestimé, lui, intègre ce qu'on a appris — la complexité découverte, la productivité réelle de l'équipe, les reprises nécessaires.",
            },
            { type: 'h2', text: 'Une réestimation qui ne coûte pas cher' },
            {
              type: 'list',
              ordered: true,
              items: [
                "Ne réestimer que les lots non terminés : les lots achevés ne bougent plus.",
                'Interroger les responsables de lots sur le reste, jamais sur le pourcentage accompli.',
                "Rapprocher la réponse de la performance observée : un responsable qui annonce un reste conforme au budget alors que son IPC est à 0,7 doit expliquer ce qui a changé.",
                "Consolider, comparer au budget disponible, et remonter l'écart si le seuil convenu est dépassé.",
              ],
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Changez la question rituelle du comité. « Où en êtes-vous ? » appelle un pourcentage rassurant ; « de combien avez-vous encore besoin pour finir ? » appelle un engagement. La seconde formulation fait remonter les mauvaises nouvelles des mois plus tôt — c'est-à-dire quand il est encore possible d'agir.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Le consommé est irrécupérable, seul le reste-à-faire est actionnable. Il se réestime à partir de la connaissance acquise, pas par soustraction. La bonne question au responsable de lot porte sur ce qu'il lui faut encore, pas sur ce qu'il a fait.",
            },
          ],
        },
        {
          id: 'tableau-de-bord-couts',
          title: 'Le tableau de bord des coûts et son usage en comité',
          duration: 25,
          kind: 'texte',
          intro:
            "Une bonne mesure mal présentée ne produit aucune décision. Voici comment construire un tableau de bord de coûts qui déclenche des arbitrages en quelques minutes.",
          blocks: [
            {
              type: 'p',
              text: "Le tableau de bord des coûts a un objectif unique : permettre au commanditaire de décider. Il tient sur une page et répond à quatre questions, dans cet ordre — où en sommes-nous, où allons-nous, quelles sont les causes, et quelles décisions sont attendues aujourd'hui.",
            },
            {
              type: 'table',
              caption: 'Structure d’un tableau de bord des coûts en une page',
              head: ['Bloc', 'Contenu', 'Question à laquelle il répond'],
              rows: [
                ['Situation', 'VP, VA, CR, écarts de coût et de délai', 'Où en sommes-nous ?'],
                ['Projection', 'Coût à terminaison, fourchette et hypothèse retenue', 'Où allons-nous ?'],
                ['Causes', 'Les deux ou trois lots qui portent l’essentiel de l’écart', 'Pourquoi ?'],
                ['Décisions', 'Arbitrages demandés, avec options et recommandation', 'Que devons-nous décider ?'],
              ],
            },
            {
              type: 'p',
              text: "Le bloc des causes mérite une attention particulière : sur la plupart des projets, deux ou trois lots concentrent l'essentiel de la dérive. Présenter les quarante lignes du budget dilue l'information et fait manquer l'essentiel. Montrer les trois lots responsables, avec leur cause propre, permet une discussion utile en cinq minutes.",
            },
            {
              type: 'p',
              text: "Enfin, la sincérité prime sur la présentation. Un tableau de bord qui n'annonce jamais de mauvaise nouvelle finit par n'être plus lu — ou pire, par être cru. Les organisations qui pilotent réellement leurs coûts sont celles où annoncer tôt une dérive est valorisé, parce que c'est précisément ce qui permet de la traiter tant qu'elle est petite.",
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Le tableau de bord entièrement vert jusqu'au mois où tout devient rouge. Ce profil ne traduit pas un projet qui a brutalement échoué : il traduit un système d'information qui a masqué la dérive jusqu'à ce qu'elle devienne indissimulable.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Une page, quatre blocs : situation, projection, causes concentrées sur les deux ou trois lots responsables, décisions attendues avec recommandation. La sincérité précoce est ce qui rend le pilotage possible.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-reste-a-faire',
        title: 'QCM — Piloter par le reste-à-faire',
        questions: [
          {
            id: 'q1',
            prompt: 'Pourquoi le reste-à-faire calculé par soustraction (budget − consommé) est-il insuffisant ?',
            choices: [
              'Parce que le calcul est trop complexe',
              'Parce qu’il suppose le budget initial toujours valable, alors que le projet a démontré le contraire',
              'Parce qu’il donne toujours un résultat négatif',
              'Parce qu’il exige un logiciel spécialisé',
            ],
            answer: 1,
            explanation:
              'La soustraction ne contient aucune information nouvelle : elle reconduit l’hypothèse initiale. Le reste-à-faire utile est réestimé à partir de ce que le projet a appris — complexité découverte, productivité réelle, reprises.',
          },
          {
            id: 'q2',
            prompt: 'Quelle question poser à un responsable de lot pour obtenir une information fiable ?',
            choices: [
              '« À quel pourcentage en es-tu ? »',
              '« De combien as-tu encore besoin pour terminer ? »',
              '« Penses-tu tenir le budget ? »',
              '« Combien as-tu dépensé ce mois-ci ? »',
            ],
            answer: 1,
            explanation:
              'Un pourcentage appelle une réponse rassurante et invérifiable ; une demande de reste-à-faire appelle un engagement chiffré. Cette simple reformulation fait remonter les difficultés des mois plus tôt.',
          },
          {
            id: 'q3',
            prompt: 'Un responsable annonce un reste-à-faire conforme au budget alors que son IPC est de 0,70. Que faire ?',
            choices: [
              'Accepter son estimation, il connaît son lot',
              'Lui demander ce qui a changé pour justifier un retour à la performance prévue',
              'Diviser d’office son estimation par 0,70',
              'Retirer son lot du périmètre',
            ],
            answer: 1,
            explanation:
              'Un retour soudain à la performance nominale doit s’expliquer par un fait concret (fin d’une difficulté, renfort, changement de méthode). Sans explication, l’estimation reconduit un espoir plutôt qu’une prévision.',
          },
          {
            id: 'q4',
            prompt: 'Dans le bloc « causes » d’un tableau de bord des coûts, que présente-t-on ?',
            choices: [
              'L’intégralité des lignes budgétaires',
              'Les deux ou trois lots qui concentrent l’essentiel de l’écart, avec leur cause propre',
              'Uniquement les lots conformes au budget',
              'La liste des fournisseurs',
            ],
            answer: 1,
            explanation:
              'Sur la plupart des projets, quelques lots portent l’essentiel de la dérive. Les isoler permet une discussion utile en quelques minutes ; présenter tout le budget dilue l’information et fait manquer l’essentiel.',
          },
          {
            id: 'q5',
            prompt: 'Que révèle un tableau de bord vert pendant des mois puis brutalement rouge ?',
            choices: [
              'Un projet ayant subi un événement imprévisible',
              'Un système d’information qui a masqué la dérive jusqu’à ce qu’elle devienne indissimulable',
              'Une méthode de valeur acquise correctement appliquée',
              'Une équipe particulièrement performante jusqu’au dernier mois',
            ],
            answer: 1,
            explanation:
              'Les dérives se constituent progressivement. Un basculement brutal des indicateurs traduit presque toujours un défaut de mesure ou une réticence à annoncer tôt — pas une dégradation soudaine de la réalité.',
          },
        ],
      },
    },
  ],
};
