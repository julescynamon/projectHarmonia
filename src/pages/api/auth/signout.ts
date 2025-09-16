export const prerender = false;

import type { APIRoute } from "astro";
import { createServerClient } from "../../../lib/supabase";

// Fonction commune pour la déconnexion
async function handleSignOut({ cookies, locals, request }) {


  // Récupérer les cookies pour analyse
  const cookiesHeader = request.headers.get('cookie');
  
  // Créer un client Supabase avec les cookies
  const supabase = createServerClient(cookiesHeader);
  
  // Déconnexion de Supabase
  const { error } = await supabase.auth.signOut();

  
  if (error) {
    console.error('Erreur lors de la déconnexion Supabase:', error);
  }

  // Récupération du cookie actuel pour analyse
  const currentCookie = request.headers.get('cookie');


  // Fonction pour supprimer un cookie avec toutes les combinaisons possibles
  function deleteWithAllOptions(name: string) {
    const options = [
      { path: '/' },
      { path: '/', secure: true, httpOnly: true, sameSite: 'lax' },
      { path: '/', httpOnly: true },
      { path: '/', domain: request.headers.get('host')?.split(':')[0] },
    ];

    options.forEach(opt => {
      cookies.delete(name, opt);
      // Aussi essayer avec le décodage URL si nécessaire
      if (name.includes('.')) {
        cookies.delete(decodeURIComponent(name), opt);
      }
    });
  }

  // Liste des cookies à supprimer
  const cookiesToRemove = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
    'supabase.auth.token'
  ];

  // Suppression de tous les cookies
  cookiesToRemove.forEach(name => {
    deleteWithAllOptions(name);

  });

  // Création des en-têtes Set-Cookie pour une suppression forcée
  const expires = new Date(0).toUTCString();
  const domain = request.headers.get('host')?.split(':')[0];
  const cookieHeaders = cookiesToRemove.flatMap(name => [
    // Version basique
    `${name}=; path=/; expires=${expires}`,
    // Version avec HttpOnly
    `${name}=; path=/; expires=${expires}; HttpOnly`,
    // Version avec domain
    `${name}=; path=/; expires=${expires}; domain=${domain}`,
    // Version complète
    `${name}=; path=/; expires=${expires}; HttpOnly; domain=${domain}; SameSite=Lax`
  ]);

  // Nettoyage des locals
  locals.session = null;


  // Redirection vers la page d'accueil avec no-cache et suppression des cookies
  const headers = new Headers({
    'Location': '/',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  // Ajouter chaque cookie individuellement
  cookieHeaders.forEach(cookie => {
    headers.append('Set-Cookie', cookie);
  });
  
  return new Response(null, {
    status: 302,
    headers
  });
}

export const POST: APIRoute = async (context) => {
  try {
    return await handleSignOut(context);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return new Response('Erreur lors de la déconnexion', { status: 500 });
  }
};

export const GET: APIRoute = async (context) => {
  try {
    return await handleSignOut(context);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return new Response('Erreur lors de la déconnexion', { status: 500 });
  }
};
