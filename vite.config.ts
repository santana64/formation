import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Le sitemap est généré après le build par scripts/sitemap.ts, qui lit le
// contenu réel des parcours. Le garder hors de cette configuration évite
// d'importer le code applicatif dans le projet TypeScript de la config.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Sépare les dépendances du contenu : le bundle applicatif change à
        // chaque mise à jour de leçon, pas le socle React, qui reste en cache.
        manualChunks(id: string) {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
