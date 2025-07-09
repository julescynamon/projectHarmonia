# Headers de Sécurité HTTP pour Astro

## Vue d'ensemble

Cette configuration de headers de sécurité HTTP pour Astro fournit une protection complète contre les vulnérabilités web courantes, similaire à Helmet.js mais optimisée pour Astro et compatible avec tous les adaptateurs.

## Fonctionnalités

- ✅ **Headers de sécurité essentiels** : X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- ✅ **Politiques de sécurité** : Referrer-Policy, Permissions-Policy
- ✅ **HSTS (HTTP Strict Transport Security)** : Protection contre les attaques de downgrade
- ✅ **Configuration par environnement** : Développement vs Production
- ✅ **Variables d'environnement** : Personnalisation via variables d'environnement
- ✅ **Exclusions intelligentes** : Certains chemins peuvent être exclus
- ✅ **Compatibilité adaptateurs** : Fonctionne avec Node, Vercel, Netlify, etc.

## Headers de Sécurité Configurés

### 1. X-Frame-Options

**Protection contre le clickjacking**

- `DENY` : Empêche complètement l'affichage dans un iframe
- `SAMEORIGIN` : Permet l'affichage uniquement sur la même origine
- `ALLOW-FROM` : Permet l'affichage depuis une origine spécifique

### 2. X-Content-Type-Options

**Protection contre le MIME sniffing**

- `nosniff` : Empêche le navigateur de deviner le type MIME

### 3. X-XSS-Protection

**Protection XSS pour les anciens navigateurs**

- `1; mode=block` : Active la protection et bloque le rendu en cas d'attaque

### 4. Referrer-Policy

**Contrôle des informations de référent**

- `strict-origin-when-cross-origin` : Envoie l'origine complète pour les requêtes same-origin, l'origine uniquement pour les requêtes cross-origin vers HTTPS, et rien pour les requêtes cross-origin vers HTTP

### 5. Permissions-Policy

**Contrôle des API du navigateur**

- Désactive les API sensibles : caméra, microphone, géolocalisation, etc.

### 6. Strict-Transport-Security (HSTS)

**Protection contre les attaques de downgrade**

- `max-age=31536000; includeSubDomains; preload` : Force HTTPS pendant 1 an

### 7. Headers supplémentaires

- `X-Download-Options: noopen` : Empêche l'ouverture automatique de fichiers
- `X-Permitted-Cross-Domain-Policies: none` : Empêche les politiques cross-domain

## Configuration

### Variables d'environnement

```bash
# Configuration des headers de sécurité
SECURITY_FRAME_OPTIONS=DENY
SECURITY_REFERRER_POLICY=strict-origin-when-cross-origin
SECURITY_XSS_PROTECTION=1; mode=block
SECURITY_FRAME_OPTIONS_URL=https://trusted-site.com
SECURITY_PERMISSIONS_POLICY=camera=(), microphone=(), geolocation=()
```

### Configuration par défaut

```typescript
const defaultConfig = {
  frameOptions: "DENY",
  contentTypeOptions: "nosniff",
  xssProtection: "1; mode=block",
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: "camera=(), microphone=(), geolocation=(), ...",
  hsts: {
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true,
  },
};
```

## Utilisation

### Middleware automatique

Le middleware de sécurité est automatiquement intégré dans votre middleware principal (`src/middleware.ts`) et s'exécute en dernier pour ajouter les headers à toutes les réponses.

### Fonctions utilitaires

```typescript
import {
  getSecurityConfig,
  generateSecurityHeaders,
  getDevelopmentSecurityConfig,
  getProductionSecurityConfig,
} from "../lib/security-config";

// Obtenir la configuration actuelle
const config = getSecurityConfig();

// Générer des headers personnalisés
const headers = generateSecurityHeaders(config);

// Configuration pour le développement
const devConfig = getDevelopmentSecurityConfig();

// Configuration pour la production
const prodConfig = getProductionSecurityConfig();
```

