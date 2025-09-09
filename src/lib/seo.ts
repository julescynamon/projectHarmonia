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
  title: 'Naima Tyzra - Naturopathe à Paris',
  description: 'Découvrez une approche holistique de la santé avec Naima Tyzra, naturopathe certifiée à Paris. Consultations personnalisées, conseils en nutrition et bien-être naturel.',
  image: '/images/social-share.webp'
};

export const pageSEO: Record<string, SEOProps> = {
  home: {
    title: 'Naima Tyzra - Naturopathe & Praticienne en Santé Naturelle à Paris',
    description: 'Retrouvez votre équilibre naturel avec Naima Tyzra, naturopathe à Paris. Consultations personnalisées, accompagnement holistique et conseils en santé naturelle.',
  },
  about: {
    title: 'À Propos - Naima Tyzra | Votre Naturopathe à Paris',
    description: 'Découvrez mon parcours et mon approche de la naturopathie. Je vous accompagne vers une meilleure santé grâce à des méthodes naturelles et personnalisées.',
  },
  services: {
    title: 'Services de Naturopathie - Consultations & Accompagnement | Naima Tyzra',
    description: 'Consultations en naturopathie, bilans de vitalité, conseils en nutrition et accompagnement personnalisé pour votre bien-être naturel à Paris.',
  },
  shop: {
    title: 'Boutique - Produits Naturels & Guides Bien-être | Naima Tyzra',
    description: 'Découvrez ma sélection de produits naturels, guides et programmes pour prendre soin de votre santé au quotidien.',
  },
  contact: {
    title: 'Contact - Prenez Rendez-vous | Naima Tyzra Naturopathe',
    description: 'Contactez-moi pour prendre rendez-vous ou en savoir plus sur mes services de naturopathie à Paris. Consultation en cabinet ou à distance.',
  },
  blog: {
    title: 'Blog Naturopathie - Conseils & Actualités | Naima Tyzra',
    description: 'Articles, conseils et actualités sur la naturopathie, la santé naturelle et le bien-être. Restez informé des dernières tendances en matière de santé holistique.',
  },
  appointment: {
    title: 'Prendre Rendez-vous | Naima Tyzra Naturopathe',
    description: 'Réservez votre consultation en naturopathie avec Naima Tyzra. Séances en cabinet à Paris ou en visioconférence pour un accompagnement personnalisé.',
  },
  accompagnementsReservation: {
    title: 'Réserver un accompagnement | Naima Tyzra',
    description: 'Prenez rendez-vous pour un accompagnement personnalisé en naturopathie humaine et animale, soins énergétiques et suivi nutritionnel.',
  },
  chamanismeReservation: {
    title: 'Réserver un soin chamanique | Naima Tyzra',
    description: 'Prenez rendez-vous pour un soin chamanique personnalisé : soins quantiques, communication animale, rituels de transmutation et nettoyage énergétique.',
  },
  lectureAmeReservation: {
    title: 'Réserver une lecture d\'âme | Naima Tyzra',
    description: 'Prenez rendez-vous pour une lecture d\'âme personnalisée et découvrez votre chemin de vie, vos missions d\'âme et votre potentiel spirituel.',
  },
  mentionsLegales: {
    title: 'Mentions Légales | La Maison Sattvaïa - Naima Tyzra',
    description: 'Mentions légales et conditions d\'utilisation du site La Maison Sattvaïa. Informations sur l\'éditeur, protection des données personnelles et droits d\'utilisation.',
  },
  politiqueConfidentialite: {
    title: 'Politique de Confidentialité | La Maison Sattvaïa - Naima Tyzra',
    description: 'Politique de confidentialité et protection des données personnelles. Découvrez comment La Maison Sattvaïa collecte, utilise et protège vos informations conformément au RGPD.',
  },
  cgv: {
    title: 'Conditions Générales de Vente | La Maison Sattvaïa - Naima Tyzra',
    description: 'Conditions générales de vente et d\'utilisation des services de naturopathie, soins énergétiques et accompagnement holistique de La Maison Sattvaïa.',
  }
};
