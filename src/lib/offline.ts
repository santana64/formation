/**
 * Pilotage du service worker (public/sw.js) côté application.
 *
 * Deux responsabilités, volontairement minimales :
 *   1. enregistrer le service worker — en production uniquement, pour ne pas
 *      voir un cache s'interposer pendant le développement ;
 *   2. exposer un état lisible par l'interface : sommes-nous hors ligne, une
 *      nouvelle version est-elle prête à être appliquée.
 *
 * La progression de l'apprenant vit dans localStorage (src/lib/progress.ts) et
 * n'est jamais concernée par ce module.
 */

export interface OfflineState {
  /** `false` dès que le navigateur se déclare sans réseau. */
  readonly online: boolean;
  /** Une nouvelle version est téléchargée et attend un rechargement. */
  readonly updateReady: boolean;
}

const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

let state: OfflineState = { online: isBrowser ? navigator.onLine : true, updateReady: false };

const listeners = new Set<() => void>();

/** Service worker installé qui attend de prendre la main. */
let waitingWorker: ServiceWorker | null = null;
let registration: ServiceWorkerRegistration | null = null;
let registerCalled = false;
let reloadPending = false;

function setState(patch: Partial<OfflineState>) {
  const next: OfflineState = { ...state, ...patch };
  if (next.online === state.online && next.updateReady === state.updateReady) return;
  state = next;
  for (const listener of listeners) listener();
}

// —————————————————————————————— Lecture d'état ——————————————————————————————

/**
 * Instantané stable : `useSyncExternalStore` compare les références, l'objet
 * n'est donc remplacé que lorsqu'une valeur change réellement.
 */
export function getOfflineState(): OfflineState {
  return state;
}

export function subscribeOffline(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (isBrowser) {
  window.addEventListener('online', () => setState({ online: true }));
  window.addEventListener('offline', () => setState({ online: false }));
}

// ——————————————————————————————— Enregistrement ———————————————————————————————

/**
 * À appeler une fois au démarrage de l'application. Sans effet en
 * développement, ni dans un contexte où le service worker est indisponible
 * (http non sécurisé, navigation privée de certains navigateurs).
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD) return;
  if (!isBrowser || !('serviceWorker' in navigator)) return;
  if (registerCalled) return;
  registerCalled = true;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloadPending) return;
    reloadPending = false;
    window.location.reload();
  });

  // L'enregistrement attend la fin du chargement : le précache ne doit pas
  // entrer en concurrence avec les requêtes de la première page.
  if (document.readyState === 'complete') void register();
  else window.addEventListener('load', () => void register(), { once: true });
}

async function register(): Promise<void> {
  try {
    registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  } catch (error) {
    console.warn('FGF Campus : service worker non enregistré.', error);
    return;
  }

  trackWaiting(registration);

  registration.addEventListener('updatefound', () => {
    const installing = registration?.installing;
    if (!installing) return;
    installing.addEventListener('statechange', () => {
      if (installing.state === 'installed') trackWaiting(registration);
    });
  });

  // Un apprenant peut garder l'onglet ouvert plusieurs jours : on revérifie
  // discrètement à chaque retour sur la page.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void registration?.update().catch(() => undefined);
  });
}

/**
 * Une version en attente n'est signalée que si un service worker contrôle déjà
 * la page. Sinon il s'agit de la toute première installation : il n'y a rien à
 * mettre à jour et proposer un rechargement serait mensonger.
 */
function trackWaiting(reg: ServiceWorkerRegistration | null): void {
  if (!reg?.waiting || !navigator.serviceWorker.controller) return;
  waitingWorker = reg.waiting;
  setState({ updateReady: true });
}

// ————————————————————————————— Mise à jour ——————————————————————————————

/**
 * Applique la version en attente : le service worker prend la main, puis la
 * page se recharge. Déclenché par l'apprenant, jamais automatiquement — un
 * rechargement subi au milieu d'un QCM serait hostile.
 */
export function applyUpdate(): void {
  if (!isBrowser) return;

  if (!waitingWorker) {
    window.location.reload();
    return;
  }

  reloadPending = true;
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });

  // Filet de sécurité : si `controllerchange` ne survient pas (service worker
  // bloqué, onglet en arrière-plan), on recharge quand même.
  window.setTimeout(() => {
    if (!reloadPending) return;
    reloadPending = false;
    window.location.reload();
  }, 3000);
}
