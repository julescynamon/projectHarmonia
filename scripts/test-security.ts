// scripts/test-security.ts
import { getSecurityConfig, generateSecurityHeaders, getDevelopmentSecurityConfig, getProductionSecurityConfig } from '../src/lib/security-config';

/**
 * Script de test pour la configuration des headers de sécurité HTTP
 * Vérifie que les headers de sécurité sont correctement configurés
 */

console.log('🔒 Test de la configuration des headers de sécurité HTTP\n');

// Test 1: Configuration par défaut
console.log('1. Configuration par défaut :');
const defaultConfig = getSecurityConfig();
console.log(`   📝 Frame Options: ${defaultConfig.frameOptions}`);
console.log(`   📝 Content Type Options: ${defaultConfig.contentTypeOptions}`);
console.log(`   📝 XSS Protection: ${defaultConfig.xssProtection}`);
console.log(`   📝 Referrer Policy: ${defaultConfig.referrerPolicy}`);
console.log(`   📝 HSTS activé: ${defaultConfig.hsts ? 'Oui' : 'Non'}`);

// Test 2: Headers générés
console.log('\n2. Headers de sécurité générés :');
const securityHeaders = generateSecurityHeaders();
Object.entries(securityHeaders).forEach(([key, value]) => {
  console.log(`   ✅ ${key}: ${value}`);
});

// Test 3: Configuration de développement
console.log('\n3. Configuration de développement :');
const devConfig = getDevelopmentSecurityConfig();
console.log(`   📝 Frame Options: ${devConfig.frameOptions} (plus permissif)`);
console.log(`   📝 Referrer Policy: ${devConfig.referrerPolicy} (plus permissif)`);
console.log(`   📝 HSTS activé: ${devConfig.hsts ? 'Oui' : 'Non'}`);

// Test 4: Configuration de production
console.log('\n4. Configuration de production :');
const prodConfig = getProductionSecurityConfig();
console.log(`   📝 Frame Options: ${prodConfig.frameOptions} (strict)`);
console.log(`   📝 Referrer Policy: ${prodConfig.referrerPolicy} (strict)`);
console.log(`   📝 HSTS activé: ${prodConfig.hsts ? 'Oui' : 'Non'}`);
if (prodConfig.hsts) {
  console.log(`   📝 HSTS max-age: ${prodConfig.hsts.maxAge} secondes`);
  console.log(`   📝 HSTS includeSubDomains: ${prodConfig.hsts.includeSubDomains}`);
  console.log(`   📝 HSTS preload: ${prodConfig.hsts.preload}`);
}

// Test 5: Chemins exclus
console.log('\n5. Chemins exclus des headers de sécurité :');
const excludePaths = defaultConfig.excludePaths || [];
excludePaths.forEach(path => {
  console.log(`   🚫 ${path}`);
});

// Test 6: Variables d'environnement
console.log('\n6. Variables d\'environnement de sécurité :');
let envVars: Record<string, string | undefined> = {};

try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    envVars = {
      'SECURITY_FRAME_OPTIONS': import.meta.env.SECURITY_FRAME_OPTIONS,
      'SECURITY_REFERRER_POLICY': import.meta.env.SECURITY_REFERRER_POLICY,
      'SECURITY_XSS_PROTECTION': import.meta.env.SECURITY_XSS_PROTECTION,
      'SECURITY_FRAME_OPTIONS_URL': import.meta.env.SECURITY_FRAME_OPTIONS_URL,
      'SECURITY_PERMISSIONS_POLICY': import.meta.env.SECURITY_PERMISSIONS_POLICY,
    };
  } else {
    envVars = {
      'SECURITY_FRAME_OPTIONS': process.env.SECURITY_FRAME_OPTIONS,
      'SECURITY_REFERRER_POLICY': process.env.SECURITY_REFERRER_POLICY,
      'SECURITY_XSS_PROTECTION': process.env.SECURITY_XSS_PROTECTION,
      'SECURITY_FRAME_OPTIONS_URL': process.env.SECURITY_FRAME_OPTIONS_URL,
      'SECURITY_PERMISSIONS_POLICY': process.env.SECURITY_PERMISSIONS_POLICY,
    };
  }
} catch (error) {
  envVars = {
    'SECURITY_FRAME_OPTIONS': process.env.SECURITY_FRAME_OPTIONS,
    'SECURITY_REFERRER_POLICY': process.env.SECURITY_REFERRER_POLICY,
    'SECURITY_XSS_PROTECTION': process.env.SECURITY_XSS_PROTECTION,
    'SECURITY_FRAME_OPTIONS_URL': process.env.SECURITY_FRAME_OPTIONS_URL,
    'SECURITY_PERMISSIONS_POLICY': process.env.SECURITY_PERMISSIONS_POLICY,
  };
}

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`   ${value ? '📝' : '❌'} ${key}: ${value || 'Non définie'}`);
});

// Test 7: Exemples de commandes curl pour tester
console.log('\n7. Exemples de commandes curl pour tester :');
console.log('\n   Test des headers de sécurité :');
console.log(`   curl -I http://localhost:4321/`);
console.log(`   # Devrait retourner les headers de sécurité`);

console.log('\n   Test d\'un chemin exclu :');
console.log(`   curl -I http://localhost:4321/api/health`);
console.log(`   # Ne devrait pas avoir tous les headers de sécurité`);

console.log('\n   Test avec un navigateur :');
console.log(`   # Ouvrez http://localhost:4321/ dans votre navigateur`);
console.log(`   # Vérifiez les headers dans les outils de développement (F12)`);

// Test 8: Validation de la sécurité
console.log('\n8. Validation de la sécurité :');
const securityScore = {
  frameOptions: defaultConfig.frameOptions === 'DENY' ? 1 : 0,
  contentTypeOptions: defaultConfig.contentTypeOptions === 'nosniff' ? 1 : 0,
  xssProtection: defaultConfig.xssProtection.includes('1') ? 1 : 0,
  referrerPolicy: defaultConfig.referrerPolicy.includes('strict') ? 1 : 0,
  hsts: defaultConfig.hsts ? 1 : 0,
  permissionsPolicy: defaultConfig.permissionsPolicy.includes('camera=()') ? 1 : 0,
};

const totalScore = Object.values(securityScore).reduce((sum, score) => sum + score, 0);
const maxScore = Object.keys(securityScore).length;

console.log(`   🛡️  Score de sécurité: ${totalScore}/${maxScore}`);
console.log(`   ${totalScore === maxScore ? '✅' : '⚠️'} Configuration ${totalScore === maxScore ? 'optimale' : 'à améliorer'}`);

Object.entries(securityScore).forEach(([key, score]) => {
  console.log(`   ${score ? '✅' : '❌'} ${key}: ${score ? 'Configuré' : 'Manquant'}`);
});

console.log('\n✅ Tests de configuration des headers de sécurité terminés !');
console.log('\n💡 Pour tester en conditions réelles, démarrez votre serveur Astro et utilisez les commandes curl ci-dessus.'); 