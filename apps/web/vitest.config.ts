import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@ddd-store/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@ddd-store/shared/api': path.resolve(__dirname, '../../packages/shared/src/api.ts'),
      '@ddd-store/auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@ddd-store/users': path.resolve(__dirname, '../../packages/users/src'),
      '@ddd-store/catalog': path.resolve(__dirname, '../../packages/catalog/src'),
    },
  },
  test: {
    environment: 'jsdom',
  },
});
