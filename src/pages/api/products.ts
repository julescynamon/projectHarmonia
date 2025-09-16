export const prerender = false;

import type { APIRoute } from 'astro';
import { getProducts } from '../../lib/shop';
import { monitoring } from '../../lib/monitoring';

const productsHandler = async ({ request, locals }: { request: Request; locals: any }) => {
  const transaction = monitoring.startTransaction('get_products', 'http.server', {
    userId: locals?.user?.id,
    action: 'get_products',
    metadata: { 
      endpoint: '/api/products',
      url: request.url 
    }
  });

  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Ajouter un span pour la récupération des paramètres
    const paramsSpan = monitoring.addSpan('parse_parameters', 'http.server', {
      category: searchParams.get('category'),
      search: searchParams.get('q'),
      sort: searchParams.get('sort'),
      hasMinPrice: !!searchParams.get('minPrice'),
      hasMaxPrice: !!searchParams.get('maxPrice'),
    });

    const products = await getProducts({
      category: searchParams.get('category') || undefined,
      search: searchParams.get('q') || undefined,
      sort: searchParams.get('sort') || 'newest',
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null,
    });

    if (paramsSpan) {
      paramsSpan.finish();
    }

    if (transaction) {
      transaction.setTag('products_count', products.length);
      transaction.setTag('has_filters', !!(searchParams.get('category') || searchParams.get('q') || searchParams.get('minPrice') || searchParams.get('maxPrice')));
      transaction.finish();
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Ajouter des en-têtes de cache pour optimiser les performances
        'Cache-Control': 'public, max-age=10', // Cache pendant 10 secondes
      },
    });
  } catch (error) {
    monitoring.captureError(error as Error, {
      userId: locals?.user?.id,
      action: 'get_products',
      metadata: { 
        endpoint: '/api/products',
        url: request.url 
      }
    });

    if (transaction) {
      transaction.setTag('status', 'error');
      transaction.finish();
    }

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const GET = productsHandler;