import { Link } from 'react-router-dom';
import { company } from '../data/company';
import { usePageMeta } from '../lib/meta';
import { ACompleter, aCompleter, derniereMiseAJour } from './legalInfo';

/**
 * Mentions légales (art. 6 III de la loi pour la confiance dans l'économie
 * numérique). Toutes les données d'identification proviennent de
 * `src/data/company.ts`. Ce qui n'est pas connu — hébergeur, déclaration
 * d'activité, certification — est affiché comme restant à compléter, jamais
 * comblé par une valeur vraisemblable.
 */
export default function Legal() {
  usePageMeta(
    'Mentions légales',
    'Éditeur, directeur de la publication, hébergement et propriété intellectuelle de FGF Campus, plateforme de formation de FGF Consultant.',
  );

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Informations légales</p>
        <h1>Mentions légales</h1>
        <p className="page-head__lead">
          FGF Campus est la plateforme de formation en ligne éditée par {company.name}. Cette page identifie
          l’éditeur du site, son directeur de publication et son hébergeur, et précise le régime des contenus
          publiés.
        </p>
        <p className="legal-updated">Dernière mise à jour : {derniereMiseAJour}.</p>
      </header>

      <nav className="legal-toc" aria-label="Sommaire des mentions légales">
        <h2>Sommaire</h2>
        <ol>
          <li>
            <a href="#editeur">Éditeur du site</a>
          </li>
          <li>
            <a href="#publication">Directeur de la publication</a>
          </li>
          <li>
            <a href="#hebergeur">Hébergement</a>
          </li>
          <li>
            <a href="#formation">Activité de formation professionnelle</a>
          </li>
          <li>
            <a href="#propriete">Propriété intellectuelle</a>
          </li>
          <li>
            <a href="#contenus">Portée des contenus et des attestations</a>
          </li>
          <li>
            <a href="#liens">Liens et ressources externes</a>
          </li>
          <li>
            <a href="#donnees">Données personnelles et accessibilité</a>
          </li>
          <li>
            <a href="#contact">Contact et signalement</a>
          </li>
        </ol>
      </nav>

      <div className="prose legal">
        <section id="editeur">
          <h2>1. Éditeur du site</h2>
          <p>
            Le site FGF Campus est édité par {company.name}, {company.legal.forme}, dont le siège social est établi{' '}
            {company.address.join(', ')}.
          </p>
          <dl className="legal-facts">
            <div>
              <dt>Dénomination sociale</dt>
              <dd>{company.name}</dd>
            </div>
            <div>
              <dt>Forme juridique</dt>
              <dd>{company.legal.forme}</dd>
            </div>
            <div>
              <dt>Capital social</dt>
              <dd>{company.legal.capital}</dd>
            </div>
            <div>
              <dt>Siège social</dt>
              <dd>
                {company.address.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Immatriculation</dt>
              <dd>{company.legal.rcs}</dd>
            </div>
            <div>
              <dt>SIREN</dt>
              <dd className="mono">{company.legal.siren}</dd>
            </div>
            <div>
              <dt>Code NAF</dt>
              <dd>{company.legal.naf}</dd>
            </div>
            <div>
              <dt>Convention collective</dt>
              <dd>{company.legal.convention}</dd>
            </div>
            <div>
              <dt>Courriel</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt>Téléphone</dt>
              <dd>
                <a href={`tel:${company.phoneHref}`} className="mono">
                  {company.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>Site institutionnel</dt>
              <dd>
                <a href={company.site} target="_blank" rel="noreferrer">
                  fgfconsultant.fr
                </a>
              </dd>
            </div>
          </dl>
          <p className="legal-note">
            Ces informations sont celles publiées par {company.name} et celles du registre du commerce et des
            sociétés. Le numéro de TVA intracommunautaire n’est pas repris ici : il n’a pas été vérifié à la source.
          </p>
        </section>

        <section id="publication">
          <h2>2. Directeur de la publication</h2>
          <p>
            Le directeur de la publication est {company.legal.president}, président de {company.name}. Dans une
            société par actions simplifiée, cette fonction revient de droit au représentant légal.
          </p>
        </section>

        <section id="hebergeur">
          <h2>3. Hébergement</h2>
          {aCompleter.hebergeur ? (
            <dl className="legal-facts">
              <div>
                <dt>Hébergeur</dt>
                <dd>{aCompleter.hebergeur.nom}</dd>
              </div>
              <div>
                <dt>Adresse</dt>
                <dd>{aCompleter.hebergeur.adresse}</dd>
              </div>
              <div>
                <dt>Téléphone</dt>
                <dd className="mono">{aCompleter.hebergeur.telephone}</dd>
              </div>
            </dl>
          ) : (
            <ACompleter quoi="Identité de l’hébergeur">
              la dénomination, l’adresse et le numéro de téléphone de la société qui héberge ce site doivent figurer
              ici. La loi pour la confiance dans l’économie numérique l’impose, et cette information n’est pas connue
              de la personne qui a rédigé cette page. Aucun nom d’hébergeur n’a été supposé.
            </ACompleter>
          )}
          <p className="legal-note">
            FGF Campus est une application web dont l’ensemble du contenu pédagogique est livré avec le site. Elle
            fonctionne sans base de données tant que les comptes ne sont pas activés ; le détail de ces deux modes de
            fonctionnement figure dans la <Link to="/confidentialite">politique de confidentialité</Link>.
          </p>
        </section>

        <section id="formation">
          <h2>4. Activité de formation professionnelle</h2>
          <p>
            {company.name} exerce une activité de recherche, de conseil et de formation en management de projet. Un
            prestataire de formation doit déclarer son activité auprès de l’administration et communiquer son numéro
            de déclaration d’activité dans ses documents et sur son site.
          </p>
          {aCompleter.declarationActivite ? (
            <p>
              Numéro de déclaration d’activité : <span className="mono">{aCompleter.declarationActivite}</span>. Cet
              enregistrement ne vaut pas agrément de l’État.
            </p>
          ) : (
            <ACompleter quoi="Numéro de déclaration d’activité">
              le numéro d’enregistrement de {company.name} en tant que prestataire de formation, délivré par la
              DREETS, doit être indiqué ici, avec la mention « cet enregistrement ne vaut pas agrément de l’État ».
              Ce numéro n’a pas été communiqué et ne peut pas être deviné.
            </ACompleter>
          )}
          {aCompleter.qualiopi ? (
            <p>Certification qualité : {aCompleter.qualiopi}</p>
          ) : (
            <ACompleter quoi="Certification Qualiopi">
              on ignore si {company.name} est titulaire de la certification Qualiopi. Si c’est le cas, indiquer ici le
              numéro de certificat, l’organisme certificateur, la date de validité et les catégories d’actions
              couvertes ; sinon, laisser cette page muette sur le sujet. Cette certification conditionne l’accès des
              formations aux financements publics et mutualisés : elle ne se revendique pas sans certificat.
            </ACompleter>
          )}
          <p className="legal-note">
            Aucune vente n’est réalisée sur ce site : les parcours publiés sont en accès libre et ne donnent lieu à
            aucun paiement en ligne. Les conditions des formations en présentiel, des sessions intra-entreprise et
            des missions de conseil sont établies au cas par cas, en dehors du campus.
          </p>
        </section>

        <section id="propriete">
          <h2>5. Propriété intellectuelle</h2>
          <p>
            Les contenus pédagogiques publiés sur FGF Campus — textes des leçons, définitions, exemples, questions de
            QCM et leurs explications — sont rédigés pour cette plateforme et demeurent la propriété de{' '}
            {company.name}. Il en va de même de la charte graphique, de la structure des parcours et du code de
            l’application.
          </p>
          <p>
            La consultation du campus et l’usage personnel de ses contenus dans un cadre d’apprentissage sont libres.
            En revanche, toute reproduction, adaptation, diffusion publique ou réutilisation à des fins de formation
            par un tiers, en tout ou partie et sur quelque support que ce soit, est soumise à l’autorisation écrite
            préalable de {company.name}.
          </p>
          <p>
            Les référentiels et méthodes cités dans les cours restent la propriété de leurs auteurs et des
            associations professionnelles qui les publient. Les noms d’organisations mentionnés dans les parcours ou
            sur la page <Link to="/a-propos">À propos</Link> le sont à titre de référence ; ils appartiennent à leurs
            titulaires respectifs.
          </p>
          <p className="legal-note">
            L’attestation de suivi que vous pouvez imprimer depuis le campus vous est destinée : vous pouvez la
            conserver, l’imprimer et la transmettre à votre employeur. Sa portée est limitée — voir ci-dessous.
          </p>
        </section>

        <section id="contenus">
          <h2>6. Portée des contenus et des attestations</h2>
          <p>
            Les parcours du campus ont une visée pédagogique générale. Ils présentent des méthodes de management de
            projet et ne constituent pas un conseil personnalisé applicable en l’état à une situation particulière :
            une décision d’investissement, une estimation ou une analyse de risques engagent leur auteur et
            supposent l’examen du contexte réel. Pour un accompagnement adapté à votre organisation,{' '}
            <a href={`mailto:${company.email}`}>écrivez-nous</a>.
          </p>
          <p>
            L’attestation de suivi est générée localement, dans votre navigateur, à partir de la progression que vous
            y avez enregistrée. Le nom qui y figure est celui que vous saisissez : <strong>l’identité n’est pas
            vérifiée</strong> et la progression est déclarative. Ce document atteste d’un parcours effectué en
            autonomie ; il ne constitue ni un diplôme, ni une certification professionnelle enregistrée au RNCP, ni
            une action de formation au sens du code du travail.
          </p>
          <p>
            {company.name} s’efforce de maintenir les contenus exacts et à jour, sans pouvoir garantir l’absence
            d’erreur ni la disponibilité ininterrompue du service.
          </p>
        </section>

        <section id="liens">
          <h2>7. Liens et ressources externes</h2>
          <p>
            Le campus renvoie vers le site institutionnel <a href={company.site}>fgfconsultant.fr</a>.{' '}
            {company.name} n’exerce aucun contrôle sur les sites tiers atteints depuis ces liens et décline toute
            responsabilité quant à leur contenu.
          </p>
          <p>
            En mode statique — le mode actuel — le campus ne charge aucune ressource extérieure : pas de police
            distante, pas de bibliothèque servie par un tiers, pas de mesure d’audience. Les polices utilisées sont
            celles déjà installées sur votre appareil.
          </p>
        </section>

        <section id="donnees">
          <h2>8. Données personnelles et accessibilité</h2>
          <p>
            Le traitement des données est décrit dans la{' '}
            <Link to="/confidentialite">politique de confidentialité</Link>, qui distingue le fonctionnement sans
            compte — aucune donnée ne quitte votre appareil — et le fonctionnement avec comptes activés.
          </p>
          <p>
            L’état de l’accessibilité numérique du campus, ses points forts et ses limites connues sont exposés dans
            la <Link to="/accessibilite">déclaration d’accessibilité</Link>.
          </p>
        </section>

        <section id="contact">
          <h2>9. Contact et signalement</h2>
          <p>
            Pour toute question sur ces mentions, pour signaler une erreur dans un contenu pédagogique ou pour faire
            valoir un droit de propriété intellectuelle, écrivez à{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a> ou appelez le{' '}
            <a href={`tel:${company.phoneHref}`} className="mono">
              {company.phone}
            </a>
            . Un courrier peut également être adressé au siège social indiqué au paragraphe 1.
          </p>
        </section>
      </div>

      <aside className="legal-contact">
        <h2>Éditeur</h2>
        <p>
          {company.name} — {company.baseline}.
        </p>
        <ul>
          <li>{company.address.join(' — ')}</li>
          <li>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </li>
          <li>
            <a href={`tel:${company.phoneHref}`} className="mono">
              {company.phone}
            </a>
          </li>
        </ul>
      </aside>

      <p className="legal-cross">
        <Link to="/confidentialite">Politique de confidentialité</Link>
        <Link to="/accessibilite">Déclaration d’accessibilité</Link>
        <Link to="/a-propos">À propos de FGF Consultant</Link>
      </p>
    </div>
  );
}
