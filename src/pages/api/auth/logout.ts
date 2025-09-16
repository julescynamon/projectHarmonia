export const prerender = false;

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

const supabase = createServerClient();

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Récupérer le token d'accès depuis les cookies
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (accessToken) {
      // Déconnecter l'utilisateur côté serveur
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erreur lors de la déconnexion Supabase:', error);
      }
    }

    // Supprimer tous les cookies de session
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });
    cookies.delete('supabase.auth.token', { path: '/' });

    return new Response(
      JSON.stringify({ success: true, message: 'Déconnexion réussie' }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la déconnexion' }),
      { status: 500 }
    );
  }
};
