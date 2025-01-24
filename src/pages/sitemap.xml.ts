import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const pages = [
  '',
  'a-propos',
  'contact',
  'services',
  'boutique',
  'rendez-vous',
  'blog'
];

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('site is undefined');

  // Get all blog posts
  const posts = await getCollection('blog');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => `
          <url>
            <loc>${new URL(page, site).toString()}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
            <priority>${page === '' ? '1.0' : '0.8'}</priority>
          </url>
        `)
        .join('')}
      ${posts
        .map((post) => `
          <url>
            <loc>${new URL(`blog/${post.slug}`, site).toString()}</loc>
            <lastmod>${post.data.updatedDate?.toISOString() || post.data.publishDate.toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
          </url>
        `)
        .join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
