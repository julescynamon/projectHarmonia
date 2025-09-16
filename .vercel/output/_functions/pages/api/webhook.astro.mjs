import Stripe from 'stripe';
import { a as createServiceClient } from '../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../renderers.mjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
function logError(phase, error) {
}
function logWebhook(message, data) {
}
const POST = async ({ request }) => {
  try {
    const payload = await request.text();
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      throw new Error("Signature Stripe manquante");
    }
    if (!endpointSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET non défini");
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
    if (event.type === "checkout.session.completed") {
      logWebhook("Traitement de checkout.session.completed");
      const session = event.data.object;
      try {
        logWebhook("Récupération des détails de la session", { sessionId: session.id });
        const stripeSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items", "line_items.data.price.product"]
        });
        logWebhook("Détails de la session récupérés", {
          sessionId: stripeSession.id,
          customerId: stripeSession.customer,
          clientReferenceId: stripeSession.client_reference_id,
          amountTotal: stripeSession.amount_total,
          lineItemsCount: stripeSession.line_items?.data.length
        });
        if (!stripeSession.client_reference_id) {
          throw new Error("client_reference_id manquant dans la session");
        }
        const userId = stripeSession.client_reference_id;
        const supabase = createServiceClient();
        const { data: existingOrder } = await supabase.from("orders").select("id").eq("stripe_session_id", session.id).single();
        if (existingOrder) {
          return new Response(JSON.stringify({ received: true, existing: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        const { data: order, error: orderError } = await supabase.from("orders").insert({
          user_id: userId,
          stripe_session_id: session.id,
          total_amount: stripeSession.amount_total ? stripeSession.amount_total / 100 : 0,
          status: "completed"
        }).select().single();
        if (orderError) {
          throw orderError;
        }
        logWebhook("Récupération des articles de la session");
        const lineItems = stripeSession.line_items?.data;
        logWebhook("Articles trouvés dans la session", {
          sessionId: stripeSession.id,
          lineItems: lineItems?.map((item) => ({
            id: item.id,
            priceId: item.price?.id,
            productId: item.price?.product,
            quantity: item.quantity,
            amount: item.amount_total,
            productDetails: item.price?.product
          }))
        });
        if (!lineItems || lineItems.length === 0) {
          throw new Error("Aucun article trouvé dans la session");
        }
        const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", userId);
        if (cartError) {
        }
        for (const item of lineItems) {
          if (!item.price?.product) {
            continue;
          }
          const stripeProduct = typeof item.price.product === "string" ? await stripe.products.retrieve(item.price.product) : item.price.product;
          const pdfPath = typeof stripeProduct === "object" && "description" in stripeProduct && stripeProduct.description ? stripeProduct.description.replace("Fichier PDF: ", "") : null;
          if (!pdfPath) {
            continue;
          }
          const { data: product, error: productError } = await supabase.from("products").select("id, title, pdf_path").eq("pdf_path", pdfPath).single();
          if (productError) {
            continue;
          }
          if (product) {
            const { error: itemError } = await supabase.from("order_items").insert({
              order_id: order.id,
              product_id: product.id,
              quantity: item.quantity || 1,
              price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0
            });
            if (itemError) {
            }
          } else {
          }
        }
      } catch (error) {
        logError("traitement commande", error);
        return new Response(JSON.stringify({
          error: "Erreur traitement commande",
          details: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({
      received: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Erreur serveur",
      details: error.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
