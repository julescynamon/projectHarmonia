# Tests E2E avec Playwright

Ce dossier contient les tests end-to-end (E2E) pour l'application Harmonia utilisant Playwright.

## Structure des tests

- `auth-flow.spec.ts` - Tests du flux d'authentification (login > mon-compte > logout)
- `navigation.spec.ts` - Tests de navigation générale entre les pages
- `payment-flow.spec.ts` - Tests du flux de paiement et gestion du panier
- `forms.spec.ts` - Tests des formulaires (contact, newsletter, rendez-vous, etc.)
- `mocks/` - Mocks pour Supabase et Stripe

## Configuration

Les tests utilisent des mocks pour :

- **Supabase** : Simulation de l'authentification et des données utilisateur
- **Stripe** : Simulation des paiements

## Exécution des tests

### Tests E2E avec serveur de développement

```bash
npm run test:e2e:dev
```

### Tests E2E avec serveur de preview

```bash
npm run test:e2e
```

### Tests E2E avec interface graphique

```bash
npm run test:e2e:ui
```

### Tests E2E en mode debug

```bash
npm run test:e2e:debug
```

### Tests E2E avec navigateur visible

```bash
npm run test:e2e:headed
```

## Scénarios testés

### Flux d'authentification

- Connexion utilisateur
- Accès à la page "Mon compte"
- Vérification des informations personnelles
- Déconnexion
- Accès refusé sans authentification
- Navigation vers les pages d'administration (pour les admins)

### Navigation générale

- Navigation entre les pages principales
- Navigation mobile (menu hamburger)
- Navigation vers les services
- Navigation vers la boutique et le blog
- Navigation vers les rendez-vous

### Flux de paiement

- Ajout de produits au panier
- Gestion du panier (modification quantité, suppression)
- Processus de paiement
- Téléchargement de produits après achat
- Confirmation de commande

### Formulaires et interactions

- Formulaire de contact
- Inscription à la newsletter
- Formulaire de rendez-vous
- Recherche de produits
- Filtres de produits
- Formulaire de mot de passe oublié
- Inscription d'un nouvel utilisateur

## Navigateurs testés

- Chrome (Desktop)
- Firefox (Desktop)
- Safari (Desktop)
- Chrome Mobile
- Safari Mobile

## Gestion des erreurs

Les tests incluent :

- Gestion des timeouts
- Vérification des redirections
- Validation des messages d'erreur
- Gestion des cas où les éléments ne sont pas présents

## Mocks et données de test

### Utilisateurs de test

- `test@example.com` / `password123` - Utilisateur standard
- `admin@example.com` / `password123` - Utilisateur administrateur

### Données simulées

- Produits de la boutique
- Commandes utilisateur
- Sessions de paiement Stripe

## Débogage

### Génération de code de test

```bash
npm run playwright:codegen
```

### Visualisation des rapports

```bash
npm run test:e2e:report
```

## Intégration CI/CD

Les tests E2E sont exécutés automatiquement dans GitHub Actions sur :

- Push vers main
- Pull requests

Configuration dans `.github/workflows/e2e-tests.yml`

## Notes importantes

1. **Sélecteurs flexibles** : Les tests utilisent des sélecteurs multiples pour s'adapter aux variations de l'interface
2. **Gestion des timeouts** : Timeouts de 10 secondes pour les redirections
3. **Vérifications conditionnelles** : Certains tests vérifient la présence d'éléments avant d'interagir
4. **Mocks réalistes** : Les mocks simulent le comportement réel des services externes

## Résolution des problèmes courants

### Tests qui échouent sur les sélecteurs

- Vérifier que les sélecteurs correspondent à la structure HTML actuelle
- Utiliser `npm run playwright:codegen` pour générer de nouveaux sélecteurs

### Problèmes de timing

- Augmenter les timeouts dans les tests si nécessaire
- Ajouter des `waitFor` pour les éléments dynamiques

### Problèmes de serveur

- S'assurer que le serveur de développement est accessible sur `http://localhost:4321`
- Vérifier que tous les services (Supabase, etc.) sont configurés
