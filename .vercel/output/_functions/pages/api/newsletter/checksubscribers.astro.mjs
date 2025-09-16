import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
export { renderers } from '../../../renderers.mjs';

const supabase = createClient(
  "https://hvthtebjvmutuvzvttdb.supabase.co",
  process.env.SUPABASE_SERVICE_KEY
);
const GET = async () => {
  try {
    const { data: subscribers, error } = await supabase.from("newsletter_subscribers").select("*").eq("confirmed", true).eq("unsubscribed", false);
    if (error) throw error;
    return new Response(JSON.stringify({ subscribers }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération des abonnés" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
