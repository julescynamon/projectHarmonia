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
  '/naturopathie-humaine',
  '/naturopathie-animale',
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

      
      // Récupérer les cookies pour analyse
      const cookies = request.headers.get('cookie');
      
      if (cookies) {
        const cookiesList = cookies.split(';').map(c => c.trim());
        const supabaseAuthToken = cookiesList.find(c => c.startsWith('supabase.auth.token='));
        const sbAccessToken = cookiesList.find(c => c.startsWith('sb-access-token='));
        const sbRefreshToken = cookiesList.find(c => c.startsWith('sb-refresh-token='));
        
      }

      // Récupération directe de la session via Supabase
      const supabase = createServerClient(cookies);
      locals.supabase = supabase;
      
      // Obtenir la session directement depuis Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erreur lors de la récupération de la session:', sessionError);
      }
      
      locals.session = session;
      
      if (session) {
        console.log("session OK")
      } else {
        // Fallback sur notre méthode personnalisée si nécessaire
        const decodedSession = extractAndVerifySession(cookies);
        
        if (decodedSession) {

          locals.session = convertToSupabaseSession(decodedSession);
        } else {
          console.log('Aucune session valide trouvée par aucune méthode');
          locals.session = null;
        }
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
        if (!locals.session) {
          console.log('Accès API refusé: pas de session');
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Vérification des accès admin (pages et API)
      if (isAdminPath || isAdminApi) {
        if (!locals.session) {
          console.log('Accès admin refusé: pas de session');
          return redirect('/login');
        }

        // Vérification du rôle dans la table profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', locals.session.user.id)
          .single();

        console.log('Profile trouvé:', profile);

        // Vérification spéciale pour l'admin principal
        const isMainAdmin = locals.session.user.email === 'tyzranaima@gmail.com';

        if (isMainAdmin) {
          
          // Créer ou mettre à jour le profil admin si nécessaire
          if (!profile) {
            const { error: upsertError } = await supabase
              .from('profiles')
              .upsert({
                id: locals.session.user.id,
                email: locals.session.user.email,
                role: 'admin',
                updated_at: new Date().toISOString()
              });
            
            if (upsertError) {
              console.error('Erreur lors de la création du profil admin:', upsertError);
            }
          }
        } else if (!profile || profile.role !== 'admin') {
          console.log('Accès admin refusé: pas admin dans profiles');
          return redirect('/mon-compte');
        }

      
      } else if (!isPublicRoute && !isPublicApi && !isApiPath) {
        if (!locals.session) {
          console.log('Accès refusé: authentification requise');
          return redirect('/login');
        }
      }

      // Si l'utilisateur est sur la page de login et qu'il est déjà connecté
      if (isLoginPath && locals.session) {
        // Rediriger vers la page appropriée
        const returnTo = new URL(request.url).searchParams.get('returnTo');
        return redirect(returnTo || '/mon-compte');
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
