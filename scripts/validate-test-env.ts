#!/usr/bin/env tsx

/**
 * Script de validation de l'environnement de test
 * Usage: npm run test:validate
 */

import { initializeTestEnvironment, validateTestEnvironment } from '../src/lib/test-env';

function validateTestSetup() {
  console.log('🔍 Validation de l\'environnement de test...\n');
  
  try {
    // Initialiser l'environnement de test
    const isValid = initializeTestEnvironment();
    
    if (!isValid) {
      console.error('❌ Environnement de test invalide');
      console.log('\n💡 Pour configurer l\'environnement de test :');
      console.log('   1. Copiez config/test.env.example vers .env.test');
      console.log('   2. Modifiez les variables selon vos besoins');
      console.log('   3. Ou exécutez : npm run test:setup');
      process.exit(1);
    }
    
    // Vérifications supplémentaires
    console.log('✅ Variables d\'environnement de base validées');
    
    // Vérifier les variables critiques
    const criticalVars = [
      'PUBLIC_SUPABASE_URL',
      'PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_KEY',
      'STRIPE_SECRET_KEY',
      'API_SECRET_KEY',
      'RESEND_API_KEY'
    ];
    
    const missingCritical = criticalVars.filter(varName => !process.env[varName]);
    
    if (missingCritical.length > 0) {
      console.error('❌ Variables critiques manquantes:', missingCritical);
      process.exit(1);
    }
    
    // Vérifier les formats des URLs
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
      console.warn('⚠️  PUBLIC_SUPABASE_URL ne semble pas être une URL Supabase valide');
    }
    
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.startsWith('sk_test_')) {
      console.warn('⚠️  STRIPE_SECRET_KEY ne semble pas être une clé de test Stripe');
    }
    
    // Vérifier la configuration des tests
    console.log('✅ Configuration des tests validée');
    console.log(`   - Base URL: ${process.env.BASE_URL}`);
    console.log(`   - Timeout: ${process.env.TEST_TIMEOUT}ms`);
    console.log(`   - Mode: ${process.env.NODE_ENV}`);
    
    console.log('\n🎯 Environnement de test prêt !');
    console.log('📝 Commandes disponibles :');
    console.log('   npm run test:run      - Exécuter tous les tests unitaires');
    console.log('   npm run test:watch    - Exécuter les tests en mode watch');
    console.log('   npm run test:e2e      - Exécuter les tests E2E');
    console.log('   npm run test:coverage - Exécuter les tests avec couverture');
    console.log('   npm run test:all      - Exécuter tous les tests');
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error);
    process.exit(1);
  }
}

// Exécuter la validation
validateTestSetup(); 