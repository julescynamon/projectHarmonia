// src/lib/security-config.ts

/**
 * Configuration des headers de sécurité HTTP
 * Support des variables d'environnement pour la personnalisation
 */

// Types pour les configurations de sécurité
export interface SecurityConfig {
  // Protection contre le clickjacking
  frameOptions: "DENY" | "SAMEORIGIN" | "ALLOW-FROM";
  frameOptionsUrl?: string;
  
  // Protection contre le MIME sniffing
  contentTypeOptions: "nosniff";
  
  // Protection XSS
  xssProtection: "0" | "1" | "1; mode=block";
  
  // Politique de référent
  referrerPolicy: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
  
  // Politique de permissions
  permissionsPolicy: string;
  
  // Headers supplémentaires
  additionalHeaders?: Record<string, string>;
  
  // Exclusions
  excludePaths?: string[];
  
  // HSTS (Strict-Transport-Security)
  hsts?: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
}

/**
 * Récupère la configuration de sécurité depuis les variables d'environnement
 * @returns Configuration de sécurité
 */
export function getSecurityConfig(): SecurityConfig {
  // Configuration de base sécurisée
  const baseConfig: SecurityConfig = {
    frameOptions: "DENY",
    contentTypeOptions: "nosniff",
    xssProtection: "1; mode=block",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), speaker=(), sync-xhr=(), midi=(), clipboard-read=(), clipboard-write=(), display-capture=(), document-domain=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), publickey-credentials-get=(), screen-wake-lock=(), web-share=(), xr-spatial-tracking=()",
    excludePaths: [
      "/api/health",
      "/_astro/",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml"
    ],
    hsts: {
      maxAge: 31536000, // 1 an
      includeSubDomains: true,
      preload: true
    }
  };

  // Récupérer les variables d'environnement
  let envConfig: Partial<SecurityConfig> = {};
  
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // Contexte Astro
      envConfig = {
        frameOptions: import.meta.env.SECURITY_FRAME_OPTIONS as SecurityConfig['frameOptions'],
        referrerPolicy: import.meta.env.SECURITY_REFERRER_POLICY as SecurityConfig['referrerPolicy'],
        xssProtection: import.meta.env.SECURITY_XSS_PROTECTION as SecurityConfig['xssProtection'],
        frameOptionsUrl: import.meta.env.SECURITY_FRAME_OPTIONS_URL,
        permissionsPolicy: import.meta.env.SECURITY_PERMISSIONS_POLICY,
      };
    } else {
      // Contexte Node.js
      envConfig = {
        frameOptions: process.env.SECURITY_FRAME_OPTIONS as SecurityConfig['frameOptions'],
        referrerPolicy: process.env.SECURITY_REFERRER_POLICY as SecurityConfig['referrerPolicy'],
        xssProtection: process.env.SECURITY_XSS_PROTECTION as SecurityConfig['xssProtection'],
        frameOptionsUrl: process.env.SECURITY_FRAME_OPTIONS_URL,
        permissionsPolicy: process.env.SECURITY_PERMISSIONS_POLICY,
      };
    }
  } catch (error) {
    // Fallback pour le contexte Node.js
    envConfig = {
      frameOptions: process.env.SECURITY_FRAME_OPTIONS as SecurityConfig['frameOptions'],
      referrerPolicy: process.env.SECURITY_REFERRER_POLICY as SecurityConfig['referrerPolicy'],
      xssProtection: process.env.SECURITY_XSS_PROTECTION as SecurityConfig['xssProtection'],
      frameOptionsUrl: process.env.SECURITY_FRAME_OPTIONS_URL,
      permissionsPolicy: process.env.SECURITY_PERMISSIONS_POLICY,
    };
  }

  // Fusionner la configuration de base avec les variables d'environnement
  const mergedConfig = { ...baseConfig, ...envConfig };

  // S'assurer que toutes les propriétés requises sont définies
  if (!mergedConfig.frameOptions) mergedConfig.frameOptions = baseConfig.frameOptions;
  if (!mergedConfig.contentTypeOptions) mergedConfig.contentTypeOptions = baseConfig.contentTypeOptions;
  if (!mergedConfig.xssProtection) mergedConfig.xssProtection = baseConfig.xssProtection;
  if (!mergedConfig.referrerPolicy) mergedConfig.referrerPolicy = baseConfig.referrerPolicy;
  if (!mergedConfig.permissionsPolicy) mergedConfig.permissionsPolicy = baseConfig.permissionsPolicy;

  // Ajouter les headers HSTS si configuré
  if (mergedConfig.hsts) {
    const hstsValue = `max-age=${mergedConfig.hsts.maxAge}${mergedConfig.hsts.includeSubDomains ? '; includeSubDomains' : ''}${mergedConfig.hsts.preload ? '; preload' : ''}`;
    
    mergedConfig.additionalHeaders = {
      ...mergedConfig.additionalHeaders,
      "Strict-Transport-Security": hstsValue,
      "X-Download-Options": "noopen",
      "X-Permitted-Cross-Domain-Policies": "none",
    };
  }

  return mergedConfig;
}

