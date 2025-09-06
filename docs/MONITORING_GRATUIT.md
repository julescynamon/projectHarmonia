# Système de Monitoring Gratuit pour La Maison Sattvaïa

## 🆓 Vue d'ensemble

Ce projet utilise un **système de monitoring personnalisé 100% gratuit** qui capture les erreurs, les performances et l'expérience utilisateur sans dépendances externes payantes.

## ✨ Fonctionnalités

### ✅ Monitoring côté serveur

- Capture automatique des erreurs API
- Mesure des temps de réponse
- Tracking des transactions Supabase et Stripe
- Métriques de performance détaillées
- Alertes automatiques pour les performances lentes
- Logs structurés avec contexte utilisateur

### ✅ Monitoring côté client

- Erreurs JavaScript en temps réel
- Performances de navigation (TTFB, DOM, Load)
- Interactions utilisateur (clics, formulaires)
- Métriques de rendu (FPS, mémoire)
- Profondeur de scroll et redimensionnement
- Requêtes fetch avec monitoring automatique

### ✅ Alertes automatiques

- ⚠️ API lentes (> 1 seconde)
- ⚠️ Pages lentes (> 3 secondes)
- ⚠️ FPS bas (< 30)
- ⚠️ Utilisation mémoire élevée (> 100MB)
- 🚨 Erreurs serveur (5xx)
- 🚨 Erreurs critiques (base de données, connexion)

## 🛠️ Installation

### Aucune dépendance externe requise !

Le système utilise uniquement :

- Les logs locaux (Pino)
- Le stockage en mémoire
- Les APIs Web standard

### Variables d'environnement (optionnelles)

```bash
# Pour les alertes par email (à implémenter)
ALERT_EMAIL_ENABLED=false
ALERT_EMAIL_TO=admin@example.com

# Pour les notifications Slack (à implémenter)
SLACK_WEBHOOK_URL=
```

## 📁 Structure des fichiers

