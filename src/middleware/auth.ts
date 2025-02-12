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

export const onRequest = defineMiddleware(
  async ({ request, redirect, locals }, next) => {
    try {
      console.log('Middleware - URL actuelle:', request.url);
      const url = new URL(request.url);
      const { pathname } = url;
      
      // Create a new supabase client on every request
      const supabase = createServerClient();
      locals.supabase = supabase;

      // Vérifier le cookie d'authentification
      const cookies = request.headers.get('cookie');
      const authCookie = cookies?.match(/supabase\.auth\.token=([^;]+)/)?.[1];
      
      // Récupérer la session actuelle
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erreur lors de la récupération de la session:', sessionError);
        locals.session = null;
        locals.user = null;
      } else if (currentSession) {
        console.log('Session existante trouvée pour:', currentSession.user.email);
        locals.session = currentSession;
        locals.user = currentSession.user;
      } else if (authCookie) {
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
            console.error('Erreur lors de la définition de la session:', error);
            locals.session = null;
            locals.user = null;
          } else {
            console.log('Nouvelle session définie pour:', authSession.user.email);
            locals.session = authSession;
            locals.user = authSession.user;
          }
        } catch (error) {
          console.error('Erreur lors du traitement du cookie:', error);
          locals.session = null;
          locals.user = null;
        }
      } else {
        console.log('Aucun cookie d\'authentification trouvé');
        locals.session = null;
        locals.user = null;
      }

      // Log session status
      console.log('Middleware - Session:', locals.session ? `Connecté (${locals.session.user.id})` : 'Non connecté');
      console.log('Middleware - URL courante:', pathname);

      // Pages requiring authentication
      const protectedPaths = ['/mon-compte', '/boutique/confirmation'];
      const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
      const isAuthPath = pathname === '/login' || pathname === '/register';

      // Handle authentication paths
      if (locals.session) {
        if (isAuthPath) {
          console.log('Middleware - Utilisateur connecté sur page auth, redirection vers /mon-compte');
          return redirect('/mon-compte');
        }
      } else if (isProtectedPath) {
        console.log('Middleware - Page protégée sans session, redirection vers /login');
        return redirect(`/login?returnTo=${encodeURIComponent(pathname)}`);
      }

      // Continue with the request
      const response = await next();
      return response;

    } catch (error) {
      console.error('Middleware - Erreur:', error);
      return next();
    }
  }
);
