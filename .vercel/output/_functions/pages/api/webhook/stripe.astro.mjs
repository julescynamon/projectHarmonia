import Stripe from 'stripe';
import { s as supabase } from '../../../chunks/supabase_CXSvBnpz.mjs';
import { c as createContextLogger, b as logStripeEvent, l as logError } from '../../../chunks/logger_D2N0LYGt.mjs';
export { renderers } from '../../../renderers.mjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const POST = async ({ request }) => {
  const startTime = Date.now();
  const logContext = {
    path: "/api/webhook/stripe",
    method: "POST",
    userAgent: request.headers.get("user-agent") || "Stripe-Webhook",
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"
  };
  const webhookLogger = createContextLogger(logContext);
  try {
    webhookLogger.info({
      message: "Webhook Stripe reçu"
    });
    const payload = await request.text();
    const sig = request.headers.get("stripe-signature");
    if (!sig || !endpointSecret) {
      webhookLogger.warn({
        message: "Signature ou secret manquant",
        hasSignature: !!sig,
        hasEndpointSecret: !!endpointSecret
      });
      return new Response("Signature ou secret manquant", { status: 400 });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      webhookLogger.info({
        message: "Événement Stripe validé",
        eventType: event.type,
        eventId: event.id
      });
    } catch (err) {
      webhookLogger.error({
        message: "Erreur de signature webhook",
        error: {
          name: err instanceof Error ? err.name : "Unknown",
          message: err instanceof Error ? err.message : String(err)
        }
      });
      return new Response("Signature invalide", { status: 400 });
    }
    logStripeEvent(event.type, event.data.object, {
      ...logContext,
      eventId: event.id
    });
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      webhookLogger.info({
        message: "Traitement de la session de paiement",
        sessionId: session.id,
        customerId: session.customer,
        amount: session.amount_total,
        currency: session.currency
      });
      try {
        const { data: cartItems, error: cartError } = await supabase.from("cart_items").select("product_id, quantity").eq("user_id", session.client_reference_id);
        if (cartError) {
          webhookLogger.error({
            message: "Erreur lors de la récupération du panier",
            error: {
              message: cartError.message,
              details: cartError.details
            },
            sessionId: session.id,
            userId: session.client_reference_id
          });
          throw cartError;
        }
        webhookLogger.info({
          message: "Panier récupéré",
          cartItemsCount: cartItems?.length || 0,
          sessionId: session.id
        });
        const { data: order, error: orderError } = await supabase.from("orders").insert({
          user_id: session.client_reference_id,
          stripe_session_id: session.id,
          total_amount: session.amount_total ? session.amount_total / 100 : 0,
          status: "completed"
        }).select().single();
        if (orderError) {
          webhookLogger.error({
            message: "Erreur lors de la création de la commande",
            error: {
              message: orderError.message,
              details: orderError.details
            },
            sessionId: session.id
          });
          throw orderError;
        }
        webhookLogger.info({
          message: "Commande créée",
          orderId: order.id,
          sessionId: session.id,
          totalAmount: order.total_amount
        });
        if (!cartItems || cartItems.length === 0) {
          webhookLogger.warn({
            message: "Panier introuvable pour la session",
            sessionId: session.id,
            userId: session.client_reference_id
          });
          throw new Error("Panier introuvable");
        }
        const orderItems = cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: 0
          // Le prix sera mis à jour ci-dessous
        }));
        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) {
          webhookLogger.error({
            message: "Erreur lors de la création des items de commande",
            error: {
              message: itemsError.message,
              details: itemsError.details
            },
            orderId: order.id
          });
          throw itemsError;
        }
        webhookLogger.info({
          message: "Items de commande créés",
          orderId: order.id,
          itemsCount: orderItems.length
        });
        const { data: products, error: productsError } = await supabase.from("products").select("id, price").in("id", cartItems.map((item) => item.product_id));
        if (productsError) {
          webhookLogger.error({
            message: "Erreur lors de la récupération des produits",
            error: {
              message: productsError.message,
              details: productsError.details
            },
            orderId: order.id
          });
          throw productsError;
        }
        if (products) {
          const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]));
          await Promise.all(orderItems.map(async (item) => {
            await supabase.from("order_items").update({ price: priceMap[item.product_id] || 0 }).eq("order_id", order.id).eq("product_id", item.product_id);
          }));
          webhookLogger.info({
            message: "Prix des items mis à jour",
            orderId: order.id,
            productsCount: products.length
          });
        }
        const { error: clearCartError } = await supabase.from("cart_items").delete().eq("user_id", session.client_reference_id);
        if (clearCartError) {
          webhookLogger.warn({
            message: "Erreur lors du vidage du panier",
            error: {
              message: clearCartError.message,
              details: clearCartError.details
            },
            userId: session.client_reference_id
          });
        } else {
          webhookLogger.info({
            message: "Panier vidé",
            userId: session.client_reference_id
          });
        }
        const duration2 = Date.now() - startTime;
        webhookLogger.info({
          message: "Webhook Stripe traité avec succès",
          duration: `${duration2}ms`,
          orderId: order.id,
          sessionId: session.id
        });
        return new Response(JSON.stringify({ orderId: order.id }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        const duration2 = Date.now() - startTime;
        webhookLogger.error({
          message: "Erreur de traitement webhook",
          duration: `${duration2}ms`,
          sessionId: session.id,
          error: {
            name: error instanceof Error ? error.name : "Unknown",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : void 0
          }
        });
        return new Response("Erreur de traitement", { status: 500 });
      }
    }
    const duration = Date.now() - startTime;
    webhookLogger.info({
      message: "Webhook Stripe traité",
      duration: `${duration}ms`,
      eventType: event.type
    });
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(error instanceof Error ? error : new Error(String(error)), {
      ...logContext,
      duration: `${duration}ms`,
      message: "Erreur générale du webhook Stripe"
    });
    return new Response("Erreur interne du serveur", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
