import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { date, time, serviceId } = await request.json();
    const supabase = createServerClient();

    // Vérifier si le créneau est déjà réservé
    const { data: existingAppointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'confirmed')
      .single();

    if (error && error.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Erreur lors de la vérification' }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        available: !existingAppointment,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la vérification' }),
      { status: 500 }
    );
  }
}
