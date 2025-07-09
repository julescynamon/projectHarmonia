# Environnement de Test - Harmonia

Ce document explique comment configurer et utiliser l'environnement de test pour le projet Harmonia.

## 🚀 Configuration Rapide

### 1. Configuration automatique

```bash
# Créer automatiquement le fichier .env.test
npm run test:setup
```

### 2. Configuration manuelle

```bash
# Copier le fichier d'exemple
cp config/test.env.example .env.test

# Modifier les variables selon vos besoins
nano .env.test
```

### 3. Validation de la configuration

```bash
# Vérifier que tout est correctement configuré
npm run test:validate
```

## 📋 Variables d'Environnement

### Variables Supabase (Base de données)

| Variable                    | Description                                        | Exemple                                                 |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | URL de l'instance Supabase de test                 | `https://test-project.supabase.co`                      |
| `PUBLIC_SUPABASE_ANON_KEY`  | Clé anonyme pour les opérations publiques          | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-anon-key`    |
| `SUPABASE_SERVICE_KEY`      | Clé de service pour les opérations administratives | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-service-key` |
| `SUPABASE_SERVICE_ROLE_KEY` | Alias de la clé de service                         | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-service-key` |
| `SUPABASE_JWT_SECRET`       | Secret JWT pour la signature des tokens            | `test-jwt-secret-key-for-testing-only`                  |

### Variables Stripe (Paiements)

| Variable                  | Description                             | Exemple                                       |
| ------------------------- | --------------------------------------- | --------------------------------------------- |
| `STRIPE_SECRET_KEY`       | Clé secrète Stripe (mode test)          | `sk_test_51TestKeyForTestingOnly`             |
| `STRIPE_PUBLISHABLE_KEY`  | Clé publique Stripe (mode test)         | `pk_test_51TestKeyForTestingOnly`             |
| `STRIPE_WEBHOOK_SECRET`   | Secret du webhook Stripe pour les tests | `whsec_test_webhook_secret_for_testing`       |
| `STRIPE_WEBHOOK_ENDPOINT` | Endpoint du webhook de test             | `https://test.example.com/api/webhook/stripe` |

### Variables Astro (Application)

| Variable         | Description                    | Exemple                                |
| ---------------- | ------------------------------ | -------------------------------------- |
| `WEBSITE_URL`    | URL du site web                | `http://localhost:4322`                |
| `WEBSITE_NAME`   | Nom du site web                | `Harmonia Test`                        |
| `DEV`            | Mode de développement          | `true`                                 |
| `PROD`           | Mode de production             | `false`                                |
| `API_SECRET_KEY` | Clé secrète API pour les tests | `test-api-secret-key-for-testing-only` |

### Variables Email (Resend)

| Variable         | Description                   | Exemple                        |
| ---------------- | ----------------------------- | ------------------------------ |
| `RESEND_API_KEY` | Clé API Resend pour les tests | `re_test_key_for_testing_only` |
| `FROM_EMAIL`     | Email d'expédition par défaut | `test@harmonia-test.com`       |
| `SUPPORT_EMAIL`  | Email de support              | `support@harmonia-test.com`    |

### Variables Sécurité

| Variable                   | Description                            | Exemple                                       |
| -------------------------- | -------------------------------------- | --------------------------------------------- |
| `CORS_ALLOWED_ORIGINS`     | Configuration CORS pour les tests      | `http://localhost:4322,http://localhost:3000` |
| `SECURITY_FRAME_OPTIONS`   | Configuration des en-têtes de sécurité | `DENY`                                        |
| `SECURITY_REFERRER_POLICY` | Politique de référent                  | `strict-origin-when-cross-origin`             |

### Variables Monitoring et Logging

| Variable             | Description                          | Exemple                               |
| -------------------- | ------------------------------------ | ------------------------------------- |
| `SENTRY_DSN`         | Configuration Sentry pour les tests  | `https://test@sentry.io/test-project` |
| `SENTRY_ENVIRONMENT` | Environnement Sentry                 | `test`                                |
| `LOGTAIL_API_KEY`    | Configuration Logtail pour les tests | `test_logtail_key_for_testing`        |

### Variables Cache et Performance

| Variable         | Description              | Exemple                    |
| ---------------- | ------------------------ | -------------------------- |
| `REDIS_URL`      | URL Redis pour les tests | `redis://localhost:6379/1` |
| `CACHE_TTL`      | Durée de vie du cache    | `300`                      |
| `CACHE_MAX_SIZE` | Taille maximale du cache | `1000`                     |

### Variables Rate Limiting

| Variable                              | Description                       | Exemple |
| ------------------------------------- | --------------------------------- | ------- |
| `RATE_LIMIT_WINDOW_MS`                | Fenêtre de temps pour les limites | `60000` |
| `RATE_LIMIT_MAX_REQUESTS`             | Nombre maximum de requêtes        | `100`   |
| `RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS` | Ignorer les requêtes réussies     | `true`  |

