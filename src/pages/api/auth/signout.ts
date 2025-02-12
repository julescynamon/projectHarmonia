import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, locals, redirect }) => {
  try {
    // Déconnexion de Supabase
    const { error } = await locals.supabase.auth.signOut();
    
    if (error) throw error;

    // Suppression des cookies de session
    const cookiesToRemove = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token'
    ];

    cookiesToRemove.forEach(cookieName => {
      cookies.delete(cookieName, {
        path: '/',
      });
    });

    // Redirection vers la page d'accueil
    return redirect('/', 302);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return new Response('Erreur lors de la déconnexion', { status: 500 });
  }
};
