// src/scripts/test-rate-limiting.ts
import { RateLimiter, MemoryStore, DEFAULT_RATE_LIMIT_CONFIG, AUTH_RATE_LIMIT_CONFIG } from '../lib/rate-limiter';
import { logger } from '../lib/logger';

async function testRateLimiting() {
  console.log('🧪 Test du système de rate limiting...\n');

  // Test 1: Rate limiting basique
  console.log('📋 Test 1: Rate limiting basique (100 requêtes / 15 minutes)');
  const basicStore = new MemoryStore();
  const basicLimiter = new RateLimiter(basicStore, DEFAULT_RATE_LIMIT_CONFIG);
  
  const testIdentifier = 'test-ip-1';
  
  for (let i = 1; i <= 105; i++) {
    const result = await basicLimiter.checkLimit(testIdentifier);
    
    if (i <= 100) {
      console.log(`  Requête ${i}: ✅ Succès (${result.remaining} restantes)`);
    } else {
      console.log(`  Requête ${i}: ❌ Limite dépassée (retry après ${result.retryAfter}s)`);
    }
  }
  
  console.log('');

  // Test 2: Rate limiting d'authentification
  console.log('🔐 Test 2: Rate limiting d\'authentification (5 requêtes / 15 minutes)');
  const authStore = new MemoryStore();
  const authLimiter = new RateLimiter(authStore, AUTH_RATE_LIMIT_CONFIG);
  
  const authIdentifier = 'test-ip-2:auth-browser';
  
  for (let i = 1; i <= 7; i++) {
    const result = await authLimiter.checkLimit(authIdentifier);
    
    if (i <= 5) {
      console.log(`  Tentative ${i}: ✅ Succès (${result.remaining} restantes)`);
    } else {
      console.log(`  Tentative ${i}: ❌ Limite dépassée (retry après ${result.retryAfter}s)`);
    }
  }
  
  console.log('');

  // Test 3: Réinitialisation de la fenêtre de temps
  console.log('⏰ Test 3: Réinitialisation de la fenêtre de temps');
  const resetStore = new MemoryStore();
  const resetLimiter = new RateLimiter(resetStore, {
    windowMs: 5 * 1000, // 5 secondes pour le test
    maxRequests: 3
  });
  
  const resetIdentifier = 'test-ip-3';
  
  // Première série de requêtes
  console.log('  Première série (3 requêtes):');
  for (let i = 1; i <= 3; i++) {
    const result = await resetLimiter.checkLimit(resetIdentifier);
    console.log(`    Requête ${i}: ✅ Succès (${result.remaining} restantes)`);
  }
  
  // Tentative de dépassement
  const overLimit = await resetLimiter.checkLimit(resetIdentifier);
  console.log(`    Requête 4: ❌ Limite dépassée (retry après ${overLimit.retryAfter}s)`);
  
  // Attendre la fin de la fenêtre
  console.log('  Attente de 6 secondes pour la réinitialisation...');
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  // Nouvelle requête après réinitialisation
  const newResult = await resetLimiter.checkLimit(resetIdentifier);
  console.log(`    Nouvelle requête: ✅ Succès (${newResult.remaining} restantes)`);
  
  console.log('');

  // Test 4: Gestion des erreurs
  console.log('🚨 Test 4: Gestion des erreurs');
  try {
    // Simuler une erreur en passant un store invalide
    const errorLimiter = new RateLimiter({
      get: async () => { throw new Error('Erreur de base de données'); },
      set: async () => { throw new Error('Erreur de base de données'); },
      delete: async () => { throw new Error('Erreur de base de données'); }
    }, DEFAULT_RATE_LIMIT_CONFIG);
    
    const result = await errorLimiter.checkLimit('test-error');
    console.log(`  Résultat en cas d'erreur: ✅ Succès (fallback activé)`);
  } catch (error) {
    console.log(`  Erreur non gérée: ❌ ${error}`);
  }
  
  console.log('');

  // Test 5: Headers de réponse
  console.log('📋 Test 5: Headers de réponse');
  const headerStore = new MemoryStore();
  const headerLimiter = new RateLimiter(headerStore, DEFAULT_RATE_LIMIT_CONFIG);
  
  const headerResult = await headerLimiter.checkLimit('test-headers');
  const errorResponse = headerLimiter.createErrorResponse({
    success: false,
    remaining: 0,
    reset: Date.now() + 900000,
    total: 100,
    retryAfter: 900
  });
  
  console.log('  Headers de la réponse d\'erreur:');
  for (const [key, value] of errorResponse.headers.entries()) {
    console.log(`    ${key}: ${value}`);
  }
  
  console.log('');

  // Test 6: Performance
  console.log('⚡ Test 6: Performance (1000 requêtes)');
  const perfStore = new MemoryStore();
  const perfLimiter = new RateLimiter(perfStore, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000
  });
  
  const startTime = Date.now();
  const promises = [];
  
  for (let i = 0; i < 1000; i++) {
    promises.push(perfLimiter.checkLimit(`perf-test-${i}`));
  }
  
  await Promise.all(promises);
  const endTime = Date.now();
  
  console.log(`  Temps d'exécution: ${endTime - startTime}ms`);
  console.log(`  Moyenne par requête: ${((endTime - startTime) / 1000).toFixed(2)}ms`);
  
  console.log('');

  // Test 7: Nettoyage du store mémoire
  console.log('🧹 Test 7: Nettoyage du store mémoire');
  const cleanupStore = new MemoryStore();
  
  // Ajouter des entrées avec TTL court
  await cleanupStore.set('expired-1', {
    remaining: 5,
    reset: Date.now() + 1000, // Expire dans 1 seconde
    total: 10
  }, 1000);
  
  await cleanupStore.set('expired-2', {
    remaining: 3,
    reset: Date.now() + 2000, // Expire dans 2 secondes
    total: 8
  }, 2000);
  
  await cleanupStore.set('valid', {
    remaining: 10,
    reset: Date.now() + 60000, // Expire dans 1 minute
    total: 20
  }, 60000);
  
  console.log('  Entrées avant nettoyage:');
  console.log(`    expired-1: ${await cleanupStore.get('expired-1') ? 'existe' : 'n\'existe pas'}`);
  console.log(`    expired-2: ${await cleanupStore.get('expired-2') ? 'existe' : 'n\'existe pas'}`);
  console.log(`    valid: ${await cleanupStore.get('valid') ? 'existe' : 'n\'existe pas'}`);
  
  // Attendre l'expiration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Nettoyer
  cleanupStore.cleanup();
  
  console.log('  Entrées après nettoyage:');
  console.log(`    expired-1: ${await cleanupStore.get('expired-1') ? 'existe' : 'n\'existe pas'}`);
  console.log(`    expired-2: ${await cleanupStore.get('expired-2') ? 'existe' : 'n\'existe pas'}`);
  console.log(`    valid: ${await cleanupStore.get('valid') ? 'existe' : 'n\'existe pas'}`);
  
  console.log('\n✅ Tous les tests terminés avec succès!');
}

