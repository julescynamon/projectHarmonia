export const prerender = false;

// src/pages/api/admin/appointments/list.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    // Vérification de l'authentification admin
    const session = locals.session;
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401 }
      );
    }

    // Vérification du rôle admin avec fallback pour l'admin principal
    const { data: profile, error: profileError } = await locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Vérification spéciale pour l'admin principal (tyzranaima@gmail.com)
    const isMainAdmin = session.user.email === 'tyzranaima@gmail.com';

    if (!isMainAdmin && (profileError || !profile || profile.role !== 'admin')) {
      return new Response(
        JSON.stringify({ error: 'Accès refusé' }),
        { status: 403 }
      );
    }

    // Récupération des paramètres de filtrage
    const searchParams = url.searchParams;
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const clientSearch = searchParams.get('client');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Construction de la requête
    let query = locals.supabase
      .from('appointments')
      .select(`
        *,
        services (
          title,
          price
        )
      `, { count: 'exact' });

    // Application des filtres
    if (status) {
      query = query.eq('status', status);
    }

    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('date', dateTo);
    }

    if (clientSearch) {
      query = query.or(`client_name.ilike.%${clientSearch}%,client_email.ilike.%${clientSearch}%`);
    }

    // Tri par date de création (plus récent en premier)
    query = query.order('created_at', { ascending: false });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    // Exécution de la requête
    const { data: appointments, error, count } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des données' }),
        { status: 500 }
      );
    }

    // Calcul des métadonnées de pagination
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
          hasPrevPage,
        },
        filters: {
          status,
          dateFrom,
          dateTo,
          clientSearch,
        },
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500 }
    );
  }
};
