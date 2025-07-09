# Système de Limitation de Débit (Rate Limiting)

Ce document décrit l'implémentation du système de limitation de débit pour protéger les routes API contre les abus et les attaques par déni de service.

## 🎯 Objectifs

- **Protection contre les abus** : Limiter le nombre de requêtes par IP
- **Sécurité renforcée** : Protection spéciale pour les routes d'authentification
- **Performance optimisée** : Stockage en mémoire ou Redis selon l'environnement
- **Flexibilité** : Configuration différente selon les types de routes
- **Monitoring** : Logging détaillé et headers informatifs

## 🏗️ Architecture

### Composants principaux

1. **RateLimiter** : Classe principale gérant la logique de limitation
2. **MemoryStore** : Adaptateur de stockage en mémoire
3. **RedisStore** : Adaptateur de stockage Redis (optionnel)
4. **Middleware** : Intégration avec Astro et autres frameworks

### Configuration par défaut

```typescript
// Configuration générale
DEFAULT_RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requêtes max
  message: "Trop de requêtes, veuillez réessayer plus tard.",
  statusCode: 429,
  headers: true,
};

// Configuration stricte pour les routes sensibles
STRICT_RATE_LIMIT_CONFIG = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20, // 20 requêtes max
  message: "Trop de tentatives, veuillez réessayer dans 5 minutes.",
  statusCode: 429,
  headers: true,
};

// Configuration pour l'authentification
AUTH_RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 tentatives max
  message: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
  statusCode: 429,
  headers: true,
};
```

## 🚀 Utilisation

### 1. Avec Astro (déjà configuré)

Le système est automatiquement intégré dans le middleware principal (`src/middleware.ts`). Les routes sont protégées selon leur type :

- **Routes d'authentification** : 5 tentatives / 15 minutes
- **Routes admin** : 20 requêtes / 5 minutes
- **Routes API générales** : 100 requêtes / 15 minutes
- **Routes de contact** : 10 messages / 10 minutes
- **Routes de newsletter** : 5 inscriptions / heure

### 2. Utilisation manuelle

```typescript
import {
  RateLimiter,
  MemoryStore,
  DEFAULT_RATE_LIMIT_CONFIG,
} from "./lib/rate-limiter";

// Créer un rate limiter
const store = new MemoryStore();
const limiter = new RateLimiter(store, DEFAULT_RATE_LIMIT_CONFIG);

// Vérifier une limite
const result = await limiter.checkLimit("user-ip-123");

if (!result.success) {
  // Limite dépassée
  return limiter.createErrorResponse(result);
}

// Continuer le traitement
console.log(`${result.remaining} requêtes restantes`);
```

### 3. Avec Redis (optionnel)

```typescript
import { RedisRateLimitManager } from "./lib/rate-limiter-redis";

// Initialiser avec Redis
const manager = new RedisRateLimitManager({
  url: "redis://localhost:6379",
});

await manager.initialize();

// Utiliser le manager
const result = await manager.checkLimit("user-ip-123", {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});
```

## 📊 Headers de réponse

Le système ajoute automatiquement des headers informatifs :

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200000
Retry-After: 900
```

## 🔧 Configuration

### Variables d'environnement

```bash
# Pour utiliser Redis (optionnel)
REDIS_URL=redis://localhost:6379

# Configuration personnalisée
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Configuration par route

```typescript
// Dans src/middleware/rate-limiting.ts
const RATE_LIMIT_ROUTES = {
  "/api/auth/login": AUTH_RATE_LIMIT_CONFIG,
  "/api/admin": STRICT_RATE_LIMIT_CONFIG,
  "/api/contact": {
    windowMs: 10 * 60 * 1000,
    maxRequests: 10,
    message: "Trop de messages envoyés",
  },
};
```

## 🧪 Tests

### Exécuter les tests

```bash
npm run test:rate-limiting
```

### Tests inclus

1. **Test basique** : Vérification des limites
2. **Test d'authentification** : Limites strictes
3. **Test de réinitialisation** : Fenêtres de temps
4. **Test de gestion d'erreurs** : Fallback en cas de problème
5. **Test des headers** : Vérification des réponses
6. **Test de performance** : 1000 requêtes simultanées
7. **Test de nettoyage** : Gestion de la mémoire

## 📈 Monitoring

### Logs automatiques

Le système génère des logs détaillés :

```json
{
  "level": "info",
  "message": "Vérification du rate limit",
  "identifier": "192.168.1.1:/api/auth/login",
  "remaining": 4,
  "total": 1,
  "success": true
}
```

### Statistiques Redis

Si Redis est utilisé, un endpoint `/api/admin/redis-stats` est disponible :

```json
{
  "connected": true,
  "memory": {
    "used_memory": "1234567",
    "used_memory_peak": "2345678"
  },
  "keys": 150,
  "info": {
    "redis_version": "6.2.0",
    "uptime_in_seconds": "3600"
  }
}
```

## 🔒 Sécurité

### Identifiants de requête

- **Routes d'authentification** : `IP:User-Agent`
- **Autres routes** : `IP:Path`

### Protection contre les contournements

- Détection de l'IP réelle via headers proxy
- Combinaison IP + User-Agent pour l'auth
- TTL automatique sur les entrées
- Nettoyage périodique de la mémoire

## 🚨 Gestion des erreurs

### Fallback automatique

En cas d'erreur Redis ou autre :

- Le système continue de fonctionner
- Les requêtes sont autorisées par défaut
- Les erreurs sont loggées

### Messages d'erreur

```json
{
  "error": "Rate limit exceeded",
  "message": "Trop de requêtes, veuillez réessayer plus tard.",
  "retryAfter": 900
}
```

## 🔄 Migration et mise à jour

### Ajouter une nouvelle route

1. Ajouter la configuration dans `RATE_LIMIT_ROUTES`
2. Tester avec `npm run test:rate-limiting`
3. Déployer

### Changer de store

1. Modifier `initializeRateLimitStore()` dans le middleware
2. Ajouter les variables d'environnement nécessaires
3. Tester la migration

## 📚 Exemples d'utilisation

### Express.js

```typescript
import { setupExpressRateLimiting } from "./lib/rate-limiter-node-adapter";

const app = express();
const manager = setupExpressRateLimiting(app);
```

### Fastify

```typescript
import { setupFastifyRateLimiting } from "./lib/rate-limiter-node-adapter";

const fastify = require("fastify")();
const manager = setupFastifyRateLimiting(fastify);
```

### Koa

```typescript
import { setupKoaRateLimiting } from "./lib/rate-limiter-node-adapter";

const app = new Koa();
const manager = setupKoaRateLimiting(app);
```

## 🎯 Bonnes pratiques

1. **Testez en développement** : Utilisez des limites plus permissives
2. **Monitorer en production** : Surveillez les logs et statistiques
3. **Ajustez selon l'usage** : Adaptez les limites à votre trafic
4. **Utilisez Redis en production** : Pour la persistance et la scalabilité
5. **Documentez les changements** : Gardez une trace des modifications

## 🔧 Dépannage

### Problèmes courants

1. **Limites trop strictes** : Ajustez `maxRequests` ou `windowMs`
2. **Erreurs Redis** : Vérifiez la connexion et les logs
3. **Performance** : Utilisez Redis pour de gros volumes
4. **Faux positifs** : Vérifiez la détection d'IP

### Commandes utiles

```bash
# Tester le système
npm run test:rate-limiting

# Vérifier les logs
tail -f logs/app.log | grep "rate limit"

# Statistiques Redis
curl http://localhost:3000/api/admin/redis-stats
```
