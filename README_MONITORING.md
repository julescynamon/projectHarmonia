# Système de Monitoring Harmonia

## 🚀 Vue d'ensemble

Ce projet utilise **Sentry** comme solution de monitoring des performances (APM) pour surveiller les erreurs, les performances et l'expérience utilisateur de l'application Harmonia.

## 📊 Fonctionnalités

### ✅ Monitoring côté serveur

- Capture automatique des erreurs API
- Mesure des temps de réponse
- Tracking des transactions Supabase
- Monitoring des appels Stripe
- Métriques de performance détaillées

### ✅ Monitoring côté client

- Erreurs JavaScript en temps réel
- Performances de navigation
- Interactions utilisateur
- Métriques de rendu (FPS)
- Utilisation mémoire
- Profondeur de scroll

### ✅ Alertes automatiques

- API lentes (> 1 seconde)
- Pages lentes (> 3 secondes)
- FPS bas (< 30)
- Utilisation mémoire élevée (> 100MB)

## 🛠️ Installation

### 1. Dépendances installées

```bash
npm install @sentry/astro @sentry/node @sentry/tracing
```

### 2. Configuration Sentry

1. Créez un compte sur [sentry.io](https://sentry.io)
2. Créez un projet pour Harmonia
3. Ajoutez votre DSN dans les variables d'environnement

### 3. Variables d'environnement

```bash
# Ajoutez à votre fichier .env
SENTRY_DSN=https://votre-dsn-sentry@votre-org.ingest.sentry.io/project-id
PUBLIC_SENTRY_DSN=https://votre-dsn-sentry@votre-org.ingest.sentry.io/project-id
```

## 📁 Structure des fichiers

```
src/
├── lib/
│   └── monitoring.ts          # Service de monitoring principal
├── middleware/
│   └── performance.ts         # Middleware pour les API
├── components/
│   └── monitoring/
│       └── ClientMonitoring.astro  # Monitoring côté client
├── scripts/
│   └── test-monitoring.ts     # Scripts de test
└── pages/api/
    ├── health.ts              # API avec monitoring
    └── products.ts            # API avec monitoring
```

## 🔧 Utilisation

### Monitoring côté serveur

```typescript
import { monitoring } from "../lib/monitoring";

// Capturer une erreur
monitoring.captureError(error, {
  userId: "user-id",
  action: "create_post",
  metadata: { postId: "123" },
});

// Démarrer une transaction
const transaction = monitoring.startTransaction("api_call", "http.server", {
  userId: "user-id",
});

// Ajouter des métriques
transaction?.setTag("status", "success");
transaction?.finish();
```

### Wrapper pour les API

```typescript
import { monitorApi } from "../../middleware/performance";

const apiHandler = async ({ request, locals }) => {
  // Votre logique API
  return new Response(JSON.stringify(data));
};

export const GET = monitorApi(apiHandler);
```

### Monitoring côté client

Le composant `ClientMonitoring.astro` est automatiquement inclus dans le layout principal et capture :

- ✅ Erreurs JavaScript
- ✅ Erreurs de promesses non gérées
- ✅ Performances de navigation
- ✅ Requêtes fetch
- ✅ Interactions utilisateur
- ✅ Performances des formulaires
- ✅ Navigation SPA
- ✅ Profondeur de scroll
- ✅ Redimensionnement de fenêtre
- ✅ Erreurs de console
- ✅ FPS
- ✅ Utilisation mémoire

## 🧪 Tests

### Exécuter les tests de monitoring

```bash
npm run test:monitoring
```

Ce script teste :

- Capture de messages
- Capture d'erreurs
- Transactions et spans
- Performances API
- Erreurs Supabase
- Erreurs Stripe
- Métriques multiples

## 📈 Dashboard Sentry

Une fois configuré, vous pourrez voir dans votre dashboard Sentry :

### 📊 Issues

- Toutes les erreurs capturées
- Stack traces détaillées
- Contexte utilisateur
- Métadonnées personnalisées

### ⚡ Performance

- Temps de réponse des API
- Transactions lentes
- Spans détaillés
- Métriques par endpoint

### 👥 Users

- Sessions utilisateur
- Erreurs par utilisateur
- Contexte de navigation

### 🎬 Replays

- Replay des sessions avec erreurs
- Interactions utilisateur
- Console logs

## 🎯 Bonnes pratiques

### 1. Sécurité

- ❌ Ne jamais capturer de mots de passe
- ❌ Ne jamais capturer de tokens sensibles
- ✅ Utiliser des tags pour le filtrage
- ✅ Anonymiser les données personnelles

### 2. Performance

- ✅ Limiter le taux d'échantillonnage en production
- ✅ Utiliser des transactions pour les opérations longues
- ✅ Ajouter des spans pour les sous-opérations
- ✅ Configurer des alertes appropriées

### 3. Organisation

- ✅ Utiliser des tags cohérents
- ✅ Structurer les métadonnées
- ✅ Documenter les métriques personnalisées
- ✅ Nettoyer régulièrement les anciennes erreurs

## 🔍 Dépannage

### Sentry ne s'initialise pas

1. Vérifiez que `SENTRY_DSN` est défini
2. Vérifiez la connectivité réseau
3. Consultez les logs de l'application

### Erreurs non capturées

1. Vérifiez que le monitoring est activé
2. Vérifiez les filtres Sentry
3. Testez avec le script de test

### Performances lentes

1. Vérifiez le taux d'échantillonnage
2. Optimisez les transactions
3. Réduisez la fréquence des métriques

## 📚 Ressources

- [Documentation Sentry](https://docs.sentry.io/)
- [Guide Astro + Sentry](https://docs.sentry.io/platforms/javascript/guides/astro/)
- [Best Practices APM](https://docs.sentry.io/product/performance/)

## 🤝 Support

Pour toute question sur le monitoring :

1. Consultez la documentation Sentry
2. Vérifiez les logs de l'application
3. Testez avec le script de test
4. Contactez l'équipe de développement

---

**Note** : Ce système de monitoring est configuré pour fonctionner avec le plan gratuit de Sentry. Pour des besoins plus avancés, considérez un plan payant.
