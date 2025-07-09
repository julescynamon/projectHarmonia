// scripts/test-cors.ts
import { getAllowedOrigins, isOriginAllowed } from '../src/lib/cors-config';

/**
 * Script de test pour la configuration CORS
 * Vérifie que les origines sont correctement configurées
 */

console.log('🧪 Test de la configuration CORS\n');

// Test 1: Vérifier les origines autorisées
console.log('1. Origines autorisées :');
const allowedOrigins = getAllowedOrigins();
allowedOrigins.forEach(origin => {
  console.log(`   ✅ ${origin}`);
});

// Test 2: Tester des origines valides
console.log('\n2. Test des origines valides :');
const validOrigins = [
  'https://harmonia.jules.com',
  'https://www.harmonia.jules.com',
];

validOrigins.forEach(origin => {
  const isValid = isOriginAllowed(origin);
  console.log(`   ${isValid ? '✅' : '❌'} ${origin} -> ${isValid ? 'AUTORISÉ' : 'REFUSÉ'}`);
});

// Test 3: Tester des origines invalides
console.log('\n3. Test des origines invalides :');
const invalidOrigins = [
  'https://malicious-site.com',
  'http://harmonia.jules.com', // HTTP au lieu de HTTPS
  'https://fake-harmonia.com',
  'https://harmonia.jules.com.evil.com',
];

invalidOrigins.forEach(origin => {
  const isValid = isOriginAllowed(origin);
  console.log(`   ${!isValid ? '✅' : '❌'} ${origin} -> ${isValid ? 'AUTORISÉ' : 'REFUSÉ'}`);
});

// Test 4: Vérifier la configuration des variables d'environnement
console.log('\n4. Configuration des variables d\'environnement :');
let envOrigins: string | undefined;

try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    envOrigins = import.meta.env.CORS_ALLOWED_ORIGINS;
  } else {
    envOrigins = process.env.CORS_ALLOWED_ORIGINS;
  }
} catch (error) {
  envOrigins = process.env.CORS_ALLOWED_ORIGINS;
}

if (envOrigins) {
  console.log(`   📝 CORS_ALLOWED_ORIGINS: ${envOrigins}`);
} else {
  console.log('   📝 CORS_ALLOWED_ORIGINS: Non définie (utilisation des valeurs par défaut)');
}

// Test 5: Générer des exemples de commandes curl
console.log('\n5. Exemples de commandes curl pour tester :');
console.log('\n   Test d\'une requête preflight (OPTIONS) :');
console.log(`   curl -X OPTIONS \\`);
console.log(`     -H "Origin: https://harmonia.jules.com" \\`);
console.log(`     -H "Access-Control-Request-Method: POST" \\`);
console.log(`     -H "Access-Control-Request-Headers: Content-Type" \\`);
console.log(`     http://localhost:4321/api/health`);

console.log('\n   Test d\'une requête normale :');
console.log(`   curl -X GET \\`);
console.log(`     -H "Origin: https://harmonia.jules.com" \\`);
console.log(`     http://localhost:4321/api/health`);

console.log('\n   Test d\'une origine non autorisée :');
console.log(`   curl -X GET \\`);
console.log(`     -H "Origin: https://malicious-site.com" \\`);
console.log(`     http://localhost:4321/api/health`);

console.log('\n✅ Tests de configuration CORS terminés !');
console.log('\n💡 Pour tester en conditions réelles, démarrez votre serveur Astro et utilisez les commandes curl ci-dessus.'); 