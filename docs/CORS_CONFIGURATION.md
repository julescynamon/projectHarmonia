# Configuration CORS Sécurisée

## Vue d'ensemble

Cette configuration CORS (Cross-Origin Resource Sharing) sécurisée pour Astro permet de contrôler précisément quelles origines peuvent accéder à votre API, tout en maintenant une sécurité optimale.

## Fonctionnalités

- ✅ **Origines autorisées configurables** via variables d'environnement
- ✅ **Headers de sécurité** optimisés pour Supabase et les applications modernes
- ✅ **Gestion des requêtes preflight** (OPTIONS) automatique
- ✅ **Support des credentials** pour l'authentification
- ✅ **Cache des requêtes preflight** pour optimiser les performances
- ✅ **Headers de sécurité supplémentaires** (Vary, Cache-Control, etc.)

## Configuration

### Variables d'environnement

Ajoutez la variable suivante à votre fichier `.env` :

```bash
# Liste des origines autorisées séparées par des virgules
CORS_ALLOWED_ORIGINS=https://harmonia.jules.com,https://www.harmonia.jules.com
```

### Origines par défaut

Si aucune variable d'environnement n'est définie, les origines suivantes sont autorisées par défaut :

- `https://harmonia.jules.com`
- `https://www.harmonia.jules.com`

## Headers CORS configurés

### Méthodes HTTP autorisées

- GET, POST, PUT, DELETE, PATCH, OPTIONS

### Headers autorisés

- Content-Type
- Authorization
- X-Requested-With
- Accept
- Origin
- Cache-Control
- X-File-Name
- X-Use-Cookies (pour Supabase)
- X-Client-Info (pour Supabase)

### Headers exposés au client

- Content-Length
- X-Total-Count
- X-Request-Id
- X-Rate-Limit-Remaining
- X-Rate-Limit-Reset

### Configuration des credentials

- `Access-Control-Allow-Credentials: true`

### Cache des requêtes preflight

- `Access-Control-Max-Age: 86400` (24 heures)

## Utilisation

### Middleware automatique

Le middleware CORS est automatiquement intégré dans votre middleware principal (`src/middleware.ts`) et s'exécute en premier pour gérer les requêtes cross-origin.

### Fonctions utilitaires

```typescript
import { isOriginAllowed, getAllowedOrigins } from "../lib/cors-config";

// Vérifier si une origine est autorisée
const isAllowed = isOriginAllowed("https://monapp.com");

// Obtenir la liste des origines autorisées
const allowedOrigins = getAllowedOrigins();
```

## Sécurité

### Mesures de sécurité implémentées

1. **Validation stricte des origines** : Seules les origines explicitement autorisées sont acceptées
2. **Headers de sécurité** : Vary, Cache-Control, Pragma, Expires pour les requêtes preflight
3. **Gestion des erreurs** : Retour d'une erreur 403 pour les origines non autorisées
4. **Pas de wildcard** : L'utilisation de `*` est évitée pour maintenir la sécurité

### Bonnes pratiques

1. **Limitez les origines** : N'autorisez que les domaines nécessaires
2. **Utilisez HTTPS** : Toutes les origines doivent utiliser HTTPS en production
3. **Surveillez les logs** : Surveillez les tentatives d'accès non autorisées
4. **Testez régulièrement** : Vérifiez que seules les origines autorisées peuvent accéder à votre API

## Tests

### Test manuel avec curl

```bash
# Test d'une requête preflight (OPTIONS)
curl -X OPTIONS \
  -H "Origin: https://harmonia.jules.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://votre-api.com/api/test

# Test d'une requête normale
curl -X POST \
  -H "Origin: https://harmonia.jules.com" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  https://votre-api.com/api/test
```

### Test d'une origine non autorisée

```bash
# Cette requête devrait retourner une erreur 403
curl -X POST \
  -H "Origin: https://malicious-site.com" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  https://votre-api.com/api/test
```

## Dépannage

### Problèmes courants

1. **Erreur 403 Forbidden** : Vérifiez que l'origine est dans la liste `CORS_ALLOWED_ORIGINS`
2. **Headers manquants** : Assurez-vous que le middleware CORS est bien intégré dans `src/middleware.ts`
3. **Problèmes avec Supabase** : Vérifiez que les headers `X-Use-Cookies` et `X-Client-Info` sont autorisés

### Logs de débogage

Le middleware CORS est intégré avec le système de logging existant. Vous pouvez surveiller les requêtes CORS dans vos logs.

## Migration depuis une configuration existante

Si vous aviez déjà une configuration CORS, remplacez-la par cette nouvelle configuration plus sécurisée. Les principales améliorations sont :

- Configuration centralisée via variables d'environnement
- Validation stricte des origines
- Headers de sécurité supplémentaires
- Intégration avec le système de logging existant
