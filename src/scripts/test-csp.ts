// src/scripts/test-csp.ts
import { generateCSPHeader } from '../lib/csp-config';

/**
 * Script de test pour vérifier la configuration CSP
 */
async function testCSPConfiguration() {
  console.log('🔒 Test de la configuration CSP...\n');

  try {
    // Générer le header CSP
    const cspHeader = generateCSPHeader();
    
    console.log('✅ Header CSP généré avec succès:');
    console.log('Content-Security-Policy:', cspHeader);
    console.log('\n📋 Analyse des directives:');
    
    // Analyser les directives
    const directives = cspHeader.split(';').map(d => d.trim());
    
    directives.forEach(directive => {
      if (directive) {
        const [name, ...values] = directive.split(' ');
        console.log(`  ${name}: ${values.join(' ')}`);
      }
    });

    // Vérifier les domaines critiques
    const criticalDomains = [
      'js.stripe.com',
      'checkout.stripe.com',
      'api.stripe.com',
      'supabase.co',
      'maps.googleapis.com'
    ];

    console.log('\n🔍 Vérification des domaines critiques:');
    criticalDomains.forEach(domain => {
      const isIncluded = cspHeader.includes(domain);
      console.log(`  ${domain}: ${isIncluded ? '✅' : '❌'}`);
    });

    // Vérifier les directives de sécurité strictes
    const strictDirectives = [
      'object-src \'none\'',
      'base-uri \'self\'',
      'form-action \'self\'',
      'upgrade-insecure-requests',
      'block-all-mixed-content'
    ];

    console.log('\n🛡️ Vérification des directives de sécurité strictes:');
    strictDirectives.forEach(directive => {
      const isIncluded = cspHeader.includes(directive);
      console.log(`  ${directive}: ${isIncluded ? '✅' : '❌'}`);
    });

    console.log('\n✅ Test CSP terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test CSP:', error);
  }
}

// Exécuter le test si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testCSPConfiguration();
}

export { testCSPConfiguration }; 