// src/lib/keywords.ts

export interface KeywordData {
  primary: string;
  secondary: string[];
  longTail: string[];
  semantic: string[];
}

export const keywords: Record<string, KeywordData> = {
  home: {
    primary: "naturopathie",
    secondary: ["soins énergétiques", "accompagnement holistique", "bien-être naturel"],
    longTail: [
      "naturopathie pour humains et animaux",
      "soins énergétiques personnalisés",
      "accompagnement holistique France",
      "naturopathe spécialisée animaux"
    ],
    semantic: [
      "médecine naturelle",
      "thérapie alternative",
      "guérison naturelle",
      "équilibre corps esprit",
      "santé holistique"
    ]
  },
  about: {
    primary: "aïa naturopathe",
    secondary: ["parcours naturopathie", "spécialiste soins énergétiques", "accompagnement spirituel"],
    longTail: [
      "aïa naturopathe expérience",
      "parcours professionnel naturopathie",
      "spécialiste soins énergétiques animaux"
    ],
    semantic: [
      "thérapeute holistique",
      "praticienne médecine douce",
      "spécialiste bien-être animal",
      "guidance spirituelle"
    ]
  },
  services: {
    primary: "services naturopathie",
    secondary: ["consultation naturopathie", "soins énergétiques", "offres MAISON SATTVA AÏA"],
    longTail: [
      "consultation naturopathie en ligne",
      "soins énergétiques humains animaux",
      "accompagnement holistique personnalisé",
      "naturopathie à distance"
    ],
    semantic: [
      "prestations bien-être",
      "thérapies naturelles",
      "soins alternatifs",
      "médecine douce"
    ]
  },
  sattva: {
    primary: "SATTVA offre humaine",
    secondary: ["naturopathie humaine", "médecine naturelle", "soins vibratoires"],
    longTail: [
      "SATTVA Maison Sattvaïa",
      "consultation naturopathie en ligne",
      "bilan de terrain et magnétisme"
    ],
    semantic: [
      "médecine préventive",
      "thérapie naturelle",
      "équilibre alimentaire",
      "gestion du stress"
    ]
  },
  aia: {
    primary: "AÏA offre animale",
    secondary: ["naturopathie animale", "communication intuitive", "bien-être animal"],
    longTail: [
      "AÏA Maison Sattvaïa",
      "soins naturels animaux domestiques",
      "accompagnement chien chat équidé"
    ],
    semantic: [
      "santé animale",
      "soins vétérinaires naturels",
      "bien-être animal domestique",
      "thérapie animale"
    ]
  },
  maison: {
    primary: "MAISON offre signature duo",
    secondary: ["binôme humain animal", "lien miroir", "harmonisation du foyer"],
    longTail: [
      "soin signature binôme",
      "lecture systémique humain animal",
      "Maison Sattvaïa duo"
    ],
    semantic: [
      "équilibre du foyer",
      "soin vibratoire duo",
      "résonance humain animal",
      "accompagnement holistique famille"
    ]
  },
  contact: {
    primary: "rendez-vous naturopathie",
    secondary: ["contact naturopathe", "prise de rendez-vous", "consultation en ligne"],
    longTail: [
      "prendre rendez-vous naturopathe",
      "contact naturopathe spécialisée animaux",
      "consultation naturopathie en ligne"
    ],
    semantic: [
      "planification consultation",
      "réservation séance",
      "contact thérapeute"
    ]
  },
  blog: {
    primary: "blog naturopathie",
    secondary: ["conseils naturopathie", "articles bien-être", "guidance holistique"],
    longTail: [
      "articles naturopathie et bien-être",
      "conseils naturopathie naturelle",
      "blog spécialisé médecine douce"
    ],
    semantic: [
      "contenu éducatif",
      "ressources bien-être",
      "informations thérapeutiques"
    ]
  }
};

// Fonction pour générer des mots-clés SEO optimisés
export function generateSEOKeywords(page: string, customKeywords?: string[]): string {
  const pageKeywords = keywords[page] || keywords.home;
  const allKeywords = [
    pageKeywords.primary,
    ...pageKeywords.secondary,
    ...pageKeywords.longTail,
    ...pageKeywords.semantic,
    ...(customKeywords || [])
  ];
  
  return allKeywords.join(', ');
}

// Fonction pour générer des titres SEO optimisés
export function generateSEOTitle(page: string, customTitle?: string): string {
  const pageKeywords = keywords[page] || keywords.home;
  const baseTitle = customTitle || `La Maison Sattvaïa - ${pageKeywords.primary}`;
  
  // Ajouter des mots-clés secondaires si l'espace le permet
  if (baseTitle.length < 50) {
    return `${baseTitle} | ${pageKeywords.secondary[0]}`;
  }
  
  return baseTitle;
}

// Fonction pour générer des descriptions SEO optimisées
export function generateSEODescription(page: string, customDescription?: string): string {
  const pageKeywords = keywords[page] || keywords.home;
  const baseDescription = customDescription || 
    `Découvrez ${pageKeywords.primary} avec La Maison Sattvaïa. ${pageKeywords.longTail[0]}. Accompagnement sur mesure et professionnel.`;
  
  // S'assurer que la description fait entre 150-160 caractères
  if (baseDescription.length > 160) {
    return baseDescription.substring(0, 157) + '...';
  }
  
  return baseDescription;
}
