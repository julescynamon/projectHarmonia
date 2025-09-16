import { a as createServiceClient } from '../../chunks/supabase_CXSvBnpz.mjs';
import Stripe from 'stripe';
import { m as monitoring } from '../../chunks/monitoring_CqxFccfw.mjs';
export { renderers } from '../../renderers.mjs';

async function checkSupabase() {
  const transaction = monitoring.startTransaction("health_check_supabase", "db.query", {
    action: "health_check",
    metadata: { service: "supabase" }
  });
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
      monitoring.captureSupabaseError(error, "health_check", {
        action: "health_check",
        metadata: { service: "supabase" }
      });
      return {
        status: "FAIL",
        message: `Erreur Supabase: ${error.message}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    if (transaction) {
      transaction.setTag("service", "supabase");
      transaction.setTag("status", "success");
      transaction.finish();
    }
    return {
      status: "OK",
      message: "Connexion Supabase réussie",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    monitoring.captureError(error, {
      action: "health_check",
      metadata: { service: "supabase" }
    });
    if (transaction) {
      transaction.setTag("service", "supabase");
      transaction.setTag("status", "error");
      transaction.finish();
    }
    return {
      status: "FAIL",
      message: `Erreur de connexion Supabase: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
async function checkStripe() {
  const transaction = monitoring.startTransaction("health_check_stripe", "http.client", {
    action: "health_check",
    metadata: { service: "stripe" }
  });
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      monitoring.captureMessage("Clé secrète Stripe non configurée", "error", {
        action: "health_check",
        metadata: { service: "stripe" }
      });
      return {
        status: "FAIL",
        message: "Clé secrète Stripe non configurée",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16"
    });
    await stripe.products.list({ limit: 1 });
    if (transaction) {
      transaction.setTag("service", "stripe");
      transaction.setTag("status", "success");
      transaction.finish();
    }
    return {
      status: "OK",
      message: "API Stripe accessible",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    monitoring.captureStripeError(error, "health_check", {
      action: "health_check",
      metadata: { service: "stripe" }
    });
    if (transaction) {
      transaction.setTag("service", "stripe");
      transaction.setTag("status", "error");
      transaction.finish();
    }
    return {
      status: "FAIL",
      message: `Erreur API Stripe: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
const healthCheckHandler = async ({ request, locals }) => {
  const transaction = monitoring.startTransaction("health_check", "http.server", {
    userId: locals?.user?.id,
    action: "health_check",
    metadata: { endpoint: "/api/health" }
  });
  try {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const [supabaseCheck, stripeCheck] = await Promise.all([
      checkSupabase(),
      checkStripe()
    ]);
    const overall = supabaseCheck.status === "OK" && stripeCheck.status === "OK" ? "OK" : "FAIL";
    const healthResponse = {
      overall,
      services: {
        supabase: supabaseCheck,
        stripe: stripeCheck
      },
      timestamp
    };
    const statusCode = overall === "OK" ? 200 : 500;
    if (transaction) {
      transaction.setTag("overall_status", overall);
      transaction.setTag("supabase_status", supabaseCheck.status);
      transaction.setTag("stripe_status", stripeCheck.status);
      transaction.finish();
    }
    return new Response(JSON.stringify(healthResponse, null, 2), {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    monitoring.captureError(error, {
      userId: locals?.user?.id,
      action: "health_check",
      metadata: { endpoint: "/api/health" }
    });
    if (transaction) {
      transaction.setTag("status", "error");
      transaction.finish();
    }
    const errorResponse = {
      overall: "FAIL",
      error: "Erreur interne du serveur",
      message: error instanceof Error ? error.message : "Erreur inconnue",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  }
};
const GET = healthCheckHandler;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
