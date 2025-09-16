import { b as sendAppointmentNotificationEmail, c as sendAppointmentConfirmationEmail } from '../../../chunks/email-service_goO0ss9z.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { date, time, serviceId, email, name, reason } = body;
    const supabase = locals.supabase;
    const { data: existingAppointments, error: availabilityError } = await supabase.from("appointments").select("*").eq("date", date).eq("time", time).in("status", ["pending_approval", "pending", "confirmed"]);
    if (existingAppointments && existingAppointments.length > 0) {
      return new Response(
        JSON.stringify({ error: "Ce créneau n'est plus disponible" }),
        { status: 400 }
      );
    }
    if (availabilityError) {
      console.error("Erreur lors de la vérification de disponibilité:", availabilityError);
    }
    const { data: service, error: serviceError } = await supabase.from("services").select("*").eq("id", serviceId).single();
    if (!service) {
      return new Response(
        JSON.stringify({ error: "Service non trouvé" }),
        { status: 404 }
      );
    }
    if (serviceError) {
      console.error("Erreur lors de la récupération du service:", serviceError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération du service" }),
        { status: 500 }
      );
    }
    const appointmentData = {
      date,
      time,
      service_id: serviceId,
      client_email: email,
      client_name: name,
      reason: reason || null,
      status: "pending_approval"
    };
    const { data: appointment, error } = await supabase.from("appointments").insert(appointmentData).select().single();
    if (error) {
      console.error("Erreur Supabase lors de la création du rendez-vous:", error);
      return new Response(
        JSON.stringify({
          error: "Erreur lors de la création du rendez-vous",
          details: error.message || "Erreur inconnue",
          code: error.code || "UNKNOWN"
        }),
        { status: 500 }
      );
    }
    try {
      await sendAppointmentNotificationEmail({
        appointment: {
          id: appointment.id,
          date: appointment.date,
          time: appointment.time,
          client_name: appointment.client_name,
          client_email: appointment.client_email,
          reason: appointment.reason
        },
        service: {
          title: service.title,
          price: service.price,
          duration: service.duration || "1h"
        }
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email admin:", emailError);
    }
    try {
      await sendAppointmentConfirmationEmail({
        appointment: {
          id: appointment.id,
          date: appointment.date,
          time: appointment.time,
          client_name: appointment.client_name,
          client_email: appointment.client_email,
          reason: appointment.reason
        },
        service: {
          title: service.title,
          price: service.price,
          duration: service.duration || "1h"
        }
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email client:", emailError);
    }
    return new Response(
      JSON.stringify({
        success: true,
        appointmentId: appointment.id,
        message: "Votre demande de réservation a été enregistrée. Vous recevrez un email de confirmation."
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error);
    let errorMessage = "Erreur lors de la création du rendez-vous";
    let errorDetails = "";
    if (error instanceof Error) {
      errorDetails = error.message;
    } else {
      errorDetails = String(error);
    }
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails
      }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