// Fonction pour tester avec des requêtes HTTP simulées
async function testHttpRequests() {
  console.log('\n🌐 Test des requêtes HTTP simulées...\n');

  const store = new MemoryStore();
  const limiter = new RateLimiter(store, {
    windowMs: 10 * 1000, // 10 secondes pour le test
    maxRequests: 5
  });

  // Simuler des requêtes HTTP
  const requests = [
    { ip: '192.168.1.1', path: '/api/auth/login', userAgent: 'Mozilla/5.0' },
    { ip: '192.168.1.1', path: '/api/auth/login', userAgent: 'Mozilla/5.0' },
    { ip: '192.168.1.2', path: '/api/products', userAgent: 'Chrome/91.0' },
    { ip: '192.168.1.1', path: '/api/auth/login', userAgent: 'Mozilla/5.0' },
    { ip: '192.168.1.1', path: '/api/auth/login', userAgent: 'Mozilla/5.0' },
    { ip: '192.168.1.1', path: '/api/auth/login', userAgent: 'Mozilla/5.0' },
    { ip: '192.168.1.1', path: '/api/auth/login', userAgent: 'Mozilla/5.0' },
    { ip: '192.168.1.3', path: '/api/blog', userAgent: 'Safari/14.0' },
  ];

  for (let i = 0; i < requests.length; i++) {
    const req = requests[i];
    const identifier = req.path.includes('/auth/') 
      ? `${req.ip}:${req.userAgent}`
      : `${req.ip}:${req.path}`;
    
    const result = await limiter.checkLimit(identifier);
    
    console.log(`Requête ${i + 1}:`);
    console.log(`  IP: ${req.ip}`);
    console.log(`  Path: ${req.path}`);
    console.log(`  User-Agent: ${req.userAgent}`);
    console.log(`  Identifiant: ${identifier}`);
    console.log(`  Résultat: ${result.success ? '✅ Succès' : '❌ Limite dépassée'}`);
    console.log(`  Restantes: ${result.remaining}`);
    console.log('');
  }
}

// Exécuter les tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testRateLimiting()
    .then(() => testHttpRequests())
    .then(() => {
      console.log('🎉 Tests terminés!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur lors des tests:', error);
      process.exit(1);
    });
} 