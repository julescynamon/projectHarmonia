import { defineMiddleware } from "astro:middleware";
import type { APIRoute } from "astro";
import { createServerClient } from "../lib/supabase";
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

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
  '/mot-de-passe-oublie',
  '/reinitialiser-mot-de-passe',
  '/login',
  '/register',
  '/rendez-vous',
  '/confirmation',
  '/'
];

// Routes API publiques
const PUBLIC_API_ROUTES = [
  '/api/create-appointment',
  '/api/appointments/create',
  '/api/appointments/check-availability',
  '/api/cart/items' // Temporairement ajouté pour le débogage
];

export const onRequest = defineMiddleware(
  async ({ request, redirect, locals }, next) => {
    
    try {
      const url = new URL(request.url);
      const { pathname } = url;
      
      // Définir les types de routes
      const isLoginPath = pathname === '/login';
      const isApiPath = pathname.startsWith('/api/');
      const isAdminPath = pathname.startsWith('/admin');
      

   
      
      // Ignorer les routes publiques
      if (PUBLIC_ROUTES.includes(pathname)) {
        return next();
      }
      
      // Create a new supabase client on every request
      const supabase = createServerClient();
      locals.supabase = supabase;

      
      
      // Récupérer la session actuelle
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      
      if (sessionError) {
        locals.session = null;
        locals.user = null;
      } else if (currentSession) {
        locals.session = currentSession;
        locals.user = currentSession.user;
      } else {
        // Essayer de récupérer le token du cookie
        const cookies = request.headers.get('cookie');
        
        
        const authCookie = cookies?.match(/supabase\.auth\.token=([^;]+)/)?.[1];
        
        
        if (authCookie) {
          try {
            // Décoder le cookie
            const decodedCookie = decodeURIComponent(authCookie);
            const { access_token, refresh_token } = JSON.parse(decodedCookie);
            
            // Définir la session avec le token
            const { data: { session: authSession }, error } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });
            
            if (error) {
              locals.session = null;
              locals.user = null;
            } else {
              locals.session = authSession;
              locals.user = authSession.user;
            }
          } catch (error) {
            locals.session = null;
            locals.user = null;
          }
        } else {
          locals.session = null;
          locals.user = null;
        }
      }
      
      // Gérer les routes API séparément
      if (isApiPath) {
        // Autoriser les routes API publiques
        if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
          return next();
        }
        
        // Pour les autres routes API, vérifier l'authentification
        if (!locals.session) {
          return new Response('Unauthorized', { status: 401 });
        }
        return next();
      }

      // Vérifier les routes admin
      if (isAdminPath) {
        
        if (!locals.session) {
          return redirect('/login');
        }
        
        try {
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', locals.session.user.id)
            .single();
          
          if (profileError) {
            console.error('Erreur lors de la requête profiles:', profileError);
            return redirect('/');
          }
          

          
          if (!profileData || profileData.role !== 'admin') {
            return redirect('/');
          }
          
          
          return next();
        } catch (error) {
          console.error('Erreur lors de la vérification du rôle:', error);
          return redirect('/');
        }
      }

      // Ensuite, vérifier les routes protégées standard
      const protectedPaths = ['/mon-compte', '/boutique/confirmation'];
      const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
      const isAuthPath = pathname === '/login' || pathname === '/register';

      // Gérer les chemins d'authentification
      if (locals.session) {
        // Si l'utilisateur est connecté et essaie d'accéder à une page d'auth
        if (isAuthPath) {
          return redirect('/mon-compte');
        }
      } 
      // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
      else if (isProtectedPath) {
        return redirect(`/login?returnTo=${encodeURIComponent(pathname)}`);
      }
      
      // Définir la session pour toutes les routes
      locals.session = locals.session;
      locals.user = locals.session?.user || null;

      // Continuer avec la requête
      const response = await next();
      return response;

    } catch (error) {
      console.error('Middleware - Erreur:', error);
      return next();
    }
  }
);
