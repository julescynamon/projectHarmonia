import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const supabase = createServerClient();
  
  // Récupération des cookies
  const cookies = request.headers.get('cookie');
  

  // Vérification de la session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  return new Response(JSON.stringify({
    isAuthenticated: !!session,
    session,
    error,
    cookies: cookies || null
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
