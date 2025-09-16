/* empty css                                    */
import { e as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, b as renderScript, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout, a as $$Cart } from '../chunks/MainLayout_BPgP8eEd.mjs';
import 'clsx';
import { a as getProducts } from '../chunks/shop_BG2ZyLKw.mjs';
import { p as pageSEO } from '../chunks/seo_DE79S3-Q.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$4 = createAstro("https://harmonia.jules.com");
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const { id, title, description, price, category, created_at, pdf_path } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow" data-aos="fade-up"> <div class="aspect-w-4 aspect-h-3 relative bg-sage/5"> ${pdf_path ? renderTemplate`<div class="absolute inset-0 flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-sage/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path> </svg> </div>` : renderTemplate`<div class="absolute inset-0 flex items-center justify-center text-sage/70 text-center px-4"> <p>Aucun PDF présent<br>revenez plus tard</p> </div>`} </div> <div class="p-6"> <div class="flex items-center gap-2 mb-2"> <span class="text-sm bg-sage/10 text-sage px-2 py-1 rounded-full"> ${category} </span> </div> <h3 class="text-xl font-heading mb-2">${title}</h3> <p class="text-ebony/70 mb-4 line-clamp-2">${description}</p> <div class="flex items-center justify-between"> <span class="text-xl font-heading text-gold">${price.toFixed(2)}€</span> <button class="bg-sage text-white px-4 py-2 rounded-full hover:bg-sage/90 transition-colors" data-add-to-cart${addAttribute(JSON.stringify({ id, title, price }), "data-product")}>
Ajouter au panier
</button> </div> </div> </article> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/shop/ProductCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/shop/ProductCard.astro", void 0);

const $$Astro$3 = createAstro("https://harmonia.jules.com");
const $$ProductFilters = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ProductFilters;
  const { categories, activeCategory = "", minPrice, maxPrice } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="space-y-6 bg-white p-6 rounded-lg shadow-sm" data-aos="fade-up"> <div> <h3 class="font-medium mb-3">Catégories</h3> <div class="space-y-2"> <button type="button" data-filter="category" data-value=""${addAttribute(`block w-full px-3 py-2 rounded-lg transition-colors text-left ${!activeCategory ? "bg-sage text-white" : "text-ebony hover:bg-sage/10"}`, "class")}>
Tous les produits
</button> ${categories.map((category) => renderTemplate`<button type="button" data-filter="category"${addAttribute(category, "data-value")}${addAttribute(`block w-full px-3 py-2 rounded-lg transition-colors text-left ${activeCategory === category ? "bg-sage text-white" : "text-ebony hover:bg-sage/10"}`, "class")}> ${category} </button>`)} </div> </div> <div> <h3 class="font-medium mb-3">Prix</h3> <div class="space-y-3"> <div> <label class="text-sm text-ebony/70">Prix minimum</label> <input type="number" data-filter="minPrice" min="0" step="1"${addAttribute(minPrice, "value")} class="w-full mt-1 px-3 py-2 bg-white border border-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"> </div> <div> <label class="text-sm text-ebony/70">Prix maximum</label> <input type="number" data-filter="maxPrice" min="0" step="1"${addAttribute(maxPrice, "value")} class="w-full mt-1 px-3 py-2 bg-white border border-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"> </div> </div> </div> </div> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/shop/ProductFilters.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/shop/ProductFilters.astro", void 0);

const $$Astro$2 = createAstro("https://harmonia.jules.com");
const $$ProductSearch = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ProductSearch;
  const { query = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="mb-6" data-aos="fade-up"> <div class="relative"> <input type="search" id="product-search" placeholder="Rechercher un produit..."${addAttribute(query, "value")} class="w-full px-4 py-3 pl-10 bg-white border border-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20 transition-shadow" autocomplete="off"> <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <!-- Indicateur de chargement --> <div id="search-loading" class="absolute right-3 top-1/2 -translate-y-1/2 hidden"> <svg class="animate-spin h-5 w-5 text-sage/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </div> </div> </div> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/shop/ProductSearch.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/shop/ProductSearch.astro", void 0);

const $$Astro$1 = createAstro("https://harmonia.jules.com");
const $$ProductSort = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProductSort;
  const { currentSort = "newest" } = Astro2.props;
  const sortOptions = [
    { value: "newest", label: "Plus r\xE9cents" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix d\xE9croissant" },
    { value: "popular", label: "Plus populaires" }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="flex justify-end mb-6" data-aos="fade-up"> <select data-sort class="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"> ${sortOptions.map((option) => renderTemplate`<option${addAttribute(option.value, "value")}${addAttribute(currentSort === option.value, "selected")}> ${option.label} </option>`)} </select> </div> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/shop/ProductSort.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/shop/ProductSort.astro", void 0);

const $$Astro = createAstro("https://harmonia.jules.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const seo = pageSEO.shop;
  const { searchParams } = Astro2.url;
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const products = await getProducts({
    category,
    search: query,
    sort,
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null
  });
  const categories = [...new Set(products.map((p) => p.category))];
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seo.title, "description": seo.description, "image": seo.image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Cart", $$Cart, {})} ${maybeRenderHead()}<div class="pt-24"> <section class="py-20"> <div class="container mx-auto px-4"> <div class="max-w-6xl mx-auto"> <div class="text-center mb-12" data-aos="fade-up"> <h1 class="text-5xl font-medium mb-6">Boutique</h1> <div class="w-20 h-1 bg-sage mx-auto mb-8"></div> <p class="text-lg text-ebony/70">
Des ressources pratiques pour prendre soin de sa santé naturellement
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-8"> <div class="lg:col-span-1"> ${renderComponent($$result2, "ProductFilters", $$ProductFilters, { "categories": categories, "activeCategory": category, "minPrice": minPrice, "maxPrice": maxPrice })} </div> <div class="lg:col-span-3"> ${renderComponent($$result2, "ProductSearch", $$ProductSearch, { "query": query })} ${renderComponent($$result2, "ProductSort", $$ProductSort, { "currentSort": sort })} <div id="products-grid" class="grid md:grid-cols-2 gap-8"> ${products.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { ...product })}`)} </div> <div id="no-products" class="hidden text-center text-ebony/70 py-12">
Aucun produit ne correspond à votre recherche.
</div> </div> </div> </div> </div> </section> </div> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/boutique/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/boutique/index.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/boutique/index.astro";
const $$url = "/boutique";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
