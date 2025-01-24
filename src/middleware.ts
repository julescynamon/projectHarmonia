import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import { onRequest as authMiddleware } from "./middleware/auth"; // Importer le middleware d'authentification

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      global: {
        headers: { "x-use-cookies": "true" }, // Assure-toi que les cookies sont utilisés
      },
    }
  );

  context.locals.supabase = supabase;

  // Vérifier et rafraîchir la session si nécessaire
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.expires_at) {
    const timeNow = Math.round(Date.now() / 1000);
    const expiresIn = session.expires_at - timeNow;

    if (expiresIn < 3600) {
      // Rafraîchir si moins d'une heure restante
      await supabase.auth.refreshSession();
    }
  }

  // Appeler le middleware d'authentification
  const response = await authMiddleware(context, next);

  // Retourner la réponse
  return response || next(); // Assurer le retour d'une réponse
});
