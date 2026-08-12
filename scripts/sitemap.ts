import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { courses } from '../src/data';

/**
 * Génère dist/sitemap.xml et dist/robots.txt à partir du contenu réel des
 * parcours : chaque leçon et chaque QCM y figure. Exécuté après `vite build`.
 *
 * URL publique surchargeable :  SITE_URL=https://mon-domaine.fr npm run build
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://campus.fgfconsultant.fr').replace(/\/$/, '');

const paths = [
  '/',
  '/formations',
  '/recherche',
  '/revision',
  '/entrainement',
  '/progression',
  '/a-propos',
  '/mentions-legales',
  '/confidentialite',
  '/accessibilite',
];

for (const course of courses) {
  paths.push(`/formations/${course.id}`);
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      paths.push(`/formations/${course.id}/modules/${mod.id}/lecons/${lesson.id}`);
    }
    paths.push(`/formations/${course.id}/modules/${mod.id}/qcm`);
  }
}

const today = new Date().toISOString().slice(0, 10);
const urls = paths
  .map(
    (p) =>
      `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>monthly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.7'}</priority>\n  </url>`,
  )
  .join('\n');

const dist = resolve(process.cwd(), 'dist');

writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
);

writeFileSync(
  resolve(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  'utf8',
);

console.log(`sitemap.xml : ${paths.length} URLs sur ${SITE_URL}`);
