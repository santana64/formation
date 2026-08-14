import type { Course } from './types';

export const risques: Course = {
  id: 'gestion-risques-projet',
  title: 'Gestion des risques projet',
  level: 'Perfectionnement',
  presentiel: '1 à 3 jours',
  audience: 'Chefs de projet en poste, PMO, responsables de lots souhaitant structurer leur pratique du risque.',
  pitch:
    "Passer d'une gestion des risques subie à une démarche outillée : identifier, évaluer, traiter et suivre les risques tout au long du projet.",
  objectives: [
    'Animer une identification des risques qui dépasse les évidences',
    'Évaluer et hiérarchiser avec une matrice probabilité × impact',
    'Choisir la bonne stratégie de réponse pour chaque risque majeur',
    'Faire vivre un registre des risques utile en comité',
  ],
  prerequis: 'Avoir suivi « Fondamentaux du management de projet » ou disposer d’une expérience équivalente.',
  modules: [
    {
      id: 'identifier',
      title: 'Identifier les risques',
      summary: "Constituer une vision honnête et large des menaces (et opportunités) qui pèsent sur le projet.",
      lessons: [
        {
          id: 'identification',
          title: "L'identification : techniques et angles morts",
          duration: 25,
          kind: 'texte',
          intro:
            "Un risque non identifié est un risque non géré. L'enjeu de cette leçon : élargir systématiquement le champ de vision de l'équipe au-delà des risques « techniques » évidents.",
          blocks: [
            {
              type: 'definition',
              term: 'Risque projet',
              text: "Événement incertain qui, s'il survient, a un effet sur au moins un objectif du projet (contenu, délai, coût, qualité). Un risque n'est pas un problème : le problème est déjà là, le risque peut survenir.",
            },
            {
              type: 'p',
              text: "La distinction risque/problème structure toute la démarche : « le fournisseur pourrait livrer en retard » est un risque (on peut s'y préparer) ; « le fournisseur a livré avec trois semaines de retard » est un problème (on ne peut plus que réagir). La gestion des risques consiste précisément à acheter, aujourd'hui et à bas prix, des options pour demain.",
            },
            { type: 'h2', text: 'Techniques d’identification' },
            {
              type: 'list',
              items: [
                "Brainstorming structuré en atelier, par catégories : technique, organisation, humain, fournisseurs, réglementaire, financier.",
                'Analyse des retours d’expérience de projets comparables — la source la plus rentable et la plus négligée.',
                'Entretiens avec les experts et les « anciens » qui ont vu échouer des projets similaires.',
                'Analyse des hypothèses de la charte : chaque hypothèse (« le métier sera disponible ») est un risque en puissance (« … et s’il ne l’est pas ? »).',
                'Revue de la liste des parties prenantes : chaque acteur hostile ou instable est une source de risque.',
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "L'atelier risques qui ne produit que des risques techniques. Les projets échouent bien plus souvent sur l'humain et l'organisationnel : départ d'une personne clé, indisponibilité du métier, changement de priorité de la direction, sous-estimation de la conduite du changement. Imposez ces catégories dans l'atelier.",
            },
            {
              type: 'p',
              text: "Chaque risque identifié est formulé en cause – événement – conséquence : « Parce que le cahier des charges de l'interface n'est pas figé (cause), le fournisseur pourrait devoir reprendre ses développements (événement), ce qui décalerait la recette de 3 à 6 semaines (conséquence). » Cette formulation force la précision et prépare l'évaluation.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: 'Risque ≠ problème. Identifier large (technique, humain, organisationnel, externe), s’appuyer sur les REX, et formuler chaque risque en cause – événement – conséquence.',
            },
          ],
        },
        {
          id: 'opportunites-appetence',
          title: 'Opportunités et appétence au risque',
          duration: 20,
          kind: 'texte',
          intro:
            "L'incertitude ne joue pas que contre vous. Cette leçon traite des risques favorables — les opportunités — et de la question qui conditionne tous vos arbitrages : quel niveau de risque votre organisation accepte-t-elle de porter ?",
          blocks: [
            {
              type: 'p',
              text: "Un risque est un événement incertain à effet sur les objectifs — l'effet peut être défavorable (menace) ou favorable (opportunité). « Si le nouveau composant tient ses promesses, nous pourrions supprimer une étape d'intégration et gagner trois semaines » est un risque au même titre qu'une menace : incertain, identifiable, évaluable. La plupart des équipes ne recensent que les menaces et laissent donc passer des gains qu'un peu de préparation aurait sécurisés.",
            },
            { type: 'h2', text: 'Quatre stratégies symétriques' },
            {
              type: 'list',
              items: [
                "Exploiter : rendre l'opportunité certaine — affecter votre meilleur expert au sujet pour garantir le gain attendu.",
                "Améliorer : augmenter la probabilité ou l'ampleur du gain, par exemple en avançant un prototype qui lèvera le doute plus tôt.",
                'Partager : s’associer à un partenaire mieux placé pour capter le bénéfice, en répartissant le gain.',
                "Accepter : prendre l'opportunité si elle se présente, sans investir pour la provoquer.",
              ],
            },
            {
              type: 'definition',
              term: 'Appétence au risque',
              text: "Le niveau d'incertitude qu'une organisation accepte volontairement de supporter pour atteindre ses objectifs. Elle se traduit concrètement par des seuils : au-delà de quelle criticité un risque doit-il être remonté, provisionné ou refusé ?",
            },
            {
              type: 'p',
              text: "L'appétence n'est pas une donnée abstraite : elle décide, projet par projet, de ce qui remonte au comité de pilotage et de ce que le chef de projet traite seul. Une organisation à faible appétence — secteur régulé, sûreté, santé — préférera un surcoût certain à une exposition résiduelle ; une organisation en conquête acceptera davantage d'incertitude pour aller plus vite. Le rôle du chef de projet n'est pas de fixer ce curseur mais de le faire expliciter, puis de coter en conséquence.",
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Demandez au commanditaire, dès le cadrage : « à partir de quel impact souhaitez-vous être saisi ? ». Une réponse chiffrée — en semaines de retard ou en pourcentage de budget — vous donne un seuil d'escalade opposable et vous évite les deux erreurs symétriques : alerter sur tout, ou découvrir trop tard que le seuil de tolérance était dépassé.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Les risques favorables se gèrent avec les mêmes outils que les menaces (exploiter, améliorer, partager, accepter). L'appétence au risque, explicitée en seuils chiffrés, détermine ce qui s'escalade et ce qui se traite au niveau du projet.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-identifier',
        title: 'QCM — Identifier les risques',
        questions: [
          {
            id: 'qcm-identifier-q1',
            prompt: 'Quelle est la différence entre un risque et un problème ?',
            choices: [
              'Aucune, ce sont des synonymes',
              'Le risque est un événement incertain à venir ; le problème est déjà survenu',
              'Le problème est toujours plus grave que le risque',
              'Le risque concerne le budget, le problème concerne le délai',
            ],
            answer: 1,
            explanation:
              'Le risque peut survenir (on peut s’y préparer, le prévenir, s’en protéger) ; le problème est avéré (on ne peut plus que le traiter). Toute la valeur de la démarche est d’agir avant.',
          },
          {
            id: 'qcm-identifier-q2',
            prompt: 'Pourquoi analyser les hypothèses de la charte lors de l’identification des risques ?',
            choices: [
              'Pour vérifier l’orthographe du document',
              'Parce que chaque hypothèse non vérifiée est un risque en puissance',
              'Parce que les hypothèses remplacent le registre des risques',
              'Pour réduire le nombre de pages de la charte',
            ],
            answer: 1,
            explanation:
              '« Le métier sera disponible », « le budget sera voté »… Chaque hypothèse est une condition supposée vraie : si elle ne se réalise pas, le projet est affecté. Les hypothèses sont donc une mine de risques déjà à moitié formulés.',
          },
          {
            id: 'qcm-identifier-q3',
            prompt: 'Quel angle mort est le plus fréquent dans les ateliers d’identification ?',
            choices: [
              'Les risques techniques, toujours oubliés',
              'Les risques humains et organisationnels (départ d’une personne clé, indisponibilité du métier…)',
              'Les risques météorologiques',
              'Il n’y a jamais d’angle mort dans un atelier',
            ],
            answer: 1,
            explanation:
              'Les équipes identifient spontanément les risques techniques de leur domaine. Les causes d’échec les plus fréquentes — humaines et organisationnelles — doivent être provoquées par des catégories imposées dans l’atelier.',
          },
          {
            id: 'qcm-identifier-q4',
            prompt: 'Quel est l’intérêt de formuler un risque en « cause – événement – conséquence » ?',
            choices: [
              'Allonger le registre des risques',
              'Forcer la précision et préparer l’évaluation et le traitement',
              'Respecter une norme obligatoire',
              'Pouvoir supprimer la colonne « impact » du registre',
            ],
            answer: 1,
            explanation:
              'Cette formulation évite les risques vagues (« problèmes de planning ») : la cause indique où agir en prévention, l’événement ce qu’on surveille, la conséquence ce qu’on évalue.',
          },
          {
            id: 'qcm-identifier-q5',
            prompt: '« Si le nouveau composant tient ses promesses, nous gagnerions trois semaines. » De quoi s’agit-il ?',
            choices: [
              'D’un problème à traiter en urgence',
              'D’une opportunité, c’est-à-dire un risque à effet favorable',
              'D’une hypothèse qui n’a pas sa place dans le registre',
              'D’un jalon du planning',
            ],
            answer: 1,
            explanation:
              'Un risque est un événement incertain affectant les objectifs — l’effet peut être défavorable (menace) ou favorable (opportunité). Les opportunités se gèrent avec des stratégies symétriques : exploiter, améliorer, partager, accepter.',
          },
          {
            id: 'qcm-identifier-q6',
            prompt: 'À quoi sert de faire expliciter l’appétence au risque du commanditaire ?',
            choices: [
              'À obtenir un budget plus important',
              'À disposer de seuils chiffrés déterminant ce qui doit être escaladé et ce qui se traite au niveau du projet',
              'À transférer la responsabilité des risques au commanditaire',
              'À supprimer l’étape de cotation',
            ],
            answer: 1,
            explanation:
              'Sans seuil explicite, on alerte sur tout ou on découvre trop tard que la tolérance était dépassée. Un seuil chiffré (en semaines ou en % du budget) rend la règle d’escalade objective et opposable.',
          },
        ],
      },
    },
    {
      id: 'evaluer',
      title: 'Évaluer et hiérarchiser',
      summary: 'Passer de la liste brute au top des risques qui méritent vraiment du temps et du budget.',
      lessons: [
        {
          id: 'matrice-probabilite-impact',
          title: 'La matrice probabilité × impact',
          duration: 25,
          kind: 'video',
          intro:
            "Tous les risques ne se valent pas, et l'énergie de l'équipe est limitée. La matrice probabilité × impact fournit un langage commun pour hiérarchiser — à condition de l'utiliser avec rigueur.",
          blocks: [
            {
              type: 'p',
              text: "Chaque risque est coté sur deux axes : sa probabilité de survenance et l'impact sur les objectifs du projet s'il survient. Une échelle en quatre niveaux par axe suffit (rare / possible / probable / quasi certain ; mineur / modéré / majeur / critique). Le produit des deux donne la criticité, qui classe les risques en trois zones : acceptable (surveillance simple), à traiter (plan d'action requis), inacceptable (action immédiate ou remontée au commanditaire).",
            },
            {
              type: 'table',
              caption: 'Exemple d’échelle d’impact (à adapter à chaque projet)',
              head: ['Niveau', 'Délai', 'Coût', 'Contenu / qualité'],
              rows: [
                ['Mineur', '< 1 semaine', '< 2 % du budget', 'Retouche sans effet visible'],
                ['Modéré', '1 à 4 semaines', '2 à 5 %', 'Dégradation limitée, contournable'],
                ['Majeur', '1 à 3 mois', '5 à 15 %', 'Fonction importante dégradée'],
                ['Critique', '> 3 mois', '> 15 %', 'Objectif du projet remis en cause'],
              ],
            },
            {
              type: 'chart',
              chart: 'matrice-risques',
              caption:
                "Le chiffre de chaque case est le produit des deux cotations. Notez la colonne « critique », entièrement classée inacceptable : le produit sert à ordonner, pas à mesurer, et il sous-pondère les événements rares à conséquence grave. Une règle de garde sur l'impact corrige ce biais. Les seuils, eux, se fixent au cadrage avec le commanditaire.",
            },
            {
              type: 'p',
              text: "Le point décisif : définir les échelles avant de coter, en valeurs concrètes propres au projet. Sans cela, chaque participant projette sa propre idée de « majeur », et la matrice ne fait qu'habiller des intuitions. Avec des seuils chiffrés, la cotation devient un débat sur des faits (« quel décalage cela provoquerait-il réellement ? ») et non sur des ressentis.",
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "Coter en grande réunion par consensus mou : les cotations convergent vers le milieu de la matrice et plus rien ne se détache. Faites coter individuellement d'abord, puis discutez uniquement les écarts — les divergences de cotation sont l'information la plus riche de l'exercice.",
            },
            {
              type: 'p',
              text: "La hiérarchisation produit le « top risques » — typiquement 5 à 10 risques qui concentrent l'attention du comité. Les autres restent au registre, revus périodiquement : un risque mineur aujourd'hui peut devenir critique quand le contexte change.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: 'Criticité = probabilité × impact, sur des échelles chiffrées définies avant cotation. Cotation individuelle puis discussion des écarts. Un top 5–10 pour le comité, le reste sous surveillance périodique.',
            },
          ],
        },
        {
          id: 'provisions-scenarios',
          title: 'Chiffrer l’exposition : provisions et scénarios',
          duration: 25,
          kind: 'texte',
          intro:
            "Combien votre projet doit-il provisionner pour ses aléas ? Cette leçon donne une méthode simple et défendable pour passer d'une matrice qualitative à un montant discutable en comité.",
          blocks: [
            {
              type: 'p',
              text: "Le comité de pilotage ne débat pas longtemps sur des couleurs de matrice ; il débat sur des montants. D'où l'utilité de convertir l'exposition en euros ou en jours, ne serait-ce que grossièrement. La méthode la plus accessible est la valeur monétaire attendue : pour chaque risque, on multiplie la probabilité estimée par l'impact chiffré.",
            },
            {
              type: 'table',
              caption: 'Exemple de calcul d’exposition sur trois risques',
              head: ['Risque', 'Probabilité', 'Impact', 'Exposition'],
              rows: [
                ['Reprise des développements d’interface', '40 %', '60 k€', '24 k€'],
                ['Indisponibilité du référent métier', '60 %', '25 k€', '15 k€'],
                ['Retard de livraison du matériel', '20 %', '80 k€', '16 k€'],
                ['Exposition totale', '—', '—', '55 k€'],
              ],
            },
            {
              type: 'p',
              text: "Ce total ne prédit rien pour un risque isolé : aucun de ces trois événements ne coûtera jamais exactement son exposition. Il donne en revanche un ordre de grandeur de provision raisonnable pour l'ensemble du portefeuille de risques — et surtout, il rend le débat possible : le commanditaire peut contester une probabilité ou un impact, ce qui est autrement plus productif que contester une case orange.",
            },
            { type: 'h2', text: 'Provision pour aléas et provision de gestion' },
            {
              type: 'list',
              items: [
                "La provision pour aléas couvre les risques identifiés. Elle appartient au budget du projet et son usage est piloté par le chef de projet, risque par risque.",
                "La provision de gestion couvre l'inconnu non identifié (les « inconnues inconnues »). Elle est détenue par le commanditaire et sa mobilisation relève d'une décision de sa part.",
                "Toute consommation de provision doit être tracée et rattachée à un risque du registre : c'est ce qui permet, en fin de projet, de savoir si l'on avait bien évalué.",
              ],
            },
            {
              type: 'callout',
              variant: 'attention',
              title: 'Piège classique',
              text: "La provision fondue dans les estimations de tâches. Chaque contributeur ajoute discrètement sa marge, le budget gonfle sans que personne ne sache de combien, et la marge est consommée avant même qu'un risque ne survienne (loi de Parkinson : le travail occupe le temps disponible). Une provision visible, séparée et pilotée vaut infiniment mieux qu'un matelas invisible.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Exposition = probabilité × impact chiffré ; le total oriente la provision pour aléas. Séparer provision pour aléas (risques identifiés, pilotée par le projet) et provision de gestion (inconnu, détenue par le commanditaire). Une provision visible plutôt qu'un matelas dispersé.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-evaluer',
        title: 'QCM — Évaluer et hiérarchiser',
        questions: [
          {
            id: 'qcm-evaluer-q1',
            prompt: 'Comment se calcule la criticité d’un risque ?',
            choices: [
              'Probabilité + impact',
              'Probabilité × impact',
              'Impact ÷ probabilité',
              'Nombre de personnes concernées × durée du projet',
            ],
            answer: 1,
            explanation:
              'La criticité combine la vraisemblance (probabilité) et la gravité (impact) : un événement quasi certain à impact critique domine le classement ; un événement rare à impact mineur est simplement surveillé.',
          },
          {
            id: 'qcm-evaluer-q2',
            prompt: 'Pourquoi définir des échelles d’impact chiffrées avant la cotation ?',
            choices: [
              'Pour faire plus professionnel dans le rapport',
              'Pour que « majeur » signifie la même chose pour tous et que la cotation porte sur des faits',
              'Parce que les outils l’imposent',
              'Pour pouvoir coter sans réunir l’équipe',
            ],
            answer: 1,
            explanation:
              'Sans seuils concrets (semaines de retard, % du budget), chacun cote selon son intuition et la matrice perd toute objectivité. Les échelles chiffrées transforment le débat d’opinion en débat de faits.',
          },
          {
            id: 'qcm-evaluer-q3',
            prompt: 'Quelle méthode de cotation limite le « consensus mou » ?',
            choices: [
              'Faire coter uniquement le chef de projet',
              'Coter à main levée en réunion plénière',
              'Cotation individuelle d’abord, puis discussion des seuls écarts',
              'Prendre systématiquement la moyenne sans discussion',
            ],
            answer: 2,
            explanation:
              'La cotation individuelle préserve les avis divergents ; la discussion des écarts fait émerger les informations que certains détiennent et pas d’autres — c’est là que l’exercice crée de la valeur.',
          },
          {
            id: 'qcm-evaluer-q4',
            prompt: 'Que fait-on des risques qui ne figurent pas dans le « top 5–10 » ?',
            choices: [
              'On les supprime du registre pour alléger le suivi',
              'On les conserve au registre et on les revoit périodiquement, car leur criticité peut évoluer',
              'On les transfère automatiquement au fournisseur',
              'On les traite tous avec le même budget que les risques majeurs',
            ],
            answer: 1,
            explanation:
              'Le contexte change : un risque mineur peut devenir critique (nouveau fournisseur, changement réglementaire, départ d’un expert). La revue périodique du registre complet est ce qui évite les angles morts.',
          },
          {
            id: 'qcm-evaluer-q5',
            prompt: 'Un risque a 40 % de probabilité et un impact estimé à 60 k€. Quelle est son exposition ?',
            choices: ['100 k€', '60 k€', '24 k€', '40 k€'],
            answer: 2,
            explanation:
              'L’exposition (valeur monétaire attendue) vaut probabilité × impact, soit 0,40 × 60 k€ = 24 k€. Ce montant ne prédit pas le coût réel du risque isolé, mais il permet de dimensionner une provision sur l’ensemble du portefeuille.',
          },
          {
            id: 'qcm-evaluer-q6',
            prompt: 'Quelle est la différence entre provision pour aléas et provision de gestion ?',
            choices: [
              'Aucune, ce sont deux noms pour la même enveloppe',
              'La provision pour aléas couvre les risques identifiés et est pilotée par le projet ; la provision de gestion couvre l’inconnu et est détenue par le commanditaire',
              'La provision de gestion sert à payer les fournisseurs',
              'La provision pour aléas est facultative et interne à chaque contributeur',
            ],
            answer: 1,
            explanation:
              'Cette séparation est ce qui rend la marge pilotable : le chef de projet mobilise la provision pour aléas risque par risque, tandis que la mobilisation de la provision de gestion relève d’une décision du commanditaire.',
          },
        ],
      },
    },
    {
      id: 'traiter',
      title: 'Traiter et suivre',
      summary: 'Choisir une stratégie de réponse par risque majeur et faire vivre le registre jusqu’à la fin du projet.',
      lessons: [
        {
          id: 'strategies-registre',
          title: 'Stratégies de réponse et registre des risques',
          duration: 25,
          kind: 'texte',
          intro:
            "Identifier et coter ne protège de rien : c'est le plan de réponse qui change le destin du projet. Quatre stratégies possibles, un registre pour tout tracer.",
          blocks: [
            { type: 'h2', text: 'Quatre stratégies face à une menace' },
            {
              type: 'list',
              items: [
                "Éviter : supprimer la cause du risque en changeant l'approche — retirer du périmètre la fonction incertaine, choisir une technologie éprouvée plutôt qu'émergente.",
                "Réduire : diminuer la probabilité (prototype, formation, audit précoce) ou l'impact (sauvegardes, solution de repli préparée).",
                "Transférer : faire porter le risque par un tiers mieux armé — assurance, clause contractuelle de pénalités, forfait fournisseur. Attention : on transfère l'impact financier, rarement l'impact délai ou image.",
                "Accepter : décision consciente de ne rien faire, parce que le coût du traitement dépasse l'exposition. Acceptation active = avec provision et seuil de déclenchement ; jamais par simple oubli.",
              ],
            },
            {
              type: 'p',
              text: "Chaque risque du top bénéficie en outre d'un plan de contingence : ce qu'on fera si le risque survient malgré tout, avec son déclencheur défini à l'avance (« si la recette n'est pas commencée au 15 mars, on active le scénario de repli »). Décider du plan B à froid coûte toujours moins cher que l'improviser en crise.",
            },
            { type: 'h2', text: 'Le registre des risques' },
            {
              type: 'p',
              text: "Le registre consolide tout : description (cause – événement – conséquence), cotation, stratégie choisie, actions avec porteur et échéance, déclencheurs, état. C'est un document vivant : revu à chaque comité de projet, recoté quand le contexte change, enrichi des nouveaux risques. Un registre figé depuis trois mois est le symptôme d'une gestion des risques cosmétique — et chaque action de traitement sans porteur nommé est une action qui ne sera pas faite.",
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "En comité, ne présentez jamais « les 47 lignes du registre » : montrez le top 5, les risques dont la cotation a changé depuis le dernier comité, et les nouveaux entrants. C'est ce mouvement — pas la liste — qui intéresse les décideurs.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: 'Éviter, réduire, transférer, accepter (activement). Un plan de contingence avec déclencheur pour chaque risque majeur. Un registre vivant, revu en comité, avec un porteur par action.',
            },
          ],
        },
        {
          id: 'revues-escalade',
          title: 'Faire vivre les risques : revues, alertes et escalade',
          duration: 20,
          kind: 'texte',
          intro:
            "La gestion des risques meurt rarement d'un mauvais outil : elle meurt d'un rythme abandonné après le troisième mois. Voici la mécanique qui la maintient vivante jusqu'à la clôture.",
          blocks: [
            {
              type: 'p',
              text: "Un registre construit en début de projet perd sa pertinence en quelques semaines : des risques se réalisent et deviennent des problèmes, d'autres disparaissent quand leur cause est levée, et surtout de nouveaux apparaissent à chaque phase. La revue périodique n'est donc pas un contrôle qualité, c'est la seule façon de garder une image fidèle de l'exposition réelle.",
            },
            { type: 'h2', text: 'Un rythme à trois niveaux' },
            {
              type: 'list',
              items: [
                "À chaque point d'équipe : les porteurs d'actions de traitement disent où ils en sont. Cinq minutes suffisent.",
                "À chaque comité de projet : revue du top des risques, des cotations qui ont changé et des nouveaux entrants. C'est le mouvement qui compte, pas la liste.",
                "À chaque jalon et à chaque changement de phase : réidentification complète, car une nouvelle phase apporte ses propres risques (l'entrée en recette n'a rien à voir avec la conception).",
              ],
            },
            { type: 'h2', text: 'Escalader au bon moment' },
            {
              type: 'p',
              text: "L'escalade est souvent vécue comme un aveu d'échec ; c'est en réalité un acte de pilotage. Un risque doit remonter au commanditaire dès qu'il dépasse le seuil d'appétence convenu, qu'il exige un arbitrage hors du mandat du chef de projet, ou qu'il concerne des acteurs qui ne relèvent pas de son autorité. Escaladez avec une proposition, jamais avec un simple problème : « voici le risque, voici l'impact chiffré, voici deux options et celle que je recommande ».",
            },
            {
              type: 'callout',
              variant: 'terrain',
              title: 'Vu sur le terrain',
              text: "Le meilleur indicateur de santé d'une démarche risques n'est pas le nombre de lignes du registre, c'est le nombre de risques clos parce que leur cause a été traitée. Un registre qui ne se vide jamais est un registre où rien ne se fait.",
            },
            {
              type: 'callout',
              variant: 'repere',
              title: 'À retenir',
              text: "Trois rythmes de revue (équipe, comité, jalon), une réidentification à chaque changement de phase, et une escalade déclenchée par un seuil — toujours accompagnée d'options et d'une recommandation.",
            },
          ],
        },
      ],
      quiz: {
        id: 'qcm-traiter',
        title: 'QCM — Traiter et suivre',
        questions: [
          {
            id: 'qcm-traiter-q1',
            prompt: 'Retirer du périmètre une fonctionnalité à la technologie incertaine relève de quelle stratégie ?',
            choices: ['Réduire', 'Transférer', 'Éviter', 'Accepter'],
            answer: 2,
            explanation:
              'Éviter consiste à supprimer la cause même du risque en changeant l’approche ou le périmètre : le risque ne peut plus survenir. Réduire ne ferait qu’en diminuer la probabilité ou l’impact.',
          },
          {
            id: 'qcm-traiter-q2',
            prompt: 'Que transfère réellement une clause de pénalités de retard chez un fournisseur ?',
            choices: [
              'La totalité du risque, qui disparaît du projet',
              'Une partie de l’impact financier — mais le retard et ses conséquences restent subis par le projet',
              'La responsabilité du chef de projet',
              'Le risque vers le commanditaire',
            ],
            answer: 1,
            explanation:
              'Le transfert couvre l’exposition financière, pas les conséquences opérationnelles : si le fournisseur livre en retard, les pénalités indemnisent, mais le planning du projet est quand même touché. Un plan de réduction reste souvent nécessaire.',
          },
          {
            id: 'qcm-traiter-q3',
            prompt: 'Qu’est-ce qu’une acceptation « active » d’un risque ?',
            choices: [
              'Oublier le risque puisqu’on ne peut rien faire',
              'Décider consciemment de ne pas le traiter, avec une provision et un seuil de déclenchement définis',
              'Attendre que le commanditaire le découvre',
              'Le supprimer du registre',
            ],
            answer: 1,
            explanation:
              'Accepter est une décision, pas une négligence : on documente le choix, on provisionne l’impact éventuel et on définit le signal qui déclencherait une réaction. L’acceptation passive (l’oubli) n’est pas une stratégie.',
          },
          {
            id: 'qcm-traiter-q4',
            prompt: 'Quel est l’intérêt de définir à l’avance le déclencheur d’un plan de contingence ?',
            choices: [
              'Pouvoir activer le plan B sur un critère objectif, sans attendre que la crise soit installée',
              'Faire plaisir à l’auditeur qualité',
              'Éviter d’avoir à préparer le plan B',
              'Réduire la probabilité du risque',
            ],
            answer: 0,
            explanation:
              'Sans déclencheur défini (« recette non commencée au 15 mars »), on repousse la décision en espérant que « ça va rentrer dans l’ordre » — et on active le plan B trop tard. Le déclencheur objectif dépersonnalise et accélère la décision.',
          },
          {
            id: 'qcm-traiter-q5',
            prompt: 'Pourquoi réidentifier les risques à chaque changement de phase ?',
            choices: [
              'Pour satisfaire une exigence documentaire',
              'Parce que chaque phase apporte ses propres risques, absents du registre initial',
              'Parce que les risques initiaux deviennent automatiquement caducs',
              'Pour augmenter le nombre de lignes du registre',
            ],
            answer: 1,
            explanation:
              'Les risques de la recette n’ont rien à voir avec ceux de la conception. Un registre construit une fois pour toutes en début de projet devient rapidement une photographie périmée de l’exposition réelle.',
          },
          {
            id: 'qcm-traiter-q6',
            prompt: 'Quelle est la bonne manière d’escalader un risque au commanditaire ?',
            choices: [
              'Transmettre le registre complet et attendre ses instructions',
              'Présenter le risque, son impact chiffré, deux options et la recommandation du chef de projet',
              'Attendre que le risque se réalise pour disposer de faits',
              'Escalader systématiquement tous les risques identifiés',
            ],
            answer: 1,
            explanation:
              'L’escalade est un acte de pilotage, pas un transfert de responsabilité : elle est déclenchée par un seuil convenu et présentée sous forme d’arbitrage documenté, avec une recommandation.',
          },
        ],
      },
    },
  ],
};
