import type { Video } from '../data/types';

interface Props {
  title: string;
  duration: number;
  video?: Video;
}

/**
 * Lecteur de la captation d'une leçon.
 *
 * Deux états réels, jamais de lecteur factice :
 * — `video.src` renseigné : lecteur HTML5 natif, avec piste de sous-titres et
 *   lien vers la transcription lorsqu'ils sont fournis ;
 * — sinon : emplacement annonçant que la captation n'est pas encore disponible,
 *   la leçon restant intégralement lisible en version écrite juste en dessous.
 *
 * Pour publier une vidéo, il suffit de renseigner `video` sur la leçon
 * (voir `src/data/types.ts`) — aucun autre fichier n'est à modifier.
 */
export default function VideoPlayer({ title, duration, video }: Props) {
  if (video?.src) {
    return (
      <figure className="video-slot">
        <video
          className="video-slot__player"
          controls
          preload="metadata"
          poster={video.poster}
          playsInline
        >
          <source src={video.src} type="video/mp4" />
          {video.captions && (
            <track kind="captions" src={video.captions} srcLang="fr" label="Français" default />
          )}
          Votre navigateur ne peut pas lire cette vidéo. La leçon reste disponible en version écrite
          ci-dessous.
        </video>
        <figcaption>
          {title} — {duration} min.{' '}
          {video.transcript ? (
            <>
              <a href={video.transcript} target="_blank" rel="noreferrer">
                Lire la transcription
              </a>{' '}
              ou suivre la version écrite ci-dessous.
            </>
          ) : (
            'La version écrite ci-dessous couvre l’intégralité du contenu traité en vidéo.'
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="video-slot">
      <div className="video-slot__frame">
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r="21" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <path d="M18 14.5v15l12-7.5z" fill="currentColor" opacity="0.65" />
        </svg>
        <p className="video-slot__title">{title}</p>
        <p className="video-slot__note">
          Captation vidéo · {duration} min — <strong>bientôt disponible</strong>
        </p>
      </div>
      <figcaption>
        La version écrite complète de cette leçon est disponible ci-dessous : elle couvre l’intégralité du contenu
        traité en vidéo.
      </figcaption>
    </figure>
  );
}