```
src/
├── lib/
│   └── monitoring.ts              # Service de monitoring principal
├── middleware/
│   └── performance.ts             # Middleware pour les API
├── components/
│   └── monitoring/
│       └── ClientMonitoring.astro # Monitoring côté client
├── pages/api/monitoring/
│   ├── client-data.ts             # API pour recevoir les données client
│   └── stats.ts                   # API pour les statistiques
└── scripts/
    └── test-monitoring.ts         # Scripts de test
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

// Capturer un message
monitoring.captureMessage("Utilisateur connecté", "info", {
  userId: "user-id",
});

// Démarrer une transaction
const transaction = monitoring.startTransaction("api_call", "http.server", {
  userId: "user-id",
});

// Ajouter des métriques
transaction?.setTag("status", "success");
transaction?.finish();

// Capturer des métriques personnalisées
monitoring.captureMetric("custom_metric", 42, {
  source: "api",
  type: "counter",
});

// Capturer des événements
monitoring.captureEvent(
  "user_action",
  {
    action: "click_button",
    button_id: "submit",
  },
  {
    userId: "user-id",
  }
);
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

Le composant `ClientMonitoring.astro` capture automatiquement :

- ✅ Erreurs JavaScript et promesses non gérées
- ✅ Performances de navigation (TTFB, DOM, Load)
- ✅ Requêtes fetch avec durée et statut
- ✅ Interactions utilisateur (clics, formulaires)
- ✅ Profondeur de scroll et redimensionnement
- ✅ Erreurs de console
- ✅ FPS et utilisation mémoire
- ✅ Navigation SPA

## 🧪 Tests

### Exécuter les tests de monitoring

```bash
npm run test:monitoring
```

Ce script teste :

- ✅ Capture de messages (info, warning, error)
- ✅ Capture d'erreurs avec contexte
- ✅ Transactions et spans
- ✅ Performances API
- ✅ Erreurs Supabase et Stripe
- ✅ Métriques personnalisées
- ✅ Événements personnalisés
- ✅ Alertes pour les performances lentes
- ✅ Statistiques et export de données

## 📊 Statistiques et API

### Récupérer les statistiques

```bash
GET /api/monitoring/stats
```

Retourne :

```json
{
  "success": true,
  "stats": {
    "totalEvents": 150,
    "recentEvents": 25,
    "dailyEvents": 120,
    "errors": 5,
    "warnings": 12,
    "metrics": {
      "api_GET_200": {
        "count": 50,
        "average": 245.6,
        "min": 120,
        "max": 890
      }
    }
  },
  "exportData": {
    "events": [...],
    "metrics": {...},
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Recevoir les données côté client

```bash
POST /api/monitoring/client-data
```

Le client envoie automatiquement ses données toutes les 5 minutes.

## 🎯 Fonctionnalités avancées

### 1. Alertes automatiques

- **API lentes** : > 1 seconde
- **Pages lentes** : > 3 secondes
- **FPS bas** : < 30
- **Mémoire élevée** : > 100MB
- **Erreurs serveur** : 5xx
- **Erreurs critiques** : base de données, connexion

### 2. Nettoyage automatique

- Suppression des événements > 1 heure
- Limitation à 1000 métriques par type
- Limitation à 1000 événements en mémoire

### 3. Contexte utilisateur

- ID utilisateur automatique
- Session ID
- URL de la page
- User Agent
- Métadonnées personnalisées

### 4. Métriques en temps réel

- Temps de réponse des API
- Durée des transactions
- Performances de navigation
- Interactions utilisateur
- Utilisation des ressources

## 🔍 Débogage

### En développement

```javascript
// Accéder au monitoring côté client
window.clientMonitoring.getStats();
window.clientMonitoring.exportData();

// Accéder au monitoring côté serveur
import { monitoring } from "../lib/monitoring";
const stats = monitoring.getStats();
const data = monitoring.exportData();
```

### Logs structurés

Tous les événements sont loggés avec :

- Timestamp ISO
- Type d'événement
- Contexte utilisateur
- Métadonnées détaillées
- Stack traces pour les erreurs

## 🚀 Extensions possibles

### 1. Alertes par email

```typescript
// Dans monitoring.ts, méthode sendAlert
private async sendAlertEmail(title: string, data: any) {
  // Implémenter l'envoi d'email
}
```

### 2. Notifications Slack

```typescript
// Dans monitoring.ts, méthode sendAlert
private async sendSlackAlert(title: string, data: any) {
  // Implémenter les notifications Slack
}
```

### 3. Base de données

```typescript
// Stocker les métriques en base
private async saveToDatabase(event: any) {
  // Implémenter la sauvegarde en base
}
```

### 4. Dashboard web

Créer une interface web pour visualiser les métriques :

- Graphiques de performance
- Liste des erreurs
- Statistiques en temps réel
- Filtres par utilisateur/action

## 💰 Coût

**100% GRATUIT** 🎉

- ✅ Aucune dépendance externe payante
- ✅ Aucune limite d'utilisation
- ✅ Aucun quota
- ✅ Données stockées localement
- ✅ Contrôle total sur les données

## 🔒 Sécurité

- ✅ Aucune donnée envoyée à des tiers
- ✅ Logs locaux uniquement
- ✅ Contrôle total sur les métadonnées
- ✅ Conformité RGPD par défaut

## 📚 Ressources

- [Documentation Pino (logging)](https://getpino.io/)
- [Performance API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
- [Web Vitals](https://web.dev/vitals/)

## 🤝 Support

Pour toute question sur le monitoring :

1. Consultez les logs de l'application
2. Testez avec le script de test
3. Vérifiez les statistiques via l'API
4. Contactez l'équipe de développement

---

**Avantages du système personnalisé :**

- 🆓 100% gratuit
- 🔒 Contrôle total des données
- ⚡ Performances optimales
- 🛠️ Personnalisable à l'infini
- 📊 Métriques détaillées
- 🚨 Alertes automatiques
