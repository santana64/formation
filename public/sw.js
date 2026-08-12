/**
 * FGF Campus — service worker écrit à la main, sans aucune dépendance.
 *
 * Objectif : un apprenant qui a ouvert ses leçons chez lui doit pouvoir les
 * relire et passer ses QCM dans le train. La progression vit dans
 * localStorage (voir src/lib/progress.ts) et n'est jamais touchée ici.
 *
 * Stratégies :
 *   - navigation  → réseau d'abord, repli sur la coquille en cache.
 *     Le routage est côté client : toute URL doit retomber sur index.html.
 *   - /assets/*   → cache d'abord (noms hashés au build, donc immuables).
 *   - autre même origine (icônes, manifeste) → cache d'abord + revalidation
 *     en arrière-plan.
 *   - toute autre origine (API Supabase, vidéos tierces) → ignorée : le
 *     service worker ne répond pas, le navigateur fait son travail habituel.
 *
 * Rien n'est mis en cache si la réponse n'est pas `ok`.
 *
 * Le bloc ci-dessous est réécrit après `vite build` par scripts/precache.ts,
 * qui y injecte l'identifiant de version et la liste réelle des fichiers
 * produits dans dist/ — les noms d'assets étant hashés à chaque build, ils ne
 * peuvent pas être écrits en dur ici.
 */

/* @precache:start */
const BUILD_ID = 'dev';
const PRECACHE_URLS = ['/'];
/* @precache:end */

const CACHE_NAME = `fgf-campus-${BUILD_ID}`;
const CACHE_PREFIX = 'fgf-campus-';

/** Clé sous laquelle la coquille applicative est stockée. */
const SHELL_URL = '/';

/**
 * Chemins jamais mis en cache, même en même origine : ce sont des appels de
 * données, pas des ressources statiques. Sert de garde-fou si l'API Supabase
 * venait un jour à être exposée derrière le même domaine (proxy, self-hosting).
 */
const NEVER_CACHE = ['/rest/v1/', '/auth/v1/', '/storage/v1/', '/realtime/v1/', '/functions/v1/', '/api/'];

// —————————————————————————————— Installation ——————————————————————————————

self.addEventListener('install', (event) => {
  event.waitUntil(precache());
});

/**
 * Précache la coquille et les assets du build. Chaque entrée est traitée
 * séparément : contrairement à `cache.addAll`, un fichier manquant ou servi en
 * erreur ne fait pas échouer toute l'installation.
 */
async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    PRECACHE_URLS.map(async (url) => {
      try {
        // `cache: 'reload'` court-circuite le cache HTTP du navigateur : on veut
        // les fichiers du déploiement courant, pas une version périmée.
        const response = await fetch(new Request(url, { cache: 'reload', credentials: 'same-origin' }));
        if (isCacheable(response)) await cache.put(url, response);
      } catch {
        /* réseau instable pendant l'installation : la ressource sera reprise à la demande */
      }
    }),
  );
}

// ——————————————————————————————— Activation ———————————————————————————————

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

/**
 * Le nouveau service worker attend délibérément : remplacer les assets sous
 * les pieds d'une application déjà chargée casserait le chargement des chunks
 * différés. C'est l'apprenant qui déclenche la bascule depuis la bannière
 * (voir src/components/OfflineBanner.tsx).
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// ————————————————————————————————— Requêtes —————————————————————————————————

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Autre origine : API Supabase, vidéos, polices distantes. On laisse passer
  // sans jamais stocker — une réponse authentifiée n'a rien à faire en cache.
  if (url.origin !== self.location.origin) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (NEVER_CACHE.some((prefix) => url.pathname.startsWith(prefix))) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstShell(request));
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(cacheThenRevalidate(request));
});

/**
 * Navigation : réseau d'abord pour toujours servir la dernière coquille, repli
 * sur la copie en cache dès que le réseau manque. Le serveur renvoyant
 * index.html pour toute URL (voir vercel.json / public/_redirects), la réponse
 * est rangée sous une clé unique plutôt qu'une entrée par route visitée.
 */
async function networkFirstShell(request) {
  try {
    const response = await fetch(request);
    if (isCacheable(response) && !response.redirected) {
      const copy = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(SHELL_URL, copy);
    }
    return response;
  } catch {
    const cached = await caches.match(SHELL_URL, { cacheName: CACHE_NAME });
    if (cached) return cached;
    return offlineFallback();
  }
}

/**
 * Assets hashés : leur contenu ne change jamais pour un nom donné, le cache
 * fait donc autorité. Un nouveau build produit de nouveaux noms.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request, { cacheName: CACHE_NAME });
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (isCacheable(response) && !isHtml(response)) {
      const copy = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, copy);
    }
    return response;
  } catch {
    return new Response('', { status: 504, statusText: 'Hors ligne' });
  }
}

/**
 * Ressources statiques non hashées (manifeste, icônes, robots.txt) : on sert
 * la copie locale tout de suite et on rafraîchit en arrière-plan.
 */
async function cacheThenRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (isCacheable(response)) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    // La revalidation ne doit pas retarder la réponse ni provoquer un rejet.
    network.catch(() => undefined);
    return cached;
  }

  const response = await network;
  return response ?? new Response('', { status: 504, statusText: 'Hors ligne' });
}

// ——————————————————————————————— Utilitaires ———————————————————————————————

/**
 * Une réponse n'est stockée que si elle est complète, valide et issue de notre
 * origine : jamais de 404, de 500, ni de réponse opaque (qu'on ne peut pas
 * inspecter et qui masquerait une erreur derrière un faux succès).
 */
function isCacheable(response) {
  return Boolean(response) && response.ok && response.type === 'basic' && response.status === 200;
}

/**
 * Le serveur renvoie index.html pour toute URL inconnue, routage côté client
 * oblige. Un asset supprimé ou mal déployé répond donc 200 avec du HTML : sans
 * ce garde-fou, on mettrait la coquille en cache sous le nom d'un fichier
 * JavaScript, et l'application se casserait durablement hors ligne.
 */
function isHtml(response) {
  const type = response.headers.get('content-type') || '';
  return type.includes('text/html');
}

/** Dernier recours : le cache est vide et le réseau absent. */
function offlineFallback() {
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hors ligne — FGF Campus</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f1f4f8;color:#131a2e;
       font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;padding:24px}
  div{max-width:34rem;text-align:center}
  h1{font-family:Georgia,'Times New Roman',serif;color:#03045e;font-size:1.6rem;margin:0 0 .6rem}
  p{color:#545e75;line-height:1.6;margin:0}
</style></head>
<body><div>
  <h1>Vous êtes hors ligne</h1>
  <p>Cette page n’a pas encore été consultée sur cet appareil, elle n’est donc pas disponible sans réseau.
     Reconnectez-vous, puis rouvrez le campus : les leçons déjà lues resteront accessibles.</p>
</div></body></html>`;
  return new Response(html, {
    status: 503,
    statusText: 'Hors ligne',
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
