/* empty css                                    */
import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, e as createAstro, r as renderComponent, d as addAttribute } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_Nho3QixU.mjs';
import { p as pageSEO } from '../chunks/seo_DE79S3-Q.mjs';
import { $ as $$Card } from '../chunks/Card_D6yxF1_R.mjs';
import 'clsx';
/* empty css                                 */
import { s as supabase } from '../chunks/supabase_CXSvBnpz.mjs';
import { B as BLOG_CATEGORIES } from '../chunks/constants_BZA9_ual.mjs';
export { renderers } from '../renderers.mjs';

const $$NewsletterForm = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="newsletter-form-container" data-astro-cid-nbvfnxgh> <form id="newsletter-form" class="newsletter-form" data-astro-cid-nbvfnxgh> <div class="input-group" data-astro-cid-nbvfnxgh> <input type="email" id="email" name="email" placeholder="Votre adresse email" required class="newsletter-input" data-astro-cid-nbvfnxgh> </div> <div class="consent-group" data-astro-cid-nbvfnxgh> <label class="consent-label" data-astro-cid-nbvfnxgh> <input type="checkbox" id="consent" name="consent" required class="consent-checkbox" data-astro-cid-nbvfnxgh> <span data-astro-cid-nbvfnxgh>
J'accepte de recevoir des emails et je confirme avoir lu la
<a href="/politique-confidentialite" class="privacy-link" data-astro-cid-nbvfnxgh>politique de confidentialité</a> </span> </label> </div> <div class="message" id="form-message" role="alert" data-astro-cid-nbvfnxgh></div> <button type="submit" class="submit-button" data-astro-cid-nbvfnxgh>
S'inscrire à la newsletter
</button> </form> </div>  ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/NewsletterForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/NewsletterForm.astro", void 0);

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const seo = pageSEO.blog;
  const category = Astro2.url.searchParams.get("category");
  let query = supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false });
  if (category) {
    query = query.eq("category", category);
  }
  const { data: posts, error } = await query;
  if (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration des articles:", error);
  }
  const categories = BLOG_CATEGORIES;
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seo.title, "description": seo.description, "data-astro-cid-5tznm7mj": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden hero-section" data-astro-cid-5tznm7mj> <!-- Background avec image et overlay --> <div class="absolute inset-0" data-astro-cid-5tznm7mj> <img src="/images/heroblogbg.webp" alt="Blog La Maison Sattvaïa - Articles naturopathie et bien-être" class="w-full h-full object-cover scale-110 transform motion-safe:animate-subtle-zoom" data-astro-cid-5tznm7mj> <div class="absolute inset-0 bg-gradient-to-r from-ebony/40 via-ebony/20 to-ebony/10" data-astro-cid-5tznm7mj></div> </div> <!-- Éléments décoratifs --> <div class="absolute inset-0 z-10 pointer-events-none overflow-hidden" data-astro-cid-5tznm7mj> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] opacity-20 motion-safe:animate-slow-spin" data-astro-cid-5tznm7mj> <img src="/images/sacred-geometry.svg" alt="" class="w-full h-full" loading="eager" data-astro-cid-5tznm7mj> </div> </div> <!-- Contenu principal centré --> <div class="container mx-auto px-4 relative z-20 flex flex-col justify-center min-h-screen" data-astro-cid-5tznm7mj> <div class="max-w-5xl mx-auto text-center" data-astro-cid-5tznm7mj> <!-- En-tête centré --> <div class="motion-safe:animate-fade-in mb-[206px]" data-astro-cid-5tznm7mj> <div class="inline-block mb-6" data-astro-cid-5tznm7mj> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-xl font-semibold uppercase tracking-wider" data-astro-cid-5tznm7mj>
Le Blog de La Maison Sattvaïa
</span> </div> <h1 class="font-heading text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight text-ebony drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-astro-cid-5tznm7mj>
Découvrez nos
<span class="block text-sage mt-4 text-3xl md:text-4xl lg:text-5xl" data-astro-cid-5tznm7mj>Articles & Conseils</span> </h1> <p class="font-slogan text-xl md:text-2xl mb-12 text-ebony/80 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)] italic" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600" data-astro-cid-5tznm7mj>
"Des conseils pour prendre soin de l’humain, de l’animal et de l’âme, au naturel et en profondeur."
</p> </div> </div> </div> <!-- Transition brush effect --> <div class="absolute bottom-0 left-0 w-full z-30 transition-divider" data-astro-cid-5tznm7mj> <div class="absolute inset-0 bg-gradient-to-b from-transparent to-cream" data-astro-cid-5tznm7mj></div> <img src="/images/brush-divider.svg" alt="" class="w-full h-auto min-h-[80px] object-cover transform motion-safe:animate-wave" loading="lazy" data-astro-cid-5tznm7mj> </div> </section>  <section class="py-20 md:py-32 bg-gradient-to-b from-cream to-white relative overflow-hidden" data-astro-cid-5tznm7mj> <!-- Éléments décoratifs --> <div class="absolute top-0 left-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl" data-astro-cid-5tznm7mj></div> <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" data-astro-cid-5tznm7mj></div> <div class="absolute inset-0 opacity-3" data-astro-cid-5tznm7mj> <img src="/images/sacred-geometry.svg" alt="Geometric pattern" class="w-full h-full object-cover bg-gradient-to-r from-sage/20 to-gold/20 bg-clip-content" data-astro-cid-5tznm7mj> </div> <div class="container mx-auto px-4 relative" data-astro-cid-5tznm7mj> <!-- En-tête de section --> <div class="text-center max-w-4xl mx-auto mb-20" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-5tznm7mj> <div class="inline-block mb-6" data-astro-cid-5tznm7mj> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold uppercase tracking-wider" data-astro-cid-5tznm7mj>
Explorez nos articles
</span> </div> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-8 leading-tight" data-astro-cid-5tznm7mj>
Un espace de <span class="text-sage" data-astro-cid-5tznm7mj>guidance</span> & de <span class="text-gold" data-astro-cid-5tznm7mj>partage</span> </h2> <p class="text-xl text-eucalyptus leading-relaxed font-slogan max-w-3xl mx-auto" data-astro-cid-5tznm7mj>
Découvrez nos conseils et inspirations pour nourrir le corps, l’esprit et l’âme.
</p> <div class="w-24 h-1 bg-gradient-to-r from-sage to-gold mx-auto mt-8 rounded-full" data-astro-cid-5tznm7mj></div> </div> <!-- Filtres premium --> <div class="mb-16 flex flex-wrap justify-center gap-4" id="category-filters" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200" data-astro-cid-5tznm7mj> <a href="/blog"${addAttribute(`group relative overflow-hidden px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
            ${!category ? "bg-gradient-to-r from-sage to-gold text-white shadow-lg shadow-sage/25" : "bg-white text-ebony border-2 border-sage/20 hover:border-sage hover:shadow-md"}`, "class")} data-astro-cid-5tznm7mj> <span class="relative z-10" data-astro-cid-5tznm7mj>Tous les articles</span> ${!category && renderTemplate`<div class="absolute inset-0 bg-gradient-to-r from-sage to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-astro-cid-5tznm7mj></div>`} </a> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/blog?category=${cat.id}`, "href")}${addAttribute(`group relative overflow-hidden px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
              ${category === cat.id ? "bg-gradient-to-r from-sage to-gold text-white shadow-lg shadow-sage/25" : "bg-white text-ebony border-2 border-sage/20 hover:border-sage hover:shadow-md"}`, "class")} data-astro-cid-5tznm7mj> <span class="relative z-10" data-astro-cid-5tznm7mj>${cat.label}</span> ${category === cat.id && renderTemplate`<div class="absolute inset-0 bg-gradient-to-r from-sage to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-astro-cid-5tznm7mj></div>`} </a>`)} </div> <!-- Grille d'articles premium --> ${posts && posts.length > 0 ? renderTemplate`<div id="posts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12" data-astro-cid-5tznm7mj> ${posts?.map((post, index) => renderTemplate`<div class="post-card opacity-0 transition-all duration-700 transform translate-y-8 hover:-translate-y-2" data-aos="fade-up" data-aos-duration="800"${addAttribute(index * 100, "data-aos-delay")} data-astro-cid-5tznm7mj> ${renderComponent($$result2, "Card", $$Card, { "variant": "hover", "title": post.title, "description": post.excerpt, "image": post.cover_url, "date": formatDate(post.created_at), "category": post.category, "url": `/blog/${post.slug}`, "data-astro-cid-5tznm7mj": true })} </div>`)} </div>` : renderTemplate`<div class="text-center py-20" data-aos="fade-up" data-aos-duration="800" data-astro-cid-5tznm7mj> <div class="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6" data-astro-cid-5tznm7mj> <span class="material-icons text-sage text-4xl" data-astro-cid-5tznm7mj>article</span> </div> <h3 class="text-2xl font-heading text-ebony mb-4" data-astro-cid-5tznm7mj>Aucun article disponible</h3> <p class="text-lg text-eucalyptus max-w-md mx-auto" data-astro-cid-5tznm7mj>
