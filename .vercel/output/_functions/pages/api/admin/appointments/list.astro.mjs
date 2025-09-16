export { renderers } from '../../../../renderers.mjs';

const GET = async ({ url, locals }) => {
  try {
    const session = locals.session;
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }
    const { data: profile, error: profileError } = await locals.supabase.from("profiles").select("role").eq("id", session.user.id).single();
    const isMainAdmin = session.user.email === "tyzranaima@gmail.com";
    if (!isMainAdmin && (profileError || !profile || profile.role !== "admin")) {
      return new Response(
        JSON.stringify({ error: "Accès refusé" }),
        { status: 403 }
      );
    }
    const searchParams = url.searchParams;
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const clientSearch = searchParams.get("client");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    let query = locals.supabase.from("appointments").select(`
        *,
        services (
          title,
          price
        )
      `, { count: "exact" });
    if (status) {
      query = query.eq("status", status);
    }
    if (dateFrom) {
      query = query.gte("date", dateFrom);
    }
    if (dateTo) {
      query = query.lte("date", dateTo);
    }
    if (clientSearch) {
      query = query.or(`client_name.ilike.%${clientSearch}%,client_email.ilike.%${clientSearch}%`);
    }
    query = query.order("created_at", { ascending: false });
    query = query.range(offset, offset + limit - 1);
    const { data: appointments, error, count } = await query;
    if (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération des données" }),
        { status: 500 }
      );
    }
    const totalPages = count ? Math.ceil(count / limit) : 0;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    return new Response(
      JSON.stringify({
        success: true,
        data: appointments || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          status,
          dateFrom,
          dateTo,
          clientSearch
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
