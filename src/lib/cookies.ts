export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

interface CookieOptions {
  path?: string;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
  domain?: string;
}

export function setCookie(
  name: string, 
  value: string, 
  options: CookieOptions = {}
) {
  if (typeof document === 'undefined') return;

  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 semaine par défaut
    secure: true,
    sameSite: 'strict' as const,
    httpOnly: true,
    ...options
  };

  // Construire la chaîne de cookie avec toutes les options de sécurité
  const cookieParts = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${cookieOptions.path}`,
    `max-age=${cookieOptions.maxAge}`,
    cookieOptions.secure ? 'secure' : '',
    `samesite=${cookieOptions.sameSite}`,
    cookieOptions.httpOnly ? 'httponly' : '',
    cookieOptions.domain ? `domain=${cookieOptions.domain}` : ''
  ].filter(Boolean);

  document.cookie = cookieParts.join('; ');
}

export function deleteCookie(name: string, options: CookieOptions = {}) {
  setCookie(name, '', { ...options, maxAge: 0 });
}
