import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap principal
Sitemap: https://www.maisonsattvaia.fr/sitemap.xml

# Crawl-delay pour éviter la surcharge
Crawl-delay: 1

# Prevent indexing of sensitive routes
Disallow: /login
Disallow: /register
Disallow: /mon-compte
Disallow: /admin
Disallow: /api/
Disallow: /_astro/
Disallow: /node_modules/

# Allow important pages
Allow: /accompagnements/
Allow: /blog/
Allow: /images/
Allow: /fonts/

# Spécifique pour Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Spécifique pour Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
