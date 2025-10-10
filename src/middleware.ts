import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "@supabase/ssr";

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, locals, url } = context;

  // Créer le client Supabase avec les cookies
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookies.get(key)?.value,
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    }
  );

  // Récupérer l'utilisateur depuis Supabase avec fallback
  try {
    const { data: { user } } = await supabase.auth.getUser();
    locals.user = user ?? null;
  } catch {
    locals.user = null;
  }
  locals.supabase = supabase;

  // 🔒 Protéger /mon-compte (et sous-routes éventuelles)
  if ((url.pathname === "/mon-compte" || url.pathname.startsWith("/mon-compte/")) && !locals.user) {
    return Response.redirect(
      new URL(`/login?redirect=${encodeURIComponent(url.pathname)}`, url),
      302
    );
  }

  // Continuer vers la page
  const response = await next();
  
  // Ajouter les headers de cache pour éviter la mise en cache des pages avec auth
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
  
  return response;
});
