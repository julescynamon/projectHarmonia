export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_KEY!
);

export const GET: APIRoute = async () => {
  try {
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('confirmed', true)
      .eq('unsubscribed', false);

    if (error) throw error;

    return new Response(JSON.stringify({ subscribers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des abonnés' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
