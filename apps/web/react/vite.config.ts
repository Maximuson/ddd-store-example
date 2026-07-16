import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_USE_MOCK': JSON.stringify(process.env.VITE_USE_MOCK ?? 'true'),
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@ddd-store/shared': path.resolve(__dirname, '../../../packages/shared/src'),
      '@ddd-store/shared/api': path.resolve(__dirname, '../../../packages/shared/src/api.ts'),
      '@ddd-store/auth': path.resolve(__dirname, '../../../packages/auth/src'),
      '@ddd-store/users': path.resolve(__dirname, '../../../packages/users/src'),
      '@ddd-store/catalog': path.resolve(__dirname, '../../../packages/catalog/src'),
      '@ddd-store/web-shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 5173,
  },
});
