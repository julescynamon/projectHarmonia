import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { Database } from '../types/supabase';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export async function isDayBlocked(date: string): Promise<boolean> {
  try {
    const { data: blockedTimes, error: blockedError } = await supabase
      .from('blocked_times')
      .select('*')
      .lte('start_date', date)
      .gte('end_date', date);

    if (blockedError) {
      console.error('Erreur lors de la vérification du jour bloqué:', blockedError);
      return false;
    }

    // Vérifier si une plage couvre toute la journée (00:00 à 23:59)
    if (blockedTimes && blockedTimes.length > 0) {
      for (const block of blockedTimes) {
        // Si la plage commence à 00:00 et finit à 23:59, c'est une journée entière bloquée
        if (block.start_time === '00:00' && block.end_time === '23:59') {
          return true;
        }
        
        // Si la plage couvre toute la journée de travail (par exemple 09:00 à 18:00)
        // on peut considérer que c'est une journée entière bloquée
        if (block.start_time === '09:00' && block.end_time === '18:00') {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du jour:', error);
    return false;
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
      from: 'La Maison Sattvaïa <notifications@la-maison-sattvaia.com>',
      to: 'naima@la-maison-sattvaia.com',
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
      location: "Cabinet La Maison Sattvaïa"
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
      from: 'La Maison Sattvaïa <notifications@la-maison-sattvaia.com>',
      to: 'naima@la-maison-sattvaia.com',
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
