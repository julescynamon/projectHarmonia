// src/lib/test-env.ts
import { config } from 'dotenv';
import { resolve } from 'path';

/**
 * Charge les variables d'environnement de test
 * Utilise .env.test si disponible, sinon utilise les variables par défaut
 */
export function loadTestEnvironment(): void {
  const testEnvPath = resolve(process.cwd(), '.env.test');
  const exampleEnvPath = resolve(process.cwd(), 'config', 'test.env.example');
  
  try {
    // Essayer de charger .env.test
    config({ path: testEnvPath });
    console.log('✅ Variables d\'environnement de test chargées depuis .env.test');
  } catch (error) {
    // Si .env.test n'existe pas, charger l'exemple
    try {
      config({ path: exampleEnvPath });
      console.log('⚠️  Variables d\'environnement de test chargées depuis config/test.env.example');
      console.log('💡 Créez un fichier .env.test basé sur config/test.env.example pour personnaliser vos variables');
    } catch (exampleError) {
      console.warn('⚠️  Impossible de charger les variables d\'environnement de test');
      console.warn('💡 Créez un fichier .env.test basé sur config/test.env.example');
    }
  }
}

/**
 * Configuration des variables d'environnement par défaut pour les tests
 */
export const TEST_ENV_DEFAULTS = {
  // Supabase
  PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
  PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-anon-key',
  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-service-key',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-service-key',
  SUPABASE_JWT_SECRET: 'test-jwt-secret-key-for-testing-only',
  
  // Stripe
  STRIPE_SECRET_KEY: 'sk_test_51TestKeyForTestingOnly',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_51TestKeyForTestingOnly',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_webhook_secret_for_testing',
  
  // Astro
  WEBSITE_URL: 'http://localhost:4322',
  WEBSITE_NAME: 'La Maison Sattvaïa Test',
  DEV: 'true',
  PROD: 'false',
  API_SECRET_KEY: 'test-api-secret-key-for-testing-only',
  
  // Email
  RESEND_API_KEY: 're_test_key_for_testing_only',
  FROM_EMAIL: 'test@maisonsattvaia-test.fr',
  SUPPORT_EMAIL: 'support@maisonsattvaia-test.fr',
  
  // Sécurité
  CORS_ALLOWED_ORIGINS: 'http://localhost:4322,http://localhost:3000,https://test.la-maison-sattvaia.com',
  
  // Monitoring
  SENTRY_DSN: 'https://test@sentry.io/test-project',
  SENTRY_ENVIRONMENT: 'test',
  LOGTAIL_API_KEY: 'test_logtail_key_for_testing',
  
  // Cache
  REDIS_URL: 'redis://localhost:6379/1',
  CACHE_TTL: '300',
  CACHE_MAX_SIZE: '1000',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: '60000',
  RATE_LIMIT_MAX_REQUESTS: '100',
  
  // Tests
  BASE_URL: 'http://localhost:4322',
  TEST_TIMEOUT: '30000',
  MOCK_EXTERNAL_SERVICES: 'true',
  NODE_ENV: 'test',
  PERFORMANCE_TEST_ENABLED: 'false'
};

/**
 * Applique les variables d'environnement par défaut si elles ne sont pas définies
 */
export function applyTestDefaults(): void {
  Object.entries(TEST_ENV_DEFAULTS).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

/**
 * Vérifie que toutes les variables d'environnement requises sont présentes
 */
export function validateTestEnvironment(): boolean {
  const requiredVars = [
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY',
    'STRIPE_SECRET_KEY',
    'API_SECRET_KEY',
    'RESEND_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes pour les tests:', missingVars);
    console.error('💡 Assurez-vous que ces variables sont définies dans votre fichier .env.test');
    return false;
  }
  
  console.log('✅ Toutes les variables d\'environnement de test sont présentes');
  return true;
}

/**
 * Initialise l'environnement de test complet
 */
export function initializeTestEnvironment(): boolean {
  loadTestEnvironment();
  applyTestDefaults();
  return validateTestEnvironment();
} 