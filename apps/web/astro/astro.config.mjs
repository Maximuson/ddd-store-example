import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@ddd-store/shared': path.resolve(__dirname, '../../../packages/shared/src'),
        '@ddd-store/shared/api': path.resolve(__dirname, '../../../packages/shared/src/api.ts'),
        '@ddd-store/auth': path.resolve(__dirname, '../../../packages/auth/src'),
        '@ddd-store/users': path.resolve(__dirname, '../../../packages/users/src'),
        '@ddd-store/catalog': path.resolve(__dirname, '../../../packages/catalog/src'),
        '@ddd-store/web-shared': path.resolve(__dirname, '../shared'),
      },
    },
  },
  server: { port: 4321 },
});
