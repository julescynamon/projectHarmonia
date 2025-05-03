import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async () => {
  
  try {
    // Récupérer les variables d'environnement
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    

    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }
    
    // Créer un client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Tester une requête simple
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Connexion à Supabase réussie',
      data
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {

    
    return new Response(JSON.stringify({
      success: false,
      message: 'Erreur de connexion à Supabase',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
