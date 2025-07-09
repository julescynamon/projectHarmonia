# Harmonia - Site Web de Naturopathie

Site web professionnel pour les services de naturopathie humaine et animale, incluant une boutique en ligne, un blog, et un système de prise de rendez-vous.

## 🚀 Technologies

- **Framework** : [Astro](https://astro.build/) - Framework web moderne
- **Styling** : [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitaire
- **Base de données** : [Supabase](https://supabase.com/) - Backend-as-a-Service
- **Authentification** : Supabase Auth avec gestion des rôles
- **Paiements** : [Stripe](https://stripe.com/) - Gestion des paiements
- **Emails** : [Resend](https://resend.com/) - Service d'envoi d'emails
- **TypeScript** : Typage statique pour une meilleure maintenabilité

## 📁 Structure du Projet

```
harmonia/
├── docs/                    # Documentation du projet
│   ├── TYPESCRIPT_TYPES.md
│   ├── MIGRATION_CSS.md
│   └── NETTOYAGE_ENERGETIQUE_SUMMARY.md
├── src/
│   ├── pages/              # Pages et routes API
│   │   ├── api/           # Endpoints API
│   │   ├── admin/         # Pages d'administration
│   │   ├── blog/          # Pages du blog
│   │   ├── boutique/      # Pages de la boutique
│   │   └── rendez-vous/   # Pages de prise de RDV
│   ├── components/        # Composants réutilisables
│   │   ├── auth/         # Composants d'authentification
│   │   ├── admin/        # Composants d'administration
│   │   ├── shop/         # Composants de la boutique
│   │   ├── ui/           # Composants UI de base
│   │   └── navigation/   # Composants de navigation
│   ├── layouts/          # Layouts de pages
│   ├── lib/              # Utilitaires et services
│   │   ├── supabase/     # Configuration Supabase
│   │   └── emails/       # Templates d'emails
│   ├── types/            # Types TypeScript
│   ├── scripts/          # Scripts utilitaires
│   ├── middleware/       # Middlewares d'authentification
│   ├── integrations/     # Intégrations Astro
│   ├── email-templates/  # Templates d'emails
│   ├── utils/            # Utilitaires
│   └── styles/           # Styles globaux
├── public/               # Assets publics
│   ├── fonts/           # Polices personnalisées
│   ├── images/          # Images du site
│   ├── robots.txt       # Configuration SEO
│   └── favicon.svg      # Favicon
├── database/            # Scripts SQL et migrations
├── supabase/            # Configuration Supabase
└── dist/                # Build de production
```

## 🛠️ Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Stripe
- Compte Resend

### Configuration

1. **Cloner le repository**

```bash
git clone <repository-url>
cd harmonia
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Remplir le fichier `.env` avec vos clés :

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Resend
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_from_email

# Application
WEBSITE_URL=your_website_url
WEBSITE_NAME=Harmonia
API_SECRET_KEY=your_api_secret
```

4. **Configurer Supabase**

```bash
# Installer Supabase CLI
npm install -g supabase

# Lier le projet
supabase link --project-ref your_project_ref

# Appliquer les migrations
supabase db push
```

## 🚀 Commandes

| Commande          | Action                                        |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Démarre le serveur de développement           |
| `npm run build`   | Build de production                           |
| `npm run preview` | Prévisualise le build localement              |
| `npm run astro`   | Commandes CLI Astro                           |
| `npm run notify`  | Envoie les notifications de nouveaux articles |

## 🎨 Fonctionnalités

### 🔐 Authentification

- Inscription/Connexion utilisateurs
- Gestion des rôles (user/admin)
- Récupération de mot de passe
- Sessions sécurisées

### 🛒 Boutique en ligne

- Catalogue de produits
- Panier d'achat
- Paiement Stripe
- Téléchargement de PDF

### 📝 Blog

- Articles avec catégories
- Système de notifications
- Interface d'administration
- SEO optimisé

### 📅 Prise de rendez-vous

- Calendrier interactif
- Gestion des disponibilités
- Confirmation par email
- Paiement en ligne

### 📧 Newsletter

- Inscription/désinscription
- Templates d'emails
- Gestion des abonnés

## 🏗️ Architecture

### Frontend

- **Astro** : Framework principal avec SSR
- **TailwindCSS** : Styling utilitaire
- **TypeScript** : Typage statique
- **React** : Composants interactifs

### Backend

- **Supabase** : Base de données PostgreSQL
- **Supabase Auth** : Authentification
- **Supabase Storage** : Stockage de fichiers
- **Edge Functions** : Logique serveur

### Intégrations

- **Stripe** : Paiements
- **Resend** : Emails transactionnels
- **AOS** : Animations au scroll

## 🔧 Configuration

### TailwindCSS

Le projet utilise une configuration personnalisée avec :

- Couleurs de la charte graphique
- Polices personnalisées (Playfair Display, Raleway, Lora)
- Composants UI réutilisables

### TypeScript

Types complets pour :

- Variables d'environnement
- Modèles de données
- API responses
- Composants Astro

### SEO

- Métadonnées dynamiques
- Sitemap automatique
- Robots.txt configuré
- Open Graph tags

## 📱 Responsive Design

Le site est entièrement responsive avec :

- Design mobile-first
- Breakpoints TailwindCSS
- Images optimisées
- Navigation adaptative

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Autres plateformes

Le projet utilise l'adapter `@astrojs/node` et peut être déployé sur n'importe quelle plateforme supportant Node.js.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Harmonia** - Votre bien-être naturel 🌿
