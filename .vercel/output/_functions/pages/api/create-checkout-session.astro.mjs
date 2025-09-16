import Stripe from 'stripe';
export { renderers } from '../../renderers.mjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const items = body.items;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Items requis et doivent être un tableau non vide" }),
        { status: 400 }
      );
    }
    const validItems = items.filter((item) => {
      if (!item.id || !item.quantity || item.quantity <= 0) {
        return false;
      }
      return true;
    });
    if (validItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucun item valide trouvé" }),
        { status: 400 }
      );
    }
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: validItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product.title,
            description: `Fichier PDF: ${item.product.pdf_path}`
          },
          unit_amount: Math.round(item.product.price * 100)
          // Conversion en centimes
        },
        quantity: item.quantity
      })),
      mode: "payment",
      client_reference_id: session.user.id,
      success_url: `${"http://localhost:4321"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${"http://localhost:4321"}/boutique`
    });
    return new Response(
      JSON.stringify({ url: stripeSession.url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Erreur Stripe:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors du traitement du paiement" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
