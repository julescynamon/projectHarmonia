# Content Security Policy (CSP) - Configuration de Sécurité

## Vue d'ensemble

Cette application utilise une Content Security Policy (CSP) stricte pour protéger contre les attaques XSS, l'injection de code et autres vulnérabilités de sécurité web.

## Configuration actuelle

### Headers de sécurité implémentés

1. **Content-Security-Policy** : Directive principale de sécurité
2. **X-Content-Type-Options** : `nosniff` - Empêche le sniffing MIME
3. **X-Frame-Options** : `DENY` - Empêche le clickjacking
4. **X-XSS-Protection** : `1; mode=block` - Protection XSS supplémentaire
5. **Referrer-Policy** : `strict-origin-when-cross-origin` - Contrôle des référents
6. **Permissions-Policy** : `camera=(), microphone=(), geolocation=()` - Restriction des permissions

### Directives CSP configurées

#### Sources autorisées par type

**Scripts (`script-src`)**

- `'self'` : Scripts du même domaine
- `'unsafe-eval'` : Nécessaire pour Astro/React
- `'unsafe-inline'` : Nécessaire pour les styles inline
- `https://js.stripe.com` : Stripe JavaScript
- `https://checkout.stripe.com` : Stripe Checkout
- `https://maps.googleapis.com` : Google Maps

**Styles (`style-src`)**

- `'self'` : Styles du même domaine
- `'unsafe-inline'` : Styles inline
- `https://fonts.googleapis.com` : Google Fonts
- `https://cdn.jsdelivr.net` : CDN pour les styles

**Polices (`font-src`)**

- `'self'` : Polices du même domaine
- `https://fonts.gstatic.com` : Google Fonts
- `https://cdn.jsdelivr.net` : CDN pour les polices
- `data:` : Polices en base64

**Images (`img-src`)**

- `'self'` : Images du même domaine
- `data:` : Images en base64
- `blob:` : Images blob
- `https:` : Images HTTPS
- `https://*.supabase.co` : Images Supabase
- `https://maps.googleapis.com` : Google Maps
- `https://maps.gstatic.com` : Google Maps
- `https://checkout.stripe.com` : Stripe

**Connexions (`connect-src`)**

- `'self'` : Connexions du même domaine
- `https://*.supabase.co` : API Supabase
- `https://api.stripe.com` : API Stripe
- `https://checkout.stripe.com` : Stripe Checkout
- `https://maps.googleapis.com` : Google Maps
- `wss://*.supabase.co` : WebSocket Supabase

**Frames (`frame-src`)**

- `'self'` : Frames du même domaine
- `https://js.stripe.com` : Stripe
- `https://checkout.stripe.com` : Stripe Checkout
- `https://hooks.stripe.com` : Stripe Webhooks

#### Directives de sécurité strictes

- **`object-src 'none'`** : Bloque tous les objets (PDF, Flash, etc.)
- **`base-uri 'self'`** : Restreint l'URI de base
- **`form-action 'self'`** : Restreint les soumissions de formulaires
- **`upgrade-insecure-requests`** : Force HTTPS
- **`block-all-mixed-content`** : Bloque le contenu mixte
- **`require-trusted-types-for 'script'`** : Exige des types de confiance
- **`trusted-types 'default'`** : Types de confiance autorisés

## Fichiers de configuration

### `src/lib/csp-config.ts`

Contient la configuration centralisée des domaines autorisés et les fonctions de génération des headers CSP.

### `src/middleware.ts`

Intègre la fonction `addSecurityHeaders()` qui applique les headers de sécurité à toutes les réponses.

## Personnalisation

### Ajouter un nouveau domaine autorisé

1. Modifiez le fichier `src/lib/csp-config.ts`
2. Ajoutez le domaine dans la section appropriée de `defaultCSPConfig`
3. Redémarrez l'application

Exemple :

```typescript
export const defaultCSPConfig: CSPConfig = {
  scriptDomains: [
    "https://js.stripe.com",
    "https://checkout.stripe.com",
    "https://maps.googleapis.com",
    "https://nouveau-domaine.com", // Nouveau domaine
  ],
  // ... autres configurations
};
```

### Configuration par environnement

Vous pouvez créer des configurations différentes selon l'environnement :

```typescript
const devCSPConfig: CSPConfig = {
  // Configuration plus permissive pour le développement
  scriptDomains: [...defaultCSPConfig.scriptDomains, "https://localhost:3000"],
  // ... autres configurations
};

const prodCSPConfig: CSPConfig = {
  // Configuration stricte pour la production
  ...defaultCSPConfig,
};
```

## Tests de sécurité

### Vérifier les headers CSP

Utilisez les outils de développement du navigateur pour vérifier que les headers CSP sont bien présents :

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Network"
3. Rechargez la page
4. Vérifiez les headers de réponse pour `Content-Security-Policy`

### Tester les violations CSP

Le navigateur affichera automatiquement les violations CSP dans la console. Surveillez ces messages pour identifier les domaines manquants.

## Dépannage

### Erreurs courantes

1. **Scripts bloqués** : Ajoutez le domaine dans `scriptDomains`
2. **Styles bloqués** : Ajoutez le domaine dans `styleDomains`
3. **Images bloquées** : Ajoutez le domaine dans `imageDomains`
4. **Requêtes AJAX bloquées** : Ajoutez le domaine dans `connectDomains`

### Mode report-only

Pour tester sans bloquer le contenu, vous pouvez temporairement utiliser le mode report-only :

```typescript
response.headers.set("Content-Security-Policy-Report-Only", cspHeader);
```

## Bonnes pratiques

1. **Principe du moindre privilège** : N'autorisez que les domaines strictement nécessaires
2. **Révision régulière** : Vérifiez périodiquement les domaines autorisés
3. **Monitoring** : Surveillez les violations CSP en production
4. **Documentation** : Maintenez cette documentation à jour
5. **Tests** : Testez la CSP sur tous les environnements

## Ressources

- [MDN - Content Security Policy](https://developer.mozilla.org/fr/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Report URI](https://report-uri.com/) - Service de monitoring CSP
