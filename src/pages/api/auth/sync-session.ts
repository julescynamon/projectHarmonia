import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

const supabase = createServerClient();

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { session } = await request.json();

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Session invalide' }),
        { status: 400 }
      );
    }

    // Vérifier la session avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Session expirée ou invalide' }),
        { status: 401 }
      );
    }

    // Définir les cookies de session
    cookies.set('sb-access-token', session.access_token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/'
    });

    cookies.set('sb-refresh-token', session.refresh_token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      path: '/'
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la synchronisation de session:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500 }
    );
  }
};
