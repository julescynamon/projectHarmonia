# Optimisations de Performance - Harmonia

Ce document détaille les optimisations de performance implémentées dans le projet Harmonia pour améliorer les temps de chargement et l'expérience utilisateur.

## 🚀 Optimisations Implémentées

### 1. Compression Gzip et Brotli

**Configuration :** `astro.config.mjs` et `vite.config.ts`

- **Gzip** : Compression standard pour tous les navigateurs
- **Brotli** : Compression avancée pour les navigateurs modernes
- **Seuil** : Compression automatique des fichiers > 10KB
- **Formats supportés** : JS, CSS, HTML, SVG, polices

```javascript
// Compression Gzip
viteCompression({
  algorithm: 'gzip',
  ext: '.gz',
  threshold: 10240,
  deleteOriginFile: false,
}),

// Compression Brotli
viteCompression({
  algorithm: 'brotliCompress',
  ext: '.br',
  threshold: 10240,
  deleteOriginFile: false,
}),
```

### 2. Optimisation des Images

**Composant :** `src/components/OptimizedImage.astro`

- **Formats modernes** : WebP et AVIF
- **Responsive** : Densités 1x et 2x
- **Lazy loading** : Chargement différé avec Intersection Observer
- **Aspect ratio** : Prévention du layout shift

```astro
<OptimizedImage
  src="/images/hero.jpg"
  alt="Image optimisée"
  width={800}
  height={600}
  loading="lazy"
  priority={false}
/>
```

### 3. Optimisation des Polices

**Fichier :** `src/styles/fonts.css`

- **Font-display: swap** : Affichage immédiat avec fallback
- **Preload** : Chargement prioritaire des polices critiques
- **Unicode-range** : Chargement optimisé par caractères
- **Formats WOFF2** : Compression maximale

```css
@font-face {
  font-family: "Cormorant Garamond";
  font-display: swap;
  font-weight: 400;
  src: url("/fonts/cormorant-garamond-latin-400-normal.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF,
    U+FFFD;
}
```

### 4. Service Worker et PWA

**Configuration :** `vite.config.ts`

- **Cache intelligent** : Stratégies adaptées par type de ressource
- **Mise à jour automatique** : Service worker auto-update
- **Cache des polices** : 1 an pour Google Fonts
- **Cache des images** : 30 jours
- **Cache des ressources** : 7 jours avec revalidation

```javascript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      // Configuration du cache par type de ressource
    ],
  },
}),
```

### 5. Optimisation du Build

**Configuration :** `astro.config.mjs` et `vite.config.ts`

- **Chunking intelligent** : Séparation des vendors et utilitaires
- **Minification avancée** : Terser avec optimisations
- **Tree shaking** : Élimination du code inutilisé
- **Source maps** : Désactivées en production

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        utils: ['@supabase/supabase-js', 'zod'],
        animations: ['gsap', 'aos'],
      },
    },
  },
  minify: 'terser',
  sourcemap: false,
},
```

### 6. Middleware de Performance

**Fichier :** `src/middleware/performance.ts`

- **En-têtes de cache** : Configuration optimisée par type
- **Compression** : Détection automatique du support navigateur
- **Sécurité** : En-têtes de protection
- **CORS** : Configuration pour les assets

```typescript
// En-têtes de cache pour les assets statiques
if (
  context.url.pathname.match(
    /\.(js|css|png|jpg|jpeg|gif|svg|webp|avif|woff2|woff|ttf|eot)$/
  )
) {
  headers.set("Cache-Control", "public, max-age=31536000, immutable"); // 1 an
}
```

### 7. Optimisation du Layout

**Fichier :** `src/layouts/Layout.astro`

- **Preload critique** : Polices et images importantes
- **DNS prefetch** : Connexions anticipées
- **Preconnect** : Connexions prioritaires
- **CSS inline** : Styles critiques intégrés
- **Lazy loading** : Scripts optimisés

```html
<!-- Preload des ressources critiques -->
<link
  rel="preload"
  href="/fonts/cormorant-garamond-latin-400-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="//fonts.googleapis.com" />

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

## 📊 Métriques de Performance

### Objectifs

- **First Contentful Paint (FCP)** : < 1.5s
- **Largest Contentful Paint (LCP)** : < 2.5s
- **First Input Delay (FID)** : < 100ms
- **Cumulative Layout Shift (CLS)** : < 0.1
- **Time to Interactive (TTI)** : < 3.8s

### Outils de Mesure

1. **Lighthouse** : Audit complet des performances
2. **WebPageTest** : Tests de vitesse détaillés
3. **PageSpeed Insights** : Analyse Google
4. **Chrome DevTools** : Profiling en temps réel

## 🔧 Configuration Serveur

### Nginx (Recommandé)

```nginx
# Compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Brotli
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Cache headers
location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|avif|woff2|woff|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### Apache

```apache
# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
</IfModule>
```

## 🚀 Scripts de Build

### Production

```bash
# Build optimisé
npm run build

# Preview avec optimisations
npm run preview

# Test des performances
npm run test:performance
```

### Développement

```bash
# Serveur de développement optimisé
npm run dev

# Build de développement
npm run build:dev
```

## 📈 Monitoring

### Métriques à Surveiller

1. **Core Web Vitals** : LCP, FID, CLS
2. **Temps de chargement** : FCP, TTI
3. **Taille des bundles** : JavaScript, CSS
4. **Cache hit ratio** : Efficacité du cache
5. **Compression ratio** : Taux de compression

### Outils de Monitoring

- **Sentry** : Performance monitoring
- **Google Analytics** : Core Web Vitals
- **Custom metrics** : Métriques spécifiques

## 🔄 Maintenance

### Vérifications Régulières

1. **Audit Lighthouse** : Mensuel
2. **Mise à jour des dépendances** : Hebdomadaire
3. **Optimisation des images** : À chaque ajout
4. **Vérification du cache** : Trimestriel
5. **Test de compression** : Mensuel

### Optimisations Futures

- **HTTP/3** : Support QUIC
- **ES Modules** : Import/export optimisés
- **Web Components** : Composants natifs
- **Streaming SSR** : Rendu progressif
- **Edge Computing** : CDN avec logique

## 📚 Ressources

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Astro Performance](https://docs.astro.build/en/guides/performance/)
