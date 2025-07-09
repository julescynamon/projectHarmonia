# Configuration CORS Sécurisée pour Astro

## 🚀 Installation et Configuration

### 1. Fichiers créés

La configuration CORS a été intégrée dans votre projet avec les fichiers suivants :

- `src/middleware/cors.ts` - Middleware CORS principal
- `src/lib/cors-config.ts` - Configuration centralisée CORS
- `docs/CORS_CONFIGURATION.md` - Documentation détaillée
- `scripts/test-cors.ts` - Script de test

### 2. Configuration des variables d'environnement

Ajoutez la variable suivante à votre fichier `.env` :

```bash
# Liste des origines autorisées séparées par des virgules
CORS_ALLOWED_ORIGINS=https://harmonia.jules.com,https://www.harmonia.jules.com
```

### 3. Intégration automatique

Le middleware CORS est automatiquement intégré dans votre middleware principal (`src/middleware.ts`) et s'exécute en premier pour gérer les requêtes cross-origin.

## 🧪 Tests

### Test de la configuration

```bash
npm run test:cors
```

### Test en conditions réelles

1. Démarrez votre serveur Astro :

```bash
npm run dev
```

2. Testez avec curl :

```bash
# Test d'une requête preflight (OPTIONS)
curl -X OPTIONS \
  -H "Origin: https://harmonia.jules.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://localhost:4321/api/health

# Test d'une requête normale
curl -X GET \
  -H "Origin: https://harmonia.jules.com" \
  http://localhost:4321/api/health

# Test d'une origine non autorisée (doit retourner 403)
curl -X GET \
  -H "Origin: https://malicious-site.com" \
  http://localhost:4321/api/health
```

## 🔒 Sécurité

### Origines autorisées par défaut

- `https://harmonia.jules.com`
- `https://www.harmonia.jules.com`

### Headers de sécurité configurés

- **Méthodes HTTP** : GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers autorisés** : Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name, X-Use-Cookies, X-Client-Info
- **Headers exposés** : Content-Length, X-Total-Count, X-Request-Id, X-Rate-Limit-Remaining, X-Rate-Limit-Reset
- **Credentials** : Activés pour l'authentification
- **Cache preflight** : 24 heures

### Mesures de sécurité

1. ✅ Validation stricte des origines
2. ✅ Pas de wildcard (`*`) pour maintenir la sécurité
3. ✅ Headers de sécurité supplémentaires (Vary, Cache-Control, etc.)
4. ✅ Gestion des erreurs avec retour 403 pour les origines non autorisées
5. ✅ Support complet de Supabase avec les headers nécessaires

## 📝 Utilisation

### Fonctions utilitaires

```typescript
import { isOriginAllowed, getAllowedOrigins } from "../lib/cors-config";

// Vérifier si une origine est autorisée
const isAllowed = isOriginAllowed("https://monapp.com");

// Obtenir la liste des origines autorisées
const allowedOrigins = getAllowedOrigins();
```

### Ajouter de nouvelles origines

1. **Via variables d'environnement** (recommandé) :

```bash
CORS_ALLOWED_ORIGINS=https://harmonia.jules.com,https://www.harmonia.jules.com,https://staging.harmonia.jules.com
```

2. **Via code** (modifier `src/lib/cors-config.ts`) :

```typescript
const DEFAULT_ALLOWED_ORIGINS = [
  "https://harmonia.jules.com",
  "https://www.harmonia.jules.com",
  "https://staging.harmonia.jules.com", // Nouvelle origine
];
```

## 🔧 Dépannage

### Problèmes courants

1. **Erreur 403 Forbidden**

   - Vérifiez que l'origine est dans la liste `CORS_ALLOWED_ORIGINS`
   - Assurez-vous que l'origine utilise HTTPS

2. **Headers manquants**

   - Vérifiez que le middleware CORS est bien intégré dans `src/middleware.ts`
   - Redémarrez le serveur après modification

3. **Problèmes avec Supabase**
   - Vérifiez que les headers `X-Use-Cookies` et `X-Client-Info` sont autorisés
   - Assurez-vous que `Access-Control-Allow-Credentials` est activé

### Logs de débogage

Le middleware CORS est intégré avec votre système de logging existant. Surveillez les logs pour détecter les tentatives d'accès non autorisées.

## 📚 Documentation complète

Pour plus de détails, consultez le fichier `docs/CORS_CONFIGURATION.md`.

## ✅ Vérification

Votre configuration CORS est maintenant sécurisée et prête à être utilisée !

- ✅ Middleware CORS intégré
- ✅ Configuration centralisée
- ✅ Tests automatisés
- ✅ Documentation complète
- ✅ Sécurité optimale
