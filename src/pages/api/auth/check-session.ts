import type { APIRoute } from 'astro';
import { extractAndVerifySession } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  // Récupération des cookies
  const cookies = request.headers.get('cookie');
  console.log('=== CHECK SESSION DEBUG ===');
  console.log('Cookies reçus:', cookies);

  // Vérification de la session
  const decodedSession = extractAndVerifySession(cookies);

  if (!decodedSession) {
    return new Response(JSON.stringify({
      isAuthenticated: false,
      error: 'Invalid or expired session'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Session valide
  return new Response(JSON.stringify({
    isAuthenticated: true,
    ...decodedSession
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
