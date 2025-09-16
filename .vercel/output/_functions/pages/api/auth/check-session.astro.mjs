import { createHmac } from 'crypto';
import { c as createServerClient } from '../../../chunks/supabase_CXSvBnpz.mjs';
import { c as createContextLogger, l as logError } from '../../../chunks/logger_NznGTdCm.mjs';
export { renderers } from '../../../renderers.mjs';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
if (!JWT_SECRET) {
  console.error("ATTENTION: SUPABASE_JWT_SECRET n'est pas défini dans les variables d'environnement");
}
function verifyJwtSignature(token) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET n'est pas défini");
    return false;
  }
  try {
    const [header, payload, signature] = token.split(".");
    const expectedSignature = createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    const isValid = signature === expectedSignature;
    if (!isValid) {
      console.error("Signature JWT invalide");
    }
    return isValid;
  } catch (error) {
    console.error("Erreur lors de la vérification de la signature:", error);
    return false;
  }
}
function extractAndVerifySession(cookies) {
  if (!cookies) {
    return null;
  }
  const authTokenMatch = cookies.match(/supabase\.auth\.token=([^;]+)/);
  const sbAccessTokenMatch = cookies.match(/sb-access-token=([^;]+)/);
  cookies.match(/sb-refresh-token=([^;]+)/);
  let tokenData = null;
  let token = "";
  if (authTokenMatch) {
    try {
      const decodedCookie = decodeURIComponent(authTokenMatch[1]);
      tokenData = JSON.parse(decodedCookie);
      token = tokenData.access_token;
    } catch (e) {
      console.error("Erreur de décodage du cookie principal:", e);
    }
  } else if (sbAccessTokenMatch) {
    token = decodeURIComponent(sbAccessTokenMatch[1]);
  }
  if (!token) {
    return null;
  }
  try {
    if (!verifyJwtSignature(token)) {
      console.error("Signature du token invalide");
      return null;
    }
    const [header, payload, signature] = token.split(".");
    if (!payload) {
      console.error("Format de token invalide");
      return null;
    }
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const now = Math.floor(Date.now() / 1e3);
    if (decodedPayload.exp < now) {
      console.error("Token expiré");
      return null;
    }
    if (!decodedPayload.sub || !decodedPayload.email) {
      console.error("Token invalide: champs requis manquants");
      return null;
    }
    return {
      user: {
        id: decodedPayload.sub,
        email: decodedPayload.email || "",
        user_metadata: decodedPayload.user_metadata || {},
        role: decodedPayload.role
      },
      session: {
        access_token: token,
        expires_at: decodedPayload.exp
      }
    };
  } catch (e) {
    console.error("Erreur lors de la vérification de la session:", e);
    return null;
  }
}

const GET = async ({ request, cookies: astroCookies }) => {
  const startTime = Date.now();
  const logContext = {
    path: "/api/auth/check-session",
    method: "GET",
    userAgent: request.headers.get("user-agent") || "Unknown",
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"
  };
  const requestLogger = createContextLogger(logContext);
  try {
    requestLogger.info({
      message: "Vérification de session démarrée"
    });
    const cookiesHeader = request.headers.get("cookie");
    const cookiesList = cookiesHeader ? cookiesHeader.split(";").map((c) => c.trim()) : [];
    const supabaseAuthToken = cookiesList.find((c) => c.startsWith("supabase.auth.token="));
    const sbAccessToken = cookiesList.find((c) => c.startsWith("sb-access-token="));
    const sbRefreshToken = cookiesList.find((c) => c.startsWith("sb-refresh-token="));
    const decodedSession = extractAndVerifySession(cookiesHeader);
    const supabase = createServerClient(cookiesHeader);
    const { data: supabaseSession, error: supabaseError } = await supabase.auth.getSession();
    if (supabaseError) {
      requestLogger.warn({
        message: "Erreur Supabase lors de la vérification de session",
        error: {
          message: supabaseError.message,
          status: supabaseError.status
        }
      });
    }
    if (!decodedSession && !supabaseSession?.session) {
      const duration2 = Date.now() - startTime;
      requestLogger.info({
        message: "Session invalide ou expirée",
        duration: `${duration2}ms`,
        cookiesPresent: {
          supabaseAuthToken: !!supabaseAuthToken,
          sbAccessToken: !!sbAccessToken,
          sbRefreshToken: !!sbRefreshToken
        }
      });
      return new Response(JSON.stringify({
        isAuthenticated: false,
        error: "Invalid or expired session",
        cookiesPresent: {
          supabaseAuthToken: !!supabaseAuthToken,
          sbAccessToken: !!sbAccessToken,
          sbRefreshToken: !!sbRefreshToken
        },
        message: "Aucune session valide trouvée"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const validSession = supabaseSession?.session || decodedSession;
    const userId = supabaseSession?.session?.user?.id || decodedSession?.user?.id;
    const duration = Date.now() - startTime;
    requestLogger.info({
      message: "Session vérifiée avec succès",
      duration: `${duration}ms`,
      sessionSource: supabaseSession?.session ? "supabase" : "decoded",
      userId,
      cookiesPresent: {
        supabaseAuthToken: !!supabaseAuthToken,
        sbAccessToken: !!sbAccessToken,
        sbRefreshToken: !!sbRefreshToken
      }
    });
    return new Response(JSON.stringify({
      isAuthenticated: true,
      sessionSource: supabaseSession?.session ? "supabase" : "decoded",
      userId,
      email: validSession?.user?.email,
      cookiesPresent: {
        supabaseAuthToken: !!supabaseAuthToken,
        sbAccessToken: !!sbAccessToken,
        sbRefreshToken: !!sbRefreshToken
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(error instanceof Error ? error : new Error(String(error)), {
      ...logContext,
      duration: `${duration}ms`,
      message: "Erreur lors de la vérification de session"
    });
    return new Response(JSON.stringify({
      isAuthenticated: false,
      error: "Internal server error",
      message: "Erreur interne du serveur"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
