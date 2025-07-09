# Configuration du Système de Logging Structuré

Ce document explique comment configurer et utiliser le système de logging structuré de l'application Astro avec Supabase et Stripe.

## 🚀 Installation

Le système de logging utilise **Pino** comme logger principal. Les dépendances sont déjà installées :

```bash
npm install pino pino-pretty
```

## 📁 Structure des Fichiers

```
src/
├── lib/
│   ├── logger.ts          # Logger principal avec Pino
│   └── log-export.ts      # Services d'export vers services externes
├── middleware/
│   └── logging.ts         # Middleware de logging pour Astro
└── middleware.ts          # Middleware principal avec logging intégré

supabase/
└── migrations/
    └── 20250120_create_application_logs.sql  # Table de logs Supabase
```

## ⚙️ Configuration

### Variables d'Environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Logging - Logtail (optionnel)
LOGTAIL_API_KEY=your_logtail_api_key

# Logging - Webhook personnalisé (optionnel)
LOG_WEBHOOK_URL=https://your-webhook-endpoint.com/logs
LOG_WEBHOOK_AUTH=Bearer your_webhook_token

# Supabase (déjà configuré)
PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Configuration du Logger

Le logger se configure automatiquement selon l'environnement :

- **Développement** : Logs colorés et formatés avec `pino-pretty`
- **Production** : Logs JSON structurés pour faciliter l'analyse

## 🔧 Utilisation

### Logger de Base

```typescript
import { logger } from "../lib/logger";

// Logs simples
logger.info("Message d'information");
logger.warn("Avertissement");
logger.error("Erreur critique");
logger.debug("Information de débogage");

// Logs avec contexte
logger.info({
  message: "Utilisateur connecté",
  userId: "user-123",
  action: "login",
  timestamp: new Date().toISOString(),
});
```

### Logger avec Contexte

```typescript
import { createContextLogger, type LogContext } from "../lib/logger";

const context: LogContext = {
  userId: "user-123",
  requestId: "req-456",
  path: "/api/users",
  method: "GET",
};

const requestLogger = createContextLogger(context);

requestLogger.info({
  message: "Requête traitée",
  duration: "150ms",
  statusCode: 200,
});
```

### Logger d'Erreurs

```typescript
import { logError } from "../lib/logger";

try {
  // Code qui peut échouer
} catch (error) {
  logError(error, {
    userId: "user-123",
    action: "create_order",
    orderId: "order-789",
  });
}
```

### Logger d'Événements Spécialisés

```typescript
import {
  logStripeEvent,
  logSupabaseEvent,
  logSecurityEvent,
} from "../lib/logger";

// Événements Stripe
logStripeEvent("payment_intent.succeeded", paymentData, {
  userId: "user-123",
  sessionId: "session-456",
});

// Événements Supabase
logSupabaseEvent("user_created", userData, {
  adminId: "admin-123",
});

// Événements de sécurité
logSecurityEvent("failed_login_attempt", {
  ip: "192.168.1.1",
  email: "user@example.com",
});
```

## 🌐 Export vers Services Externes

### Logtail

