export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request, locals }) => {
  const session = locals.session;
  
  if (!session) {
    return new Response(
      JSON.stringify({ message: 'Authentification requise' }), 
      { status: 401 }
    );
  }

  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return new Response(
        JSON.stringify({ message: 'ID de l\'article manquant' }), 
        { status: 400 }
      );
    }

    // Créer un client Supabase avec le token de l'utilisateur
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    });

    // Vérifier que l'article appartient bien à l'utilisateur
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select()
      .eq('id', itemId)
      .eq('user_id', session.user.id)
      .single();

    if (!cartItem) {
      return new Response(
        JSON.stringify({ message: 'Article non trouvé' }), 
        { status: 404 }
      );
    }

    // Supprimer l'article
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Article supprimé du panier' }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la suppression de l\'article' }), 
      { status: 500 }
    );
  }
}
