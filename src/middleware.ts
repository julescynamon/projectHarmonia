import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import { onRequest as authMiddleware } from "./middleware/auth"; // Importer le middleware d'authentification

export const onRequest = defineMiddleware(async (context, next) => {
  // Créer le client Supabase avec une configuration standard
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce"
      },
      global: {
        headers: { "x-use-cookies": "true" }
      }
    }
  );

  // Stocker le client Supabase dans les locals pour qu'il soit accessible partout
  context.locals.supabase = supabase;

  // Récupérer la session
  try {
    const { data: { session } } = await supabase.auth.getSession();
    context.locals.session = session;

    // Rafraîchir la session si elle expire bientôt
    if (session?.expires_at) {
      const timeNow = Math.round(Date.now() / 1000);
      const expiresIn = session.expires_at - timeNow;

      if (expiresIn < 3600) {
        const refreshResult = await supabase.auth.refreshSession();
        context.locals.session = refreshResult.data.session;
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    context.locals.session = null;
  }

  // Appeler le middleware d'authentification
  const response = await authMiddleware(context, next);

  // Retourner la réponse
  return response || next();
});