1. Créez un compte sur [Logtail](https://logtail.com)
2. Obtenez votre clé API
3. Ajoutez `LOGTAIL_API_KEY` dans vos variables d'environnement

### Webhook Personnalisé

1. Configurez votre endpoint webhook
2. Ajoutez `LOG_WEBHOOK_URL` et `LOG_WEBHOOK_AUTH` dans vos variables d'environnement

### Supabase

1. Exécutez la migration pour créer la table `application_logs`
2. Les logs seront automatiquement exportés vers Supabase

```bash
# Exécuter la migration
supabase db push
```

## 📊 Base de Données Supabase

### Table `application_logs`

La table stocke les logs structurés avec les colonnes suivantes :

- `id` : Identifiant unique
- `timestamp` : Horodatage du log
- `level` : Niveau de log (fatal, error, warn, info, debug, trace)
- `message` : Message principal
- `request_id` : ID de la requête
- `user_id` : ID de l'utilisateur (référence vers auth.users)
- `session_id` : ID de session
- `method` : Méthode HTTP
- `path` : Chemin de la requête
- `user_agent` : User-Agent du navigateur
- `ip_address` : Adresse IP
- `status_code` : Code de statut HTTP
- `duration_ms` : Durée de traitement
- `error_name` : Nom de l'erreur
- `error_message` : Message d'erreur
- `error_stack` : Stack trace
- `context` : Contexte JSON additionnel
- `metadata` : Métadonnées JSON

### Fonctions Utilitaires

```sql
-- Obtenir les statistiques des logs
SELECT * FROM get_log_statistics();

-- Obtenir les erreurs récentes
SELECT * FROM get_recent_errors(10);

-- Nettoyer les anciens logs
SELECT cleanup_old_logs(30);
```

## 🔍 Monitoring et Alertes

### Requêtes Utiles

```sql
-- Erreurs par heure
SELECT
  DATE_TRUNC('hour', timestamp) as hour,
  COUNT(*) as error_count
FROM application_logs
WHERE level IN ('error', 'fatal')
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour;

-- Temps de réponse moyen par endpoint
SELECT
  path,
  AVG(duration_ms) as avg_duration,
  COUNT(*) as request_count
FROM application_logs
WHERE duration_ms IS NOT NULL
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY path
ORDER BY avg_duration DESC;

-- Utilisateurs avec le plus d'erreurs
SELECT
  user_id,
  COUNT(*) as error_count
FROM application_logs
WHERE level IN ('error', 'fatal')
  AND user_id IS NOT NULL
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY user_id
ORDER BY error_count DESC
LIMIT 10;
```

### Alertes Recommandées

1. **Taux d'erreur élevé** : Plus de 5% d'erreurs sur 5 minutes
2. **Temps de réponse lent** : Moyenne > 2000ms sur 5 minutes
3. **Erreurs critiques** : Logs de niveau 'fatal'
4. **Tentatives d'intrusion** : Nombreux échecs de connexion

## 🛠️ Maintenance

### Nettoyage Automatique

Les logs sont automatiquement nettoyés après 30 jours par défaut. Vous pouvez ajuster cette durée :

```sql
-- Nettoyer les logs de plus de 7 jours
SELECT cleanup_old_logs(7);

-- Nettoyer les logs de plus de 90 jours
SELECT cleanup_old_logs(90);
```

### Performance

- Les index sont créés automatiquement pour optimiser les requêtes
- Les logs sont exportés par batch pour réduire la charge
- Le nettoyage automatique évite l'accumulation excessive

## 🔒 Sécurité

- Seuls les administrateurs peuvent accéder aux logs via RLS
- Les informations sensibles (mots de passe, tokens) sont automatiquement masquées
- Les logs d'erreur ne contiennent pas de données personnelles sensibles

## 📈 Métriques Recommandées

1. **Taux d'erreur** : Pourcentage d'erreurs par rapport au total des requêtes
2. **Temps de réponse** : Moyenne, médiane, 95e percentile
3. **Trafic** : Nombre de requêtes par minute/heure
4. **Utilisateurs actifs** : Nombre d'utilisateurs uniques par période
5. **Endpoints populaires** : Les pages/APIs les plus utilisées

## 🚨 Dépannage

### Logs non visibles

1. Vérifiez que `LOGTAIL_API_KEY` est configuré
2. Vérifiez les permissions Supabase
3. Vérifiez que la table `application_logs` existe

### Performance dégradée

1. Réduisez la fréquence d'export (`flushInterval`)
2. Augmentez la taille des batches (`batchSize`)
3. Activez le nettoyage automatique des anciens logs

### Erreurs d'export

1. Vérifiez la connectivité réseau
2. Vérifiez les clés API
3. Vérifiez les permissions des services externes
