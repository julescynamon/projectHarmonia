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
    site: 'https://www.maisonsattvaia.fr',
    title: 'La Maison Sattvaïa - Naturopathie & Soins Énergétiques',
    description: 'Découvrez mes services de naturopathie et soins énergétiques pour votre bien-être naturel.',
    author: 'La Maison Sattvaïa',
    language: 'fr',
    timezone: 'Europe/Paris',
  };
} 