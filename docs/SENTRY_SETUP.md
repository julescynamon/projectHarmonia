# Configuration Sentry pour La Maison Sattvaïa

## Installation et Configuration

### 1. Créer un compte Sentry

1. Allez sur [sentry.io](https://sentry.io)
2. Créez un compte gratuit
3. Créez un nouveau projet pour La Maison Sattvaïa
4. Notez votre DSN (Data Source Name)

### 2. Variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```bash
# Configuration Sentry
SENTRY_DSN=https://votre-dsn-sentry@votre-org.ingest.sentry.io/project-id
PUBLIC_SENTRY_DSN=https://votre-dsn-sentry@votre-org.ingest.sentry.io/project-id

# Configuration Sentry (optionnel)
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=1.0
SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0
```

### 3. Configuration Astro

Le fichier `astro.config.mjs` est déjà configuré avec Sentry. Assurez-vous que votre DSN est correctement défini.

## Utilisation

### Monitoring côté serveur

```typescript
import { monitoring } from "../lib/monitoring";

// Capturer une erreur
monitoring.captureError(error, {
  userId: "user-id",
  action: "create_post",
  metadata: { postId: "123" },
});

// Capturer un message
monitoring.captureMessage("Utilisateur connecté", "info", {
  userId: "user-id",
});

// Démarrer une transaction
const transaction = monitoring.startTransaction("api_call", "http.server", {
  userId: "user-id",
});

// Ajouter un span
const span = monitoring.addSpan("database_query", "db.query", {
  table: "users",
  query: "SELECT * FROM users WHERE id = ?",
});

// Finir la transaction
transaction?.finish();
```

### Monitoring côté client

Le composant `ClientMonitoring.astro` est automatiquement inclus dans le layout principal et capture :

- Erreurs JavaScript
- Erreurs de promesses non gérées
- Performances de navigation
- Performances des requêtes fetch
- Interactions utilisateur
- Performances des formulaires
- Navigation SPA
- Profondeur de scroll
- Redimensionnement de fenêtre
- Erreurs de console
- FPS
- Utilisation mémoire

### Wrapper pour les API

Utilisez le wrapper `monitorApi` pour automatiquement monitorer vos API :

```typescript
import { monitorApi } from "../../middleware/performance";

const apiHandler = async ({ request, locals }) => {
  // Votre logique API
  return new Response(JSON.stringify(data));
};

export const GET = monitorApi(apiHandler);
```

## Fonctionnalités

### 1. Capture d'erreurs

- Erreurs JavaScript côté client
- Erreurs serveur avec contexte
- Erreurs Supabase spécifiques
- Erreurs Stripe spécifiques

### 2. Monitoring des performances

- Temps de réponse des API
- Performances de navigation
- Requêtes de base de données
- Appels API externes

### 3. Métriques utilisateur

- Interactions utilisateur
- Profondeur de scroll
- Temps passé sur les pages
- Erreurs par utilisateur

### 4. Alertes automatiques

- API lentes (> 1 seconde)
- Pages lentes (> 3 secondes)
- FPS bas (< 30)
- Utilisation mémoire élevée (> 100MB)

## Dashboard Sentry

Une fois configuré, vous pourrez voir dans votre dashboard Sentry :

1. **Issues** : Toutes les erreurs capturées
2. **Performance** : Métriques de performance
3. **Releases** : Suivi des déploiements
4. **Users** : Sessions utilisateur
5. **Replays** : Replay des sessions avec erreurs

## Bonnes pratiques

1. **Ne pas capturer d'informations sensibles** : Les mots de passe, tokens, etc.
2. **Utiliser des tags appropriés** : Pour faciliter le filtrage
3. **Limiter le taux d'échantillonnage** : En production, réduire les taux pour économiser les quotas
4. **Configurer les alertes** : Pour être notifié des erreurs critiques
5. **Nettoyer régulièrement** : Supprimer les anciennes erreurs résolues

## Plan gratuit Sentry

Le plan gratuit inclut :

- 5,000 erreurs par mois
- 100 sessions par mois
- 1,000 transactions par mois
- 1,000 replays par mois
- 7 jours de rétention

## Support

Pour plus d'informations, consultez la [documentation officielle Sentry](https://docs.sentry.io/).
