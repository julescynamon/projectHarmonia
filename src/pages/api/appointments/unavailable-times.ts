import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { date } = await request.json();
    
    // Utiliser le client Supabase avec les bonnes permissions
    const supabase = locals.supabase;
    


    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date requise' }),
        { status: 400 }
      );
    }

    // Récupérer tous les créneaux indisponibles pour la date donnée (rendez-vous existants)
    const { data: unavailableAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .in('status', ['pending_approval', 'pending', 'confirmed']);

    if (appointmentsError) {
      console.error('Erreur lors de la récupération des créneaux indisponibles:', appointmentsError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification' }),
        { status: 500 }
      );
    }

    // Récupérer les périodes bloquées par l'admin pour cette date
    const { data: blockedPeriods, error: blockedError } = await supabase
      .from('blocked_times')
      .select('start_time, end_time, reason, start_date, end_date')
      .lte('start_date', date)
      .gte('end_date', date);
    
    if (blockedError) {
      console.error('Erreur lors de la récupération des périodes bloquées:', blockedError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification' }),
        { status: 500 }
      );
    }
    


    // Extraire les horaires indisponibles des rendez-vous et normaliser le format
    const unavailableTimes = unavailableAppointments?.map(appointment => appointment.time) || [];

    // Ajouter les créneaux bloqués par l'admin
    if (blockedPeriods && blockedPeriods.length > 0) {
      for (const period of blockedPeriods) {
        // Vérifier si c'est un blocage de journée entière (vacances)
        const isFullDayBlock = (period.start_time === '00:00' || period.start_time === '00:00:00') && 
                              (period.end_time === '23:59' || period.end_time === '23:59:00');
        
        if (isFullDayBlock) {
          // Bloquer tous les créneaux de la journée
          const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
          for (const slot of timeSlots) {
            const normalizedSlot = slot + ':00';
            if (!unavailableTimes.includes(normalizedSlot)) {
              unavailableTimes.push(normalizedSlot);
            }
          }
        } else {
          // Blocage partiel (créneaux spécifiques)
          const startTime = new Date(`2000-01-01T${period.start_time}`);
          const endTime = new Date(`2000-01-01T${period.end_time}`);
          
          // Créneaux disponibles (toutes les 1h30)
          const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
          
          for (const slot of timeSlots) {
            const slotTime = new Date(`2000-01-01T${slot}`);
            const normalizedSlot = slot + ':00';
            
            if (slotTime >= startTime && slotTime < endTime) {
              if (!unavailableTimes.includes(normalizedSlot)) {
                unavailableTimes.push(normalizedSlot);
              }
            }
          }
        }
      }
    }

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
