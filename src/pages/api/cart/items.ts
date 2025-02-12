import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../lib/supabase';

interface Product {
  id: string;
  title: string;
  price: number;
  pdf_path: string;
}

interface CartItem {
  id: string;
  user_id: string;
  quantity: number;
  products: Product;
}

interface FormattedCartItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export const GET: APIRoute = async ({ locals }) => {
  console.log('GET /api/cart/items - Session:', locals.session);
  const session = locals.session;
  if (!session?.user) {
    return new Response(
      JSON.stringify({ error: 'Non autorisé' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    console.log('Fetching cart items for user:', session.user.id);
    console.log('Access token:', session.access_token);

    // Créer un client Supabase avec le token d'accès
    const supabase = createServiceClient(session.access_token);
    
    // Log the query we're about to make
    const query = supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_id,
        products (id, title, price, pdf_path)
      `)
      .eq('user_id', session.user.id);
    
    console.log('Executing query for user:', session.user.id);
    const { data: cartItems, error } = await query.returns<CartItem[]>();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Cart items found:', cartItems);
    console.log('Raw response:', { data: cartItems, error });

    if (!cartItems || cartItems.length === 0) {
      console.log('No items found in cart');
      return new Response(
        JSON.stringify({ items: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Formater les données pour le frontend
    const items = cartItems.map((item) => {
      const productData = item.products;
      return {
        id: item.id,
        product_id: productData.id,
        title: productData.title,
        price: productData.price,
        quantity: item.quantity,
        image: productData.pdf_path,
        product: productData
      };
    });

    return new Response(
      JSON.stringify({ items }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la récupération du panier' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
