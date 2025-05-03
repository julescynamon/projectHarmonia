import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log('[LOGOUT] Début du processus de déconnexion');
    
    // Récupérer les cookies pour analyse
    const cookiesHeader = request.headers.get('cookie');
    console.log('[LOGOUT] Cookies reçus:', cookiesHeader ? 'Présents' : 'Absents');
    
    // Créer un client Supabase avec les cookies
    const supabase = createServerClient(cookiesHeader);
    
    // Déconnecter l'utilisateur via Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[LOGOUT] Erreur lors de la déconnexion Supabase:', error);
    } else {
      console.log('[LOGOUT] Déconnexion Supabase réussie');
    }
    
    // Supprimer tous les cookies liés à l'authentification
    const cookiesToClear = [
      'supabase.auth.token',
      'sb-access-token',
      'sb-refresh-token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      cookies.delete(cookieName, {
        path: '/',
      });
      
      // Essayer également avec des options différentes pour s'assurer que le cookie est supprimé
      cookies.delete(cookieName);
    });
    
    console.log('[LOGOUT] Cookies supprimés');
    
    // Retourner une réponse JSON si c'est une requête AJAX
    const isAjax = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    
    if (isAjax) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Déconnexion réussie'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Sinon, rediriger vers la page d'accueil
    return redirect('/?logout=success');
  } catch (error) {
    console.error('[LOGOUT] Erreur:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
