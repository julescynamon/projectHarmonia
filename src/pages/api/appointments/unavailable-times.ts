import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { date } = await request.json();
    const supabase = locals.supabase;

    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date requise' }),
        { status: 400 }
      );
    }

    // Récupérer tous les créneaux indisponibles pour la date donnée
    const { data: unavailableAppointments, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .in('status', ['pending_approval', 'pending', 'confirmed']);

    if (error) {
      console.error('Erreur lors de la récupération des créneaux indisponibles:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification' }),
        { status: 500 }
      );
    }

    // Extraire les horaires indisponibles
    const unavailableTimes = unavailableAppointments?.map(appointment => appointment.time) || [];

    return new Response(
      JSON.stringify({
        unavailableTimes,
        date
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur dans unavailable-times:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la vérification' }),
      { status: 500 }
    );
  }
};
