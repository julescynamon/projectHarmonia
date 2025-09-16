/* empty css                                          */
import { e as createAstro, c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../../chunks/MainLayout_Nho3QixU.mjs';
import { $ as $$Card } from '../../../chunks/Card_D6yxF1_R.mjs';
/* empty css                                            */
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://project-harmonia.vercel.app");
function getStaticPaths() {
  const categories = ["soins-energetiques", "meditation", "bien-etre", "developpement-personnel", "sante-naturelle", "spiritualite"];
  return categories.map((category) => ({ params: { category } }));
}
const $$category = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$category;
  const { category } = Astro2.params;
  const categories = [
    { id: "soins-energetiques", label: "Soins \xC9nerg\xE9tiques" },
    { id: "meditation", label: "M\xE9ditation" },
    { id: "bien-etre", label: "Bien-\xEAtre" },
    { id: "developpement-personnel", label: "D\xE9veloppement Personnel" },
    { id: "sante-naturelle", label: "Sant\xE9 Naturelle" },
    { id: "spiritualite", label: "Spiritualit\xE9" }
  ];
  const allArticles = [
    {
      title: "Les bienfaits des soins \xE9nerg\xE9tiques",
      excerpt: "D\xE9couvrez comment les soins \xE9nerg\xE9tiques peuvent am\xE9liorer votre sant\xE9 et votre bien-\xEAtre quotidien.",
      image: "/images/blog/soins-energetiques.webp",
      category: "Soins \xC9nerg\xE9tiques",
      date: "15 avril 2024",
      slug: "bienfaits-soins-energetiques"
    },
    {
      title: "M\xE9ditation pour d\xE9butants",
      excerpt: "Guide complet pour commencer la m\xE9ditation et retrouver la paix int\xE9rieure.",
      image: "/images/blog/meditation.webp",
      category: "M\xE9ditation",
      date: "10 avril 2024",
      slug: "meditation-pour-debutants"
    },
    {
      title: "G\xE9rer son stress naturellement",
      excerpt: "Techniques et conseils naturels pour mieux g\xE9rer le stress et retrouver la s\xE9r\xE9nit\xE9.",
      image: "/images/blog/gestion-stress.webp",
      category: "Bien-\xEAtre",
      date: "5 avril 2024",
      slug: "gerer-stress-naturellement"
    },
    {
      title: "D\xE9veloppement personnel et spiritualit\xE9",
      excerpt: "D\xE9couvrez les principes fondamentaux du d\xE9veloppement personnel et de la spiritualit\xE9.",
      image: "/images/blog/developpement-personnel.webp",
      category: "D\xE9veloppement Personnel",
      date: "1 avril 2024",
      slug: "developpement-personnel-spiritualite"
    }
  ];
  const articles = allArticles.filter(
    (article) => article.category.toLowerCase().replace("-", "") === category.replace("-", "")
  );
  const currentCategory = categories.find((cat) => cat.id === category)?.label || category;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Blog - ${currentCategory}`, "description": `Articles sur ${currentCategory} - Conseils et actualit\xE9s en naturopathie`, "data-astro-cid-xzuqcofm": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden hero-section" data-astro-cid-xzuqcofm> <!-- Background avec image et overlay --> <div class="absolute inset-0" data-astro-cid-xzuqcofm> <img src="/images/herobg.webp"${addAttribute(`Blog ${currentCategory} - Articles naturopathie et bien-\xEAtre`, "alt")} class="w-full h-full object-cover scale-110 transform motion-safe:animate-subtle-zoom" data-astro-cid-xzuqcofm> <div class="absolute inset-0 bg-gradient-to-r from-ebony/80 via-ebony/60 to-ebony/40" data-astro-cid-xzuqcofm></div> </div> <!-- Éléments décoratifs --> <div class="absolute inset-0 z-10 pointer-events-none overflow-hidden" data-astro-cid-xzuqcofm> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-20 motion-safe:animate-slow-spin" data-astro-cid-xzuqcofm> <img src="/images/sacred-geometry.svg" alt="" class="w-full h-full" loading="eager" data-astro-cid-xzuqcofm> </div> </div> <!-- Contenu principal centré --> <div class="container mx-auto px-4 relative z-20 flex flex-col justify-center min-h-screen" data-astro-cid-xzuqcofm> <div class="max-w-5xl mx-auto text-center" data-astro-cid-xzuqcofm> <!-- En-tête centré --> <div class="motion-safe:animate-fade-in" data-astro-cid-xzuqcofm> <div class="inline-block mb-6" data-astro-cid-xzuqcofm> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-xl font-semibold uppercase tracking-wider" data-astro-cid-xzuqcofm>
Catégorie ${currentCategory} </span> </div> <h1 class="font-heading text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-astro-cid-xzuqcofm>
Articles sur
<span class="block text-sage mt-4 text-3xl md:text-4xl lg:text-5xl" data-astro-cid-xzuqcofm>${currentCategory}</span> </h1> <p class="font-slogan text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] italic" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600" data-astro-cid-xzuqcofm>
"Découvrez nos conseils experts et articles spécialisés dans le domaine de ${currentCategory.toLowerCase()}."
</p> </div> <!-- Navigation des catégories --> <div class="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-duration="800" data-aos-delay="800" data-astro-cid-xzuqcofm> <a href="/blog" class="group relative overflow-hidden px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30" data-astro-cid-xzuqcofm> <span class="relative z-10" data-astro-cid-xzuqcofm>Toutes les catégories</span> </a> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/blog/categorie/${cat.id}`, "href")}${addAttribute(`group relative overflow-hidden px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                ${category === cat.id ? "bg-gradient-to-r from-sage to-gold text-white shadow-lg shadow-sage/25" : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"}`, "class")} data-astro-cid-xzuqcofm> <span class="relative z-10" data-astro-cid-xzuqcofm>${cat.label}</span> ${category === cat.id && renderTemplate`<div class="absolute inset-0 bg-gradient-to-r from-sage to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-astro-cid-xzuqcofm></div>`} </a>`)} </div> </div> </div> <!-- Transition brush effect --> <div class="absolute bottom-0 left-0 w-full z-30 transition-divider" data-astro-cid-xzuqcofm> <div class="absolute inset-0 bg-gradient-to-b from-transparent to-cream" data-astro-cid-xzuqcofm></div> <img src="/images/brush-divider.svg" alt="" class="w-full h-auto min-h-[80px] object-cover transform motion-safe:animate-wave" loading="lazy" data-astro-cid-xzuqcofm> </div> </section>  <section class="py-20 md:py-32 bg-gradient-to-b from-cream to-white relative overflow-hidden" data-astro-cid-xzuqcofm> <!-- Éléments décoratifs --> <div class="absolute top-0 left-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl" data-astro-cid-xzuqcofm></div> <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" data-astro-cid-xzuqcofm></div> <div class="absolute inset-0 opacity-3" data-astro-cid-xzuqcofm> <img src="/images/sacred-geometry.svg" alt="Geometric pattern" class="w-full h-full object-cover bg-gradient-to-r from-sage/20 to-gold/20 bg-clip-content" data-astro-cid-xzuqcofm> </div> <div class="container mx-auto px-4 relative" data-astro-cid-xzuqcofm> <!-- En-tête de section --> <div class="text-center max-w-4xl mx-auto mb-20" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-xzuqcofm> <div class="inline-block mb-6" data-astro-cid-xzuqcofm> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold uppercase tracking-wider" data-astro-cid-xzuqcofm>
Articles ${currentCategory} </span> </div> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-8 leading-tight" data-astro-cid-xzuqcofm>
Découvrez nos <span class="text-sage" data-astro-cid-xzuqcofm>Conseils</span> en <span class="text-gold" data-astro-cid-xzuqcofm>${currentCategory}</span> </h2> <p class="text-xl text-eucalyptus leading-relaxed font-slogan max-w-3xl mx-auto" data-astro-cid-xzuqcofm>
Une sélection d'articles experts spécialisés dans le domaine de ${currentCategory.toLowerCase()}.
</p> <div class="w-24 h-1 bg-gradient-to-r from-sage to-gold mx-auto mt-8 rounded-full" data-astro-cid-xzuqcofm></div> </div> <!-- Grille d'articles premium --> ${articles && articles.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12" data-astro-cid-xzuqcofm> ${articles.map((article, index) => renderTemplate`<div class="post-card opacity-0 transition-all duration-700 transform translate-y-8 hover:-translate-y-2" data-aos="fade-up" data-aos-duration="800"${addAttribute(index * 100, "data-aos-delay")} data-astro-cid-xzuqcofm> ${renderComponent($$result2, "Card", $$Card, { "variant": "hover", "title": article.title, "description": article.excerpt, "image": article.image, "date": article.date, "category": article.category, "url": `/blog/${article.slug}`, "data-astro-cid-xzuqcofm": true })} </div>`)} </div>` : renderTemplate`<div class="text-center py-20" data-aos="fade-up" data-aos-duration="800" data-astro-cid-xzuqcofm> <div class="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6" data-astro-cid-xzuqcofm> <span class="material-icons text-sage text-4xl" data-astro-cid-xzuqcofm>article</span> </div> <h3 class="text-2xl font-heading text-ebony mb-4" data-astro-cid-xzuqcofm>Aucun article disponible</h3> <p class="text-lg text-eucalyptus max-w-md mx-auto" data-astro-cid-xzuqcofm>
Nous préparons actuellement de nouveaux articles dans cette catégorie. Revenez bientôt !
</p> </div>`} </div> </section> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/blog/categorie/[category].astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/jules/Downloads/harmonia/src/pages/blog/categorie/[category].astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/blog/categorie/[category].astro";
const $$url = "/blog/categorie/[category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
