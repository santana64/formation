import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

/**
 * Valide la grammaire PostgreSQL des migrations sans serveur ni conteneur.
 *
 * Motivation : ces migrations sont écrites hors ligne et ne sont exécutées que
 * le jour de la mise en service. Une faute de syntaxe ne se découvrait donc
 * qu'à ce moment-là — c'est ainsi qu'un `returns table (… position int)` est
 * passé inaperçu, `position` étant un mot réservé qui doit être cité.
 *
 * Limite à connaître : l'analyseur valide les instructions SQL de premier
 * niveau. Le corps des fonctions plpgsql est un littéral de chaîne à ses yeux
 * et n'est pas analysé — une erreur à l'intérieur d'un `begin … end` ne sera
 * révélée qu'à l'exécution réelle sur la base.
 */

const dir = resolve(process.cwd(), 'supabase/migrations');

type Parser = (sql: string) => Promise<{ stmts?: unknown[] }>;

// libpg-query est un paquet CommonJS : on le charge par require plutôt que par
// import, dont l'interopérabilité varie selon le chargeur (node, vite-node).
const mod = createRequire(import.meta.url)('libpg-query') as {
  parse?: Parser;
  default?: { parse?: Parser };
};
const parse = mod.parse ?? mod.default?.parse;

if (!parse) {
  console.error('libpg-query n’expose pas de fonction parse : vérifiez la version installée.');
  process.exit(1);
}

let failed = false;

for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
  const sql = readFileSync(join(dir, file), 'utf8');
  try {
    const result = await parse(sql);
    console.log(`  ok      ${file} — ${result.stmts?.length ?? 0} instructions`);
  } catch (error) {
    failed = true;
    console.error(`  ÉCHEC   ${file} : ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) {
  console.error('\nLa grammaire d’au moins une migration est invalide : elle échouerait à l’exécution.');
  process.exit(1);
}

console.log('\nGrammaire valide. Le corps des fonctions plpgsql reste à vérifier sur une vraie base.');
