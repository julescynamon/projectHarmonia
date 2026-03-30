export interface SEOProps {
  title: string;
  description: string;
  image?: string;
}

export interface SEO {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

export const defaultSEO: SEOProps = {
  title: 'La Maison Sattvaïa - Aïa | Naturopathie & Soins Énergétiques',
  description: 'Découvrez La Maison Sattvaïa : accompagnement holistique unique alliant naturopathie, soins énergétiques et guidance spirituelle pour humains et animaux.',
  image: '/images/heroblogbg.webp'
};

export const pageSEO: Record<string, SEOProps> = {
  home: {
    title: 'Maison Sattvaïa – Harmonie du foyer, de l\'humain et de l\'animal | Gard, Vaucluse, Drôme, Ardèche',
    description:
      'Maison Sattvaïa accompagne le foyer, l\'humain et l\'animal : naturopathie, soins vibratoires et leviers sur mesure. À domicile ou en visio depuis le Gard, le Vaucluse, la Drôme et l\'Ardèche.',
    image: '/images/og-image-home.webp'
  },
  about: {
    title: 'À Propos | Maison Sattvaïa - Vision & méthode',
    description:
      'La vision Sattvaïa : une approche qui unit le biologique, le vibratoire et le systémique — pour les humains comme pour les animaux. Découvrez la méthode et les trois plans d\'intervention.',
    image: '/images/og-image-about.webp'
  },
  services: {
    title: 'Services Naturopathie & Soins Énergétiques | Maison Sattvaïa',
    description: 'Naturopathie humaine et animale, soins énergétiques et guidance spirituelle. Consultations personnalisées en présentiel ou à distance dans le Gard, Vaucluse, Drôme et Ardèche.',
    image: '/images/og-image-services.webp'
  },
  shop: {
    title: 'Boutique | Maison Sattvaïa - Guides & Ressources Holistiques',
    description: 'Découvrez mes guides spirituels, ressources de développement personnel et outils d\'accompagnement pour votre cheminement holistique.',
  },
  contact: {
    title: 'Contact | Prendre Rendez-vous Naturopathe - Maison Sattvaïa',
    description: 'Contactez La Maison Sattvaïa pour votre accompagnement holistique. Prise de rendez-vous facile : naturopathie, soins énergétiques, guidance spirituelle pour humains et animaux dans le Gard, Vaucluse, Drôme et Ardèche.',
    image: '/images/og-image-contact.webp'
  },
  blog: {
    title: 'Blog Naturopathie & Soins Énergétiques | Maison Sattvaïa',
    description: 'Articles et conseils naturopathie, soins énergétiques, bien-être holistique et développement spirituel. Ressources expertes pour votre cheminement personnel et celui de vos animaux.',
    image: '/images/og-image-blog.webp'
  },
  appointment: {
    title: 'Prendre Rendez-vous | Maison Sattvaïa',
    description: 'Réservez votre accompagnement holistique à La Maison Sattvaïa. Séances en présentiel ou à distance pour humains et animaux.',
  },
  accompagnementsReservation: {
    title: 'Réserver un accompagnement | Maison Sattvaïa',
    description: 'Prenez rendez-vous pour un accompagnement holistique personnalisé : naturopathie humaine et animale, soins énergétiques et guidance spirituelle.',
  },
  mentionsLegales: {
    title: 'Mentions Légales | Maison Sattvaïa - Aïa',
    description: 'Mentions légales et conditions d\'utilisation du site La Maison Sattvaïa. Informations sur l\'éditeur, protection des données personnelles et droits d\'utilisation.',
  },
  politiqueConfidentialite: {
    title: 'Politique de Confidentialité | Maison Sattvaïa - Aïa',
    description: 'Politique de confidentialité et protection des données personnelles. Découvrez comment La Maison Sattvaïa collecte, utilise et protège vos informations conformément au RGPD.',
  },
  cgv: {
    title: 'Conditions Générales de Vente | Maison Sattvaïa - Aïa',
    description: 'Conditions générales de vente et d\'utilisation des services de naturopathie, soins énergétiques et accompagnement holistique de La Maison Sattvaïa.',
  }
};
