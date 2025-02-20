import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export async function isDayBlocked(date: string): Promise<boolean> {
  try {
    console.log('Vérification si le jour est bloqué:', date);

    const { data: blockedTimes, error: blockedError } = await supabase
      .from('blocked_times')
      .select('*')
      .lte('start_date', date)
      .gte('end_date', date)
      .lte('start_time', '09:00')
      .gte('end_time', '19:00');

    if (blockedError) {
      console.error('Erreur lors de la vérification du jour bloqué:', blockedError);
      throw blockedError;
    }

    console.log('Résultat de la vérification du jour:', blockedTimes);
    
    // Vérifier si au moins un bloc couvre toute la journée de travail
    if (blockedTimes && blockedTimes.length > 0) {
      for (const block of blockedTimes) {
        if (block.start_time <= '09:00' && block.end_time >= '19:00') {
          console.log('Journée entière bloquée:', block);
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du jour:', error);
    throw error;
  }
}

export async function checkAvailability(date: string, time: string): Promise<boolean> {
  try {
    console.log('Vérification de disponibilité pour:', { date, time });

    // Vérifier les rendez-vous existants
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time', time);

    if (appointmentsError) {
      console.error('Erreur lors de la vérification des rendez-vous:', appointmentsError);
      throw appointmentsError;
    }

    console.log('Rendez-vous existants:', appointments);

    // Vérifier les plages bloquées
    const { data: blockedTimes, error: blockedError } = await supabase
      .from('blocked_times')
      .select('*')
      .lte('start_date', date)
      .gte('end_date', date);

    if (blockedError) {
      console.error('Erreur lors de la vérification des plages bloquées:', blockedError);
      throw blockedError;
    }

    console.log('Plages bloquées trouvées:', blockedTimes);

    // Si des rendez-vous existent déjà pour ce créneau
    if (appointments && appointments.length > 0) {
      console.log(`Créneau ${date} ${time} déjà réservé par:`, appointments);
      return false;
    }

    // Vérifier si l'horaire est dans une plage bloquée
    if (blockedTimes && blockedTimes.length > 0) {
      console.log('Vérification des plages bloquées:', blockedTimes);
      
      for (const block of blockedTimes) {
        console.log('Vérification de la plage:', {
          start_date: block.start_date,
          end_date: block.end_date,
          start_time: block.start_time,
          end_time: block.end_time
        });

        // Convertir les heures en minutes pour faciliter la comparaison
        const [blockStartHour, blockStartMin] = block.start_time.split(':').map(Number);
        const [blockEndHour, blockEndMin] = block.end_time.split(':').map(Number);
        const [timeHour, timeMin] = time.split(':').map(Number);

        const blockStartMinutes = blockStartHour * 60 + blockStartMin;
        const blockEndMinutes = blockEndHour * 60 + blockEndMin;
        const timeMinutes = timeHour * 60 + timeMin;

        console.log('Comparaison des minutes:', {
          blockStart: blockStartMinutes,
          blockEnd: blockEndMinutes,
          time: timeMinutes
        });

        if (timeMinutes >= blockStartMinutes && timeMinutes <= blockEndMinutes) {
          console.log(`Créneau ${date} ${time} dans une période bloquée:`, block);
          return false;
        }
      }
    }

    console.log(`Créneau ${date} ${time} disponible`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification des disponibilités:', error);
    throw error;
  }
}

export async function sendAppointmentNotification(
  appointment: {
    date: string;
    time: string;
    service: string;
    clientName: string;
    clientEmail: string;
  }
) {
  try {
    // Envoyer l'email via Resend
    await resend.emails.send({
      from: 'Harmonia <notifications@harmonia-naturo.com>',
      to: 'naima@harmonia-naturo.com',
      subject: 'Nouveau rendez-vous',
      html: `
        <h2>Nouveau rendez-vous confirmé</h2>
        <p>Un nouveau rendez-vous a été pris pour :</p>
        <ul>
          <li>Date : ${appointment.date}</li>
          <li>Heure : ${appointment.time}</li>
          <li>Service : ${appointment.service}</li>
          <li>Client : ${appointment.clientName}</li>
          <li>Email : ${appointment.clientEmail}</li>
        </ul>
      `,
    });

    // Générer le lien du calendrier iOS
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 90 * 60000); // +90 minutes par défaut

    const icsData = {
      title: `RDV ${appointment.service} - ${appointment.clientName}`,
      description: `Rendez-vous avec ${appointment.clientName}\nEmail: ${appointment.clientEmail}`,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      location: "Cabinet Harmonia"
    };

    // Créer le lien calendrier iOS
    const calendarLink = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${icsData.title}
DTSTART:${icsData.startTime.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${icsData.endTime.replace(/[-:]/g, '').split('.')[0]}Z
DESCRIPTION:${icsData.description}
LOCATION:${icsData.location}
END:VEVENT
END:VCALENDAR`;

    // Envoyer le lien du calendrier par email
    await resend.emails.send({
      from: 'Harmonia <notifications@harmonia-naturo.com>',
      to: 'naima@harmonia-naturo.com',
      subject: 'Ajouter le rendez-vous à votre calendrier',
      html: `
        <p>Cliquez sur le lien ci-dessous pour ajouter le rendez-vous à votre calendrier :</p>
        <a href="${calendarLink}">Ajouter au calendrier</a>
      `,
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    throw error;
  }
}
