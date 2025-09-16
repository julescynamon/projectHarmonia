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
  title: 'La Maison Sattvaïa - Naima Tyzra | Naturopathie & Soins Énergétiques',
  description: 'Découvrez La Maison Sattvaïa : accompagnement holistique unique alliant naturopathie, soins énergétiques et guidance spirituelle pour humains et animaux.',
  image: '/images/heroblogbg.webp'
};

export const pageSEO: Record<string, SEOProps> = {
  home: {
    title: 'Maison Sattvaïa – Naturopathie & Soins Énergétiques pour Humains et Animaux',
    description: 'Découvrez La Maison Sattvaïa : accompagnement holistique unique alliant naturopathie, soins énergétiques et guidance spirituelle pour humains et animaux.',
  },
  about: {
    title: 'À Propos | Maison Sattvaïa - Naima Tyzra',
    description: 'Découvrez l\'histoire de La Maison Sattvaïa et le parcours de Naima Tyzra. Un lieu de reconnexion où corps, énergie et âme retrouvent leur équilibre naturel.',
  },
  services: {
    title: 'Services | Maison Sattvaïa - Accompagnements Holistiques',
    description: 'Naturopathie humaine et animale, soins énergétiques, guidance spirituelle : découvrez nos accompagnements personnalisés pour retrouver votre équilibre.',
  },
  shop: {
    title: 'Boutique | Maison Sattvaïa - Guides & Ressources Holistiques',
    description: 'Découvrez nos guides spirituels, ressources de développement personnel et outils d\'accompagnement pour votre cheminement holistique.',
  },
  contact: {
    title: 'Contact | Maison Sattvaïa - Prenez Rendez-vous',
    description: 'Contactez La Maison Sattvaïa pour débuter votre accompagnement holistique. Consultations en présentiel ou à distance pour humains et animaux.',
  },
  blog: {
    title: 'Blog | Maison Sattvaïa - Sagesse & Guidance Holistique',
    description: 'Articles, conseils et guidance sur la naturopathie, les soins énergétiques et le développement spirituel. Nourrissez votre cheminement holistique.',
  },
  appointment: {
    title: 'Prendre Rendez-vous | Maison Sattvaïa',
    description: 'Réservez votre accompagnement holistique à La Maison Sattvaïa. Séances en présentiel ou à distance pour humains et animaux.',
  },
  accompagnementsReservation: {
    title: 'Réserver un accompagnement | Maison Sattvaïa',
    description: 'Prenez rendez-vous pour un accompagnement holistique personnalisé : naturopathie humaine et animale, soins énergétiques et guidance spirituelle.',
  },
  chamanismeReservation: {
    title: 'Réserver un soin chamanique | Maison Sattvaïa',
    description: 'Prenez rendez-vous pour un soin chamanique personnalisé : soins quantiques, communication animale, rituels de transmutation et nettoyage énergétique.',
  },
  lectureAmeReservation: {
    title: 'Réserver une lecture d\'âme | Maison Sattvaïa',
    description: 'Prenez rendez-vous pour une lecture d\'âme personnalisée et découvrez votre chemin de vie, vos missions d\'âme et votre potentiel spirituel.',
  },
  mentionsLegales: {
    title: 'Mentions Légales | Maison Sattvaïa - Naima Tyzra',
    description: 'Mentions légales et conditions d\'utilisation du site La Maison Sattvaïa. Informations sur l\'éditeur, protection des données personnelles et droits d\'utilisation.',
  },
  politiqueConfidentialite: {
    title: 'Politique de Confidentialité | Maison Sattvaïa - Naima Tyzra',
    description: 'Politique de confidentialité et protection des données personnelles. Découvrez comment La Maison Sattvaïa collecte, utilise et protège vos informations conformément au RGPD.',
  },
  cgv: {
    title: 'Conditions Générales de Vente | Maison Sattvaïa - Naima Tyzra',
    description: 'Conditions générales de vente et d\'utilisation des services de naturopathie, soins énergétiques et accompagnement holistique de La Maison Sattvaïa.',
  }
};
