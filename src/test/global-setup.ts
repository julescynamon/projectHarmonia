// src/test/global-setup.ts
import { initializeTestEnvironment } from '../lib/test-env';

/**
 * Configuration globale pour tous les tests
 * Ce fichier est exécuté une seule fois avant tous les tests
 */
export default async function globalSetup(): Promise<void> {
  console.log('🚀 Initialisation de l\'environnement de test...');
  
  // Initialiser les variables d'environnement de test
  const isValid = initializeTestEnvironment();
  
  if (!isValid) {
    console.error('❌ Échec de l\'initialisation de l\'environnement de test');
    process.exit(1);
  }
  
  console.log('✅ Environnement de test initialisé avec succès');
  
  // Configuration supplémentaire pour les tests
  process.env.NODE_ENV = 'test';
  process.env.TEST_MODE = 'true';
  
  // Désactiver les logs de production pendant les tests
  process.env.LOG_LEVEL = 'error';
  
  console.log('🎯 Tests prêts à être exécutés');
} 