## Chemins exclus

Certains chemins sont automatiquement exclus des headers de sécurité :

- `/api/health` - Endpoint de santé
- `/_astro/` - Assets Astro
- `/favicon.ico` - Favicon
- `/robots.txt` - Robots.txt
- `/sitemap.xml` - Sitemap

## Environnements

### Développement

- `X-Frame-Options: SAMEORIGIN` (plus permissif)
- `Referrer-Policy: no-referrer-when-downgrade` (plus permissif)
- Pas de HSTS (pour éviter les problèmes en développement)

### Production

- `X-Frame-Options: DENY` (strict)
- `Referrer-Policy: strict-origin-when-cross-origin` (strict)
- HSTS activé avec preload

## Tests

### Test de la configuration

```bash
npm run test:security
```

### Test manuel avec curl

```bash
# Test des headers de sécurité
curl -I http://localhost:4321/

# Test d'un chemin exclu
curl -I http://localhost:4321/api/health

# Test avec un navigateur
# Ouvrez http://localhost:4321/ et vérifiez les headers (F12)
```

## Sécurité

### Mesures de sécurité implémentées

1. **Protection contre le clickjacking** : X-Frame-Options
2. **Protection contre le MIME sniffing** : X-Content-Type-Options
3. **Protection XSS** : X-XSS-Protection
4. **Contrôle des référents** : Referrer-Policy
5. **Contrôle des API** : Permissions-Policy
6. **Protection HTTPS** : HSTS
7. **Protection des téléchargements** : X-Download-Options
8. **Protection cross-domain** : X-Permitted-Cross-Domain-Policies

### Bonnes pratiques

1. **Utilisez HTTPS en production** : HSTS nécessite HTTPS
2. **Testez régulièrement** : Vérifiez que les headers sont présents
3. **Surveillez les logs** : Détectez les tentatives d'attaque
4. **Mettez à jour régulièrement** : Suivez les nouvelles vulnérabilités

## Compatibilité

### Adaptateurs Astro supportés

- ✅ Node.js (`@astrojs/node`)
- ✅ Vercel (`@astrojs/vercel`)
- ✅ Netlify (`@astrojs/netlify`)
- ✅ Deno (`@astrojs/deno`)
- ✅ Cloudflare (`@astrojs/cloudflare`)

### Navigateurs supportés

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (support limité)

## Dépannage

### Problèmes courants

1. **Headers manquants**

   - Vérifiez que le middleware de sécurité est intégré
   - Redémarrez le serveur après modification

2. **Problèmes avec les iframes**

   - Ajustez `X-Frame-Options` si nécessaire
   - Utilisez `SAMEORIGIN` ou `ALLOW-FROM`

3. **Problèmes HSTS**

   - HSTS nécessite HTTPS
   - Désactivez en développement si nécessaire

4. **Problèmes de performance**
   - Les headers n'impactent pas les performances
   - HSTS peut améliorer les performances (pas de redirection HTTP)

### Logs de débogage

Le middleware de sécurité est intégré avec votre système de logging existant. Surveillez les logs pour détecter les problèmes.

## Migration depuis Helmet.js

Si vous migrez depuis Helmet.js, cette configuration fournit les mêmes protections :

| Helmet.js                               | Notre configuration                 |
| --------------------------------------- | ----------------------------------- |
| `helmet.frameguard()`                   | `X-Frame-Options`                   |
| `helmet.noSniff()`                      | `X-Content-Type-Options`            |
| `helmet.xssFilter()`                    | `X-XSS-Protection`                  |
| `helmet.referrerPolicy()`               | `Referrer-Policy`                   |
| `helmet.hsts()`                         | `Strict-Transport-Security`         |
| `helmet.permittedCrossDomainPolicies()` | `X-Permitted-Cross-Domain-Policies` |

## Support et maintenance

Cette configuration est maintenue et mise à jour régulièrement pour suivre les meilleures pratiques de sécurité web.
