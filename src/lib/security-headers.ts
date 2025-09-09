// src/lib/security-headers.ts
export interface SecurityHeadersConfig {
  // Content Security Policy
  csp: {
    enabled: boolean;
    directives: {
      defaultSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
      imgSrc: string[];
      fontSrc: string[];
      connectSrc: string[];
      frameSrc: string[];
      objectSrc: string[];
      mediaSrc: string[];
      manifestSrc: string[];
      workerSrc: string[];
      childSrc: string[];
      formAction: string[];
      baseUri: string[];
      upgradeInsecureRequests: boolean;
      blockAllMixedContent: boolean;
    };
  };
  
  // Headers de sécurité de base
  basic: {
    xFrameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
    xContentTypeOptions: boolean;
    xXssProtection: boolean;
    referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
    permissionsPolicy: {
      camera: string[];
      microphone: string[];
      geolocation: string[];
      payment: string[];
      usb: string[];
      magnetometer: string[];
      gyroscope: string[];
      accelerometer: string[];
      ambientLightSensor: string[];
      autoplay: string[];
      encryptedMedia: string[];
      fullscreen: string[];
      pictureInPicture: string[];
    };
  };
  
  // HSTS (HTTP Strict Transport Security)
  hsts: {
    enabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  
  // Autres headers
  additional: {
    xDownloadOptions: boolean;
    xPermittedCrossDomainPolicies: boolean;
    crossOriginEmbedderPolicy: 'unsafe-none' | 'require-corp';
    crossOriginOpenerPolicy: 'unsafe-none' | 'same-origin-allow-popups' | 'same-origin';
    crossOriginResourcePolicy: 'same-site' | 'same-origin' | 'cross-origin';
  };
}

const DEFAULT_SECURITY_CONFIG: SecurityHeadersConfig = {
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Nécessaire pour Astro
        "'unsafe-eval'", // Nécessaire pour le développement
        "https://fonts.googleapis.com",
        "https://www.google-analytics.com",
        "https://www.googletagmanager.com",
        "https://js.stripe.com",
        "https://checkout.stripe.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Nécessaire pour Tailwind CSS
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
        "http:", // Pour les images externes
        "https://images.unsplash.com",
        "https://via.placeholder.com",
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com",
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
        "https://analytics.google.com",
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://checkout.stripe.com",
        "https://hooks.stripe.com",
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: true,
      blockAllMixedContent: true,
    },
  },
  
  basic: {
    xFrameOptions: 'DENY',
    xContentTypeOptions: true,
    xXssProtection: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      camera: ['()'],
      microphone: ['()'],
      geolocation: ['()'],
      payment: ['()'],
      usb: ['()'],
      magnetometer: ['()'],
      gyroscope: ['()'],
      accelerometer: ['()'],
      ambientLightSensor: ['()'],
      autoplay: ['()'],
      encryptedMedia: ['()'],
      fullscreen: ['self'],
      pictureInPicture: ['()'],
    },
  },
  
  hsts: {
    enabled: true,
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true,
  },
  
  additional: {
    xDownloadOptions: true,
    xPermittedCrossDomainPolicies: true,
    crossOriginEmbedderPolicy: 'unsafe-none', // Permet les images externes
    crossOriginOpenerPolicy: 'same-origin',
    crossOriginResourcePolicy: 'cross-origin', // Permet les ressources cross-origin
  },
};

export class SecurityHeadersManager {
  private static config: SecurityHeadersConfig = DEFAULT_SECURITY_CONFIG;

  static getConfig(): SecurityHeadersConfig {
    return this.config;
  }

