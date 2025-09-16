import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute, g as renderSlot } from './astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from './MainLayout_BPgP8eEd.mjs';
/* empty css                          */

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

const $$Astro = createAstro("https://harmonia.jules.com");
const $$BlogPostLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPostLayout;
  const { title, description, image, category = "Non cat\xE9goris\xE9", date, readingTime, author } = Astro2.props;
  const formattedDate = formatDate(date);
  const categorySlug = category?.toLowerCase() || "non-categorise";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": title, "description": description, "data-astro-cid-2q5oecfc": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="article-container" itemscope itemtype="https://schema.org/BlogPosting" data-astro-cid-2q5oecfc> <div class="container mx-auto px-4 py-12 lg:py-20 padding-article" data-astro-cid-2q5oecfc> <div class="max-w-4xl mx-auto" data-astro-cid-2q5oecfc> <!-- En-tête de l'article --> <header class="article-header mb-12" data-astro-cid-2q5oecfc> <div class="article-meta flex items-center gap-4 mb-6 text-sm" data-aos="fade-up" data-astro-cid-2q5oecfc> <a${addAttribute(`/categories/${categorySlug}`, "href")} class="category-tag" data-astro-cid-2q5oecfc> ${category} </a> <time${addAttribute(date, "datetime")} itemprop="datePublished" class="text-gray-600" data-astro-cid-2q5oecfc> ${formattedDate} </time> ${readingTime && renderTemplate`<span class="text-gray-600 flex items-center" data-astro-cid-2q5oecfc> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-2q5oecfc> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-2q5oecfc></path> </svg> ${readingTime} </span>`} <span class="text-gray-600" data-astro-cid-2q5oecfc>
Écrit par ${author} </span> </div> <h1 itemprop="headline" class="article-title" data-aos="fade-up" data-astro-cid-2q5oecfc> ${title} </h1> <p class="article-description" itemprop="description" data-aos="fade-up" data-astro-cid-2q5oecfc> ${description} </p> </header> <!-- Image principale --> ${image && renderTemplate`<figure class="article-image mb-12" data-aos="fade-up" data-astro-cid-2q5oecfc> <img${addAttribute(image, "src")}${addAttribute(title, "alt")} itemprop="image" class="w-full aspect-[16/9] object-cover rounded-xl shadow-soft" loading="eager" data-astro-cid-2q5oecfc> </figure>`} <!-- Contenu de l'article --> <div class="article-content prose prose-lg mx-auto" itemprop="articleBody" data-aos="fade-up" data-astro-cid-2q5oecfc> ${renderSlot($$result2, $$slots["default"])} </div> </div> <!-- Bouton de retour --> <div class="text-center mt-16" data-aos="fade-up" data-astro-cid-2q5oecfc> <a href="/blog" class="inline-flex items-center px-6 py-3 text-base font-slogan font-medium rounded-full bg-eucalyptus text-white transition-all duration-300 hover:bg-sage hover:shadow-md transform hover:-translate-y-0.5" data-astro-cid-2q5oecfc> <span class="mr-2 text-lg" data-astro-cid-2q5oecfc>←</span>
Retour au blog
</a> </div> </div> </article> ` })} `;
}, "/Users/jules/Downloads/harmonia/src/layouts/BlogPostLayout.astro", void 0);

export { $$BlogPostLayout as $ };
