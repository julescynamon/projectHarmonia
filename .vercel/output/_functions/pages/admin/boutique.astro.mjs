/* empty css                                       */
import { e as createAstro, c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_CUdCZsD4.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$Boutique = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Boutique;
  const supabase = Astro2.locals.supabase;
  const session = Astro2.locals.session;
  if (!session?.user?.id) {
    return Astro2.redirect("/login?returnTo=/admin/boutique");
  }
  const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
  const isMainAdmin = session.user.email === "tyzranaima@gmail.com";
  if (!isMainAdmin && (profileError || !profile || profile.role !== "admin")) {
    return Astro2.redirect("/mon-compte");
  }
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const action = formData.get("action");
      if (action === "create") {
        const pdfFile = formData.get("pdf");
        if (!pdfFile || !(pdfFile instanceof File)) {
          return new Response(
            JSON.stringify({ error: "PDF manquant ou invalide" }),
            { status: 400 }
          );
        }
        if (!(pdfFile instanceof File)) {
          return new Response(
            JSON.stringify({ error: "PDF manquant ou invalide" }),
            { status: 400 }
          );
        }
        const pdfPath = `guides/${pdfFile.name}`;
        const pdfBuffer = await pdfFile.arrayBuffer();
        const { error: uploadError } = await supabase.storage.from("pdfs").upload(pdfPath, pdfBuffer, {
          contentType: pdfFile.type,
          cacheControl: "3600",
          upsert: false
        });
        if (uploadError) {
          console.error("Erreur upload PDF:", uploadError);
          return new Response(
            JSON.stringify({ error: "Erreur lors de l'upload du PDF" }),
            { status: 500 }
          );
        }
        const title = formData.get("title")?.toString() || "";
        const description = formData.get("description")?.toString() || "";
        const priceValue = formData.get("price")?.toString() || "0";
        const category = formData.get("category")?.toString() || "";
        const { error: insertError } = await supabase.from("products").insert({
          title,
          description,
          price: parseFloat(priceValue),
          category,
          pdf_path: pdfPath
        });
        if (insertError) {
          console.error("Erreur insertion produit:", insertError);
          return new Response(
            JSON.stringify({ error: "Erreur lors de la cr\xE9ation du produit" }),
            { status: 500 }
          );
        }
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200 }
        );
      }
      const productId = formData.get("productId");
      if (!productId) {
        return new Response(
          JSON.stringify({ error: "ID du produit manquant" }),
          { status: 400 }
        );
      }
      const { data: product, error: selectError } = await supabase.from("products").select("pdf_path").eq("id", productId).single();
      if (selectError) {
        console.error("Erreur lors de la recherche du produit:", selectError);
        return new Response(
          JSON.stringify({ error: "Produit non trouv\xE9" }),
          { status: 404 }
        );
      }
      if (product?.pdf_path) {
        const { error: deleteStorageError } = await supabase.storage.from("pdfs").remove([product.pdf_path]);
        if (deleteStorageError) throw deleteStorageError;
      }
      const { error: deleteError } = await supabase.from("products").delete().eq("id", productId);
      if (deleteError) throw deleteError;
      return new Response(JSON.stringify({ success: true }));
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Administration de la boutique | La Maison Sattva\xEFa" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <h1 class="text-3xl font-bold text-sage mb-8">Administration de la boutique</h1> <!-- Formulaire d'ajout de produit --> <div class="bg-white rounded-lg shadow-sm p-6 mb-8"> <h2 class="text-xl font-semibold text-gray-800 mb-4">Ajouter un nouveau produit</h2> <form id="productForm" class="space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700">Titre</label> <input type="text" name="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage"> </div> <div> <label class="block text-sm font-medium text-gray-700">Catégorie</label> <input type="text" name="category" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage"> </div> </div> <div> <label class="block text-sm font-medium text-gray-700">Description</label> <textarea name="description" required rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage"></textarea> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700">Prix (€)</label> <input type="number" name="price" required step="0.01" min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage"> </div> <div> <label class="block text-sm font-medium text-gray-700">PDF</label> <input type="file" name="pdf" required accept=".pdf" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sage/10 file:text-sage hover:file:bg-sage/20"> </div> </div> <div class="flex justify-end"> <button type="submit" class="bg-sage text-white px-4 py-2 rounded-md hover:bg-sage/90 transition-colors">
Ajouter le produit
</button> </div> </form> </div> <!-- Liste des produits --> <div class="bg-white rounded-lg shadow-sm p-6"> <h2 class="text-xl font-semibold text-gray-800 mb-4">Produits existants</h2> <div class="overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead> <tr> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th> <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${products?.map((product) => renderTemplate`<tr> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.title}</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.category}</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)} €</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> ${product.pdf_path ? renderTemplate`<span class="text-green-600">✓</span>` : renderTemplate`<span class="text-red-600">✗</span>`} </td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> <button${addAttribute(product.id, "data-product-id")} class="text-red-600 hover:text-red-900 delete-product">
Supprimer
</button> </td> </tr>`)} </tbody> </table> </div> </div> </main> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/admin/boutique.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/admin/boutique.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/admin/boutique.astro";
const $$url = "/admin/boutique";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Boutique,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
