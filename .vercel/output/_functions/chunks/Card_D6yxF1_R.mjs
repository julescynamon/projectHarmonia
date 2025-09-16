import { e as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, g as renderSlot, a as renderTemplate } from './astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const {
    variant = "default",
    class: className = "",
    title,
    description,
    image,
    date,
    category,
    url
  } = Astro2.props;
  const imageUrl = image;
  const variants = {
    default: "bg-white shadow-soft border-sage/10",
    hover: "bg-white shadow-soft hover:shadow-xl hover:-translate-y-2 border-sage/10 hover:border-sage/30",
    feature: "bg-cream border-gold/30 shadow-soft"
  };
  const baseClasses = "rounded-3xl transition-all duration-500 border overflow-hidden group";
  const classes = `${baseClasses} ${variants[variant]} ${className}`;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(classes, "class")} itemscope itemtype="https://schema.org/BlogPosting" data-astro-cid-dd5txfcy> ${image && renderTemplate`<a${addAttribute(url, "href")} class="block relative aspect-[16/9] overflow-hidden" data-astro-cid-dd5txfcy> <!-- Overlay subtil au hover --> <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" data-astro-cid-dd5txfcy></div> <img${addAttribute(imageUrl, "src")}${addAttribute(title, "alt")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" data-astro-cid-dd5txfcy> ${category && renderTemplate`<div class="absolute top-4 left-4 z-20" data-astro-cid-dd5txfcy> <span class="bg-gradient-to-r from-sage to-gold text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-sage/25 backdrop-blur-sm" data-astro-cid-dd5txfcy> ${category} </span> </div>`} <!-- Icône de lecture au hover --> <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20" data-astro-cid-dd5txfcy> <div class="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl" data-astro-cid-dd5txfcy> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-dd5txfcy> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-dd5txfcy></path> </svg> </div> </div> </a>`} <div class="p-8" data-astro-cid-dd5txfcy> ${date && renderTemplate`<div class="mb-4" data-astro-cid-dd5txfcy> <time${addAttribute(date, "datetime")} class="text-sm text-eucalyptus/70 font-slogan uppercase tracking-wider" data-astro-cid-dd5txfcy> ${date} </time> </div>`} ${title && renderTemplate`<h3 class="text-xl md:text-2xl font-heading font-bold mb-4 text-ebony leading-tight" itemprop="headline" data-astro-cid-dd5txfcy> <a${addAttribute(url, "href")} class="hover:text-sage transition-colors duration-300 group-hover:text-sage" itemprop="url" data-astro-cid-dd5txfcy> ${title} </a> </h3>`} ${description && renderTemplate`<p class="text-eucalyptus leading-relaxed mb-6 font-slogan" itemprop="description" data-astro-cid-dd5txfcy> ${description} </p>`} ${url && renderTemplate`<div class="mt-6" data-astro-cid-dd5txfcy> <a${addAttribute(url, "href")} class="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-sage to-gold text-white hover:from-sage-600 hover:to-gold-600 transition-all duration-300 ease-in-out rounded-full text-sm font-medium font-slogan shadow-lg shadow-sage/25 hover:shadow-xl hover:shadow-sage/30 transform hover:scale-105" data-astro-cid-dd5txfcy>
Lire l'article
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-dd5txfcy> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-astro-cid-dd5txfcy></path> </svg> </a> </div>`} ${renderSlot($$result, $$slots["default"])} </div> </article> `;
}, "/Users/jules/Downloads/harmonia/src/components/ui/Card.astro", void 0);

export { $$Card as $ };