/**
 * Génère les headers de sécurité HTTP
 * @param config - Configuration de sécurité (optionnelle)
 * @returns Headers de sécurité
 */
export function generateSecurityHeaders(config?: SecurityConfig): Record<string, string> {
  const securityConfig = config || getSecurityConfig();
  const headers: Record<string, string> = {};

  // X-Frame-Options
  if (securityConfig.frameOptions === "ALLOW-FROM" && securityConfig.frameOptionsUrl) {
    headers["X-Frame-Options"] = `${securityConfig.frameOptions} ${securityConfig.frameOptionsUrl}`;
  } else {
    headers["X-Frame-Options"] = securityConfig.frameOptions;
  }

  // X-Content-Type-Options
  headers["X-Content-Type-Options"] = securityConfig.contentTypeOptions;

  // X-XSS-Protection
  headers["X-XSS-Protection"] = securityConfig.xssProtection;

  // Referrer-Policy
  headers["Referrer-Policy"] = securityConfig.referrerPolicy;

  // Permissions-Policy
  headers["Permissions-Policy"] = securityConfig.permissionsPolicy;

  // Headers supplémentaires
  if (securityConfig.additionalHeaders) {
    Object.assign(headers, securityConfig.additionalHeaders);
  }

  return headers;
}

/**
 * Configuration pour les environnements de développement
 * @returns Configuration de sécurité adaptée au développement
 */
export function getDevelopmentSecurityConfig(): SecurityConfig {
  return {
    frameOptions: "SAMEORIGIN", // Plus permissif pour le développement
    contentTypeOptions: "nosniff",
    xssProtection: "1; mode=block",
    referrerPolicy: "no-referrer-when-downgrade", // Plus permissif
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), speaker=(), sync-xhr=(), midi=(), clipboard-read=(), clipboard-write=(), display-capture=(), document-domain=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), publickey-credentials-get=(), screen-wake-lock=(), web-share=(), xr-spatial-tracking=()",
    excludePaths: [
      "/api/health",
      "/_astro/",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml"
    ],
    // Pas de HSTS en développement
  };
}

/**
 * Configuration pour les environnements de production
 * @returns Configuration de sécurité renforcée pour la production
 */
export function getProductionSecurityConfig(): SecurityConfig {
  return {
    frameOptions: "DENY",
    contentTypeOptions: "nosniff",
    xssProtection: "1; mode=block",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), speaker=(), sync-xhr=(), midi=(), clipboard-read=(), clipboard-write=(), display-capture=(), document-domain=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), publickey-credentials-get=(), screen-wake-lock=(), web-share=(), xr-spatial-tracking=()",
    excludePaths: [
      "/api/health",
      "/_astro/",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml"
    ],
    hsts: {
      maxAge: 31536000, // 1 an
      includeSubDomains: true,
      preload: true
    },
    additionalHeaders: {
      "X-Download-Options": "noopen",
      "X-Permitted-Cross-Domain-Policies": "none",
    }
  };
} 