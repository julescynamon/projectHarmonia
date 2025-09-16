export const prerender = false;

import type { APIRoute } from "astro";
import { getDownloadUrl } from "../../lib/shop";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Vérifier l'authentification via le middleware
    const { session } = locals;
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const orderId = url.searchParams.get("orderId");

    if (!productId || !orderId) {
      return new Response(JSON.stringify({ error: "Paramètres manquants" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const downloadUrl = await getDownloadUrl(productId, orderId, session.user.id);

    return new Response(JSON.stringify({ url: downloadUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
