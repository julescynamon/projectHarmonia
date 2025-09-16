import { d as sendContactEmail } from '../../chunks/email-service_goO0ss9z.mjs';
export { renderers } from '../../renderers.mjs';

const validationRules = {
  name: {
    minLength: 2,
    pattern: /^[A-Za-zÀ-ÿ\s-]+$/,
    message: "Le nom doit contenir au moins 2 caractères et ne contenir que des lettres"
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Format d'email invalide"
  },
  subject: {
    enum: ["consultation", "question", "partnership", "other"],
    message: "Veuillez sélectionner un sujet valide"
  },
  message: {
    minLength: 10,
    message: "Le message doit contenir entre 10 et 1000 caractères"
  }
};
function validateContactForm(data) {
  const errors = [];
  if (data.website) {
    errors.push({ field: "website", message: "Spam détecté" });
    return errors;
  }
  if (!data.name) {
    errors.push({ field: "name", message: "Le nom est requis" });
  } else if (data.name.length < validationRules.name.minLength) {
    errors.push({ field: "name", message: validationRules.name.message });
  } else if (!validationRules.name.pattern.test(data.name)) {
    errors.push({ field: "name", message: validationRules.name.message });
  }
  if (!data.email) {
    errors.push({ field: "email", message: "L'email est requis" });
  } else if (!validationRules.email.pattern.test(data.email)) {
    errors.push({ field: "email", message: validationRules.email.message });
  }
  if (!data.subject) {
    errors.push({ field: "subject", message: "Le sujet est requis" });
  } else if (!validationRules.subject.enum?.includes(data.subject)) {
    errors.push({ field: "subject", message: validationRules.subject.message });
  }
  if (!data.message) {
    errors.push({ field: "message", message: "Le message est requis" });
  } else if (data.message.length < validationRules.message.minLength) {
    errors.push({ field: "message", message: validationRules.message.message });
  }
  return errors;
}
function sanitizeContactData(data) {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    website: data.website?.trim()
  };
}

const POST = async ({ request }) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const contentType = request.headers.get("Content-Type");
    if (!contentType?.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Content-Type doit être application/json" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const body = await request.json();
    const data = body;
    const sanitizedData = sanitizeContactData(data);
    const errors = validateContactForm(sanitizedData);
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Données invalides",
          errors
        }),
        { status: 400 }
      );
    }
    try {
      await sendContactEmail(sanitizedData);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Message envoyé avec succès"
        }),
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Erreur lors de l'envoi du message"
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur dans l'API contact:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur interne du serveur"
      }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
