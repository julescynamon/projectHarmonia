// src/lib/site-config.ts

export interface SiteConfig {
  site: string;
  title: string;
  description: string;
  author: string;
  language: string;
  timezone: string;
}

export function getSiteConfig(): SiteConfig {
  return {
    site: 'https://harmonia.jules.com',
    title: 'La Maison Sattvaïa - Naturopathie & Soins Chamaniques',
    description: 'Découvrez nos services de naturopathie et soins chamaniques pour votre bien-être naturel.',
    author: 'La Maison Sattvaïa',
    language: 'fr',
    timezone: 'Europe/Paris',
  };
} 