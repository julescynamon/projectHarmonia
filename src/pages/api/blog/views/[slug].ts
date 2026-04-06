export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_KEY est requis pour la lecture des vues');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

export const GET: APIRoute = async ({ params }) => {
  const slug = typeof params.slug === 'string' ? params.slug.trim() : '';

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug requis' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { data: post, error: postError } = await supabaseAdmin
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (postError || !post) {
    return new Response(JSON.stringify({ error: 'Article introuvable' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { count, error: countError } = await supabaseAdmin
    .from('post_views')
    .select('id', { count: 'exact', head: true })
    .eq('post_id', post.id);

  if (countError) {
    return new Response(JSON.stringify({ error: 'Erreur lors du calcul des vues' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ views: count ?? 0 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
