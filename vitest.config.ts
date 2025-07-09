/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // Configuration des variables d'environnement pour les tests
    env: {
      NODE_ENV: 'test',
    },
    // Timeout global pour les tests
    testTimeout: 30000,
    // Configuration des hooks globaux
    globalSetup: './src/test/global-setup.ts',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}); 