  static updateConfig(newConfig: Partial<SecurityHeadersConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  static generateHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const config = this.config;

    // Content Security Policy
    if (config.csp.enabled) {
      const cspDirectives = this.buildCSPDirectives(config.csp.directives);
      headers['Content-Security-Policy'] = cspDirectives;
    }

    // Headers de sécurité de base
    if (config.basic.xFrameOptions) {
      headers['X-Frame-Options'] = config.basic.xFrameOptions;
    }

    if (config.basic.xContentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    if (config.basic.xXssProtection) {
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    if (config.basic.referrerPolicy) {
      headers['Referrer-Policy'] = config.basic.referrerPolicy;
    }

    // Permissions Policy
    const permissionsPolicy = this.buildPermissionsPolicy(config.basic.permissionsPolicy);
    if (permissionsPolicy) {
      headers['Permissions-Policy'] = permissionsPolicy;
    }

    // HSTS
    if (config.hsts.enabled) {
      let hstsValue = `max-age=${config.hsts.maxAge}`;
      if (config.hsts.includeSubDomains) {
        hstsValue += '; includeSubDomains';
      }
      if (config.hsts.preload) {
        hstsValue += '; preload';
      }
      headers['Strict-Transport-Security'] = hstsValue;
    }

    // Headers supplémentaires
    if (config.additional.xDownloadOptions) {
      headers['X-Download-Options'] = 'noopen';
    }

    if (config.additional.xPermittedCrossDomainPolicies) {
      headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    }

    if (config.additional.crossOriginEmbedderPolicy) {
      headers['Cross-Origin-Embedder-Policy'] = config.additional.crossOriginEmbedderPolicy;
    }

    if (config.additional.crossOriginOpenerPolicy) {
      headers['Cross-Origin-Opener-Policy'] = config.additional.crossOriginOpenerPolicy;
    }

    if (config.additional.crossOriginResourcePolicy) {
      headers['Cross-Origin-Resource-Policy'] = config.additional.crossOriginResourcePolicy;
    }

    return headers;
  }

  private static buildCSPDirectives(directives: SecurityHeadersConfig['csp']['directives']): string {
    const cspParts: string[] = [];

    // Directives principales
    if (directives.defaultSrc.length > 0) {
      cspParts.push(`default-src ${directives.defaultSrc.join(' ')}`);
    }

    if (directives.scriptSrc.length > 0) {
      cspParts.push(`script-src ${directives.scriptSrc.join(' ')}`);
    }

    if (directives.styleSrc.length > 0) {
      cspParts.push(`style-src ${directives.styleSrc.join(' ')}`);
    }

    if (directives.imgSrc.length > 0) {
      cspParts.push(`img-src ${directives.imgSrc.join(' ')}`);
    }

    if (directives.fontSrc.length > 0) {
      cspParts.push(`font-src ${directives.fontSrc.join(' ')}`);
    }

    if (directives.connectSrc.length > 0) {
      cspParts.push(`connect-src ${directives.connectSrc.join(' ')}`);
    }

    if (directives.frameSrc.length > 0) {
      cspParts.push(`frame-src ${directives.frameSrc.join(' ')}`);
    }

    if (directives.objectSrc.length > 0) {
      cspParts.push(`object-src ${directives.objectSrc.join(' ')}`);
    }

    if (directives.mediaSrc.length > 0) {
      cspParts.push(`media-src ${directives.mediaSrc.join(' ')}`);
    }

    if (directives.manifestSrc.length > 0) {
      cspParts.push(`manifest-src ${directives.manifestSrc.join(' ')}`);
    }

    if (directives.workerSrc.length > 0) {
      cspParts.push(`worker-src ${directives.workerSrc.join(' ')}`);
    }

    if (directives.childSrc.length > 0) {
      cspParts.push(`child-src ${directives.childSrc.join(' ')}`);
    }

    if (directives.formAction.length > 0) {
      cspParts.push(`form-action ${directives.formAction.join(' ')}`);
    }

    if (directives.baseUri.length > 0) {
      cspParts.push(`base-uri ${directives.baseUri.join(' ')}`);
    }

    // Directives spéciales
    if (directives.upgradeInsecureRequests) {
      cspParts.push('upgrade-insecure-requests');
    }

    if (directives.blockAllMixedContent) {
      cspParts.push('block-all-mixed-content');
    }

    return cspParts.join('; ');
  }

  private static buildPermissionsPolicy(permissions: SecurityHeadersConfig['basic']['permissionsPolicy']): string {
    const policyParts: string[] = [];

    Object.entries(permissions).forEach(([feature, allowlist]) => {
      if (allowlist.length === 0) {
        policyParts.push(`${feature}=()`);
      } else {
        policyParts.push(`${feature}=(${allowlist.join(' ')})`);
      }
    });

    return policyParts.join(', ');
  }

  // Méthodes utilitaires pour la configuration
  static addCSPDirective(directive: keyof SecurityHeadersConfig['csp']['directives'], value: string): void {
    if (Array.isArray(this.config.csp.directives[directive])) {
      (this.config.csp.directives[directive] as string[]).push(value);
    }
  }

  static removeCSPDirective(directive: keyof SecurityHeadersConfig['csp']['directives'], value: string): void {
    if (Array.isArray(this.config.csp.directives[directive])) {
      const array = this.config.csp.directives[directive] as string[];
      const index = array.indexOf(value);
      if (index > -1) {
        array.splice(index, 1);
      }
    }
  }

  static enableHSTS(): void {
    this.config.hsts.enabled = true;
  }

  static disableHSTS(): void {
    this.config.hsts.enabled = false;
  }

  static setHSTSPreload(enabled: boolean): void {
    this.config.hsts.preload = enabled;
  }

  // Configuration pour différents environnements
  static getDevelopmentConfig(): SecurityHeadersConfig {
    const devConfig = { ...DEFAULT_SECURITY_CONFIG };
    
    // Assouplir CSP pour le développement
    devConfig.csp.directives.scriptSrc.push("'unsafe-eval'");
    devConfig.csp.directives.connectSrc.push("ws://localhost:*", "wss://localhost:*");
    
    // Désactiver HSTS en développement
    devConfig.hsts.enabled = false;
    
    return devConfig;
  }

  static getProductionConfig(): SecurityHeadersConfig {
    const prodConfig = { ...DEFAULT_SECURITY_CONFIG };
    
    // Renforcer la sécurité en production
    prodConfig.csp.directives.scriptSrc = prodConfig.csp.directives.scriptSrc.filter(
      src => src !== "'unsafe-eval'"
    );
    
    // Activer HSTS en production
    prodConfig.hsts.enabled = true;
    
    return prodConfig;
  }
}

