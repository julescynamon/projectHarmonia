import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
import { z } from 'zod';
import { f as sendConfirmationEmail } from '../../../chunks/email-service_goO0ss9z.mjs';
export { renderers } from '../../../renderers.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseKey) {
  console.error("Variables d'environnement manquantes:", {
    hasUrl: true,
    hasKey: !!supabaseKey
  });
  throw new Error("Configuration Supabase incomplète");
}
const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
const subscribeSchema = z.object({
  email: z.string().email("L'adresse email n'est pas valide"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation"
  })
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, consent } = subscribeSchema.parse(body);
    const { data: existingSubscriber, error: queryError } = await supabase.from("newsletter_subscribers").select("id, confirmed").eq("email", email.toLowerCase());
    if (queryError && queryError.code !== "PGRST116") {
      console.error("Erreur de requête Supabase:", queryError);
      throw new Error("Erreur lors de la vérification de l'email");
    }
    if (existingSubscriber && existingSubscriber.length > 0 && existingSubscriber[0].confirmed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cette adresse email est déjà inscrite à la newsletter."
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const confirmationToken = crypto.randomUUID();
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const { error: upsertError } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: email.toLowerCase(),
        confirmation_token: confirmationToken,
        token_expires_at: expiresAt.toISOString(),
        confirmed: false,
        consent_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        unsubscribed: false,
        unsubscribed_at: null
      },
      {
        onConflict: "email",
        ignoreDuplicates: false
      }
    );
    if (upsertError) {
      console.error("Erreur d'insertion Supabase:", upsertError);
      throw new Error("Erreur lors de l'enregistrement de l'inscription");
    }
    await sendConfirmationEmail(email, confirmationToken);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Merci ! Veuillez confirmer votre inscription en cliquant sur le lien envoyé par email."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Erreur complète:", error);
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: false,
        message: "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      }),
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
