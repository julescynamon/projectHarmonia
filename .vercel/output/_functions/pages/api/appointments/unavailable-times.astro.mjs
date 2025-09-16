export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const { date } = await request.json();
    const supabase = locals.supabase;
    if (!date) {
      return new Response(
        JSON.stringify({ error: "Date requise" }),
        { status: 400 }
      );
    }
    const { data: unavailableAppointments, error: appointmentsError } = await supabase.from("appointments").select("time").eq("date", date).in("status", ["pending_approval", "pending", "confirmed"]);
    if (appointmentsError) {
      console.error("Erreur lors de la récupération des créneaux indisponibles:", appointmentsError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la vérification" }),
        { status: 500 }
      );
    }
    const { data: blockedPeriods, error: blockedError } = await supabase.from("blocked_times").select("start_time, end_time, reason, start_date, end_date").lte("start_date", date).gte("end_date", date);
    if (blockedError) {
      console.error("Erreur lors de la récupération des périodes bloquées:", blockedError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la vérification" }),
        { status: 500 }
      );
    }
    const unavailableTimes = unavailableAppointments?.map((appointment) => appointment.time) || [];
    if (blockedPeriods && blockedPeriods.length > 0) {
      for (const period of blockedPeriods) {
        const isFullDayBlock = (period.start_time === "00:00" || period.start_time === "00:00:00") && (period.end_time === "23:59" || period.end_time === "23:59:00");
        if (isFullDayBlock) {
          const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
          for (const slot of timeSlots) {
            const normalizedSlot = slot + ":00";
            if (!unavailableTimes.includes(normalizedSlot)) {
              unavailableTimes.push(normalizedSlot);
            }
          }
        } else {
          const startTime = /* @__PURE__ */ new Date(`2000-01-01T${period.start_time}`);
          const endTime = /* @__PURE__ */ new Date(`2000-01-01T${period.end_time}`);
          const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
          for (const slot of timeSlots) {
            const slotTime = /* @__PURE__ */ new Date(`2000-01-01T${slot}`);
            const normalizedSlot = slot + ":00";
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
    console.error("Erreur dans unavailable-times:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la vérification" }),
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
