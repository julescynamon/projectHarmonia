export const prerender = false;

import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  try {
    if (!params.slug) {
      // Retourner tous les articles
      const allPosts = await getCollection('blog');
      return new Response(JSON.stringify(allPosts), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Retourner un article spécifique
    const post = await getEntry('blog', params.slug);
    if (!post) {
      return new Response(JSON.stringify({ error: 'Article non trouvé' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
