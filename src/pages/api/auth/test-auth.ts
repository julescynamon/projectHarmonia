import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ request }) => {
  console.log('=== TEST AUTH ===');
  
  try {
    // Récupérer les variables d'environnement
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }
    
    // Créer un client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: { 'x-use-cookies': 'true' }
      }
    });
    
    // Vérifier la session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Vérifier les cookies
    const cookies = request.headers.get('cookie');
    const cookiesList = cookies ? cookies.split(';').map(c => c.trim()) : [];
    
    return new Response(JSON.stringify({
      success: true,
      sessionExists: !!session,
      sessionDetails: session ? {
        userId: session.user.id,
        email: session.user.email,
        expiresAt: session.expires_at
      } : null,
      cookies: {
        raw: cookies,
        parsed: cookiesList,
        supabaseAuthToken: cookiesList.find(c => c.startsWith('supabase.auth.token=')),
        sbAccessToken: cookiesList.find(c => c.startsWith('sb-access-token=')),
        sbRefreshToken: cookiesList.find(c => c.startsWith('sb-refresh-token='))
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors du test d\'authentification:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Erreur lors du test d\'authentification',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
