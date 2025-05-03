import type { APIRoute } from 'astro';
import { extractAndVerifySession } from '../../../lib/auth';
import { createServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies: astroCookies }) => {
  // Récupération des cookies
  const cookiesHeader = request.headers.get('cookie');

  
  // Analyse des cookies individuels
  const cookiesList = cookiesHeader ? cookiesHeader.split(';').map(c => c.trim()) : [];

  
  // Vérification spécifique des cookies Supabase
  const supabaseAuthToken = cookiesList.find(c => c.startsWith('supabase.auth.token='));
  const sbAccessToken = cookiesList.find(c => c.startsWith('sb-access-token='));
  const sbRefreshToken = cookiesList.find(c => c.startsWith('sb-refresh-token='));


  // Vérification de la session via notre méthode personnalisée
  const decodedSession = extractAndVerifySession(cookiesHeader);

  
  // Vérification alternative via le client Supabase
  const supabase = createServerClient(cookiesHeader);
  const { data: supabaseSession } = await supabase.auth.getSession();

  if (!decodedSession && !supabaseSession?.session) {
    return new Response(JSON.stringify({
      isAuthenticated: false,
      error: 'Invalid or expired session',
      cookiesPresent: {
        supabaseAuthToken: !!supabaseAuthToken,
        sbAccessToken: !!sbAccessToken,
        sbRefreshToken: !!sbRefreshToken
      },
      message: 'Aucune session valide trouvée'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Session valide (priorité à la session Supabase si disponible)
  const validSession = supabaseSession?.session || decodedSession;
  const userId = supabaseSession?.session?.user?.id || decodedSession?.user?.id;
  
  return new Response(JSON.stringify({
    isAuthenticated: true,
    sessionSource: supabaseSession?.session ? 'supabase' : 'decoded',
    userId,
    email: validSession?.user?.email,
    cookiesPresent: {
      supabaseAuthToken: !!supabaseAuthToken,
      sbAccessToken: !!sbAccessToken,
      sbRefreshToken: !!sbRefreshToken
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
