export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function setCookie(name: string, value: string, options: { path?: string; maxAge?: number; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}) {
  if (typeof document === 'undefined') return;

  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 semaine par défaut
    secure: true,
    sameSite: 'lax' as const,
    ...options
  };

  const cookieString = `${name}=${value}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}${cookieOptions.secure ? '; secure' : ''}; samesite=${cookieOptions.sameSite}`;
  document.cookie = cookieString;
}
