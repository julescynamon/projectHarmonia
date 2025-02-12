import type { APIRoute } from 'astro';
import { getProducts } from '../../lib/shop';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const products = await getProducts({
      category: searchParams.get('category') || undefined,
      search: searchParams.get('q') || undefined,
      sort: searchParams.get('sort') || 'newest',
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null,
    });

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Ajouter des en-têtes de cache pour optimiser les performances
        'Cache-Control': 'public, max-age=10', // Cache pendant 10 secondes
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};