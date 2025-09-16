export const prerender = false;

import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, locals }) => {
  const session = locals.session;
  
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ message: 'Authentification requise' }), 
      { status: 401 }
    );
  }


  // Créer un client Supabase avec le token d'accès
  const supabase = createServiceClient(session.access_token);

  try {
    const { productId } = await request.json();
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!productId || !UUID_REGEX.test(productId)) {
      return new Response(
        JSON.stringify({ message: 'ID du produit invalide' }), 
        { status: 400 }
      );
    }


    // Vérifier si le produit est un PDF
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('pdf_path')
      .eq('id', productId)
      .single();

    if (productError) throw productError;

    // Vérifier si le produit existe déjà dans le panier
    const { data: existingItem, error: selectError } = await supabase
      .from('cart_items')
      .select()
      .eq('user_id', session.user.id)
      .eq('product_id', productId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    // Si c'est un PDF et qu'il est déjà dans le panier, renvoyer une erreur
    if (product?.pdf_path && existingItem) {
      return new Response(
        JSON.stringify({ message: 'Ce PDF est déjà dans votre panier' }), 
        { status: 400 }
      );
    }

    // Si ce n'est pas un PDF et qu'il est déjà dans le panier, mettre à jour la quantité
    if (!product?.pdf_path && existingItem) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);

      if (updateError) throw updateError;
    } else {
      // Ajouter un nouvel article


      // Vérifier d'abord si l'utilisateur a accès à la table
      const { data: testData, error: testError } = await supabase
        .from('cart_items')
        .select('id')
        .limit(1);



      // Tenter l'insertion
      const { data: insertData, error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: session.user.id,
          product_id: productId,
          quantity: 1
        })
        .select();



      if (insertError) {
        console.error('Détails de l\'erreur d\'insertion:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw insertError;
      }
    }

    return new Response(
      JSON.stringify({ message: 'Produit ajouté au panier' }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de l\'ajout au panier' }), 
      { status: 500 }
    );
  }
}