### Variables Spécifiques aux Tests

| Variable                   | Description                      | Exemple                 |
| -------------------------- | -------------------------------- | ----------------------- |
| `BASE_URL`                 | Base URL pour les tests E2E      | `http://localhost:4322` |
| `TEST_TIMEOUT`             | Timeout pour les tests           | `30000`                 |
| `MOCK_EXTERNAL_SERVICES`   | Configuration des mocks          | `true`                  |
| `NODE_ENV`                 | Mode de test                     | `test`                  |
| `PERFORMANCE_TEST_ENABLED` | Activer les tests de performance | `false`                 |

## 🧪 Exécution des Tests

### Tests Unitaires

```bash
# Exécuter tous les tests unitaires
npm run test:run

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests avec couverture
npm run test:coverage

# Exécuter seulement les tests unitaires
npm run test:unit
```

### Tests d'Intégration

```bash
# Exécuter les tests d'intégration
npm run test:integration

# Exécuter les tests d'intégration en mode watch
npm run test:integration:watch
```

### Tests E2E (Playwright)

```bash
# Exécuter tous les tests E2E
npm run test:e2e

# Exécuter les tests E2E avec interface graphique
npm run test:e2e:ui

# Exécuter les tests E2E en mode debug
npm run test:e2e:debug

# Exécuter les tests E2E en mode headed (avec navigateur visible)
npm run test:e2e:headed

# Exécuter les tests E2E localement avec environnement de test
npm run test:e2e:local
```

### Tests Spécialisés

```bash
# Tests de logging
npm run test:logging

# Tests de monitoring
npm run test:monitoring

# Tests de sécurité CSP
npm run test:csp

# Tests CORS
npm run test:cors

# Tests de sécurité
npm run test:security

# Tests de rate limiting
npm run test:rate-limiting
```

### Tests Complets

```bash
# Exécuter tous les tests (unitaires + intégration + E2E)
npm run test:all

# Exécuter les tests pour CI (unitaires + E2E)
npm run test:ci
```

## 🔧 Configuration CI/CD

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Setup test environment
        run: npm run test:setup

      - name: Validate test environment
        run: npm run test:validate

      - name: Run unit tests
        run: npm run test:run

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          # Variables d'environnement pour CI
          PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_KEY: ${{ secrets.TEST_SUPABASE_SERVICE_KEY }}
          STRIPE_SECRET_KEY: ${{ secrets.TEST_STRIPE_SECRET_KEY }}
          RESEND_API_KEY: ${{ secrets.TEST_RESEND_API_KEY }}
```

### Variables d'Environnement CI

Dans votre CI/CD, configurez ces secrets :

- `TEST_SUPABASE_URL`
- `TEST_SUPABASE_ANON_KEY`
- `TEST_SUPABASE_SERVICE_KEY`
- `TEST_STRIPE_SECRET_KEY`
- `TEST_RESEND_API_KEY`
- `TEST_API_SECRET_KEY`

## 🛠️ Développement Local

### 1. Configuration initiale

```bash
# Installer les dépendances
npm install

# Configurer l'environnement de test
npm run test:setup

# Valider la configuration
npm run test:validate
```

### 2. Développement avec tests

```bash
# Démarrer le serveur de développement
npm run dev

# Dans un autre terminal, exécuter les tests en watch
npm run test:watch
```

### 3. Tests E2E en développement

```bash
# Démarrer le serveur et exécuter les tests E2E
npm run test:e2e:dev
```

## 🔍 Dépannage

### Problèmes courants

1. **Variables d'environnement manquantes**

   ```bash
   npm run test:validate
   ```

2. **Tests qui échouent à cause de l'environnement**

   ```bash
   # Vérifier que .env.test existe
   ls -la .env.test

   # Recréer le fichier si nécessaire
   npm run test:setup
   ```

3. **Problèmes avec Supabase**

   - Vérifiez que l'URL Supabase est correcte
   - Assurez-vous que les clés sont valides
   - Vérifiez que l'instance de test existe

4. **Problèmes avec Stripe**
   - Utilisez uniquement des clés de test (`sk_test_`)
   - Vérifiez que les webhooks sont configurés pour l'environnement de test

### Logs de debug

```bash
# Activer les logs détaillés
DEBUG=* npm run test:run

# Voir les variables d'environnement chargées
NODE_ENV=test node -e "console.log(process.env)"
```

## 📚 Ressources

- [Documentation Vitest](https://vitest.dev/)
- [Documentation Playwright](https://playwright.dev/)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Stripe](https://stripe.com/docs/testing)
- [Documentation Resend](https://resend.com/docs)
