# Guide d'utilisation des Breadcrumbs

## Exemples d'utilisation dans vos pages

### Page d'accueil

```astro
<!-- Pas de breadcrumb sur l'accueil -->
```

### Page Services

```astro
---
import Breadcrumb from '../components/Breadcrumb.astro';

const breadcrumbItems = [
  { name: 'Accueil', url: '/' },
  { name: 'Services', url: '/services' }
];
---

<Breadcrumb items={breadcrumbItems} />
```

### Page Naturopathie Humaine

```astro
---
import Breadcrumb from '../components/Breadcrumb.astro';

const breadcrumbItems = [
  { name: 'Accueil', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Naturopathie Humaine', url: '/accompagnements/naturopathie-humaine' }
];
---

<Breadcrumb items={breadcrumbItems} />
```

### Page Article de Blog

```astro
---
import Breadcrumb from '../components/Breadcrumb.astro';

const breadcrumbItems = [
  { name: 'Accueil', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Article Title', url: '/blog/article-title' }
];
---

<Breadcrumb items={breadcrumbItems} />
```

## Structure recommandée

### Pages principales

- Accueil (pas de breadcrumb)
- À propos : Accueil > À propos
- Services : Accueil > Services
- Contact : Accueil > Contact
- Blog : Accueil > Blog

### Pages de services

- Naturopathie Humaine : Accueil > Services > Naturopathie Humaine
- Naturopathie Animale : Accueil > Services > Naturopathie Animale
- Soins Énergétiques : Accueil > Services > Soins Énergétiques

### Pages de blog

- Article : Accueil > Blog > Titre de l'article
- Catégorie : Accueil > Blog > Catégorie

## Avantages SEO

1. **Navigation structurée** pour Google
2. **Liens internes** supplémentaires
3. **Rich snippets** dans les résultats de recherche
4. **Meilleure UX** pour les utilisateurs
5. **Schema.org BreadcrumbList** automatique
