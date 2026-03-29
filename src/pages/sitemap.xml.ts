import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

const pages = [
  '',
  'a-propos',
  'contact',
  'boutique',
  'rendez-vous',
  'blog',
  'mentions-legales',
  'politique-confidentialite',
  'cgv',
  'maison',
  'sattva',
  'aia',
  'accompagnements/reservation'
];

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('site is undefined');

  // Get all published blog posts from Supabase
  let posts: Array<{ slug: string; published_at: string | null; updated_at: string | null }> = [];
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('slug, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts for sitemap:', error);
    } else if (data) {
      posts = data;
    }
  } catch (error) {
    console.error('Error in sitemap blog posts fetch:', error);
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          // Définir les priorités selon l'importance des pages
          let priority = '0.7';
          let changefreq = 'weekly';
          
          if (page === '') {
            priority = '1.0';
            changefreq = 'daily';
          } else if (page === 'services' || page === 'contact' || page === 'rendez-vous') {
            priority = '0.9';
            changefreq = 'weekly';
          } else if (page === 'a-propos') {
            priority = '0.8';
            changefreq = 'monthly';
          } else if (page === 'maison' || page === 'sattva' || page === 'aia') {
            priority = '0.8';
            changefreq = 'monthly';
          } else if (page.startsWith('accompagnements/')) {
            priority = '0.8';
            changefreq = 'monthly';
          } else if (page === 'blog') {
            priority = '0.7';
            changefreq = 'weekly';
          } else if (page === 'boutique') {
            priority = '0.6';
            changefreq = 'weekly';
          } else if (page.includes('mentions-legales') || page.includes('politique-confidentialite') || page.includes('cgv')) {
            priority = '0.3';
            changefreq = 'yearly';
          }
          
          return `
          <url>
            <loc>${new URL(page, site).toString()}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
          </url>
        `;
        })
        .join('')}
      ${posts
        .map((post) => {
          const lastmod = post.updated_at || post.published_at || new Date().toISOString();
          return `
          <url>
            <loc>${new URL(`blog/${post.slug}`, site).toString()}</loc>
            <lastmod>${new Date(lastmod).toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
          </url>
        `;
        })
        .join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
