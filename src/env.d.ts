/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Variables publiques (accessibles côté client)
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  
  // Variables privées (serveur uniquement)
  readonly SUPABASE_SERVICE_KEY: string;
  readonly SUPABASE_JWT_SECRET: string;
  readonly RESEND_API_KEY: string;
  readonly FROM_EMAIL: string;
  readonly WEBSITE_URL: string;
  readonly WEBSITE_NAME: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly API_SECRET_KEY: string;
  
  // Variables d'environnement Astro
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly BASE_URL: string;
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: import("@supabase/supabase-js").User | null;
    supabase: import("@supabase/supabase-js").SupabaseClient;
  }
}

// Types pour les profils utilisateurs
interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Types pour les produits
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

// Types pour les articles de blog
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

// Types pour les éléments du panier
interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  product: Product;
}

// Types pour les commandes
interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string;
  status: 'pending' | 'completed' | 'failed';
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

// Types pour les rendez-vous
interface Appointment {
  id: string;
  user_id: string;
  service_type: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  stripe_session_id?: string;
  created_at: string;
}

// Types pour les abonnés newsletter
interface NewsletterSubscriber {
  id: number;
  email: string;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
}

// Types pour les notifications
interface Notification {
  id: number;
  user_id: string;
  type: 'blog' | 'appointment' | 'order';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Types pour les erreurs API
interface APIError {
  error: string;
  message: string;
  details?: any;
}

// Types pour les réponses API
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Types pour les cookies
interface CookieOptions {
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Types pour les requêtes HTTP
interface HTTPRequest {
  method: string;
  url: string;
  headers: Headers;
  body?: any;
}

// Types pour les réponses HTTP
interface HTTPResponse {
  status: number;
  statusText: string;
  headers: Headers;
  body?: any;
}

// Types pour les middlewares
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

// Types pour les composants Astro
interface AstroComponentProps {
  [key: string]: any;
}

// Types pour les layouts
interface LayoutProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}

// Types pour les métadonnées SEO
interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noindex?: boolean;
}

// Types pour les animations
interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Types pour les thèmes
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

// Types pour les configurations
interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'production' | 'staging';
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
    provider: 'resend' | 'nodemailer';
    fromAddress: string;
    replyTo?: string;
  };
  payment: {
    provider: 'stripe';
    currency: string;
    webhookSecret: string;
  };
}
