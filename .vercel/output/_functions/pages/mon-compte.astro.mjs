/* empty css                                    */
import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, e as createAstro, r as renderComponent, d as addAttribute } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_BPgP8eEd.mjs';
import 'clsx';
/* empty css                                      */
import { Resend } from 'resend';
export { renderers } from '../renderers.mjs';

const $$Toast = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="toast-container" class="toast-container"></div> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/Toast.astro?astro&type=script&index=0&lang.ts")}  ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/Toast.astro?astro&type=script&index=1&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/Toast.astro", void 0);

const createResendClient = (config) => new Resend(config.resendApiKey);
const createEmailTemplate = (confirmationUrl, config) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de changement d'email</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lora:wght@400;500&family=Raleway:wght@300;400&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Lora', serif;
      line-height: 1.6;
      color: #1C1C1C;
      background-color: #F4F1ED;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      padding: 40px 0;
      background-color: #A8B5A3;
    }
    .header h1 {
      font-family: 'Playfair Display', serif;
      color: white;
      margin: 0;
      font-size: 32px;
      letter-spacing: 0.02em;
    }
    .content {
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: #D4A373;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 30px;
      font-family: 'Raleway', sans-serif;
      font-weight: 400;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      color: #748C69;
      font-size: 14px;
      margin-top: 40px;
      font-family: 'Raleway', sans-serif;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #748C69;
      text-decoration: none;
      letter-spacing: 0.03em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmation de changement d'email</h1>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Vous avez demandé à changer votre adresse email sur <strong>${config.websiteName}</strong>.</p>
      <p>Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :</p>
      <p style="text-align: center;">
        <a href="${confirmationUrl}" class="button">Confirmer mon email</a>
      </p>
      <p style="font-size: 14px; color: #666;">Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
      <p style="font-size: 14px; color: #666; word-break: break-all;">${confirmationUrl}</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
    </div>
    <div class="footer">
      <a href="${config.websiteUrl}" class="logo">${config.websiteName}</a>
      <p>Votre boutique de partitions numériques</p>
    </div>
  </div>
</body>
</html>
`;
const sendEmailChangeConfirmation = async (to, confirmationUrl, config) => {
  try {
    const resend = createResendClient(config);
    const { data, error } = await resend.emails.send({
      from: config.fromEmail,
      to,
      subject: `${config.websiteName} - Confirmation de changement d'email`,
      html: createEmailTemplate(confirmationUrl, config)
    });
    if (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

const $$Astro = createAstro("https://harmonia.jules.com");
const $$MonCompte = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MonCompte;
  const supabase = Astro2.locals.supabase;
  const session = Astro2.locals.session;
  if (!session) {
    return Astro2.redirect("/login?returnTo=/mon-compte");
  }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
  if (Astro2.request.method === "POST") {
    const response = {
      success: false,
      message: ""
    };
    try {
      const formData = await Astro2.request.formData();
      const name = formData.get("name")?.toString();
      const email = formData.get("email")?.toString();
      if (!name || !email) {
        throw new Error("Le nom et l'email sont requis");
      }
      const { error: nameError } = await supabase.auth.updateUser({
        data: { name }
      });
      if (nameError) throw nameError;
      if (email !== session.user.email) {
        try {
          const { data: updateData, error: emailError } = await supabase.auth.updateUser({
            email
          });
          if (emailError) throw emailError;
          const confirmationUrl = updateData?.user?.confirmation_sent_at ? `${process.env.WEBSITE_URL}/auth/confirm-email?token=${updateData.user?.email_change_token}` : null;
          if (confirmationUrl) {
            await sendEmailChangeConfirmation(email, confirmationUrl, {
              resendApiKey: process.env.RESEND_API_KEY,
              fromEmail: process.env.FROM_EMAIL,
              websiteUrl: process.env.WEBSITE_URL,
              websiteName: process.env.WEBSITE_NAME
            });
          }
          response.success = true;
          response.message = "Un email de confirmation a été envoyé à " + email + ". Vous devez cliquer sur le lien dans l'email pour confirmer le changement. En attendant, votre ancien email reste actif.";
          response.preventReload = true;
        } catch (error) {
          console.error("Erreur lors de l'envoi de l'email:", error);
          throw new Error("Impossible d'envoyer l'email de confirmation. Veuillez réessayer plus tard.");
        }
      } else {
        response.success = true;
        response.message = "Profil mis à jour avec succès";
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      response.success = false;
      response.message = error.message || "Une erreur est survenue lors de la mise à jour du profil";
    }
    return new Response(JSON.stringify(response), {
      status: response.success ? 200 : 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const { data: orders, error: ordersError } = await supabase.from("orders").select(`
    id,
    user_id,
    total_amount,
    status,
    created_at,
    stripe_session_id
  `).eq("user_id", session.user.id).order("created_at", { ascending: false });
  if (orders && orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const { data: items, error: itemsError } = await supabase.from("order_items").select(`
      id,
      order_id,
      product_id,
      quantity,
      price,
      products (
        id,
        title,
        price,
        pdf_path
      )
    `).in("order_id", orderIds);
    if (items && !itemsError) {
      orders.forEach((order) => {
        order.order_items = items.filter((item) => item.order_id === order.id);
      });
    }
  }
  if (orders) {
    orders.forEach((order, i) => {
      const orderItems = order.order_items || [];
      orderItems.forEach((item) => {
      });
    });
  }
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  const userData = session?.user?.user_metadata || user?.user_metadata || {};
  console.log("Session user:", session?.user);
  console.log("User metadata:", userData);
  console.log("User name:", userData.name);
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Mon compte", "description": "Gérez vos informations personnelles et consultez vos commandes", "data-astro-cid-h23xuaax": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Toast", $$Toast, { "data-astro-cid-h23xuaax": true })}  ${maybeRenderHead()}<section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden hero-section" data-astro-cid-h23xuaax> <!-- Background avec image et overlay --> <div class="absolute inset-0" data-astro-cid-h23xuaax> <img src="/images/contact-hero.webp" alt="Mon compte La Maison Sattvaïa" class="w-full h-full object-cover scale-110 transform motion-safe:animate-subtle-zoom" data-astro-cid-h23xuaax> <div class="absolute inset-0 bg-gradient-to-r from-ebony/80 via-ebony/60 to-ebony/40" data-astro-cid-h23xuaax></div> </div> <!-- Contenu principal centré --> <div class="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-[60vh]" data-astro-cid-h23xuaax> <div class="max-w-5xl mx-auto text-center" data-astro-cid-h23xuaax> <!-- En-tête centré --> <div class="motion-safe:animate-fade-in" data-astro-cid-h23xuaax> <div class="inline-block mb-8" data-astro-cid-h23xuaax> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-xl font-semibold uppercase tracking-wider" data-astro-cid-h23xuaax>
Votre espace personnel
</span> </div> <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-astro-cid-h23xuaax>
Mon <span class="text-sage" data-astro-cid-h23xuaax>compte</span> </h1> <p class="font-slogan text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] italic" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600" data-astro-cid-h23xuaax>
"Gérez vos informations personnelles et consultez vos accompagnements."
</p> </div> </div> </div> <!-- Transition brush effect --> <div class="absolute bottom-0 left-0 w-full z-30" data-astro-cid-h23xuaax> <div class="absolute inset-0 bg-gradient-to-b from-transparent to-cream" data-astro-cid-h23xuaax></div> <svg width="100%" height="80" viewBox="0 0 1200 80" preserveAspectRatio="none" class="w-full h-auto" data-astro-cid-h23xuaax> <path d="M0,80 C300,20 600,60 1200,40 L1200,80 Z" fill="#faf9f7" data-astro-cid-h23xuaax></path> </svg> </div> </section>  <section class="py-20 md:py-32 bg-gradient-to-b from-cream to-white relative overflow-hidden" data-astro-cid-h23xuaax> <!-- Éléments décoratifs --> <div class="absolute top-0 left-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl" data-astro-cid-h23xuaax></div> <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" data-astro-cid-h23xuaax></div> <div class="absolute inset-0 bg-geometric-pattern opacity-3" data-astro-cid-h23xuaax></div> <div class="container mx-auto px-4 relative" data-astro-cid-h23xuaax> <div class="max-w-6xl mx-auto" data-astro-cid-h23xuaax> <!-- Informations personnelles --> <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-sage/10 hover:shadow-2xl transition-all duration-500 mb-12" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-h23xuaax> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4" data-astro-cid-h23xuaax> <div data-astro-cid-h23xuaax> <h2 class="font-heading text-3xl text-ebony mb-2" data-astro-cid-h23xuaax>Informations personnelles</h2> <p class="text-eucalyptus" data-astro-cid-h23xuaax>Gérez vos données de profil</p> </div> <button type="button" class="group bg-gradient-to-r from-sage/10 to-eucalyptus/10 hover:from-sage hover:to-eucalyptus text-sage hover:text-white px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 font-medium" data-edit-profile data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-h23xuaax></path> </svg>
Modifier
</button> </div> <!-- Formulaire de profil (caché par défaut) --> <form method="POST" class="hidden space-y-6 mb-8 transition-all duration-300 ease-in-out" data-profile-form data-astro-cid-h23xuaax> <div id="form-message" class="mb-6 hidden" data-astro-cid-h23xuaax></div> <div class="grid md:grid-cols-2 gap-6" data-astro-cid-h23xuaax> <div class="space-y-2" data-astro-cid-h23xuaax> <label for="name" class="block text-ebony font-heading text-lg font-medium" data-astro-cid-h23xuaax>Nom complet</label> <input type="text" id="name" name="name"${addAttribute(userData.name || session?.user?.user_metadata?.name || "", "value")} class="w-full px-6 py-4 rounded-2xl border-2 border-sage/20 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm" placeholder="Votre nom complet" data-astro-cid-h23xuaax> </div> <div class="space-y-2" data-astro-cid-h23xuaax> <label for="email" class="block text-ebony font-heading text-lg font-medium" data-astro-cid-h23xuaax>Adresse email</label> <input type="email" id="email" name="email"${addAttribute(user?.email || "", "value")} class="w-full px-6 py-4 rounded-2xl border-2 border-sage/20 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm" placeholder="votre@email.com" data-astro-cid-h23xuaax> </div> </div> <div class="flex flex-col sm:flex-row justify-end gap-4 pt-4" data-astro-cid-h23xuaax> <button type="button" class="px-6 py-3 text-eucalyptus hover:text-sage transition-colors duration-300 font-medium" data-cancel-edit data-astro-cid-h23xuaax>
Annuler
</button> <button type="submit" class="bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage text-white px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium" data-astro-cid-h23xuaax>
Enregistrer les modifications
</button> </div> </form> <!-- Affichage des informations --> <div class="grid md:grid-cols-2 gap-8" data-profile-info data-astro-cid-h23xuaax> <div class="space-y-6" data-astro-cid-h23xuaax> <div class="bg-sage/5 hover:bg-sage/10 transition-colors duration-300 rounded-2xl p-6" data-astro-cid-h23xuaax> <div class="flex items-start gap-4" data-astro-cid-h23xuaax> <div class="w-12 h-12 rounded-full bg-gradient-to-r from-sage to-eucalyptus flex items-center justify-center shrink-0" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-astro-cid-h23xuaax></path> </svg> </div> <div data-astro-cid-h23xuaax> <h3 class="font-heading text-xl text-ebony mb-2" data-astro-cid-h23xuaax>Nom</h3> <p class="text-eucalyptus font-medium" data-profile-name data-astro-cid-h23xuaax>${userData.name || session?.user?.user_metadata?.name || "Non renseigné"}</p> </div> </div> </div> <div class="bg-gold/5 hover:bg-gold/10 transition-colors duration-300 rounded-2xl p-6" data-astro-cid-h23xuaax> <div class="flex items-start gap-4" data-astro-cid-h23xuaax> <div class="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-sage flex items-center justify-center shrink-0" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-astro-cid-h23xuaax></path> </svg> </div> <div data-astro-cid-h23xuaax> <h3 class="font-heading text-xl text-ebony mb-2" data-astro-cid-h23xuaax>Email</h3> <p class="text-eucalyptus font-medium break-all" data-astro-cid-h23xuaax>${session.user.email}</p> </div> </div> </div> </div> <div class="space-y-6" data-astro-cid-h23xuaax> <div class="bg-eucalyptus/5 hover:bg-eucalyptus/10 transition-colors duration-300 rounded-2xl p-6" data-astro-cid-h23xuaax> <div class="flex items-start gap-4" data-astro-cid-h23xuaax> <div class="w-12 h-12 rounded-full bg-gradient-to-r from-eucalyptus to-gold flex items-center justify-center shrink-0" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-h23xuaax></path> </svg> </div> <div data-astro-cid-h23xuaax> <h3 class="font-heading text-xl text-ebony mb-2" data-astro-cid-h23xuaax>Membre depuis</h3> <p class="text-eucalyptus font-medium" data-astro-cid-h23xuaax>${new Date(session.user.created_at).toLocaleDateString("fr-FR")}</p> </div> </div> </div> <div class="bg-gradient-to-br from-sage/10 to-eucalyptus/10 rounded-2xl p-6 border border-sage/20" data-astro-cid-h23xuaax> <div class="text-center" data-astro-cid-h23xuaax> <div class="w-16 h-16 rounded-full bg-gradient-to-r from-sage to-eucalyptus flex items-center justify-center mx-auto mb-4" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-h23xuaax></path> </svg> </div> <h3 class="font-heading text-xl text-ebony mb-2" data-astro-cid-h23xuaax>Statut du compte</h3> <p class="text-eucalyptus font-medium" data-astro-cid-h23xuaax>Actif</p> </div> </div> </div> </div> </div> <!-- Historique des commandes --> <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-sage/10 hover:shadow-2xl transition-all duration-500 mb-12" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200" data-astro-cid-h23xuaax> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4" data-astro-cid-h23xuaax> <div data-astro-cid-h23xuaax> <h2 class="font-heading text-3xl text-ebony mb-2" data-astro-cid-h23xuaax>Mes commandes</h2> <p class="text-eucalyptus" data-astro-cid-h23xuaax>Consultez vos achats et téléchargez vos guides</p> </div> <div class="bg-gradient-to-r from-sage/10 to-eucalyptus/10 rounded-2xl px-6 py-3 border border-sage/20" data-astro-cid-h23xuaax> <div class="text-center" data-astro-cid-h23xuaax> <div class="text-2xl font-heading text-ebony font-bold" data-astro-cid-h23xuaax>${orders?.length || 0}</div> <div class="text-sm text-eucalyptus font-medium" data-astro-cid-h23xuaax>commande${orders?.length !== 1 ? "s" : ""}</div> </div> </div> </div> ${orders && orders.length > 0 ? renderTemplate`<div class="grid gap-6 lg:grid-cols-2" data-astro-cid-h23xuaax> <style>
                @keyframes slideIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .order-card {
                  animation: slideIn 0.5s ease-out forwards;
                  opacity: 0;
                }
                .order-card:nth-child(1) { animation-delay: 0.1s; }
                .order-card:nth-child(2) { animation-delay: 0.2s; }
                .order-card:nth-child(3) { animation-delay: 0.3s; }
                .order-card:nth-child(4) { animation-delay: 0.4s; }
              </style> ${orders.map((order) => renderTemplate`<div class="order-card bg-gradient-to-br from-white to-sage/5 hover:from-sage/5 hover:to-eucalyptus/5 rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl border border-sage/10 hover:border-sage/30 relative overflow-hidden group" data-astro-cid-h23xuaax> <!-- Badge de statut --> <div class="absolute top-4 right-4" data-astro-cid-h23xuaax> <span${addAttribute(`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${order.status === "completed" ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300" : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"}`, "class")} data-astro-cid-h23xuaax> ${order.status === "completed" ? "Payée" : "En cours"} </span> </div> <!-- En-tête de la commande --> <div class="mb-6" data-astro-cid-h23xuaax> <div class="flex items-center gap-3 mb-3" data-astro-cid-h23xuaax> <div class="w-12 h-12 rounded-full bg-gradient-to-r from-sage to-eucalyptus flex items-center justify-center" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-astro-cid-h23xuaax></path> </svg> </div> <div data-astro-cid-h23xuaax> <h3 class="font-heading text-xl text-ebony" data-astro-cid-h23xuaax>Commande #${order.id.slice(-8)}</h3> <p class="text-eucalyptus text-sm" data-astro-cid-h23xuaax> ${new Date(order.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </p> </div> </div> <div class="bg-gradient-to-r from-sage/10 to-eucalyptus/10 rounded-2xl p-4 border border-sage/20" data-astro-cid-h23xuaax> <div class="text-center" data-astro-cid-h23xuaax> <div class="text-3xl font-heading text-ebony font-bold" data-astro-cid-h23xuaax>${order.total_amount.toFixed(2)}€</div> <div class="text-sm text-eucalyptus font-medium" data-astro-cid-h23xuaax>Total de la commande</div> </div> </div> </div> <!-- Articles de la commande --> <div class="space-y-4" data-astro-cid-h23xuaax> ${(order.order_items || [])?.map((item) => renderTemplate`<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-sage/10 hover:border-sage/20 transition-all duration-300" data-astro-cid-h23xuaax> <div class="flex justify-between items-start mb-3" data-astro-cid-h23xuaax> <div class="flex-1" data-astro-cid-h23xuaax> <h4 class="font-heading text-lg text-ebony font-medium mb-1" data-astro-cid-h23xuaax> ${item.products?.title || "Produit non trouvé"} </h4> <p class="text-eucalyptus text-sm" data-astro-cid-h23xuaax>Quantité: ${item.quantity}</p> </div> <div class="text-right" data-astro-cid-h23xuaax> <div class="text-xl font-heading text-ebony font-bold" data-astro-cid-h23xuaax> ${item.products?.price?.toFixed(2) || "0.00"}€
</div> </div> </div> ${item.products?.pdf_path ? renderTemplate`<div class="flex items-center justify-between bg-gradient-to-r from-sage/5 to-eucalyptus/5 rounded-xl p-3 border border-sage/10" data-astro-cid-h23xuaax> <div class="flex items-center gap-3" data-astro-cid-h23xuaax> <div class="w-8 h-8 rounded-full bg-gradient-to-r from-sage to-eucalyptus flex items-center justify-center" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-astro-cid-h23xuaax></path> </svg> </div> <div data-astro-cid-h23xuaax> <p class="text-sm font-medium text-ebony" data-astro-cid-h23xuaax>PDF disponible</p> ${item.download_count > 0 && renderTemplate`<p class="text-xs text-eucalyptus" data-astro-cid-h23xuaax> ${item.download_count} téléchargement${item.download_count > 1 ? "s" : ""} </p>`} </div> </div> <button class="group bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"${addAttribute(`downloadFile('${item.products.id}', '${order.id}');`, "onclick")}${addAttribute(item.products.id, "data-product-id")}${addAttribute(order.id, "data-order-id")} data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" data-astro-cid-h23xuaax></path> </svg> <span data-astro-cid-h23xuaax>Télécharger</span> </button> </div>` : renderTemplate`<div class="flex items-center gap-3 bg-red-50 rounded-xl p-3 border border-red-200" data-astro-cid-h23xuaax> <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-h23xuaax></path> </svg> </div> <p class="text-sm font-medium text-red-700" data-astro-cid-h23xuaax>PDF non disponible</p> </div>`} </div>`)} </div> </div>`)} </div>` : renderTemplate`<div class="text-center py-16 bg-gradient-to-br from-sage/5 to-eucalyptus/5 rounded-3xl border-2 border-dashed border-sage/20" data-astro-cid-h23xuaax> <div class="max-w-md mx-auto" data-astro-cid-h23xuaax> <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-sage/20 to-eucalyptus/20 flex items-center justify-center" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-sage animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-astro-cid-h23xuaax></path> </svg> </div> <h3 class="font-heading text-2xl text-ebony mb-4" data-astro-cid-h23xuaax>
Aucune commande pour le moment
</h3> <p class="text-eucalyptus text-lg mb-8 leading-relaxed" data-astro-cid-h23xuaax>
Découvrez notre sélection de guides et accompagnements pour commencer votre chemin vers l'harmonie.
</p> <a href="/guides" class="group inline-flex items-center gap-3 bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-heading text-lg" data-astro-cid-h23xuaax> <span data-astro-cid-h23xuaax>Découvrir nos guides</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-astro-cid-h23xuaax></path> </svg> </a> </div> </div>`} </div> ${(profile?.role === "admin" || session.user.email === "tyzranaima@gmail.com") && renderTemplate`<div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-sage/10 hover:shadow-2xl transition-all duration-500 mb-12" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-astro-cid-h23xuaax> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4" data-astro-cid-h23xuaax> <div data-astro-cid-h23xuaax> <h2 class="font-heading text-3xl text-ebony mb-2" data-astro-cid-h23xuaax>Administration</h2> <p class="text-eucalyptus" data-astro-cid-h23xuaax>Gérez le contenu et les fonctionnalités du site</p> </div> <div class="bg-gradient-to-r from-gold/10 to-sage/10 rounded-2xl px-4 py-2 border border-gold/20" data-astro-cid-h23xuaax> <span class="text-sm font-medium text-ebony" data-astro-cid-h23xuaax>Accès administrateur</span> </div> </div> <div class="grid gap-6 md:grid-cols-3" data-astro-cid-h23xuaax> <a href="/admin/boutique" class="group bg-gradient-to-br from-white to-sage/5 hover:from-sage/10 hover:to-eucalyptus/10 rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl border border-sage/10 hover:border-sage/30 transform hover:-translate-y-2" data-admin-link="boutique" data-astro-cid-h23xuaax> <div class="text-center" data-astro-cid-h23xuaax> <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-sage to-eucalyptus flex items-center justify-center group-hover:scale-110 transition-transform duration-300" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-astro-cid-h23xuaax></path> </svg> </div> <h3 class="font-heading text-xl text-ebony mb-2" data-astro-cid-h23xuaax>Boutique</h3> <p class="text-eucalyptus text-sm" data-astro-cid-h23xuaax>Gérer les PDF et produits</p> </div> </a> <a href="/admin/disponibilites" class="group bg-gradient-to-br from-white to-gold/5 hover:from-gold/10 hover:to-sage/10 rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl border border-gold/10 hover:border-gold/30 transform hover:-translate-y-2" data-admin-link="disponibilites" data-astro-cid-h23xuaax> <div class="text-center" data-astro-cid-h23xuaax> <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold to-sage flex items-center justify-center group-hover:scale-110 transition-transform duration-300" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-h23xuaax></path> </svg> </div> <h3 class="font-heading text-xl text-ebony mb-2" data-astro-cid-h23xuaax>Disponibilités</h3> <p class="text-eucalyptus text-sm" data-astro-cid-h23xuaax>Gérer les rendez-vous</p> </div> </a> <a href="/admin/blog" class="group bg-gradient-to-br from-white to-eucalyptus/5 hover:from-eucalyptus/10 hover:to-gold/10 rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl border border-eucalyptus/10 hover:border-eucalyptus/30 transform hover:-translate-y-2" data-admin-link="blog" data-astro-cid-h23xuaax> <div class="text-center" data-astro-cid-h23xuaax> <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-eucalyptus to-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-h23xuaax></path> </svg> </div> <h3 class="font-heading text-xl text-ebony mb-2" data-astro-cid-h23xuaax>Blog</h3> <p class="text-eucalyptus text-sm" data-astro-cid-h23xuaax>Gérer les articles</p> </div> </a> </div> </div>`} <!-- Aide et support --> <div class="text-center bg-gradient-to-br from-sage/5 to-eucalyptus/5 rounded-3xl p-8 lg:p-12 border border-sage/20" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600" data-astro-cid-h23xuaax> <div class="max-w-2xl mx-auto" data-astro-cid-h23xuaax> <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-sage to-eucalyptus flex items-center justify-center" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" data-astro-cid-h23xuaax></path> </svg> </div> <h2 class="font-heading text-3xl text-ebony mb-4" data-astro-cid-h23xuaax>Besoin d'aide ?</h2> <p class="text-eucalyptus text-lg mb-8 leading-relaxed" data-astro-cid-h23xuaax>
Notre équipe est là pour vous accompagner avec vos commandes et répondre à toutes vos questions.
</p> <a href="/contact" class="group inline-flex items-center gap-3 bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-heading text-lg" data-astro-cid-h23xuaax> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-h23xuaax> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" data-astro-cid-h23xuaax></path> </svg>
Nous contacter
</a> </div> </div> </div> </div> </section> ` })}  ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/mon-compte.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/mon-compte.astro", void 0);
const $$file = "/Users/jules/Downloads/harmonia/src/pages/mon-compte.astro";
const $$url = "/mon-compte";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MonCompte,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
