import type { Session, User } from '@supabase/supabase-js';

export interface DecodedSession {
  user: {
    id: string;
    email: string;
    user_metadata: any;
    role?: string;
  };
  session: {
    access_token: string;
    expires_at: number;
  };
}

export function extractAndVerifySession(cookies: string | null): DecodedSession | null {
  if (!cookies) return null;

  // Extraction du token - supporte plusieurs formats de cookies
  const authTokenMatch = cookies.match(/supabase\.auth\.token=([^;]+)/);
  const sbAccessTokenMatch = cookies.match(/sb-access-token=([^;]+)/);
  const sbRefreshTokenMatch = cookies.match(/sb-refresh-token=([^;]+)/);
  
  // Priorité au format principal, puis aux formats alternatifs
  let tokenData: any = null;
  let token: string = '';
  
  if (authTokenMatch) {
    try {
      // Format JSON encodé en URL
      const decodedCookie = decodeURIComponent(authTokenMatch[1]);
      tokenData = JSON.parse(decodedCookie);
      token = tokenData.access_token;
      console.log('Session trouvée via supabase.auth.token');
    } catch (e) {
      console.log('Erreur de décodage du cookie principal:', e);
    }
  } else if (sbAccessTokenMatch) {
    // Format alternatif utilisé par Supabase v2+
    token = decodeURIComponent(sbAccessTokenMatch[1]);
    console.log('Session trouvée via sb-access-token');
  }
  
  if (!token) {
    console.log('Aucun token valide trouvé dans les cookies');
    return null;
  }

  try {
    // Décode le JWT
    const [header, payload, signature] = token.split('.');
    if (!payload) {
      console.log('Format de token invalide');
      return null;
    }
    
    // Décode le payload Base64
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

    // Vérifie si le token est expiré
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp < now) {
      console.log('Token expiré');
      return null;
    }

    // Retourne la session décodée
    return {
      user: {
        id: decodedPayload.sub,
        email: decodedPayload.email || '',
        user_metadata: decodedPayload.user_metadata || {},
        role: decodedPayload.role
      },
      session: {
        access_token: token,
        expires_at: decodedPayload.exp
      }
    };
  } catch (e) {
    console.error('Erreur lors de la vérification de la session:', e);
    return null;
  }
}

// Convertit notre session décodée en format Supabase pour la compatibilité
export function convertToSupabaseSession(decoded: DecodedSession): Session {
  return {
    access_token: decoded.session.access_token,
    token_type: 'bearer',
    expires_in: decoded.session.expires_at - Math.floor(Date.now() / 1000),
    expires_at: decoded.session.expires_at,
    refresh_token: '', // On n'a pas besoin du refresh token pour la vérification
    user: {
      id: decoded.user.id,
      aud: 'authenticated',
      email: decoded.user.email,
      role: decoded.user.role || 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmation_sent_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
        providers: ['email']
      },
      user_metadata: decoded.user.user_metadata,
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };
}
