export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Define types for the data structure
interface Product {
  id: number;
  title: string;
  price: number;
  pdf_path: string;
}

interface CartItem {
  id: number;
  quantity: number;
  products: {
    id: number;
    title: string;
    price: number;
    pdf_path: string;
  };
}

export const GET: APIRoute = async ({ locals }) => {
  const session = locals.session;
  
  if (!session) {
    return new Response(
      JSON.stringify({ message: 'Authentification requise' }), 
      { status: 401 }
    );
  }

  try {
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

    // Récupérer les articles du panier avec les informations des produits
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (
          id,
          title,
          price,
          pdf_path
        )
      `)
      .eq('user_id', session.user.id)
      .returns<CartItem[]>();

    if (error) throw error;

 // Log the structure of cartItems

    // Formater les données pour le frontend
    const items = data.map((item) => ({
      id: item.id,
      product_id: item.products.id,
      title: item.products.title,
      price: item.products.price,
      quantity: item.quantity,
      image: item.products.pdf_path,
    }));

// Debug log

    return new Response(
      JSON.stringify({ items }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la récupération du panier' }), 
      { status: 500 }
    );
  }
}
