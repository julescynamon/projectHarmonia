# Configuration GitHub Actions pour CI/CD

Ce document explique comment configurer les secrets GitHub nécessaires pour le workflow CI/CD de votre projet Astro.

## 📋 Prérequis

- Un repository GitHub avec votre projet
- Accès aux paramètres du repository (Settings > Secrets and variables > Actions)
- Comptes configurés sur Vercel et/ou Netlify (optionnel)

## 🔐 Secrets GitHub à configurer

### Variables d'environnement de base

| Secret              | Description                  | Exemple                                   |
| ------------------- | ---------------------------- | ----------------------------------------- |
| `PUBLIC_SITE_URL`   | URL publique de votre site   | `https://harmonia.jules.com`              |
| `SUPABASE_URL`      | URL de votre projet Supabase | `https://your-project.supabase.co`        |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase         | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Configuration Vercel

| Secret              | Description                     | Comment l'obtenir                                                         |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Token d'authentification Vercel | [Vercel Dashboard > Settings > Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | ID de votre organisation Vercel | [Vercel Dashboard > Settings > General](https://vercel.com/account)       |
| `VERCEL_PROJECT_ID` | ID de votre projet Vercel       | [Vercel Dashboard > Project Settings](https://vercel.com/dashboard)       |

### Configuration Netlify (alternative)

| Secret               | Description                      | Comment l'obtenir                                                                             |
| -------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| `NETLIFY_AUTH_TOKEN` | Token d'authentification Netlify | [Netlify Dashboard > User Settings > Applications](https://app.netlify.com/user/applications) |
| `NETLIFY_SITE_ID`    | ID de votre site Netlify         | [Netlify Dashboard > Site Settings > General](https://app.netlify.com/sites)                  |
| `NETLIFY_SITE_URL`   | URL de votre site Netlify        | `https://your-site.netlify.app`                                                               |

### Notifications

| Secret              | Description                          | Comment l'obtenir                                                          |
| ------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| `SLACK_WEBHOOK_URL` | Webhook Slack pour les notifications | [Slack Apps > Incoming Webhooks](https://api.slack.com/messaging/webhooks) |
| `EMAIL_WEBHOOK_URL` | Webhook pour notifications email     | Service d'email de votre choix (SendGrid, Mailgun, etc.)                   |

## 🚀 Étapes de configuration

### 1. Accéder aux secrets GitHub

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** (onglet)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** > **Actions**
4. Cliquez sur **New repository secret**

### 2. Configurer Vercel

#### Obtenir le token Vercel :

```bash
# Via CLI Vercel
npm i -g vercel
vercel login
vercel whoami
```

#### Obtenir les IDs Vercel :

```bash
# Installer Vercel CLI
npm i -g vercel

# Lister les projets
vercel projects

# Obtenir les détails d'un projet
vercel project ls
```

### 3. Configurer Netlify (optionnel)

#### Obtenir le token Netlify :

```bash
# Via CLI Netlify
npm install -g netlify-cli
netlify login
netlify status
```

#### Obtenir l'ID du site :

```bash
# Lister les sites
netlify sites:list

# Obtenir les détails d'un site
netlify sites:info --site=your-site-name
```

### 4. Configurer Slack (optionnel)

1. Allez sur [api.slack.com/apps](https://api.slack.com/apps)
2. Cliquez sur **Create New App**
3. Choisissez **From scratch**
4. Donnez un nom à votre app et sélectionnez votre workspace
5. Dans le menu de gauche, allez dans **Incoming Webhooks**
6. Activez les Incoming Webhooks
7. Cliquez sur **Add New Webhook to Workspace**
8. Sélectionnez le canal `#deployments` (créez-le si nécessaire)
9. Copiez l'URL du webhook

### 5. Tester la configuration

Après avoir configuré tous les secrets, vous pouvez tester le workflow :

1. Faites un push sur la branche `main`
2. Allez dans l'onglet **Actions** de votre repository
3. Vérifiez que le workflow se lance correctement
4. Surveillez les logs pour détecter d'éventuelles erreurs

## 🔧 Personnalisation du workflow

### Modifier les branches déclencheuses

Dans le fichier `.github/workflows/deploy.yml`, modifiez la section `on` :

```yaml
on:
  push:
    branches: [main, develop, staging] # Ajoutez vos branches
  pull_request:
    branches: [main, develop]
```

### Ajouter des environnements

Pour des déploiements multi-environnements :

```yaml
deploy-staging:
  environment: staging
  # ...

deploy-production:
  environment: production
  # ...
```

### Modifier les notifications

Personnalisez les messages Slack dans les jobs `notify-failure` et `notify-success`.

## 🛠️ Dépannage

### Erreurs courantes

1. **Token Vercel invalide** : Régénérez le token dans le dashboard Vercel
2. **ID de projet incorrect** : Vérifiez l'ID dans les paramètres du projet Vercel
3. **Webhook Slack invalide** : Vérifiez l'URL et les permissions du webhook
4. **Variables d'environnement manquantes** : Assurez-vous que tous les secrets sont configurés

### Logs et debugging

- Consultez les logs dans l'onglet **Actions** de GitHub
- Utilisez `echo` dans les steps pour débugger les variables
- Vérifiez les permissions des tokens

## 📚 Ressources utiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [Slack API Documentation](https://api.slack.com/)

## 🔒 Sécurité

- Ne partagez jamais vos tokens dans le code
- Utilisez des tokens avec des permissions minimales
- Régénérez régulièrement vos tokens
- Surveillez l'utilisation de vos tokens
