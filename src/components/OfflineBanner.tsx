import { useState, useSyncExternalStore } from 'react';
import { applyUpdate, getOfflineState, subscribeOffline } from '../lib/offline';
import '../styles/offline.css';

/**
 * Indicateur discret en bas d'écran. Deux messages possibles, jamais bloquants :
 *
 *   - hors ligne : on dit ce qui reste possible (relire ce qui a déjà été
 *     consulté, passer ses QCM, conserver sa progression) plutôt que d'agiter
 *     une alerte. Rien ne disparaît, l'apprenant n'a rien à faire ;
 *   - version prête : on propose un rechargement, sans l'imposer.
 *
 * Le conteneur `role="status"` est monté en permanence : une région live créée
 * en même temps que son contenu n'est pas annoncée par les lecteurs d'écran.
 * Chaque état porte un intitulé texte et une icône — jamais la couleur seule.
 */
export default function OfflineBanner() {
  const { online, updateReady } = useSyncExternalStore(subscribeOffline, getOfflineState, getOfflineState);
  const [updateDismissed, setUpdateDismissed] = useState(false);

  // L'état hors ligne prime : c'est celui qui explique ce que l'apprenant
  // observe. La mise à jour peut attendre le retour du réseau.
  const mode = !online ? 'offline' : updateReady && !updateDismissed ? 'update' : null;

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      {mode === 'offline' && (
        <div className="offline-banner__card offline-banner__card--offline">
          <svg className="offline-banner__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path
              d="M5.6 15h7.9a3.5 3.5 0 0 0 .8-6.9A5 5 0 0 0 6 6.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path d="M3 3l14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <p className="offline-banner__text">
            <strong>Hors ligne.</strong> Les leçons et QCM déjà ouverts sur cet appareil restent accessibles, et votre
            progression continue d’être enregistrée.
          </p>
        </div>
      )}

      {mode === 'update' && (
        <div className="offline-banner__card offline-banner__card--update">
          <svg className="offline-banner__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path
              d="M16 10a6 6 0 1 1-1.9-4.4M16 3v3.2h-3.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="offline-banner__text">
            <strong>Nouvelle version disponible.</strong> Rechargez quand cela vous arrange : rien ne sera perdu.
          </p>
          <div className="offline-banner__actions">
            <button type="button" className="btn btn--primary offline-banner__apply" onClick={applyUpdate}>
              Recharger
            </button>
            <button
              type="button"
              className="offline-banner__dismiss"
              onClick={() => setUpdateDismissed(true)}
              aria-label="Masquer l’avis de mise à jour"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" width="14" height="14">
                <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
