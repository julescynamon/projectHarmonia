import { g as getCollection } from '../chunks/_astro_content_C6mQ-x-S.mjs';
export { renderers } from '../renderers.mjs';

const pages = [
  "",
  "a-propos",
  "contact",
  "services",
  "boutique",
  "rendez-vous",
  "blog",
  "mentions-legales",
  "politique-confidentialite",
  "cgv",
  "accompagnements/naturopathie-humaine",
  "accompagnements/naturopathie-animale",
  "accompagnements/soins-energetiques-humains",
  "accompagnements/soins-energetiques-animaux",
  "accompagnements/accompagnement-personalise",
  "accompagnements/reservation"
];
const GET = async ({ site }) => {
  if (!site) throw new Error("site is undefined");
  const posts = await getCollection("blog");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map((page) => {
    let priority = "0.8";
    let changefreq = "weekly";
    if (page === "") {
      priority = "1.0";
      changefreq = "daily";
    } else if (page === "services" || page === "contact" || page === "rendez-vous") {
      priority = "0.9";
    } else if (page.startsWith("accompagnements/")) {
      priority = "0.8";
      changefreq = "monthly";
    } else if (page === "blog") {
      priority = "0.7";
    } else if (page.includes("mentions-legales") || page.includes("politique-confidentialite") || page.includes("cgv")) {
      priority = "0.3";
      changefreq = "yearly";
    }
    return `
          <url>
            <loc>${new URL(page, site).toString()}</loc>
            <lastmod>${(/* @__PURE__ */ new Date()).toISOString()}</lastmod>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
          </url>
        `;
  }).join("")}
      ${posts.map((post) => `
          <url>
            <loc>${new URL(`blog/${post.slug}`, site).toString()}</loc>
            <lastmod>${post.data.updatedDate?.toISOString() || post.data.publishDate.toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
          </url>
        `).join("")}
    </urlset>`;
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
