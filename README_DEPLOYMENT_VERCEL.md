# 🚀 Déploiement Vercel - La Maison Sattvaïa

## Configuration actuelle

- **Framework :** Astro avec adapter Vercel serverless
- **Mode :** `output: "server"` (SSR complet)
- **Adapter :** `@astrojs/vercel`
- **Node.js :** >= 18

## Commandes de build

```bash
# Build standard Astro
npm run build

# Build Vercel (test local)
npm run vercel:build

# Déploiement Vercel
npx vercel --prod
```

## Configuration Vercel Dashboard

### Settings > General
- **Framework preset :** Astro
- **Build Command :** `npm run build`
- **Output directory :** Laisser vide (Vercel détecte `.vercel/output`)
- **Node Version :** 18+ (ou 20)

### Variables d'environnement (Production)
```env
# Supabase
PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# Application
WEBSITE_URL=https://votre-domaine.com
WEBSITE_NAME=La Maison Sattvaïa
```

## Structure de déploiement

- **Pages statiques :** Générées dans `.vercel/output/static/`
- **API Routes :** Fonctions serverless dans `.vercel/output/functions/`
- **SSR Pages :** Fonction `_render` pour toutes les pages

## Test local

```bash
# 1. Build Astro
npm run build

# 2. Test Vercel local
npx vercel build

# 3. Vérifier la structure
ls -la .vercel/output/
```

## Dépannage

### Erreur "Cannot find module '/var/task/dist/server/entry.mjs'"
- ✅ **Résolu :** Configuration Astro corrigée avec adapter Vercel
- ✅ **Résolu :** Pas de `vercel.json` avec builds custom
- ✅ **Résolu :** Framework preset = "Astro"

### Variables d'environnement
- ✅ **Sécurisé :** Seules les clés `PUBLIC_*` sont exposées côté client
- ✅ **Sécurisé :** Clés sensibles uniquement dans les API routes

### Routes API
- ✅ **Compatible :** Toutes les routes dans `src/pages/api/` fonctionnent
- ✅ **Compatible :** Aucun import `@astrojs/node` détecté

## Notes importantes

1. **Pas de `vercel.json`** - L'adapter Astro gère tout automatiquement
2. **Dossiers ignorés** - `.vercel/` et `dist/` dans `.gitignore`
3. **Mode server** - Toutes les pages sont en SSR (pas de statique)
4. **Sécurité** - Variables sensibles protégées côté serveur uniquement

## Déploiement

1. Push sur GitHub
2. Vercel détecte automatiquement les changements
3. Build avec `npm run build`
4. Déploiement des fonctions serverless
5. Site accessible sur l'URL Vercel

---

**Dernière mise à jour :** $(date)
**Version Astro :** Vérifier avec `npm list astro`
**Version Vercel :** Vérifier avec `npm list @astrojs/vercel`
