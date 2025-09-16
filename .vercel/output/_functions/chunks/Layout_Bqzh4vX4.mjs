import { e as createAstro, c as createComponent, a as renderTemplate, g as renderSlot, h as renderHead, u as unescapeHTML, d as addAttribute } from './astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */

function getSiteConfig() {
  return {
    site: "https://harmonia.jules.com",
    title: "La Maison Sattvaïa - Naturopathie & Soins Chamaniques",
    description: "Découvrez nos services de naturopathie et soins chamaniques pour votre bien-être naturel.",
    author: "La Maison Sattvaïa",
    language: "fr",
    timezone: "Europe/Paris"
  };
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://harmonia.jules.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "La Maison Sattva\xEFa - Naturopathie & Soins Chamaniques",
    description = "D\xE9couvrez nos services de naturopathie et soins chamaniques pour votre bien-\xEAtre naturel.",
    image = "/images/og-image.webp",
    canonical,
    noindex = false,
    seo = {}
  } = Astro2.props;
  const siteConfig = getSiteConfig();
  const canonicalURL = canonical ? new URL(canonical, siteConfig.site) : new URL(Astro2.url.pathname, siteConfig.site);
  return renderTemplate(_a || (_a = __template(['<html lang="fr" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="description"', '><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><!-- Preload des ressources critiques --><link rel="preload" href="/fonts/cormorant-garamond-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/lato-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><!-- Preload des images critiques --><link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp"><!-- DNS Prefetch pour les domaines externes --><link rel="dns-prefetch" href="//fonts.googleapis.com"><link rel="dns-prefetch" href="//fonts.gstatic.com"><link rel="dns-prefetch" href="//cdn.jsdelivr.net"><!-- Preconnect pour les connexions critiques --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Canonical URL --><link rel="canonical"', '><!-- Meta tags pour les r\xE9seaux sociaux --><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:url"', '><meta property="og:site_name" content="Harmonia"><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Meta tags de performance --><meta name="theme-color" content="#4F46E5"><meta name="color-scheme" content="light dark"><!-- Noindex si demand\xE9 -->', '<!-- Structured Data --><script type="application/ld+json">', "<\/script><!-- Inline CSS critique --><style>\n      /* CSS critique pour \xE9viter le FOUC */\n      body { margin: 0; font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }\n      .loading { opacity: 0; transition: opacity 0.3s ease-in; }\n      .loaded { opacity: 1; }\n      \n      /* Optimisation du rendu des polices */\n      .font-display-swap { font-display: swap; }\n      \n      /* Optimisation des images */\n      img { max-width: 100%; height: auto; }\n      \n      /* Optimisation du scroll */\n      html { scroll-behavior: smooth; }\n      \n      /* Optimisation du focus */\n      :focus { outline: 2px solid #4F46E5; outline-offset: 2px; }\n    </style><title>", "</title>", '</head> <body class="loading"> ', " <!-- Script de chargement optimis\xE9 --> <script>\n      // Marquer la page comme charg\xE9e\n      document.addEventListener('DOMContentLoaded', function() {\n        document.body.classList.add('loaded');\n      });\n      \n      // Optimisation du lazy loading\n      if ('IntersectionObserver' in window) {\n        const imageObserver = new IntersectionObserver((entries, observer) => {\n          entries.forEach(entry => {\n            if (entry.isIntersecting) {\n              const img = entry.target;\n              img.src = img.dataset.src;\n              img.classList.remove('lazy');\n              observer.unobserve(img);\n            }\n          });\n        });\n        \n        document.querySelectorAll('img[data-src]').forEach(img => {\n          imageObserver.observe(img);\n        });\n      }\n      \n      // Optimisation du service worker\n      if ('serviceWorker' in navigator) {\n        window.addEventListener('load', () => {\n          navigator.serviceWorker.register('/sw.js')\n            .then(registration => {\n              console.log('SW registered: ', registration);\n            })\n            .catch(registrationError => {\n              console.log('SW registration failed: ', registrationError);\n            });\n        });\n      }\n    <\/script> </body> </html> "])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), addAttribute(canonicalURL, "href"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, siteConfig.site), "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, siteConfig.site), "content"), noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Harmonia",
    "description": description,
    "url": siteConfig.site,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteConfig.site}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  })), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/jules/Downloads/harmonia/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
