# Documentation des Types TypeScript - La Maison Sattvaïa

## Vue d'ensemble

Le fichier `src/env.d.ts` contient tous les types TypeScript nécessaires pour le projet La Maison Sattvaïa, garantissant une sécurité de type complète et une meilleure expérience de développement.

## Variables d'Environnement

### Variables Publiques (Client)

```typescript
interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SITE_URL: string;
}
```

### Variables Privées (Serveur)

```typescript
interface ImportMetaEnv {
  readonly SUPABASE_SERVICE_KEY: string;
  readonly SUPABASE_JWT_SECRET: string;
  readonly RESEND_API_KEY: string;
  readonly FROM_EMAIL: string;
  readonly WEBSITE_URL: string;
  readonly WEBSITE_NAME: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly API_SECRET_KEY: string;
}
```

### Variables Astro

```typescript
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly BASE_URL: string;
  readonly SITE: string;
}
```

## Types d'Application

### Locals (Contexte Astro)

```typescript
declare namespace App {
  interface Locals {
    supabase: SupabaseClient;
    session: Session | null;
    user: User | null;
  }
}
```

## Types de Données

### Profils Utilisateurs

```typescript
interface UserProfile {
  id: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}
```

### Produits

```typescript
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  pdf_path: string;
  category: string;
  created_at: string;
  updated_at: string;
}
```

### Articles de Blog

```typescript
interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  category: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
```

### Panier

```typescript
interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  product: Product;
}
```

### Commandes

```typescript
interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string;
  status: "pending" | "completed" | "failed";
  total: number;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  order_id: string;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}
```

### Rendez-vous

```typescript
interface Appointment {
  id: string;
  user_id: string;
  service_type: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  stripe_session_id?: string;
  created_at: string;
}
```

### Newsletter

```typescript
interface NewsletterSubscriber {
  id: number;
  email: string;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
}
```

### Notifications

```typescript
interface Notification {
  id: number;
  user_id: string;
  type: "blog" | "appointment" | "order";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
```

## Types API

### Erreurs API

```typescript
interface APIError {
  error: string;
  message: string;
  details?: any;
}
```

### Réponses API

```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Types HTTP

### Requêtes

```typescript
interface HTTPRequest {
  method: string;
  url: string;
  headers: Headers;
  body?: any;
}
```

### Réponses

```typescript
interface HTTPResponse {
  status: number;
  statusText: string;
  headers: Headers;
  body?: any;
}
```

## Types Middleware

### Contexte Middleware

```typescript
interface MiddlewareContext {
  request: HTTPRequest;
  locals: App.Locals;
  cookies: {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options?: CookieOptions) => void;
    delete: (name: string) => void;
  };
  redirect: (url: string) => Response;
}
```

## Types Composants

### Props Composants Astro

```typescript
interface AstroComponentProps {
  [key: string]: any;
}
```

### Props Layouts

```typescript
interface LayoutProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}
```

## Types SEO

### Métadonnées SEO

```typescript
interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noindex?: boolean;
}
```

## Types Animations

### Configuration Animation

```typescript
interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: "normal" | "reverse" | "alternate";
  fillMode?: "none" | "forwards" | "backwards" | "both";
}
```

## Types Thème

### Configuration Thème

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

## Types Configuration

### Configuration Application

```typescript
interface AppConfig {
  name: string;
  version: string;
  environment: "development" | "production" | "staging";
  debug: boolean;
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    sessionTimeout: number;
    refreshThreshold: number;
  };
  email: {
    provider: "resend" | "nodemailer";
    fromAddress: string;
    replyTo?: string;
  };
  payment: {
    provider: "stripe";
    currency: string;
    webhookSecret: string;
  };
}
```

## Avantages

1. **Sécurité de Type** : Toutes les variables d'environnement sont typées
2. **Autocomplétion** : IDE avec suggestions intelligentes
3. **Détection d'Erreurs** : Erreurs de type détectées à la compilation
4. **Documentation** : Types servent de documentation du code
5. **Refactoring** : Changements automatiques propagés
6. **Maintenabilité** : Code plus robuste et maintenable

## Utilisation

### Dans les Composants Astro

```typescript
---
// Les types sont automatiquement disponibles
const session: Session | null = Astro.locals.session;
const user: User | null = Astro.locals.user;
---
```

### Dans les API Routes

```typescript
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  // locals est typé avec App.Locals
  const session = locals.session;
  const user = locals.user;
};
```

### Dans les Middlewares

```typescript
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // context.locals est typé
  context.locals.session = session;
});
```

## Notes Importantes

- Tous les types sont globaux et disponibles dans tout le projet
- Les variables d'environnement sont strictement typées
- Les types Supabase sont importés automatiquement
- Les types sont extensibles selon les besoins du projet
