import { defineMiddleware } from "astro:middleware";
import type { APIRoute } from "astro";
import { createServerClient } from "../lib/supabase";
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { extractAndVerifySession, convertToSupabaseSession } from "../lib/auth";

// Extend the Locals interface to include our custom properties
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      session?: Session | null;
    }
  }
}

// Routes à ignorer pour l'authentification
const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/blog',
  '/boutique',
  '/contact',
  '/a-propos',
  '/mot-de-passe-oublie',
  '/reinitialiser-mot-de-passe',
  '/login',
  '/register',
  '/confirmation',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/cgv'
];

// Vérifie si un chemin correspond à une route publique
function isPublicPath(pathname: string): boolean {
  // Vérifie les correspondances exactes
  if (PUBLIC_ROUTES.includes(pathname)) return true;

  // Vérifie les sous-routes de blog et boutique
  if (pathname.startsWith('/blog/') || pathname.startsWith('/boutique/')) return true;

  // Vérifie les assets statiques
  if (pathname.startsWith('/assets/') || 
      pathname.startsWith('/images/') || 
      pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)) return true;

  return false;
}

// Routes API publiques
const PUBLIC_API_ROUTES = [
  '/api/create-appointment',
  '/api/appointments/create',
  '/api/appointments/check-availability',
  '/api/appointments/webhook',
  '/api/cart/items',
  '/api/auth/check-session'
];

// Routes API qui nécessitent une authentification
const AUTH_API_ROUTES = [
  '/api/cart/checkout'
];

// Routes API qui nécessitent un rôle admin
const ADMIN_API_ROUTES = [
  '/api/admin/users',
  '/api/admin/orders',
  '/api/admin/products',
  '/api/blog/create',
  '/api/blog/update',
  '/api/blog/delete'
];

export const onRequest = defineMiddleware(
  async ({ request, redirect, locals }, next) => {
    let pathname: string;

    try {
      const url = new URL(request.url);
      pathname = url.pathname;

      console.log('=== AUTH MIDDLEWARE DEBUG ===');
      console.log('Path:', pathname);

      // Vérification de la session via le token JWT
      const cookies = request.headers.get('cookie');
      const decodedSession = extractAndVerifySession(cookies);

      // Création du client Supabase
      const supabase = createServerClient();
      locals.supabase = supabase;

      // Si on a une session valide, on la convertit au format Supabase
      if (decodedSession) {
        locals.session = convertToSupabaseSession(decodedSession);
        console.log('Session trouvée pour:', decodedSession.user.email);
      } else {
        locals.session = null;
        console.log('Pas de session valide');
      }

      // Définir les types de routes
      const isLoginPath = pathname === '/login';
      const isApiPath = pathname.startsWith('/api/');
      const isAdminPath = pathname.startsWith('/admin');
      const isPublicRoute = isPublicPath(pathname);
      const isPublicApi = PUBLIC_API_ROUTES.includes(pathname);
      const isAdminApi = ADMIN_API_ROUTES.includes(pathname);
      const isAuthApi = AUTH_API_ROUTES.includes(pathname);

      // Vérification des accès authentifiés
      if (isAuthApi) {
        if (!decodedSession) {
          console.log('Accès API refusé: pas de session');
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Vérification des accès admin (pages et API)
      if (isAdminPath || isAdminApi) {
        if (!decodedSession) {
          console.log('Accès admin refusé: pas de session');
          return redirect('/login');
        }

        // Vérification du rôle dans la table profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', decodedSession.user.id)
          .single();

        console.log('Profile trouvé:', profile);

        // Vérification spéciale pour l'admin principal
        const isMainAdmin = decodedSession.user.email === 'tyzranaima@gmail.com';

        if (isMainAdmin) {
          console.log('Accès admin accordé pour admin principal');
          // Créer ou mettre à jour le profil admin si nécessaire
          if (!profile) {
            const { error: upsertError } = await supabase
              .from('profiles')
              .upsert({
                id: decodedSession.user.id,
                email: decodedSession.user.email,
                role: 'admin',
                updated_at: new Date().toISOString()
              });
            
            if (upsertError) {
              console.error('Erreur lors de la création du profil admin:', upsertError);
            }
          }
        } else if (!profile || profile.role !== 'admin') {
          console.log('Accès admin refusé: pas admin dans profiles');
          return redirect('/');
        }

        console.log('Accès admin accordé pour:', decodedSession.user.email);
      } else if (!isPublicRoute && !isPublicApi && !isApiPath) {
        if (!decodedSession) {
          console.log('Accès refusé: authentification requise');
          return redirect('/login');
        }
      }

      // Si l'utilisateur est sur la page de login et qu'il est déjà connecté
      if (isLoginPath && decodedSession) {
        console.log('Redirection: déjà connecté');
        return redirect('/');
      }

      // Continuer vers la page demandée
      const response = await next();
      return response;

    } catch (error) {
      console.error('Middleware - Erreur:', error);
      // En cas d'erreur sur une route admin, redirige vers la page de login
      if (pathname.startsWith('/admin')) {
        return redirect('/login');
      }
      return next();
    }
  }
);
