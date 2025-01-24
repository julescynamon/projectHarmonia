import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "../lib/supabase";

export const onRequest = defineMiddleware(
  async ({ request, redirect, locals }, next) => {
    // Créer une nouvelle instance du client serveur pour chaque requête
    const supabase = createServerClient();
    locals.supabase = supabase;

    // Récupérer tous les cookies
    const cookies = request.headers.get("Cookie") || "";

    // Récupérer le token d'authentification depuis les cookies
    const authTokenMatch = cookies.match(
      /sb-hvthtebjvmutuvzvttdb-auth-token=([^;]+)/
    );

    if (authTokenMatch) {
      try {
        const authToken = decodeURIComponent(authTokenMatch[1]);

        let parsedToken;
        try {
          parsedToken = JSON.parse(authToken);
        } catch (error) {
          console.error("Erreur lors du parsing du token:", error);
          throw error;
        }

        // Vérifier que le token contient les champs nécessaires
        if (!parsedToken.access_token || !parsedToken.refresh_token) {
          console.error("Token invalide - champs manquants");
          throw new Error("Token invalide");
        }

        // Configurer la session avec le token
        const {
          data: { session },
          error,
        } = await supabase.auth.setSession({
          access_token: parsedToken.access_token,
          refresh_token: parsedToken.refresh_token,
        });

        if (error) {
          console.error(
            "Erreur lors de la configuration de la session:",
            error.message
          );
          throw error;
        }

        if (session) {
          console.log(
            "Session configurée avec succès pour l'utilisateur:",
            session.user.id
          );

          const { pathname } = new URL(request.url);
          console.log("Chemin actuel:", pathname);

          // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
          if (pathname === "/login") {
            const returnTo = new URL(request.url).searchParams.get("returnTo");
            console.log(
              "Redirection de /login vers:",
              returnTo || "/mon-compte"
            );
            return redirect(returnTo || "/mon-compte");
          }
        } else {
          console.log("Pas de session malgré un token valide");
        }
      } catch (error) {
        console.error("Erreur lors du traitement de la session:", error);
      }
    } else {
      const { pathname } = new URL(request.url);
      const protectedPaths = ["/boutique/confirmation", "/mon-compte"];

      if (protectedPaths.some((path) => pathname.startsWith(path))) {
        console.log(
          "Accès à une page protégée sans session, redirection vers login"
        );
        const searchParams = new URLSearchParams();
        searchParams.set("returnTo", pathname);
        return redirect(`/login?${searchParams.toString()}`);
      }
    }

    const response = await next();
    return response;
  }
);
