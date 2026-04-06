export const prerender = false;

import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const VIEW_DEDUPLICATION_WINDOW_HOURS = 24;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_KEY est requis pour le suivi des vues');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

const buildVisitorFingerprint = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent') || 'unknown-agent';
  const rawIp = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown-ip';
  const source = `${rawIp}::${userAgent}`;
  return createHash('sha256').update(source).digest('hex');
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';

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

    const visitorFingerprint = buildVisitorFingerprint(request);
    const cutoffDate = new Date(Date.now() - VIEW_DEDUPLICATION_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    const { data: existingView, error: existingViewError } = await supabaseAdmin
      .from('post_views')
      .select('id')
      .eq('post_id', post.id)
      .eq('visitor_fingerprint', visitorFingerprint)
      .gte('created_at', cutoffDate)
      .limit(1)
      .maybeSingle();

    if (existingViewError) {
      return new Response(JSON.stringify({ error: 'Erreur lors de la vérification des vues' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let counted = false;
    if (!existingView) {
      const { error: insertError } = await supabaseAdmin
        .from('post_views')
        .insert({
          post_id: post.id,
          visitor_fingerprint: visitorFingerprint
        });

      if (insertError) {
        return new Response(JSON.stringify({ error: 'Erreur lors de l\'enregistrement de la vue' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      counted = true;
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

    return new Response(JSON.stringify({ views: count ?? 0, counted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Requête invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
