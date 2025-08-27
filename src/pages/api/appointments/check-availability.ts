import type { APIRoute } from 'astro';
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { date, time } = await request.json();
    const supabase = locals.supabase;

    // Vérifier si le créneau est déjà réservé (pending_approval, pending ou confirmed)
    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .in('status', ['pending_approval', 'pending', 'confirmed'])
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Erreur lors de la vérification' }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        available: !existingAppointments || existingAppointments.length === 0,
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
