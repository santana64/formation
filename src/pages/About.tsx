import { Link } from 'react-router-dom';
import { company } from '../data/company';
import { usePageMeta } from '../lib/meta';

export default function About() {
  usePageMeta(
    'À propos de FGF Consultant',
    'FGF Consultant : recherche, conseil et formation en management de projet à Arsac (Gironde) depuis 2005.',
  );
  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">À propos</p>
        <h1>FGF Consultant</h1>
        <p className="page-head__lead">
          {company.baseline}. Société installée à Arsac, en Gironde, et active depuis 2005. FGF Campus est sa
          plateforme pédagogique en accès libre.
        </p>
      </header>

      <section className="about-intro">
        <p className="about-intro__quote">
          Un management de projet fortement orienté objectifs, sans jamais perdre de vue les femmes, les hommes et
          l’environnement. C’est la tension que résume la devise maison, qui emprunte à la NASA son
          «&nbsp;Failure is not an option&nbsp;» pour lui opposer aussitôt l’idée que la vie reste un voyage, non une
          destination.
        </p>
      </section>

      <div className="about-grid">
        <div className="prose">
          <h2>Notre métier</h2>
          <p>
            FGF Consultant est spécialisé en management de projet, sur tous les types de projets et quels que soient
            les enjeux, la taille ou le domaine d’activité. L’intervention peut porter sur l’évaluation préalable, la
            structuration, puis la maîtrise des performances, des délais, des coûts, des risques, de la qualité, de
            la communication et de l’organisation.
          </p>
          <p>
            L’activité s’organise en trois volets qui se nourrissent mutuellement : la <strong>recherche</strong>{' '}
            appliquée, menée en partenariat avec des grandes écoles et des universités, le <strong>conseil</strong>{' '}
            — optimisation des processus, digitalisation, accompagnement des équipes et des PMO, conduite de projet
            en maîtrise d’œuvre ou en assistance à maîtrise d’ouvrage — et la <strong>formation</strong>, dont ce
            campus est le prolongement en ligne.
          </p>

          <h2>Ce que nous enseignons</h2>
          <ul>
            {company.teachingModes.map((m) => (
              <li key={m.title}>
                <strong>{m.title}</strong> — {m.text}
              </li>
            ))}
          </ul>
          <p>
            Les parcours publiés ici reprennent les thèmes de notre catalogue présentiel : fondamentaux du management
            de projet, maîtrise des dépenses, estimation des coûts et rentabilité, gestion des risques. Nous préparons
            également aux certifications internationales {company.certifications.join(', ')}, et formons aux solutions
            logicielles de gestion de projet — deux sujets qui se traitent en session animée plutôt qu’en ligne.
          </p>

          <h2>Notre approche pédagogique</h2>
          <p>
            Un chef de projet n’a pas besoin d’une encyclopédie méthodologique, mais d’un petit nombre de gestes
            justes, compris en profondeur et applicables dès le lundi matin. Chaque leçon suit donc la même logique :
            le concept, la méthode, l’erreur classique observée en mission, puis ce qu’il faut retenir.
          </p>
          <p>
            Les QCM ne servent pas à sanctionner mais à révéler les confusions. C’est pourquoi chaque réponse —
            juste ou fausse — s’accompagne d’une explication, et pourquoi un QCM peut être repassé autant de fois
            que nécessaire.
          </p>

          <h2>Secteurs d’intervention</h2>
          <ul className="sector-list">
            {company.sectors.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <h2>Ils nous ont invités</h2>
          <p>
            Nos consultants interviennent régulièrement auprès d’écoles, d’universités et d’associations
            professionnelles : {company.invitedBy.join(', ')}. Nous suivons par ailleurs les travaux des congrès{' '}
            {company.associations.join(', ')}.
          </p>
        </div>

        <div className="about-side">
          <aside className="about-card">
            <h2>Nous contacter</h2>
            <p className="about-card__note">
              Pour une formation en présentiel, une session intra-entreprise ou une mission de conseil.
            </p>
            <dl>
              <dt>Adresse</dt>
              <dd>
                {company.address.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </dd>
              <dt>Courriel</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
              <dt>Téléphone</dt>
              <dd>
                <a href={`tel:${company.phoneHref}`} className="mono">
                  {company.phone}
                </a>
              </dd>
              <dt>Site institutionnel</dt>
              <dd>
                <a href={company.site} target="_blank" rel="noreferrer">
                  fgfconsultant.fr
                </a>
              </dd>
            </dl>
          </aside>

          <aside className="about-card">
            <h2>Notre expérience</h2>
            <ul className="exp-list">
              {company.experience.map((e) => (
                <li key={e.label}>
                  <span className="exp-list__years mono">{e.years}</span>
                  <span>{e.label}</span>
                </li>
              ))}
            </ul>
          </aside>

          <aside className="about-card">
            <h2>Informations légales</h2>
            <p className="about-card__note">Données publiques du registre du commerce et des sociétés.</p>
            <dl>
              <dt>Forme juridique</dt>
              <dd>{company.legal.forme}</dd>
              <dt>Capital social</dt>
              <dd>{company.legal.capital}</dd>
              <dt>Immatriculation</dt>
              <dd>{company.legal.rcs}</dd>
              <dt>SIREN</dt>
              <dd className="mono">{company.legal.siren}</dd>
              <dt>Code NAF</dt>
              <dd>{company.legal.naf}</dd>
              <dt>Président</dt>
              <dd>{company.legal.president}</dd>
              <dt>Convention collective</dt>
              <dd>{company.legal.convention}</dd>
            </dl>
          </aside>
        </div>
      </div>

      <section className="values">
        <h2 className="section__title rule-top">Nos valeurs</h2>
        <div className="values__grid">
          {company.values.map((v) => (
            <article key={v.title} className="value">
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Prêt à commencer ?</h2>
        <p>Les parcours du campus sont accessibles immédiatement, sans inscription.</p>
        <Link to="/formations" className="btn btn--primary btn--lg">
          Voir les parcours
        </Link>
      </section>
    </div>
  );
}
