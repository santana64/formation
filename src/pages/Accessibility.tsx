import { Link } from 'react-router-dom';
import { company } from '../data/company';
import { usePageMeta } from '../lib/meta';
import { derniereMiseAJour } from './legalInfo';

/**
 * Déclaration d'accessibilité.
 *
 * Elle ne recopie aucun modèle : chaque point énoncé correspond à un dispositif
 * réellement présent dans le code (lien d'évitement et focus déplacé sur
 * `<main>` dans App.tsx, contrastes du design system, cartes empilées sous
 * 760 px, `prefers-reduced-motion` dans global.css). Les limites connues sont
 * énoncées avec la même précision que les points conformes : une déclaration
 * d'accessibilité qui ne mentionne aucune limite n'est pas crédible.
 */
export default function Accessibility() {
  usePageMeta(
    'Déclaration d’accessibilité',
    'État de l’accessibilité de FGF Campus : ce qui est en place, les limites connues et comment signaler un obstacle.',
  );

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Informations légales</p>
        <h1>Déclaration d’accessibilité</h1>
        <p className="page-head__lead">
          {company.name} souhaite que FGF Campus soit utilisable par le plus grand nombre, quels que soient le
          matériel, le navigateur ou les aides techniques employés. Cette page décrit ce qui a été fait, ce qui ne
          l’a pas encore été, et comment nous signaler un obstacle.
        </p>
        <p className="legal-updated">Dernière mise à jour : {derniereMiseAJour}.</p>
      </header>

      <nav className="legal-toc" aria-label="Sommaire de la déclaration d’accessibilité">
        <h2>Sommaire</h2>
        <ol>
          <li>
            <a href="#portee">Portée et statut de cette déclaration</a>
          </li>
          <li>
            <a href="#enplace">Ce qui est en place</a>
          </li>
          <li>
            <a href="#limites">Limites connues</a>
          </li>
          <li>
            <a href="#alternatives">Solutions de remplacement</a>
          </li>
          <li>
            <a href="#signaler">Signaler un obstacle</a>
          </li>
          <li>
            <a href="#recours">Voies de recours</a>
          </li>
        </ol>
      </nav>

      <div className="prose legal">
        <section id="portee">
          <h2>1. Portée et statut de cette déclaration</h2>
          <p>
            Cette déclaration porte sur l’ensemble des pages de FGF Campus : accueil, catalogue, fiches de parcours,
            leçons, QCM, recherche, tableau de bord de progression, attestation et pages légales.
          </p>
          <p>
            <strong>Ce n’est pas une déclaration de conformité au RGAA.</strong> Aucun audit formel, ni interne ni
            externe, n’a été réalisé : ni grille RGAA appliquée critère par critère, ni taux de conformité calculé,
            ni échantillon de pages audité. Annoncer un pourcentage de conformité sans audit serait une affirmation
            sans fondement.
          </p>
          <p>
            L’obligation légale de publier une déclaration de conformité vise les organismes publics et les
            entreprises dépassant un seuil de chiffre d’affaires que {company.name} n’atteint pas. Cette page est
            donc publiée volontairement : elle rend compte d’un état de fait, elle ne satisfait pas à une formalité.
          </p>
          <p className="legal-note">
            Les points énoncés ci-dessous ont été mis en place et vérifiés pendant le développement, dans le
            navigateur, sur les résolutions 1440, 1024 et 390 pixels de large. Le référentiel visé est le niveau AA
            des règles WCAG, sans que la couverture complète du référentiel ait été contrôlée.
          </p>
        </section>

        <section id="enplace">
          <h2>2. Ce qui est en place</h2>

          <h3>Contrastes</h3>
          <p>
            Les couleurs de l’interface ont été mesurées dans le navigateur. Le rapport de contraste le plus faible
            relevé sur du texte est de <strong>5,18:1</strong>, celui des titres atteint 16:1 — le niveau AA des
            règles WCAG exige 4,5:1 pour le texte courant. Aucune couleur n’est utilisée en dehors de la palette
            ainsi contrôlée.
          </p>

          <h3>Navigation au clavier</h3>
          <p>
            L’ensemble du site s’utilise au clavier : navigation, menu, filtres du catalogue, recherche, réponse aux
            QCM, export et import de progression. L’indicateur de focus est visible sur tous les éléments
            interactifs et n’est jamais supprimé.
          </p>
          <p>
            Un <strong>lien d’évitement</strong> « Aller au contenu » apparaît dès la première tabulation et permet
            de sauter la navigation principale.
          </p>

          <h3>Changement de page</h3>
          <p>
            L’application étant rendue côté client, le navigateur ne recharge pas la page lorsque vous suivez un
            lien. Le focus est donc déplacé par programme sur la zone de contenu principale à chaque changement de
            page : sans cela, une personne au clavier ou au lecteur d’écran resterait positionnée sur le lien cliqué
            et devrait re-parcourir toute la navigation. Le titre du document est également mis à jour à chaque page.
          </p>
          <p>
            Après validation d’un QCM, le focus est porté sur le bloc de résultat, annoncé dans une région live pour
            que le score et la correction soient restitués sans avoir à les chercher.
          </p>

          <h3>L’information n’est jamais portée par la seule couleur</h3>
          <p>
            Réussite, échec, leçon terminée, badge obtenu, information à compléter : chaque état est signalé par un
            texte explicite et, selon le cas, par une icône ou un libellé, en plus de la couleur. Une personne qui ne
            perçoit pas les différences de teinte dispose de la même information.
          </p>

          <h3>Adaptation à la taille de l’écran</h3>
          <p>
            La mise en page s’adapte sans provoquer de défilement horizontal, contrôlé sur toutes les routes en 1440,
            1024 et 390 pixels. Sous 760 pixels, les tableaux — tableau de bord de progression, tableau des données
            de la politique de confidentialité — sont réorganisés en cartes empilées, chaque valeur restant
            accompagnée de l’intitulé de sa colonne, plutôt que d’imposer un défilement latéral.
          </p>

          <h3>Animations et mouvement</h3>
          <p>
            Le réglage système « réduire les animations » (<span className="mono">prefers-reduced-motion</span>) est
            respecté : transitions et défilements animés sont neutralisés. Le site ne comporte par ailleurs ni
            contenu clignotant, ni carrousel automatique, ni lecture automatique de média.
          </p>

          <h3>Structure et langue</h3>
          <p>
            Les pages sont structurées avec des repères (en-tête, navigation, contenu principal, pied de page) et une
            hiérarchie de titres continue. La langue du document est déclarée en français. Les tableaux disposent
            d’en-têtes de ligne et de colonne explicites.
          </p>
        </section>

        <section id="limites">
          <h2>3. Limites connues</h2>
          <p>Les points suivants ne sont pas satisfaits à ce jour. Ils sont connus et assumés comme tels.</p>
          <h3>Aucun audit RGAA formel</h3>
          <p>
            Le référentiel général d’amélioration de l’accessibilité n’a pas été appliqué critère par critère. Des
            non-conformités peuvent donc subsister sans avoir été identifiées, notamment sur des situations
            d’utilisation qui n’ont pas été reproduites en développement.
          </p>
          <h3>Vidéos : ni sous-titres, ni transcription</h3>
          <p>
            Les captations vidéo des leçons ne sont pas encore disponibles. Le lecteur intégré au campus prévoit une
            piste de sous-titres en français et un lien vers une transcription, mais aucune vidéo n’étant publiée,
            aucun sous-titre ni aucune transcription n’existe aujourd’hui. Le jour où une captation sera mise en
            ligne, elle devra être accompagnée de ces deux éléments : une vidéo sans sous-titres exclurait les
            personnes sourdes et malentendantes.
          </p>
          <h3>Tests avec les aides techniques</h3>
          <p>
            Les comportements décrits au paragraphe 2 ont été vérifiés dans le navigateur et dans la structure des
            pages, mais aucune campagne de tests documentée n’a été menée avec l’ensemble des lecteurs d’écran du
            marché, ni avec des personnes en situation de handicap. Le rendu visuel n’a pas non plus fait l’objet
            d’une revue à l’œil au moment de la rédaction de cette page.
          </p>
          <h3>Documents produits par le site</h3>
          <p>
            L’attestation de suivi est une page imprimable, non un PDF balisé. Son accessibilité une fois imprimée ou
            enregistrée en PDF par le navigateur n’a pas été contrôlée.
          </p>
        </section>

        <section id="alternatives">
          <h2>4. Solutions de remplacement</h2>
          <p>
            Tout le contenu pédagogique existe en version écrite : les leçons dont une vidéo est annoncée
            comportent, sous le lecteur, la version écrite complète du même contenu. Aucune information n’est
            accessible uniquement par la vidéo.
          </p>
          <p>
            Si une page vous reste inutilisable, le contenu correspondant peut vous être transmis par un autre moyen
            — courriel, document, ou explication de vive voix. Il suffit de le demander à{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </section>

        <section id="signaler">
          <h2>5. Signaler un obstacle</h2>
          <p>
            Si vous rencontrez une difficulté pour accéder à un contenu ou à une fonctionnalité du campus,
            écrivez-nous à <a href={`mailto:${company.email}`}>{company.email}</a>. Un signalement est utile même
            s’il est bref ; s’il vous est possible d’indiquer les éléments suivants, le traitement en sera facilité :
          </p>
          <ul>
            <li>l’adresse de la page concernée ;</li>
            <li>ce que vous cherchiez à faire et ce qui a bloqué ;</li>
            <li>votre navigateur et, le cas échéant, l’aide technique utilisée.</li>
          </ul>
          <p>
            Vous pouvez aussi appeler le{' '}
            <a href={`tel:${company.phoneHref}`} className="mono">
              {company.phone}
            </a>{' '}
            ou écrire au siège social indiqué dans les <Link to="/mentions-legales">mentions légales</Link>. Chaque
            signalement reçoit une réponse et, lorsque l’obstacle est confirmé, une solution de remplacement vous est
            proposée en attendant la correction.
          </p>
        </section>

        <section id="recours">
          <h2>6. Voies de recours</h2>
          <p>
            Si un signalement reste sans réponse satisfaisante, vous pouvez saisir le Défenseur des droits, autorité
            indépendante compétente en matière d’accès aux services : un délégué peut être contacté près de chez
            vous, un formulaire est disponible sur{' '}
            <a href="https://www.defenseurdesdroits.fr" target="_blank" rel="noreferrer">
              defenseurdesdroits.fr
            </a>
            , et un courrier peut être adressé sans affranchissement à : Défenseur des droits, Libre réponse 71120,
            75342 Paris Cedex 07.
          </p>
        </section>
      </div>

      <aside className="legal-contact">
        <h2>Signaler un obstacle</h2>
        <p>
          Un obstacle rencontré sur le campus est une information utile : il n’y a pas de formulaire à remplir, un
          courriel suffit.
        </p>
        <ul>
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
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/confidentialite">Politique de confidentialité</Link>
        <Link to="/formations">Catalogue des parcours</Link>
      </p>
    </div>
  );
}
