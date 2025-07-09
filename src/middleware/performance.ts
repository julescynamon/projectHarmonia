// src/middleware/performance.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  
  // Optimisation des en-têtes de performance
  const headers = new Headers(response.headers);
  
  // En-têtes de cache pour les assets statiques
  if (context.url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|avif|woff2|woff|ttf|eot)$/)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 an
    headers.set('Vary', 'Accept-Encoding');
  }
  
  // En-têtes de cache pour les pages HTML
  else if (context.url.pathname.match(/\.html$/) || !context.url.pathname.includes('.')) {
    headers.set('Cache-Control', 'public, max-age=3600, must-revalidate'); // 1 heure
  }
  
  // En-têtes de compression
  const acceptEncoding = context.request.headers.get('accept-encoding') || '';
  
  if (acceptEncoding.includes('br')) {
    headers.set('Content-Encoding', 'br');
  } else if (acceptEncoding.includes('gzip')) {
    headers.set('Content-Encoding', 'gzip');
  }
  
  // En-têtes de performance
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // En-têtes de sécurité supplémentaires
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // En-têtes de performance pour les polices
  if (context.url.pathname.match(/\.(woff2|woff|ttf|eot)$/)) {
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Timing-Allow-Origin', '*');
  }
  
  // En-têtes de performance pour les images
  if (context.url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) {
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  // En-têtes de performance pour les scripts et styles
  if (context.url.pathname.match(/\.(js|css)$/)) {
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}; 