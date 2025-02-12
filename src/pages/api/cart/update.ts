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
    const { itemId, quantity } = await request.json();

    if (!itemId || typeof quantity !== 'number' || quantity < 1) {
      return new Response(
        JSON.stringify({ message: 'Paramètres invalides' }), 
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

    // Vérifier la disponibilité du produit
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', cartItem.product_id)
      .single();

    if (!product || quantity > product.stock) {
      return new Response(
        JSON.stringify({ message: 'Quantité non disponible' }), 
        { status: 400 }
      );
    }

    // Mettre à jour la quantité
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: quantity })
      .eq('id', itemId)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        message: 'Quantité mise à jour',
        quantity: quantity
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quantité:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la mise à jour de la quantité' }), 
      { status: 500 }
    );
  }
}
