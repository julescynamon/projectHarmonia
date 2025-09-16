import { d as defineMiddleware, s as sequence } from './chunks/index_DfICTfIP.mjs';
import { c as createClient } from './chunks/index_DeVVxtlF.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_CV4XAf8J.mjs';
import 'kleur/colors';
import './chunks/astro/server_BsvY2apF.mjs';
import 'clsx';
import 'cookie';

const DEFAULT_CACHE_CONFIG = {
  staticAssets: {
    maxAge: 31536e3},
  htmlPages: {
    maxAge: 3600},
  apiResponses: {
    maxAge: 300,
    // 5 minutes
    staleWhileRevalidate: 3600
    // 1 heure
  },
  images: {
    maxAge: 2592e3},
  fonts: {
    maxAge: 31536e3}
};
const onRequest$3 = async (context, next) => {
  const response = await next();
  if (!response) return response;
  const headers = new Headers(response.headers);
  const pathname = context.url.pathname;
  if (isStaticAsset(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.staticAssets;
    headers.set("Cache-Control", `public, max-age=${config.maxAge}${", immutable" }`);
    headers.set("Vary", "Accept-Encoding");
  } else if (isImage(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.images;
    headers.set("Cache-Control", `public, max-age=${config.maxAge}${", immutable" }`);
    headers.set("Vary", "Accept-Encoding");
  } else if (isFont(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.fonts;
    headers.set("Cache-Control", `public, max-age=${config.maxAge}${", immutable" }`);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Timing-Allow-Origin", "*");
  } else if (isApiEndpoint(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.apiResponses;
    headers.set("Cache-Control", `public, max-age=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`);
    headers.set("Vary", "Accept-Encoding, Accept");
  } else if (isHtmlPage(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.htmlPages;
    headers.set("Cache-Control", `public, max-age=${config.maxAge}${", must-revalidate" }`);
    headers.set("Vary", "Accept-Encoding");
  }
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  const acceptEncoding = context.request.headers.get("accept-encoding") || "";
  if (acceptEncoding.includes("br")) {
    headers.set("Content-Encoding", "br");
  } else if (acceptEncoding.includes("gzip")) {
    headers.set("Content-Encoding", "gzip");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
function isStaticAsset(pathname) {
  return /\.(js|css|map)$/i.test(pathname);
}
function isImage(pathname) {
  return /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i.test(pathname);
}
function isFont(pathname) {
  return /\.(woff2|woff|ttf|eot|otf)$/i.test(pathname);
}
function isApiEndpoint(pathname) {
  return pathname.startsWith("/api/");
}
function isHtmlPage(pathname) {
  return pathname.endsWith(".html") || !pathname.includes(".");
}

const DEFAULT_SECURITY_CONFIG = {
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        // Nécessaire pour Astro
        "'unsafe-eval'",
        // Nécessaire pour le développement
        "https://fonts.googleapis.com",
        "https://www.google-analytics.com",
        "https://www.googletagmanager.com",
        "https://js.stripe.com",
        "https://checkout.stripe.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        // Nécessaire pour Tailwind CSS
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
        "http:",
        // Pour les images externes
        "https://images.unsplash.com",
        "https://via.placeholder.com"
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com"
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "https://checkout.stripe.com",
        "https://*.supabase.co",
        "https://*.supabase.in",
        "wss://*.supabase.co",
        "wss://*.supabase.in",
        "https://www.google-analytics.com",
        "https://analytics.google.com"
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://checkout.stripe.com",
        "https://hooks.stripe.com"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: true,
      blockAllMixedContent: true
    }
  },
  basic: {
    xFrameOptions: "DENY",
    xContentTypeOptions: true,
    xXssProtection: true,
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: {
      camera: ["()"],
      microphone: ["()"],
      geolocation: ["()"],
      payment: ["()"],
      usb: ["()"],
      magnetometer: ["()"],
      gyroscope: ["()"],
      accelerometer: ["()"],
      ambientLightSensor: ["()"],
      autoplay: ["()"],
      encryptedMedia: ["()"],
      fullscreen: ["self"],
      pictureInPicture: ["()"]
    }
  },
  hsts: {
    enabled: true,
    maxAge: 31536e3,
    // 1 an
    includeSubDomains: true,
    preload: true
  },
  additional: {
    xDownloadOptions: true,
    xPermittedCrossDomainPolicies: true,
    crossOriginEmbedderPolicy: "unsafe-none",
    // Permet les images externes
    crossOriginOpenerPolicy: "same-origin",
    crossOriginResourcePolicy: "cross-origin"
    // Permet les ressources cross-origin
  }
};
class SecurityHeadersManager {
  static config = DEFAULT_SECURITY_CONFIG;
  static getConfig() {
    return this.config;
  }
  static updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  static generateHeaders() {
    const headers = {};
    const config = this.config;
    if (config.csp.enabled) {
      const cspDirectives = this.buildCSPDirectives(config.csp.directives);
      headers["Content-Security-Policy"] = cspDirectives;
    }
    if (config.basic.xFrameOptions) {
      headers["X-Frame-Options"] = config.basic.xFrameOptions;
    }
    if (config.basic.xContentTypeOptions) {
      headers["X-Content-Type-Options"] = "nosniff";
    }
    if (config.basic.xXssProtection) {
      headers["X-XSS-Protection"] = "1; mode=block";
    }
    if (config.basic.referrerPolicy) {
      headers["Referrer-Policy"] = config.basic.referrerPolicy;
    }
    const permissionsPolicy = this.buildPermissionsPolicy(config.basic.permissionsPolicy);
    if (permissionsPolicy) {
      headers["Permissions-Policy"] = permissionsPolicy;
    }
    if (config.hsts.enabled) {
      let hstsValue = `max-age=${config.hsts.maxAge}`;
      if (config.hsts.includeSubDomains) {
        hstsValue += "; includeSubDomains";
      }
      if (config.hsts.preload) {
        hstsValue += "; preload";
      }
      headers["Strict-Transport-Security"] = hstsValue;
    }
    if (config.additional.xDownloadOptions) {
      headers["X-Download-Options"] = "noopen";
    }
    if (config.additional.xPermittedCrossDomainPolicies) {
      headers["X-Permitted-Cross-Domain-Policies"] = "none";
    }
    if (config.additional.crossOriginEmbedderPolicy) {
      headers["Cross-Origin-Embedder-Policy"] = config.additional.crossOriginEmbedderPolicy;
    }
    if (config.additional.crossOriginOpenerPolicy) {
      headers["Cross-Origin-Opener-Policy"] = config.additional.crossOriginOpenerPolicy;
    }
    if (config.additional.crossOriginResourcePolicy) {
      headers["Cross-Origin-Resource-Policy"] = config.additional.crossOriginResourcePolicy;
    }
    return headers;
  }
  static buildCSPDirectives(directives) {
    const cspParts = [];
    if (directives.defaultSrc.length > 0) {
      cspParts.push(`default-src ${directives.defaultSrc.join(" ")}`);
    }
    if (directives.scriptSrc.length > 0) {
      cspParts.push(`script-src ${directives.scriptSrc.join(" ")}`);
    }
    if (directives.styleSrc.length > 0) {
      cspParts.push(`style-src ${directives.styleSrc.join(" ")}`);
    }
    if (directives.imgSrc.length > 0) {
      cspParts.push(`img-src ${directives.imgSrc.join(" ")}`);
    }
    if (directives.fontSrc.length > 0) {
      cspParts.push(`font-src ${directives.fontSrc.join(" ")}`);
    }
    if (directives.connectSrc.length > 0) {
      cspParts.push(`connect-src ${directives.connectSrc.join(" ")}`);
    }
    if (directives.frameSrc.length > 0) {
      cspParts.push(`frame-src ${directives.frameSrc.join(" ")}`);
    }
    if (directives.objectSrc.length > 0) {
      cspParts.push(`object-src ${directives.objectSrc.join(" ")}`);
    }
    if (directives.mediaSrc.length > 0) {
      cspParts.push(`media-src ${directives.mediaSrc.join(" ")}`);
    }
    if (directives.manifestSrc.length > 0) {
      cspParts.push(`manifest-src ${directives.manifestSrc.join(" ")}`);
    }
    if (directives.workerSrc.length > 0) {
      cspParts.push(`worker-src ${directives.workerSrc.join(" ")}`);
    }
    if (directives.childSrc.length > 0) {
      cspParts.push(`child-src ${directives.childSrc.join(" ")}`);
    }
    if (directives.formAction.length > 0) {
      cspParts.push(`form-action ${directives.formAction.join(" ")}`);
    }
    if (directives.baseUri.length > 0) {
      cspParts.push(`base-uri ${directives.baseUri.join(" ")}`);
    }
    if (directives.upgradeInsecureRequests) {
      cspParts.push("upgrade-insecure-requests");
    }
    if (directives.blockAllMixedContent) {
      cspParts.push("block-all-mixed-content");
    }
    return cspParts.join("; ");
  }
  static buildPermissionsPolicy(permissions) {
    const policyParts = [];
    Object.entries(permissions).forEach(([feature, allowlist]) => {
      if (allowlist.length === 0) {
        policyParts.push(`${feature}=()`);
      } else {
        policyParts.push(`${feature}=(${allowlist.join(" ")})`);
      }
    });
    return policyParts.join(", ");
  }
  // Méthodes utilitaires pour la configuration
  static addCSPDirective(directive, value) {
    if (Array.isArray(this.config.csp.directives[directive])) {
      this.config.csp.directives[directive].push(value);
    }
  }
  static removeCSPDirective(directive, value) {
    if (Array.isArray(this.config.csp.directives[directive])) {
      const array = this.config.csp.directives[directive];
      const index = array.indexOf(value);
      if (index > -1) {
        array.splice(index, 1);
      }
    }
  }
  static enableHSTS() {
    this.config.hsts.enabled = true;
  }
  static disableHSTS() {
    this.config.hsts.enabled = false;
  }
  static setHSTSPreload(enabled) {
    this.config.hsts.preload = enabled;
  }
  // Configuration pour différents environnements
  static getDevelopmentConfig() {
    const devConfig = { ...DEFAULT_SECURITY_CONFIG };
    devConfig.csp.directives.scriptSrc.push("'unsafe-eval'");
    devConfig.csp.directives.connectSrc.push("ws://localhost:*", "wss://localhost:*");
    devConfig.hsts.enabled = false;
    return devConfig;
  }
  static getProductionConfig() {
    const prodConfig = { ...DEFAULT_SECURITY_CONFIG };
    prodConfig.csp.directives.scriptSrc = prodConfig.csp.directives.scriptSrc.filter(
      (src) => src !== "'unsafe-eval'"
    );
    prodConfig.hsts.enabled = true;
    return prodConfig;
  }
}

function shouldExcludePath(pathname) {
  const excludePaths = [
    "/api/health",
    "/_astro/",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/sw.js",
    "/manifest.json"
  ];
  return excludePaths.some((excludePath) => {
    if (excludePath.endsWith("*")) {
      return pathname.startsWith(excludePath.slice(0, -1));
    }
    return pathname === excludePath || pathname.startsWith(excludePath);
  });
}
const onRequest$2 = async (context, next) => {
  const request = context.request;
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (shouldExcludePath(pathname)) {
    return next();
  }
  const response = await next();
  if (!response) {
    return response;
  }
  const securityHeaders = SecurityHeadersManager.generateHeaders();
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers)
  });
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  return newResponse;
};

const onRequest$1 = defineMiddleware(async (context, next) => {
  const cookiesHeader = context.request.headers.get("cookie") || "";
  const supabase = createClient(
    "https://hvthtebjvmutuvzvttdb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY",
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: "pkce"
      },
      global: {
        headers: cookiesHeader ? {
          "x-use-cookies": "true",
          "Cookie": cookiesHeader
        } : { "x-use-cookies": "true" }
      }
    }
  );
  context.locals.supabase = supabase;
  let session = null;
  try {
    const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
    if (!error && supabaseSession) {
      session = supabaseSession;
    } else {
      const cookiesList = cookiesHeader.split(";").map((c) => c.trim());
      const sbAccessTokenCookie = cookiesList.find((c) => c.startsWith("sb-access-token="));
      if (sbAccessTokenCookie) {
        const accessToken = sbAccessTokenCookie.split("=")[1];
        if (accessToken) {
          const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
          if (!userError && user) {
            session = {
              access_token: accessToken,
              refresh_token: "",
              expires_in: 21600,
              expires_at: Math.floor(Date.now() / 1e3) + 21600,
              token_type: "bearer",
              user
            };
          }
        }
      }
    }
    if (session?.expires_at) {
      const timeNow = Math.round(Date.now() / 1e3);
      const expiresIn = session.expires_at - timeNow;
      if (expiresIn < 7200) {
        try {
          const refreshResult = await supabase.auth.refreshSession();
          if (refreshResult.data.session) {
            session = refreshResult.data.session;
          }
        } catch (refreshError) {
          console.error("Erreur lors du rafraîchissement de session:", refreshError);
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    session = null;
  }
  context.locals.session = session;
  const response = await next();
  const cachedResponse = await onRequest$3(context, async () => response);
  const secureResponse = await onRequest$2(context, async () => cachedResponse);
  return secureResponse;
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
