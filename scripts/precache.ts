import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

/**
 * Injecte dans dist/sw.js la liste des fichiers à précacher et un identifiant
 * de version. Exécuté après `vite build`, comme scripts/sitemap.ts.
 *
 * Pourquoi un script plutôt qu'une liste écrite en dur : Vite hashe le nom des
 * fichiers de dist/assets à chaque build (index-Cgiw3cPY.js…). Le service
 * worker ne peut donc pas les connaître à l'avance. On lit dist/ après coup et
 * on réécrit le bloc délimité par `@precache:start` / `@precache:end`.
 *
 * Effet de bord utile : le contenu de sw.js change à chaque build dont les
 * assets changent, ce qui suffit au navigateur pour détecter une mise à jour
 * (il compare le fichier octet par octet).
 */

const dist = resolve(process.cwd(), 'dist');
const swPath = join(dist, 'sw.js');

/** Fichiers de dist/ à ne jamais précacher. */
const EXCLUDED_FILES = new Set(['sw.js', 'sitemap.xml', 'robots.txt', '_redirects', '.htaccess']);

/** Extensions précachées hors de dist/assets (ressources de la coquille). */
const SHELL_EXTENSIONS = ['.webmanifest', '.svg', '.ico', '.png', '.woff2'];

/** Au-delà, on préfère laisser la ressource se charger à la demande. */
const MAX_PRECACHE_BYTES = 2_500_000;

function walk(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (entry.isFile()) found.push(full);
  }
  return found;
}

function toUrl(file: string): string {
  return '/' + relative(dist, file).split(sep).join('/');
}

const files = walk(dist);

const assets: string[] = [];
const shell: string[] = [];

for (const file of files) {
  const url = toUrl(file);
  const name = url.slice(url.lastIndexOf('/') + 1);

  if (EXCLUDED_FILES.has(name)) continue;
  if (url.endsWith('.map')) continue;
  if (url === '/index.html') continue; // servi sous la clé « / »
  if (statSync(file).size > MAX_PRECACHE_BYTES) continue;

  if (url.startsWith('/assets/')) assets.push(url);
  else if (SHELL_EXTENSIONS.some((ext) => url.endsWith(ext))) shell.push(url);
}

assets.sort();
shell.sort();

// La coquille en premier : c'est elle qui rend l'application utilisable.
const urls = ['/', ...shell, ...assets];

/**
 * L'identifiant de version dérive du contenu réel du build : index.html plus
 * la liste (déjà hashée) des assets. Deux builds identiques donnent le même
 * identifiant, donc aucune purge de cache inutile.
 */
const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8');
const buildId = createHash('sha256')
  .update(indexHtml)
  .update(urls.join('\n'))
  .digest('hex')
  .slice(0, 12);

const block = [
  '/* @precache:start */',
  `const BUILD_ID = ${JSON.stringify(buildId)};`,
  'const PRECACHE_URLS = [',
  ...urls.map((url) => `  ${JSON.stringify(url)},`),
  '];',
  '/* @precache:end */',
].join('\n');

const source = readFileSync(swPath, 'utf8');
const marker = /\/\* @precache:start \*\/[\s\S]*?\/\* @precache:end \*\//;

if (!marker.test(source)) {
  console.error(
    'precache : marqueurs @precache:start / @precache:end introuvables dans dist/sw.js.\n' +
      'Vérifiez que public/sw.js les contient toujours.',
  );
  process.exit(1);
}

writeFileSync(swPath, source.replace(marker, block), 'utf8');

console.log(`sw.js : ${urls.length} URLs précachées, version ${buildId}`);