Nous préparons actuellement de nouveaux articles pour vous. Revenez bientôt !
</p> </div>`} </div> </section>  <section class="py-20 md:py-32 bg-gradient-to-br from-sage/30 via-cream/50 to-gold/30 relative overflow-hidden" data-astro-cid-5tznm7mj> <!-- Éléments décoratifs lumineux --> <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-sage/25 rounded-full blur-3xl" data-astro-cid-5tznm7mj></div> <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/25 rounded-full blur-3xl" data-astro-cid-5tznm7mj></div> <div class="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-sage/20 rounded-full blur-3xl" data-astro-cid-5tznm7mj></div> <div class="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-gold/20 rounded-full blur-3xl" data-astro-cid-5tznm7mj></div> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-sage/15 via-cream/10 to-gold/15 rounded-full blur-3xl" data-astro-cid-5tznm7mj></div> <div class="container mx-auto px-4 relative" data-astro-cid-5tznm7mj> <div class="max-w-4xl mx-auto text-center" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-5tznm7mj> <!-- En-tête premium --> <div class="inline-block mb-6" data-astro-cid-5tznm7mj> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold uppercase tracking-wider" data-astro-cid-5tznm7mj>
Ne ratez rien
</span> </div> <h2 class="font-heading text-4xl md:text-5xl text-ebony mb-8 leading-tight" data-astro-cid-5tznm7mj>
Recevez nos <span class="text-sage" data-astro-cid-5tznm7mj>inspirations</span> directement dans votre <span class="text-gold" data-astro-cid-5tznm7mj>boîte mail</span> </h2> <p class="text-xl text-eucalyptus leading-relaxed font-slogan max-w-3xl mx-auto mb-12" data-astro-cid-5tznm7mj>
Soyez avertis dès la parution d'un nouvel article pour nourrir votre corps, votre esprit et votre âme.
</p> <!-- Formulaire newsletter avec design premium --> <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl shadow-sage/10 border border-white/20" data-astro-cid-5tznm7mj> ${renderComponent($$result2, "NewsletterForm", $$NewsletterForm, { "data-astro-cid-5tznm7mj": true })} <p class="text-sm text-eucalyptus/70 mt-6 font-slogan" data-astro-cid-5tznm7mj>
📧 Notification instantanée • 🚫 Désinscription en 1 clic • 🔒 Vos données protégées
</p> </div> </div> </div> </section> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/blog/index.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/jules/Downloads/harmonia/src/pages/blog/index.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
