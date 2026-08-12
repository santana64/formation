import { Link } from 'react-router-dom';
import { company } from '../data/company';
import { usePageMeta } from '../lib/meta';
import { isBackendConfigured } from '../lib/supabase';
import { ACompleter, aCompleter, derniereMiseAJour } from './legalInfo';

/**
 * Politique de confidentialité.
 *
 * Le campus a deux modes de fonctionnement très différents du point de vue des
 * données : application statique sans compte (progression dans le navigateur,
 * rien n'est transmis) et installation avec comptes (base Supabase). Les deux
 * sont décrits, et l'encadré indique lequel est actif sur cette installation.
 *
 * Rien n'est promis ici qui ne soit vérifiable dans le code : la clé de
 * stockage local vient de `src/lib/progress.ts`, les données et les accès des
 * encadrants viennent de `supabase/migrations/`.
 */
export default function Privacy() {
  usePageMeta(
    'Politique de confidentialité',
    'Ce que FGF Campus fait de vos données : progression conservée dans votre navigateur sans compte, données de compte hébergées en Europe lorsque les comptes sont activés.',
  );

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Informations légales</p>
        <h1>Politique de confidentialité</h1>
        <p className="page-head__lead">
          Cette page décrit exactement ce que FGF Campus enregistre, où, pendant combien de temps et qui peut le
          consulter. Elle couvre les deux modes de fonctionnement de la plateforme, y compris celui qui n’est pas
          activé ici.
        </p>
        <p className="legal-updated">Dernière mise à jour : {derniereMiseAJour}.</p>
      </header>

      <nav className="legal-toc" aria-label="Sommaire de la politique de confidentialité">
        <h2>Sommaire</h2>
        <ol>
          <li>
            <a href="#essentiel">L’essentiel</a>
          </li>
          <li>
            <a href="#responsable">Responsable du traitement</a>
          </li>
          <li>
            <a href="#modes">Les deux modes de fonctionnement</a>
          </li>
          <li>
            <a href="#traitements">Données traitées lorsque les comptes sont activés</a>
          </li>
          <li>
            <a href="#destinataires">Qui accède à vos données</a>
          </li>
          <li>
            <a href="#conservation">Durées de conservation</a>
          </li>
          <li>
            <a href="#hebergement">Hébergement, sous-traitance et transferts</a>
          </li>
          <li>
            <a href="#cookies">Cookies et traceurs</a>
          </li>
          <li>
            <a href="#droits">Vos droits</a>
          </li>
          <li>
            <a href="#reclamation">Réclamation auprès de la CNIL</a>
          </li>
        </ol>
      </nav>

      <div className="prose legal">
        <section id="essentiel">
          <h2>1. L’essentiel</h2>
          <p>
            Dans son mode par défaut, FGF Campus est une application statique : il n’y a ni compte, ni serveur
            applicatif, ni base de données. Votre progression est écrite dans la mémoire de votre navigateur et n’est
            transmise à personne — pas même à {company.name}. Aucune mesure d’audience, aucun traceur publicitaire,
            aucune ressource chargée depuis un site tiers.
          </p>
          <p>
            Le campus peut aussi être installé <strong>avec les comptes activés</strong>. Dans ce cas seulement, des
            données vous concernant sont enregistrées sur un serveur : nom, adresse électronique, progression,
            résultats de QCM et d’examens, badges et attestations. Le paragraphe 4 les détaille une par une.
          </p>
        </section>

        <section id="responsable">
          <h2>2. Responsable du traitement</h2>
          <p>
            Le responsable du traitement est {company.name}, {company.legal.forme}, {company.legal.rcs}, SIREN{' '}
            {company.legal.siren}, dont le siège social est établi {company.address.join(', ')}.
          </p>
          <p>
            Point de contact pour toute question relative aux données personnelles :{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a> ou{' '}
            <a href={`tel:${company.phoneHref}`} className="mono">
              {company.phone}
            </a>
            .
          </p>
        </section>

        <section id="modes">
          <h2>3. Les deux modes de fonctionnement</h2>

          <article className="legal-mode">
            <div className="legal-mode__head">
              <h3>Mode A — sans compte</h3>
              <span className={`badge ${isBackendConfigured ? 'badge--todo' : 'badge--ok'}`}>
                {isBackendConfigured ? 'Non actif sur cette installation' : 'Mode actif sur cette installation'}
              </span>
            </div>
            <p>
              Le site est livré avec tout son contenu pédagogique. Aucun compte n’est demandé, aucune donnée n’est
              envoyée à un serveur, et {company.name} ne reçoit rien de votre passage.
            </p>
            <p>
              Votre progression est conservée dans le stockage local de votre navigateur (
              <span className="mono">localStorage</span>), sous la clé{' '}
              <span className="mono">fgf-campus-progress-v1</span>. Elle contient uniquement :
            </p>
            <ul>
              <li>la liste des leçons que vous avez marquées comme terminées ;</li>
              <li>
                pour chaque QCM passé, le meilleur score obtenu, le nombre de questions et la date de ce résultat.
              </li>
            </ul>
            <p>
              Ces informations restent sur l’appareil et dans le navigateur utilisés. Elles ne sont pas partagées
              entre vos appareils, et elles disparaissent si vous videz les données de site de votre navigateur ou si
              vous naviguez en mode privé. Le nom que vous saisissez pour éditer une attestation n’est pas même
              enregistré : il vit le temps de l’affichage de la page.
            </p>
            <p>
              Depuis la page <Link to="/progression">Ma progression</Link>, vous pouvez à tout moment{' '}
              <strong>exporter</strong> cette progression dans un fichier, la <strong>réimporter</strong> sur un
              autre appareil ou l’<strong>effacer</strong> entièrement. L’effacement est immédiat et définitif :
              comme aucune copie n’existe ailleurs, {company.name} ne peut ni la restaurer, ni la consulter.
            </p>
            <p className="legal-note">
              Cette écriture locale sert exclusivement à vous rendre le service que vous demandez — retrouver votre
              parcours là où vous l’avez laissé. Elle ne poursuit aucune finalité publicitaire ni statistique, et
              relève à ce titre des traceurs strictement nécessaires, exemptés de consentement préalable.
            </p>
          </article>

          <article className="legal-mode">
            <div className="legal-mode__head">
              <h3>Mode B — avec comptes activés</h3>
              <span className={`badge ${isBackendConfigured ? 'badge--ok' : 'badge--todo'}`}>
                {isBackendConfigured ? 'Mode actif sur cette installation' : 'Non activé sur cette installation'}
              </span>
            </div>
            <p>
              Lorsque {company.name} raccorde le campus à sa base de données, des fonctions supplémentaires
              apparaissent : création de compte, progression synchronisée entre appareils, examens, badges,
              attestations et certificats vérifiables, suivi par un formateur ou par le référent de votre entreprise.
            </p>
            <p>
              La création d’un compte reste volontaire. Le catalogue et les leçons demeurent consultables sans
              compte ; dans ce cas, le mode A ci-dessus continue de s’appliquer.
            </p>
            <p>
              La base de données est fournie par <strong>Supabase</strong>, hébergée dans une région européenne
              (Francfort ou Paris), conformément à la procédure d’installation du campus.
            </p>
          </article>
        </section>

        <section id="traitements">
          <h2>4. Données traitées lorsque les comptes sont activés</h2>
          <p>
            La finalité générale est unique : permettre le suivi d’un parcours de formation et en attester. Aucune
            donnée n’est utilisée à des fins publicitaires, aucune n’est vendue, aucune décision automatisée n’est
            prise à votre sujet.
          </p>
          <div className="table-scroll">
            <table className="legal-table">
              <caption>Données enregistrées, finalité et base légale — mode B uniquement.</caption>
              <thead>
                <tr>
                  <th scope="col">Données</th>
                  <th scope="col">Finalité</th>
                  <th scope="col">Base légale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Adresse électronique et mot de passe</th>
                  <td data-label="Finalité">
                    Créer le compte, vous authentifier, confirmer l’adresse et permettre la réinitialisation du mot
                    de passe. Le mot de passe est conservé par Supabase sous forme d’empreinte chiffrée, jamais en
                    clair, et n’est accessible ni à {company.name} ni aux formateurs.
                  </td>
                  <td data-label="Base légale">Exécution du service demandé (art. 6.1.b du RGPD)</td>
                </tr>
                <tr>
                  <th scope="row">Nom, et nom à faire figurer sur les attestations</th>
                  <td data-label="Finalité">
                    Vous identifier dans l’interface et sur les documents délivrés. Le nom d’attestation est distinct
                    du nom d’usage : vous choisissez ce qui figure sur un document officiel.
                  </td>
                  <td data-label="Base légale">Exécution du service demandé</td>
                </tr>
                <tr>
                  <th scope="row">Inscriptions et progression</th>
                  <td data-label="Finalité">
                    Mémoriser les parcours suivis et les leçons terminées, afin de reprendre là où vous en êtes et de
                    calculer l’avancement.
                  </td>
                  <td data-label="Base légale">Exécution du service demandé</td>
                </tr>
                <tr>
                  <th scope="row">Résultats de QCM et d’examens</th>
                  <td data-label="Finalité">
                    Corriger les copies côté serveur, conserver le score, le nombre de questions, la date, la durée
                    de l’épreuve et les questions manquées — ces dernières servant à vous montrer les explications
                    utiles et à déterminer la réussite.
                  </td>
                  <td data-label="Base légale">Exécution du service demandé</td>
                </tr>
                <tr>
                  <th scope="row">Badges</th>
                  <td data-label="Finalité">
                    Marquer des jalons de progression. Ils sont attribués par le serveur à partir de vos résultats
                    réels ; ils ne sont pas publiés et restent visibles de vous seul et de l’administrateur.
                  </td>
                  <td data-label="Base légale">Exécution du service demandé</td>
                </tr>
                <tr>
                  <th scope="row">Attestations et certificats</th>
                  <td data-label="Finalité">
                    Délivrer le document : nom du titulaire, intitulé, score éventuel, date d’émission et code de
                    vérification. Ce code permet à un tiers à qui vous remettez le document — un employeur, par
                    exemple — d’en vérifier l’authenticité. La vérification ne révèle que le nom du titulaire,
                    l’intitulé, le type de document et sa date : ni votre adresse, ni le détail de vos résultats.
                  </td>
                  <td data-label="Base légale">Exécution du service demandé</td>
                </tr>
                <tr>
                  <th scope="row">Entreprise de rattachement</th>
                  <td data-label="Finalité">
                    Lorsque votre formation est prise en charge par votre employeur, rattacher votre compte à son
                    organisation pour permettre au référent désigné de suivre l’avancement.
                  </td>
                  <td data-label="Base légale">
                    Intérêt légitime de l’employeur qui finance la formation à en vérifier le suivi (art. 6.1.f) —
                    vous pouvez vous y opposer, voir le paragraphe 9
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="legal-note">
            Le rattachement à une entreprise et le rôle attribué à un compte (apprenant, formateur, référent
            d’entreprise, administrateur) ne sont modifiables que par un administrateur du campus. Personne ne peut
            s’attribuer de droits à lui-même.
          </p>
        </section>

        <section id="destinataires">
          <h2>5. Qui accède à vos données</h2>
          <p>
            Il faut le dire clairement : lorsque les comptes sont activés, vous n’êtes pas seul à voir votre
            progression.
          </p>
          <h3>Le formateur auteur d’un cours</h3>
          <p>
            Il voit les personnes inscrites à ses propres parcours, les leçons qu’elles y ont terminées et leurs
            tentatives de QCM sur ses modules. Il n’a accès ni aux cours des autres formateurs, ni aux comptes qui ne
            sont pas inscrits chez lui.
          </p>
          <h3>Le référent de votre entreprise</h3>
          <p>
            Il voit les comptes rattachés à son organisation et leur avancement : leçons terminées, QCM validés,
            examens réussis. L’interface qui lui est proposée n’affiche que ces compteurs — jamais le détail question
            par question, jamais le contenu de vos réponses.
          </p>
          <h3>L’administrateur du campus</h3>
          <p>
            Il administre les comptes, les rôles et les rattachements, et dispose d’un accès étendu aux données
            nécessaires à cette gestion.
          </p>
          <p>
            Une précision d’honnêteté : si les interfaces du formateur et du référent se limitent à des compteurs,
            les règles d’accès de la base de données autorisent, elles, la lecture de la tentative complète — y
            compris la liste des questions manquées — par le formateur auteur du module, par le référent de votre
            organisation et par l’administrateur. Nous préférons l’écrire plutôt que de vous promettre une
            confidentialité que la technique ne garantit pas aujourd’hui.
          </p>
          <p>
            En revanche, la progression enregistrée sur les parcours livrés avec le campus, lorsqu’elle est
            sauvegardée sur votre compte, est <strong>strictement personnelle</strong> : la règle de sécurité
            correspondante n’autorise que vous à la lire, y compris face à un administrateur.
          </p>
          <p className="legal-note">
            En dehors de ces rôles et de l’hébergeur de la base de données, aucune donnée n’est communiquée à un
            tiers. Elle ne l’est ni vendue, ni échangée, ni utilisée pour du démarchage.
          </p>
        </section>

        <section id="conservation">
          <h2>6. Durées de conservation</h2>
          <h3>Sans compte</h3>
          <p>
            La progression reste dans votre navigateur jusqu’à ce que vous l’effaciez — depuis la page{' '}
            <Link to="/progression">Ma progression</Link> ou en vidant les données de site du navigateur.{' '}
            {company.name} ne détient aucune copie et n’applique donc aucune durée.
          </p>
          <h3>Avec un compte</h3>
          <p>
            Les données sont conservées tant que votre compte existe. Sa suppression entraîne, par construction de la
            base, l’effacement en cascade des données rattachées : profil, inscriptions, progression, tentatives de
            QCM et d’examens, badges et attestations émises.
          </p>
          {aCompleter.dureeConservationComptes ? (
            <p>Comptes inactifs : {aCompleter.dureeConservationComptes}</p>
          ) : (
            <ACompleter quoi="Durée de conservation des comptes inactifs">
              aucune suppression automatique des comptes restés inactifs n’est programmée dans la base de données.
              La durée retenue — la CNIL recommande de ne pas conserver un compte inactif au-delà de deux à trois
              ans, après une relance — doit être décidée par {company.name}, inscrite ici, puis réellement mise en
              œuvre. Elle n’est pas indiquée tant qu’elle n’est pas décidée.
            </ACompleter>
          )}
        </section>

        <section id="hebergement">
          <h2>7. Hébergement, sous-traitance et transferts</h2>
          <p>
            En mode sans compte, aucune donnée personnelle n’est hébergée : le site ne sert que des fichiers
            statiques. L’identité de l’hébergeur du site figure dans les{' '}
            <Link to="/mentions-legales">mentions légales</Link>.
          </p>
          <p>
            En mode avec comptes, la base de données et le service d’authentification sont fournis par{' '}
            <strong>Supabase</strong>, sous-traitant au sens de l’article 28 du RGPD. Le projet est créé dans une
            région européenne (Francfort ou Paris) : les données de compte et de progression sont stockées dans
            l’Union européenne. Le recours à ce sous-traitant est encadré par ses conditions de traitement des
            données, acceptées lors de la mise en service.
          </p>
          <p>
            Aucun transfert de données hors de l’Union européenne n’est organisé par {company.name}. Si une évolution
            du service devait en entraîner un, cette page serait mise à jour avant sa mise en œuvre.
          </p>
          <h3>Sécurité</h3>
          <p>
            Les échanges avec la base transitent par une liaison chiffrée. Chaque table est protégée par des règles
            d’accès évaluées côté serveur, selon le principe « tout est refusé, puis quelques accès sont ouverts
            explicitement ». Les éléments sensibles ne circulent jamais vers le navigateur : les bonnes réponses d’un
            QCM ne sont envoyées qu’après correction, les scores sont calculés par le serveur et non déclarés par le
            client, et l’émission d’une attestation vérifie elle-même que les conditions sont réunies.
          </p>
        </section>

        <section id="cookies">
          <h2>8. Cookies et traceurs</h2>
          <p>
            FGF Campus ne dépose <strong>aucun cookie publicitaire, aucun cookie de mesure d’audience et aucun
            traceur tiers</strong>. Il n’y a donc pas de bandeau de consentement : il n’y a rien à consentir.
          </p>
          <p>
            Sans compte, la seule écriture effectuée sur votre appareil est la progression décrite au paragraphe 3,
            dans le stockage local du navigateur. Avec un compte, s’y ajoute un jeton de session, également conservé
            par le navigateur, qui vous évite d’avoir à vous reconnecter à chaque visite ; il disparaît à la
            déconnexion. Ces deux écritures sont strictement nécessaires au fonctionnement demandé.
          </p>
        </section>

        <section id="droits">
          <h2>9. Vos droits</h2>
          <p>
            Le RGPD vous reconnaît un droit d’accès, de rectification, d’effacement, de limitation du traitement, de
            portabilité de vos données, ainsi qu’un droit d’opposition aux traitements fondés sur l’intérêt légitime.
          </p>
          <h3>Sans compte</h3>
          <p>
            Ces droits s’exercent directement, sans nous écrire et sans délai, depuis la page{' '}
            <Link to="/progression">Ma progression</Link> : consultation à l’écran, export au format JSON
            (portabilité), import et effacement complet. {company.name} n’ayant aucune copie de ces données, nous ne
            pourrions matériellement pas répondre à une demande d’accès portant sur elles.
          </p>
          <h3>Avec un compte</h3>
          <p>
            Vous pouvez consulter et corriger votre nom depuis votre espace personnel. Pour toute autre demande —
            accès à l’ensemble de vos données, effacement du compte, opposition au suivi par le référent de votre
            entreprise, portabilité — écrivez à <a href={`mailto:${company.email}`}>{company.email}</a> en précisant
            l’adresse électronique associée à votre compte. Une réponse vous sera apportée dans un délai d’un mois.
          </p>
          <p className="legal-note">
            L’opposition au suivi par un référent d’entreprise peut avoir une conséquence concrète : si votre
            employeur finance la formation, il peut demander une preuve de suivi. Dans ce cas, l’attestation que vous
            lui transmettez vous-même reste une solution.
          </p>
        </section>

        <section id="reclamation">
          <h2>10. Réclamation auprès de la CNIL</h2>
          <p>
            Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire
            une réclamation auprès de la Commission nationale de l’informatique et des libertés :
          </p>
          <p>
            CNIL — 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 —{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
              www.cnil.fr
            </a>
          </p>
          <h3>Modification de cette politique</h3>
          <p>
            Toute évolution du fonctionnement du campus ayant un effet sur les données donnera lieu à une mise à jour
            de cette page, dont la date figure en tête.
          </p>
        </section>
      </div>

      <aside className="legal-contact">
        <h2>Une question sur vos données ?</h2>
        <p>Écrivez au responsable du traitement, {company.name}. Une réponse est apportée sous un mois.</p>
        <ul>
          <li>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </li>
          <li>
            <a href={`tel:${company.phoneHref}`} className="mono">
              {company.phone}
            </a>
          </li>
          <li>{company.address.join(' — ')}</li>
        </ul>
      </aside>

      <p className="legal-cross">
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/accessibilite">Déclaration d’accessibilité</Link>
        <Link to="/progression">Gérer ma progression</Link>
      </p>
    </div>
  );
}
