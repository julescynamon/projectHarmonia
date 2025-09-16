/* empty css                                    */
import { c as createComponent, m as maybeRenderHead, a as renderTemplate, d as addAttribute, b as renderScript, r as renderComponent } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_Nho3QixU.mjs';
import 'clsx';
/* empty css                                 */
import { $ as $$Card } from '../chunks/Card_D6yxF1_R.mjs';
import { $ as $$Button } from '../chunks/Button_CHyoFLrn.mjs';
import { s as supabase } from '../chunks/supabase_CXSvBnpz.mjs';
import { p as pageSEO } from '../chunks/seo_DE79S3-Q.mjs';
export { renderers } from '../renderers.mjs';

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden hero-section" data-astro-cid-bbe6dxrz> <!-- Background avec overlay et effet parallax --> <div class="absolute inset-0 z-0" data-astro-cid-bbe6dxrz> <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10 z-10" data-astro-cid-bbe6dxrz></div> <img src="/images/herobg.webp" alt="Background Nature" class="w-full h-full object-cover scale-110 transform motion-safe:animate-subtle-zoom" loading="eager" decoding="async" fetchpriority="high" data-astro-cid-bbe6dxrz> </div> <!-- Élément géométrie sacrée --> <div class="absolute inset-0 z-10 pointer-events-none overflow-hidden" data-astro-cid-bbe6dxrz> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-30 motion-safe:animate-slow-spin" data-astro-cid-bbe6dxrz> <img src="/images/sacred-geometry.svg" alt="" class="w-full h-full" loading="eager" data-astro-cid-bbe6dxrz> </div> </div> <!-- Contenu principal --> <div class="container mx-auto px-4 relative z-20" data-astro-cid-bbe6dxrz> <div class="max-w-6xl mx-auto" data-astro-cid-bbe6dxrz> <!-- En-tête --> <div class="text-center mb-16" data-astro-cid-bbe6dxrz> <h1 class="font-heading text-5xl md:text-8xl text-white mb-24 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] animate-title-fade-in" data-astro-cid-bbe6dxrz>
La Maison SATTVAÏA
</h1> </div> <!-- Citation inspirante --> <div class="text-center mb-24" data-astro-cid-bbe6dxrz> <blockquote class="text-2xl md:text-3xl text-white italic font-light max-w-3xl mx-auto leading-relaxed animate-quote-fade-in" data-astro-cid-bbe6dxrz>
"Un lieu de reconnexion où corps, énergie et âme retrouvent équilibre, harmonie et clarté intérieure."
</blockquote> </div> </div> </div> <!-- Transition brush effect --> <div class="absolute bottom-0 left-0 w-full z-30 transition-divider" data-astro-cid-bbe6dxrz> <div class="absolute inset-0 bg-gradient-to-b from-transparent to-cream" data-astro-cid-bbe6dxrz></div> <img src="/images/brush-divider.svg" alt="" class="w-full h-auto min-h-[80px] object-cover transform motion-safe:animate-wave" loading="lazy" data-astro-cid-bbe6dxrz> </div> </section> `;
}, "/Users/jules/Downloads/harmonia/src/components/Hero.astro", void 0);

const $$Dimensions = createComponent(($$result, $$props, $$slots) => {
  const dimensions = [
    {
      title: "Dimension du Corps",
      description: "La Maison Sattva\xEFa prend soin du corps, humain comme animal, \xE0 travers la naturopathie et les approches naturelles. Alimentation, hygi\xE8ne de vie, plantes et pratiques douces deviennent des alli\xE9s pour restaurer l'\xE9quilibre, renforcer la vitalit\xE9 et soutenir un bien-\xEAtre global. Un corps en harmonie est la premi\xE8re porte vers la paix int\xE9rieure.",
      icon: "healing",
      backgroundImage: "/images/dimensions-sante-naturelle.webp",
      accentColor: "sage"
    },
    {
      title: "Dimension de l'\xC9nergie",
      description: "L'\xE9nergie est le souffle de vie. Par les soins \xE9nerg\xE9tiques et chamaniques, La Maison Sattva\xEFa lib\xE8re les blocages, r\xE9accorde les vibrations et favorise la circulation fluide de l'\xE9nergie. Quand l'\xE9nergie circule librement, l'\xEAtre retrouve paix, clart\xE9 et force int\xE9rieure.",
      icon: "self_improvement",
      backgroundImage: "/images/dimensions-rituels-energie.webp",
      accentColor: "gold"
    },
    {
      title: "Dimension de l'\xC2me",
      description: "Au-del\xE0 du corps et de l'\xE9nergie, La Maison Sattva\xEFa est un espace de guidance et de reconnexion spirituelle. Lectures d'\xE2me, num\xE9rologie karmique et accompagnements personnalis\xE9s ouvrent des chemins de conscience et de transformation profonde. C'est une invitation \xE0 retrouver la lumi\xE8re de son essence et \xE0 marcher align\xE9 avec sa mission de vie.",
      icon: "psychology",
      backgroundImage: "/images/dimensions-developpement-spirituel.webp",
      accentColor: "eucalyptus"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-20 md:py-32 bg-gradient-to-b from-cream/50 to-white relative overflow-hidden" data-astro-cid-lb4yc5zi> <!-- Éléments décoratifs de fond --> <div class="absolute inset-0 bg-nature-pattern opacity-3" data-astro-cid-lb4yc5zi></div> <div class="absolute top-10 left-10 w-64 h-64 bg-sage/5 rounded-full blur-3xl animate-pulse" data-astro-cid-lb4yc5zi></div> <div class="absolute bottom-10 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;" data-astro-cid-lb4yc5zi></div> <div class="container mx-auto px-4 relative" data-astro-cid-lb4yc5zi> <!-- En-tête éditorial --> <div class="text-center max-w-4xl mx-auto mb-20" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-lb4yc5zi> <div class="inline-block mb-8" data-astro-cid-lb4yc5zi> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-2xl md:text-3xl font-bold uppercase tracking-wider" data-astro-cid-lb4yc5zi>
Nos dimensions
</span> </div> <p class="text-xl md:text-2xl text-ebony leading-relaxed font-slogan max-w-3xl mx-auto mb-8" data-astro-cid-lb4yc5zi>
Trois chemins d'accompagnement, une même essence : retrouver l'harmonie et révéler la lumière intérieure.
</p> <div class="w-24 h-1 bg-gradient-to-r from-sage to-gold mx-auto mt-8 rounded-full" data-astro-cid-lb4yc5zi></div> </div> <!-- Layout Magazine - Cards horizontales --> <div class="space-y-8 lg:space-y-12" data-astro-cid-lb4yc5zi> ${dimensions.map((dimension, index) => renderTemplate`<div${addAttribute(`group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`, "class")} data-aos="fade-up"${addAttribute(index * 200, "data-aos-delay")} data-aos-duration="1000" data-astro-cid-lb4yc5zi> <div${addAttribute(`flex flex-col lg:flex-row ${index % 2 === 0 ? "" : "lg:flex-row-reverse"} min-h-[400px]`, "class")} data-astro-cid-lb4yc5zi> <!-- Section Image --> <div class="relative lg:w-1/2 overflow-hidden" data-astro-cid-lb4yc5zi> <!-- Image réelle --> <img${addAttribute(dimension.backgroundImage, "src")}${addAttribute(`Image repr\xE9sentant ${dimension.title.toLowerCase()}`, "alt")} class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" data-astro-cid-lb4yc5zi> <!-- Effet parallax sur hover --> <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" data-astro-cid-lb4yc5zi></div> </div> <!-- Section Contenu --> <div${addAttribute(`lg:w-1/2 bg-white relative flex flex-col justify-center p-6 lg:p-10 xl:p-12`, "class")} data-astro-cid-lb4yc5zi> <!-- Accent décoratif --> <div${addAttribute(`absolute top-0 ${index % 2 === 0 ? "left-0" : "right-0"} w-2 h-full bg-gradient-to-b ${dimension.accentColor === "sage" ? "from-sage to-eucalyptus" : dimension.accentColor === "gold" ? "from-gold to-sage" : "from-eucalyptus to-sage"}`, "class")} data-astro-cid-lb4yc5zi></div> <div class="relative z-10" data-astro-cid-lb4yc5zi> <!-- Titre --> <h3 class="font-heading text-3xl lg:text-4xl xl:text-5xl mb-6 leading-tight bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent" data-astro-cid-lb4yc5zi> ${dimension.title} </h3> <!-- Description --> <p class="text-lg lg:text-xl text-ebony leading-relaxed font-slogan" data-astro-cid-lb4yc5zi> ${dimension.description} </p> </div> <!-- Effet de brillance --> <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" data-astro-cid-lb4yc5zi> <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" data-astro-cid-lb4yc5zi></div> </div> </div> </div> </div>`)} </div> </div> </section> `;
}, "/Users/jules/Downloads/harmonia/src/components/Dimensions.astro", void 0);

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="py-20 md:py-32 bg-gradient-to-b from-white to-cream/30 relative overflow-hidden"> <!-- Éléments décoratifs --> <div class="absolute top-0 left-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl"></div> <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div> <div class="absolute inset-0 opacity-3"> <img src="/images/sacred-geometry.svg" alt="Geometric pattern" class="w-full h-full object-cover bg-gradient-to-r from-sage/20 to-gold/20 bg-clip-content"> </div> <div class="container mx-auto px-4 relative"> <div class="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center"> <!-- Image avec effets premium --> <div class="relative order-2 lg:order-1" data-aos="fade-right" data-aos-offset="50" data-aos-duration="1000"> <div class="relative"> <!-- Cadre décoratif --> <div class="absolute -inset-4 bg-gradient-to-r from-sage/20 to-gold/20 rounded-3xl blur-xl"></div> <div class="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"> <img src="/images/apropos2.webp" alt="Naïma, naturopathe et guide holistique" class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" loading="lazy"> <!-- Overlay subtil --> <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div> </div> </div> </div> <!-- Contenu enrichi --> <div class="order-1 lg:order-2" data-aos="fade-left" data-aos-offset="50" data-aos-duration="1000"> <!-- En-tête avec animation --> <div class="mb-8"> <div class="inline-block mb-4"> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold">
L'esprit de la Maison Sattvaïa
</span> </div> <h2 class="font-heading text-4xl md:text-5xl xl:text-6xl text-ebony mb-6 leading-tight">
Qui sommes-nous ?
</h2> </div> <!-- Contenu principal --> <div class="space-y-8 text-ebony mb-10 text-xl leading-relaxed"> <p>
À La Maison Sattvaïa, chaque être est accueilli dans sa globalité humain comme animal. Notre vision est simple : le corps, l'énergie et l'âme ne sont pas séparés, mais intimement liés. Ici, la <strong>naturopathie</strong>, les <strong>soins énergétiques</strong> et la <strong>guidance spirituelle</strong> s'unissent pour offrir un accompagnement unique, où la science du naturel rencontre la sagesse du subtil.
</p> <p>
Ce qui nous distingue ? Une approche profondément <strong>humaine et respectueuse</strong>, qui ne se limite pas à soulager des symptômes, mais qui vous guide vers une véritable transformation intérieure et un mieux-être durable.
</p> <p>
La Maison Sattvaïa est plus qu'un espace de soins : c'est un lieu de <strong>reconnexion à votre essence</strong>, de douceur et d'écoute, où l'harmonie se construit pas à pas, dans la lumière et la simplicité.
</p> </div> </div> </div> </div> </section>`;
}, "/Users/jules/Downloads/harmonia/src/components/About.astro", void 0);

const $$ResultsTestimonials = createComponent(($$result, $$props, $$slots) => {
  const testimonials = [
    {
      name: "Marie",
      role: "38 ans \u2013 Naturopathie humaine",
      content: "J'avais perdu toute \xE9nergie et je ne savais plus par o\xF9 commencer. La s\xE9ance m'a permis d'y voir clair et de repartir avec des conseils simples et un programme concret. Aujourd'hui je me sens beaucoup plus l\xE9g\xE8re et apais\xE9e.",
      rating: 5,
      category: "humain",
      location: "Paris"
    },
    {
      name: "Julien",
      role: "Ma\xEEtre de Luna (chienne de 7 ans) \u2013 Naturopathie animale",
      content: "Luna avait souvent des probl\xE8mes digestifs. On a adapt\xE9 son alimentation avec des solutions naturelles et en quelques jours d\xE9j\xE0, elle allait mieux. Je la retrouve plus joyeuse et pleine de vitalit\xE9.",
      rating: 5,
      category: "animal",
      location: "Lyon"
    },
    {
      name: "Sophie",
      role: "42 ans \u2013 Soins \xE9nerg\xE9tiques humains",
      content: "Pendant le soin, j'ai ressenti une chaleur douce et un apaisement profond. Apr\xE8s, c'\xE9tait comme si un poids s'\xE9tait lev\xE9. Je dors enfin sereinement, \xE7a a chang\xE9 mon quotidien.",
      rating: 5,
      category: "humain",
      location: "Bordeaux"
    },
    {
      name: "\xC9lodie",
      role: "29 ans \u2013 Guidance & lecture d'\xE2me",
      content: "La lecture a \xE9t\xE9 une vraie r\xE9v\xE9lation. J'ai compris des choses que je ressentais sans jamais r\xE9ussir \xE0 les exprimer. \xC7a m'a donn\xE9 une confiance nouvelle pour avancer dans mes choix de vie.",
      rating: 5,
      category: "humain",
      location: "Toulouse"
    }
  ];
  const stats = [
    { number: "280+", label: "Personnes et animaux accompagn\xE9s", description: "Humains et animaux r\xE9concili\xE9s avec leur bien-\xEAtre" },
    { number: "97%", label: "Satisfaction client", description: "Des r\xE9sultats mesurables et durables" },
    { number: "5", label: "Ann\xE9es d'exp\xE9rience", description: "Une expertise approfondie et reconnue" },
    { number: "100%", label: "Approche naturelle", description: "Respect total de votre nature profonde" }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="py-20 md:py-32 bg-gradient-to-b from-sage/5 via-white to-cream/20 relative overflow-hidden" data-astro-cid-uc4laiv3> <!-- Éléments décoratifs --> <div class="absolute top-10 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse" data-astro-cid-uc4laiv3></div> <div class="absolute bottom-10 left-10 w-80 h-80 bg-sage/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;" data-astro-cid-uc4laiv3></div> <div class="container mx-auto px-4 relative" data-astro-cid-uc4laiv3> <!-- En-tête --> <div class="text-center max-w-4xl mx-auto mb-20" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-uc4laiv3> <div class="inline-block mb-6" data-astro-cid-uc4laiv3> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold uppercase tracking-wider" data-astro-cid-uc4laiv3>
Résultats & Témoignages
</span> </div> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-8 leading-tight" data-astro-cid-uc4laiv3>
Des <span class="text-sage" data-astro-cid-uc4laiv3>transformations</span> qui parlent d'elles-mêmes
</h2> </div> <!-- Statistiques avec animations --> <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20" data-astro-cid-uc4laiv3> ${stats.map((stat, index) => renderTemplate`<div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 text-center shadow-xl border border-sage/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2" data-aos="fade-up"${addAttribute(index * 150, "data-aos-delay")} data-aos-duration="800" data-astro-cid-uc4laiv3> <div class="relative mb-4" data-astro-cid-uc4laiv3> <div class="text-4xl lg:text-5xl font-heading text-sage font-bold counter"${addAttribute(stat.number, "data-target")} data-astro-cid-uc4laiv3>
0
</div> <div class="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-gold to-sage rounded-full" data-astro-cid-uc4laiv3></div> </div> <h3 class="font-heading text-lg text-ebony font-semibold mb-2" data-astro-cid-uc4laiv3> ${stat.label} </h3> <p class="text-sm text-eucalyptus leading-relaxed" data-astro-cid-uc4laiv3> ${stat.description} </p> </div>`)} </div> <!-- Section témoignages avec carousel effect --> <div class="mb-16" data-astro-cid-uc4laiv3> <div class="text-center mb-12" data-aos="fade-up" data-astro-cid-uc4laiv3> <h3 class="font-heading text-3xl md:text-4xl text-ebony mb-4" data-astro-cid-uc4laiv3>
Ils témoignent de leur transformation
</h3> <div class="w-24 h-1 bg-gradient-to-r from-sage to-gold mx-auto rounded-full" data-astro-cid-uc4laiv3></div> </div> <!-- Grille de témoignages --> <div class="grid md:grid-cols-2 gap-8 mb-12" data-astro-cid-uc4laiv3> ${testimonials.map((testimonial, index) => renderTemplate`<div data-aos="fade-up"${addAttribute(index * 200, "data-aos-delay")} data-aos-duration="800" class="group" data-astro-cid-uc4laiv3> <div class="bg-white rounded-3xl p-8 shadow-xl border border-sage/10 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1 h-full flex flex-col" data-astro-cid-uc4laiv3> <!-- En-tête du témoignage --> <div class="flex items-start justify-between mb-6" data-astro-cid-uc4laiv3> <div class="flex items-center gap-4" data-astro-cid-uc4laiv3> <div class="w-12 h-12 rounded-full bg-gradient-to-r from-sage to-gold flex items-center justify-center shadow-lg" data-astro-cid-uc4laiv3> <span class="text-white font-heading font-bold text-lg" data-astro-cid-uc4laiv3> ${testimonial.name.charAt(0)} </span> </div> <div data-astro-cid-uc4laiv3> <h4 class="font-heading text-lg text-ebony font-semibold" data-astro-cid-uc4laiv3> ${testimonial.name} </h4> <p class="text-sm text-eucalyptus" data-astro-cid-uc4laiv3> ${testimonial.role} • ${testimonial.location} </p> </div> </div> <!-- Badge catégorie --> <div${addAttribute(`px-3 py-1 rounded-full text-xs font-semibold ${testimonial.category === "humain" ? "bg-sage/10 text-sage" : "bg-gold/10 text-gold"}`, "class")} data-astro-cid-uc4laiv3> ${testimonial.category === "humain" ? "\u{1F464} Humain" : "\u{1F43E} Animal"} </div> </div> <!-- Étoiles --> <div class="flex gap-1 mb-4" data-astro-cid-uc4laiv3> ${[...Array(5)].map((_, i) => renderTemplate`<span${addAttribute(`text-lg ${i < testimonial.rating ? "text-gold" : "text-gray-300"}`, "class")} data-astro-cid-uc4laiv3>
★
</span>`)} </div> <!-- Contenu --> <div class="flex-grow" data-astro-cid-uc4laiv3> <p class="text-eucalyptus leading-relaxed italic mb-4 text-lg" data-astro-cid-uc4laiv3>
"${testimonial.content}"
</p> </div> <!-- Signature --> <div class="border-t border-sage/10 pt-4" data-astro-cid-uc4laiv3> <p class="text-sm text-eucalyptus font-medium text-right" data-astro-cid-uc4laiv3>
— Témoignage vérifié
</p> </div> </div> </div>`)} </div> </div> </div> </section> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/ResultsTestimonials.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/jules/Downloads/harmonia/src/components/ResultsTestimonials.astro", void 0);

const $$RecentPosts = createComponent(async ($$result, $$props, $$slots) => {
  const { data: recentPosts, error } = await supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(3);
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return renderTemplate`${maybeRenderHead()}<section class="py-20 md:py-32 bg-gradient-to-b from-white via-cream/30 to-sage/10 relative overflow-hidden"> <!-- Éléments décoratifs améliorés --> <div class="absolute inset-0 bg-nature-pattern opacity-3"></div> <div class="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-pulse"></div> <div class="absolute bottom-10 left-10 w-80 h-80 bg-sage/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div> <div class="container mx-auto px-4 relative"> <!-- En-tête premium --> <div class="text-center max-w-4xl mx-auto mb-20" data-aos="fade-up" data-aos-duration="1000"> <div class="inline-block mb-6"> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold uppercase tracking-wider">
Le Blog de La Maison Sattvaïa
</span> </div> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-8 leading-tight">
Derniers <span class="text-sage">Articles</span> & <span class="text-gold">Conseils</span> </h2> <p class="text-xl text-eucalyptus leading-relaxed font-slogan max-w-3xl mx-auto">
Découvrez nos derniers conseils, actualités et réflexions sur la naturopathie et le bien-être naturel.
</p> <div class="w-24 h-1 bg-gradient-to-r from-sage to-gold mx-auto mt-8 rounded-full"></div> </div> <!-- Grille d'articles premium --> ${recentPosts && recentPosts.length > 0 ? renderTemplate`<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative"> ${recentPosts.map((post, index) => renderTemplate`<div data-aos="fade-up"${addAttribute(index * 200, "data-aos-delay")} data-aos-offset="30" data-aos-duration="800" class="group relative post-card opacity-0 transition-all duration-500"> <!-- Effet de glow au fond --> <div class="absolute -inset-1 bg-gradient-to-r from-sage/20 to-gold/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div> <div class="relative"> ${renderComponent($$result, "Card", $$Card, { "variant": "hover", "title": post.title, "description": post.excerpt, "image": post.cover_url, "date": formatDate(post.created_at), "category": post.category, "url": `/blog/${post.slug}`, "class": "h-full bg-white/95 backdrop-blur-sm border border-sage/10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2" })} <!-- Badge numéroté --> <div class="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-sage to-gold rounded-full flex items-center justify-center shadow-lg z-10"> <span class="text-white font-bold text-sm">${index + 1}</span> </div> </div> </div>`)} </div>` : renderTemplate`<div class="text-center py-16 bg-gradient-to-r from-sage/10 via-white to-gold/10 rounded-3xl border border-sage/20 shadow-xl" data-aos="fade-up" data-aos-duration="1000"> <div class="p-12"> <!-- Icône animée --> <div class="relative mb-8"> <div class="w-24 h-24 bg-gradient-to-r from-sage to-gold rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse"> <span class="text-4xl">🌿</span> </div> <div class="absolute -inset-2 bg-gradient-to-r from-sage/20 to-gold/20 rounded-full blur-xl animate-pulse"></div> </div> <h3 class="font-heading text-2xl text-ebony mb-4">Articles en préparation</h3> <p class="text-xl text-eucalyptus mb-6 font-slogan">Les premiers articles arrivent bientôt, un peu de patience 🌿</p> <p class="text-eucalyptus/80">En attendant, n'hésitez pas à explorer les autres sections du site.</p> <!-- Mini CTA --> <div class="mt-8"> <a href="/contact" class="inline-flex items-center gap-2 bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"> <span>Être notifié(e)</span> <span>📧</span> </a> </div> </div> </div>`} <!-- Call to action premium --> <div class="text-center mt-20" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000"> <div class="bg-gradient-to-r from-sage/10 via-white to-gold/10 rounded-3xl p-8 lg:p-12 shadow-xl border border-sage/20"> <h3 class="font-heading text-2xl lg:text-3xl text-ebony mb-6">
Explorez tous nos articles
</h3> <p class="text-lg text-eucalyptus mb-8 max-w-2xl mx-auto font-slogan">
Découvrez une mine de conseils, d'actualités et de réflexions pour votre bien-être et celui de vos animaux.
</p> ${renderComponent($$result, "Button", $$Button, { "href": "/blog", "size": "lg", "class": "bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" }, { "default": async ($$result2) => renderTemplate`
Voir tous les articles
` })} </div> </div> </div> </section> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/RecentPosts.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/RecentPosts.astro", void 0);

const $$FinalCTA = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden" data-astro-cid-66itwakk> <!-- Photo de fond --> <div class="absolute inset-0 z-0" data-astro-cid-66itwakk> <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 z-10" data-astro-cid-66itwakk></div> <img src="/images/final-cta-bg.webp" alt="Background Nature" class="w-full h-full object-cover scale-110 transform motion-safe:animate-subtle-zoom" loading="eager" decoding="async" fetchpriority="high" data-astro-cid-66itwakk> </div> <!-- Contenu principal --> <div class="container mx-auto px-4 relative z-20" data-astro-cid-66itwakk> <div class="max-w-6xl mx-auto text-center" data-astro-cid-66itwakk> <!-- Citation qui s'écrit automatiquement --> <div class="animate-quote-fade-in" data-astro-cid-66itwakk> <blockquote class="text-3xl md:text-4xl lg:text-5xl text-white font-serif italic leading-relaxed max-w-5xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" data-astro-cid-66itwakk> <span id="typing-text" data-astro-cid-66itwakk></span> </blockquote> </div> </div> </div> </section>  ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/FinalCTA.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/FinalCTA.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const seo = pageSEO.home;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seo.title, "description": seo.description, "image": seo.image }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative"> ${renderComponent($$result2, "Hero", $$Hero, {})} </div>  <div class="relative"> ${renderComponent($$result2, "Dimensions", $$Dimensions, {})} </div>  <div class="relative"> ${renderComponent($$result2, "About", $$About, {})} </div>  <div class="relative"> ${renderComponent($$result2, "ResultsTestimonials", $$ResultsTestimonials, {})} </div>  <div class="relative"> ${renderComponent($$result2, "RecentPosts", $$RecentPosts, {})} </div>  <div class="relative"> ${renderComponent($$result2, "FinalCTA", $$FinalCTA, {})} </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/index.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
