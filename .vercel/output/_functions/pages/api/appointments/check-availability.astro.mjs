export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const { date, time } = await request.json();
    const supabase = locals.supabase;
    const { data: existingAppointments, error } = await supabase.from("appointments").select("*").eq("date", date).eq("time", time).in("status", ["pending_approval", "pending", "confirmed"]).limit(1);
    if (error && error.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: "Erreur lors de la vérification" }), {
        status: 500
      });
    }
    return new Response(
      JSON.stringify({
        available: !existingAppointments || existingAppointments.length === 0
      }),
      { status: 200 }
    );
  } catch (error) {
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
