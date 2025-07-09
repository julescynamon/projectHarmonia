import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';
import { initializeTestEnvironment } from '../lib/test-env';

// Initialiser l'environnement de test si ce n'est pas déjà fait
if (process.env.NODE_ENV !== 'test') {
  initializeTestEnvironment();
}

// Configuration globale pour les tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock des variables d'environnement globales pour les tests
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:4322',
    origin: 'http://localhost:4322',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock de fetch pour les tests
global.fetch = vi.fn();

// Mock de console pour réduire le bruit dans les tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
}); 