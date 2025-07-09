// src/lib/csp-config.ts

/**
 * Configuration de la Content Security Policy (CSP)
 * Centralise toutes les directives CSP pour une maintenance facile
 */

export interface CSPConfig {
  // Domaines autorisés pour les scripts
  scriptDomains: string[];
  // Domaines autorisés pour les styles
  styleDomains: string[];
  // Domaines autorisés pour les polices
  fontDomains: string[];
  // Domaines autorisés pour les images
  imageDomains: string[];
  // Domaines autorisés pour les connexions
  connectDomains: string[];
  // Domaines autorisés pour les frames
  frameDomains: string[];
}

// Configuration par défaut
export const defaultCSPConfig: CSPConfig = {
  scriptDomains: [
    'https://js.stripe.com',
    'https://checkout.stripe.com',
    'https://maps.googleapis.com'
  ],
  styleDomains: [
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net'
  ],
  fontDomains: [
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ],
  imageDomains: [
    'https://*.supabase.co',
    'https://maps.googleapis.com',
    'https://maps.gstatic.com',
    'https://checkout.stripe.com'
  ],
  connectDomains: [
    'https://*.supabase.co',
    'https://api.stripe.com',
    'https://checkout.stripe.com',
    'https://maps.googleapis.com',
    'wss://*.supabase.co'
  ],
  frameDomains: [
    'https://js.stripe.com',
    'https://checkout.stripe.com',
    'https://hooks.stripe.com'
  ]
};

/**
 * Génère les directives CSP à partir de la configuration
 * @param config - Configuration CSP personnalisée
 * @returns Tableau des directives CSP
 */
export function generateCSPDirectives(config: CSPConfig = defaultCSPConfig): string[] {
  return [
    // Default-src: source par défaut pour les ressources
    "default-src 'self'",
    
    // Script-src: sources autorisées pour les scripts
    `script-src 'self' 'unsafe-eval' 'unsafe-inline' ${config.scriptDomains.join(' ')}`,
    
    // Style-src: sources autorisées pour les styles
    `style-src 'self' 'unsafe-inline' ${config.styleDomains.join(' ')}`,
    
    // Font-src: sources autorisées pour les polices
    `font-src 'self' ${config.fontDomains.join(' ')} data:`,
    
    // Img-src: sources autorisées pour les images
    `img-src 'self' data: blob: https: ${config.imageDomains.join(' ')}`,
    
    // Connect-src: sources autorisées pour les requêtes AJAX/fetch
    `connect-src 'self' ${config.connectDomains.join(' ')}`,
    
    // Frame-src: sources autorisées pour les iframes
    `frame-src 'self' ${config.frameDomains.join(' ')}`,
    
    // Object-src: sources autorisées pour les objets (PDF, etc.)
    "object-src 'none'",
    
    // Media-src: sources autorisées pour les médias
    "media-src 'self'",
    
    // Manifest-src: sources autorisées pour les manifests
    "manifest-src 'self'",
    
    // Worker-src: sources autorisées pour les web workers
    "worker-src 'self' blob:",
    
    // Child-src: sources autorisées pour les frames enfants
    `child-src 'self' ${config.frameDomains.join(' ')}`,
    
    // Form-action: URLs autorisées pour les soumissions de formulaires
    "form-action 'self'",
    
    // Base-uri: URI de base autorisée
    "base-uri 'self'",
    
    // Upgrade-insecure-requests: forcer HTTPS
    "upgrade-insecure-requests",
    
    // Block-all-mixed-content: bloquer le contenu mixte
    "block-all-mixed-content",
    
    // Require-trusted-types-for: exiger des types de confiance pour les scripts
    "require-trusted-types-for 'script'",
    
    // Trusted-types: types de confiance autorisés
    "trusted-types 'default'",
  ];
}

/**
 * Génère le header CSP complet
 * @param config - Configuration CSP personnalisée
 * @returns Chaîne du header CSP
 */
export function generateCSPHeader(config: CSPConfig = defaultCSPConfig): string {
  return generateCSPDirectives(config).join("; ");
} 