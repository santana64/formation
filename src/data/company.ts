/**
 * Informations publiées par FGF Consultant sur fgfconsultant.fr,
 * complétées par les données légales du registre du commerce.
 * Aucune donnée inventée : toute modification doit être vérifiée à la source.
 */

export const company = {
  name: 'FGF Consultant',
  baseline: 'Recherche · Conseil · Formation en management de projet',
  claim: 'Notre ambition, votre performance',
  site: 'https://fgfconsultant.fr',
  email: 'contact@fgfconsultant.fr',
  phone: '+33 6 22 72 71 30',
  phoneHref: '+33622727130',
  address: ['Rhapsodie de Ligondra', '11 allée de Blanchard', '33460 Arsac'],
  legal: {
    forme: 'SAS, société par actions simplifiée',
    capital: '17 000 €',
    rcs: 'RCS Bordeaux, 13 juillet 2005',
    siren: '483 184 727',
    naf: '70.22Z — conseil pour les affaires et autres conseils de gestion',
    president: 'François Gagné',
    convention: 'SYNTEC (IDCC 1486)',
  },
  /** Ancienneté revendiquée par domaine d'activité. */
  experience: [
    { years: '40 ans', label: 'de management en maîtrise d’œuvre et assistance à maîtrise d’ouvrage' },
    { years: '30 ans', label: 'de conseil en solutions logicielles' },
    { years: '30 ans', label: 'de recherche appliquée' },
    { years: '25 ans', label: 'de formation' },
    { years: '20 ans', label: 'de conseil en processus' },
  ],
  values: [
    {
      title: 'Excellence',
      text: 'Chaque mission est menée avec rigueur, en visant le meilleur résultat possible pour le client.',
    },
    {
      title: 'Innovation',
      text: 'De nouvelles méthodes et de nouveaux outils sont développés en continu pour répondre aux défis à venir.',
    },
    {
      title: 'Engagement',
      text: 'L’implication porte sur l’ensemble du projet, de la stratégie jusqu’à l’exécution opérationnelle.',
    },
    {
      title: 'Transmission',
      text: 'Trait d’union entre le monde académique et le terrain, FGF partage son savoir avec les futurs managers de projet.',
    },
    {
      title: 'Adaptabilité',
      text: 'Les solutions sont ajustées au secteur, à la culture et aux objectifs propres de chaque organisation.',
    },
    {
      title: 'Transparence',
      text: 'Méthodes explicites, résultats mesurables et communication ouverte avec le client.',
    },
  ],
  /** Secteurs d'intervention les plus fréquents. */
  sectors: [
    'Aéronautique',
    'Nucléaire',
    'Ferroviaire',
    'High-Tech',
    'Mines et matières premières',
    'Assurance',
    'Énergie',
    'BTP',
    'Pharmacie',
  ],
  /** Organisations qui ont invité FGF Consultant à intervenir. */
  invitedBy: ['AFITEP', 'ESC Rouen', 'INSEEC', 'SMaP', 'SMP', 'RVMP'],
  /** Associations professionnelles dont les congrès sont suivis, et certifications préparées. */
  certifications: ['PMI', 'IPMA', 'ICEC'],
  associations: ['PMI', 'IPMA', 'ICEC', 'AACEI', 'SMaP', 'AFITEP'],
  /** Formes d'intervention en formation. */
  teachingModes: [
    {
      title: 'Enseignement des méthodes',
      text: 'Formation aux bonnes pratiques de conduite de projet.',
    },
    {
      title: 'Formation aux outils',
      text: 'Apprentissage des logiciels spécialisés de gestion de projet.',
    },
    {
      title: 'Formation initiale et continue',
      text: 'Interventions en grandes écoles et universités, en entreprise, dans les services publics et en centre de formation professionnelle.',
    },
    {
      title: 'Ingénierie pédagogique et animation',
      text: 'Conception de cours, d’études de cas et de mises en situation ; animation, simulations de projet et préparation aux certifications internationales.',
    },
  ],
} as const;
