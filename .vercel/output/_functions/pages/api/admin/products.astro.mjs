export { renderers } from '../../../renderers.mjs';

const post = async ({ request, locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession();
  if (!session?.user || session.user.email !== "tyzranaima@gmail.com") {
    return new Response(JSON.stringify({ error: "Non autorisé" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const data = await request.formData();
    const title = data.get("title");
    const description = data.get("description");
    const price = parseFloat(data.get("price"));
    const category = data.get("category");
    const pdf = data.get("pdf");
    const pdfPath = `guides/${pdf.name}`;
    const { error: uploadError } = await locals.supabase.storage.from("pdfs").upload(pdfPath, pdf, {
      cacheControl: "3600",
      upsert: false
    });
    if (uploadError) throw uploadError;
    const { error: insertError } = await locals.supabase.from("products").insert({
      title,
      description,
      price,
      category,
      pdf_path: pdfPath
    });
    if (insertError) throw insertError;
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    post
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
