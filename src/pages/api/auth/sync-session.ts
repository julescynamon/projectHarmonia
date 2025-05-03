import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    console.log('[SYNC_SESSION] Début de la synchronisation de session');
    
    // Récupérer les données de session du corps de la requête
    const { session } = await request.json();
    
    if (!session || !session.access_token) {
      console.error('[SYNC_SESSION] Données de session invalides');
      return new Response(JSON.stringify({
        success: false,
        message: 'Données de session invalides'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log('[SYNC_SESSION] Session reçue pour:', session.user?.email);
    
    // Définir les cookies manuellement
    const expires = new Date(session.expires_at * 1000);
    
    // Cookie pour le token d'accès
    cookies.set('sb-access-token', session.access_token, {
      path: '/',
      expires,
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax'
    });
    
    // Cookie pour le token de rafraîchissement
    if (session.refresh_token) {
      cookies.set('sb-refresh-token', session.refresh_token, {
        path: '/',
        expires,
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax'
      });
    }
    
    // Cookie pour la session complète (format utilisé par le middleware)
    const sessionStr = JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at
    });
    
    cookies.set('supabase.auth.token', sessionStr, {
      path: '/',
      expires,
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax'
    });
    
    console.log('[SYNC_SESSION] Cookies définis avec succès');
    
    // Créer un client Supabase avec le token d'accès
    const supabase = createServerClient();
    
    // Vérifier que la session est valide
    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
    
    if (error || !user) {
      console.error('[SYNC_SESSION] Erreur lors de la vérification de la session:', error);
      return new Response(JSON.stringify({
        success: false,
        message: 'Session invalide',
        error: error?.message
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log('[SYNC_SESSION] Session validée pour:', user.email);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Session synchronisée avec succès',
      user: {
        id: user.id,
        email: user.email
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('[SYNC_SESSION] Erreur:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Erreur lors de la synchronisation de la session',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
