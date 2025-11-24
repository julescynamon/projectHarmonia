# Configuration SEO - La Maison Sattvaïa

## Variables d'environnement requises

Créez un fichier `.env.local` avec les variables suivantes :

```bash
# Configuration SEO et Analytics
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
PUBLIC_GOOGLE_SEARCH_CONSOLE_ID=your-search-console-id
PUBLIC_FACEBOOK_PIXEL_ID=your-facebook-pixel-id
PUBLIC_HOTJAR_ID=your-hotjar-id

# Configuration du site
PUBLIC_SITE_URL=https://www.maisonsattvaia.fr
PUBLIC_SITE_NAME=La Maison Sattvaïa
PUBLIC_SITE_DESCRIPTION=Accompagnement holistique unique alliant naturopathie, soins énergétiques et guidance spirituelle pour humains et animaux.

# Contact et informations
PUBLIC_CONTACT_EMAIL=contact@maisonsattvaia.fr
PUBLIC_CONTACT_PHONE=+33 6 XX XX XX XX

# Réseaux sociaux
PUBLIC_FACEBOOK_URL=https://www.facebook.com/maisonsattvaia
PUBLIC_INSTAGRAM_URL=https://www.instagram.com/maisonsattvaia
PUBLIC_TWITTER_URL=https://twitter.com/maisonsattvaia
```

## Optimisations SEO implémentées

### 1. Données structurées

- **LocalBusiness** : Informations sur l'entreprise
- **Service** : Détails des services proposés
- **Review** : Témoignages clients
- **FAQ** : Questions fréquentes
- **Breadcrumb** : Navigation structurée

### 2. Meta tags optimisés

- Titres optimisés pour chaque page
- Descriptions enrichies avec mots-clés
- Images Open Graph personnalisées
- Meta tags géographiques (France)
- Balises de performance

### 3. Sitemap optimisé

- Priorités ajustées selon l'importance des pages
- Fréquences de mise à jour optimisées
- Inclusion automatique des articles de blog

### 4. Performance et Core Web Vitals

- Preload des ressources critiques
- DNS prefetch pour les domaines externes
- Lazy loading des images
- CSS critique inline
- Optimisation des polices

### 5. Analytics et tracking

- Google Analytics 4 configuré
- Événements de conversion trackés
- Métriques Core Web Vitals
- Mesure de l'engagement utilisateur

## Mots-clés stratégiques

### Mots-clés principaux

- naturopathie
- soins énergétiques
- accompagnement holistique
- bien-être naturel

### Mots-clés longue traîne

- naturopathie pour humains et animaux
- soins énergétiques personnalisés
- accompagnement holistique France
- naturopathe spécialisée animaux

### Mots-clés sémantiques

- médecine naturelle
- thérapie alternative
- guérison naturelle
- équilibre corps esprit
- santé holistique

## Pages optimisées

1. **Accueil** - Mots-clés : naturopathie, soins énergétiques
2. **À propos** - Mots-clés : aïa, parcours naturopathie
3. **Services** - Mots-clés : services naturopathie, consultation
4. **Contact** - Mots-clés : rendez-vous naturopathie, contact
5. **Blog** - Mots-clés : blog naturopathie, conseils bien-être

## Tests de validation

### Outils de test SEO

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Critères d'acceptation

- Score PageSpeed > 90
- Données structurées validées
- Mobile-friendly confirmé
- Sitemap accessible
- Meta tags présents sur toutes les pages

## Monitoring et maintenance

### Métriques à surveiller

- Position dans les SERP
- Trafic organique
- Taux de conversion
- Core Web Vitals
- Engagement utilisateur

### Actions de maintenance

- Mise à jour régulière du contenu
- Optimisation des images
- Ajout de nouveaux articles de blog
- Surveillance des erreurs 404
- Mise à jour des données structurées

## Configuration Vercel

Assurez-vous que les variables d'environnement sont configurées dans Vercel :

1. Allez dans les paramètres du projet
2. Section "Environment Variables"
3. Ajoutez toutes les variables PUBLIC\_\*
4. Redéployez le projet

## Support et documentation

- [Documentation Astro SEO](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [Schema.org Documentation](https://schema.org/)
