/* empty css                                       */
import { e as createAstro, c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_BPgP8eEd.mjs';
import { $ as $$Card } from '../../chunks/Card_CmPKRykx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://harmonia.jules.com");
const $$Disponibilites = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Disponibilites;
  const supabase = Astro2.locals.supabase;
  const session = Astro2.locals.session;
  if (!session?.user?.id) {
    return Astro2.redirect("/login?returnTo=/admin/disponibilites");
  }
  const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
  const isMainAdmin = session.user.email === "tyzranaima@gmail.com";
  if (!isMainAdmin && (profileError || !profile || profile.role !== "admin")) {
    return Astro2.redirect("/mon-compte");
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Gestion des disponibilit\xE9s", "description": "G\xE9rez vos disponibilit\xE9s et r\xE9servations" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pt-24"> <section class="py-20 bg-sage/5"> <div class="container mx-auto px-4"> <div class="max-w-6xl mx-auto"> ${renderComponent($$result2, "Card", $$Card, { "variant": "hover" }, { "default": async ($$result3) => renderTemplate` <div class="p-8"> <h1 class="font-heading text-3xl text-ebony mb-8">Gestion des disponibilités et réservations</h1> <!-- Navigation par onglets --> <div class="mb-8"> <div class="border-b border-sage/20"> <nav class="-mb-px flex space-x-8"> <button id="tab-appointments" class="tab-button active py-2 px-1 border-b-2 border-sage text-sage font-medium">
📋 Demandes en attente
</button> <button id="tab-availability" class="tab-button py-2 px-1 border-b-2 border-transparent text-ebony/60 hover:text-ebony font-medium">
📅 Périodes bloquées
</button> </nav> </div> </div> <!-- Onglet Demandes en attente --> <div id="appointments-tab" class="tab-content"> <div class="mb-6"> <h2 class="font-heading text-2xl text-ebony mb-4">Demandes de réservation en attente</h2> <!-- Filtres --> <div class="bg-white/50 rounded-lg p-4 mb-6"> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"> <div> <label class="block text-sm font-medium text-ebony mb-2">Statut</label> <select id="status-filter" class="w-full px-3 py-2 rounded-lg border border-sage/20 text-sm"> <option value="">Tous les statuts</option> <option value="pending_approval">En attente d'approbation</option> <option value="pending">En attente de paiement</option> <option value="confirmed">Confirmé</option> <option value="refused">Refusé</option> </select> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Date de début</label> <input type="date" id="date-from-filter" class="w-full px-3 py-2 rounded-lg border border-sage/20 text-sm"> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Date de fin</label> <input type="date" id="date-to-filter" class="w-full px-3 py-2 rounded-lg border border-sage/20 text-sm"> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Recherche client</label> <input type="text" id="client-search" placeholder="Nom ou email..." class="w-full px-3 py-2 rounded-lg border border-sage/20 text-sm"> </div> </div> <div class="mt-4 flex justify-between items-center"> <button id="apply-filters" class="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 transition-colors text-sm">
🔍 Appliquer les filtres
</button> <button id="clear-filters" class="text-sage hover:text-sage/80 transition-colors text-sm">
✨ Effacer les filtres
</button> </div> </div> <!-- Liste des réservations --> <div id="appointments-list" class="space-y-4"> <!-- Les réservations seront chargées ici --> </div> <!-- Pagination --> <div id="pagination" class="mt-6 flex justify-center items-center space-x-2"> <!-- La pagination sera générée ici --> </div> </div> </div> <!-- Onglet Périodes bloquées --> <div id="availability-tab" class="tab-content hidden"> <div id="calendar-manager" class="space-y-6"> <!-- Le calendrier sera injecté ici par le JavaScript --> </div> <h2 class="font-heading text-2xl text-ebony mb-4">Bloquer une plage horaire</h2> <form id="block-time-form" class="space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-ebony mb-2">Date de début</label> <input type="date" name="startDate" id="startDate" class="w-full px-4 py-2 rounded-lg border border-sage/20" required> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Date de fin</label> <input type="date" name="endDate" id="endDate" class="w-full px-4 py-2 rounded-lg border border-sage/20" required> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Heure de début</label> <input type="time" name="startTime" class="w-full px-4 py-2 rounded-lg border border-sage/20" required> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Heure de fin</label> <input type="time" name="endTime" class="w-full px-4 py-2 rounded-lg border border-sage/20" required> </div> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Raison</label> <input type="text" name="reason" class="w-full px-4 py-2 rounded-lg border border-sage/20" placeholder="Optionnel"> </div> <button type="submit" class="bg-eucalyptus text-white px-6 py-2 rounded-lg hover:bg-eucalyptus/90 transition-colors">
Bloquer cette plage
</button> </form> <!-- Séparateur --> <div class="my-8 border-t border-sage/20"></div> <!-- Formulaire pour bloquer des jours entiers (vacances) --> <h2 class="font-heading text-2xl text-ebony mb-4">Bloquer des jours entiers (Vacances)</h2> <form id="block-day-form" class="space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-ebony mb-2">Date de début</label> <input type="date" name="startDate" id="vacationStartDate" class="w-full px-4 py-2 rounded-lg border border-sage/20" required> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Date de fin</label> <input type="date" name="endDate" id="vacationEndDate" class="w-full px-4 py-2 rounded-lg border border-sage/20" required> </div> </div> <div> <label class="block text-sm font-medium text-ebony mb-2">Raison (ex: Vacances, Congés, etc.)</label> <input type="text" name="reason" class="w-full px-4 py-2 rounded-lg border border-sage/20" placeholder="Vacances d'été" required> </div> <button type="submit" class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
🏖️ Bloquer ces jours (Vacances)
</button> </form> </div> </div> ` })} </div> </div> </section> </div> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/admin/disponibilites.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/admin/disponibilites.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/admin/disponibilites.astro";
const $$url = "/admin/disponibilites";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Disponibilites,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
