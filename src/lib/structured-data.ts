// src/lib/structured-data.ts

export interface LocalBusinessData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email?: string;
  address?: {
    "@type": string;
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    "@type": string;
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  logo?: string;
  sameAs?: string[];
  serviceArea?: {
    "@type": string;
    description: string;
  };
  areaServed?: Array<{
    "@type": string;
    geoMidpoint: {
      "@type": string;
      latitude: number;
      longitude: number;
    };
    geoRadius: number;
  }>;
  hasOfferCatalog?: {
    "@type": string;
    name: string;
    itemListElement: ServiceData[];
  };
}

export interface ServiceData {
  "@type": string;
  name: string;
  description: string;
  provider: {
    "@type": string;
    name: string;
  };
  areaServed?: string;
  availableChannel?: {
    "@type": string;
    serviceType: string;
  };
  offers?: {
    "@type": string;
    price?: string;
    priceCurrency: string;
    availability: string;
  };
}

export interface ReviewData {
  "@type": string;
  reviewRating: {
    "@type": string;
    ratingValue: number;
    bestRating: number;
  };
  author: {
    "@type": string;
    name: string;
  };
  reviewBody: string;
  datePublished: string;
}

export interface FAQData {
  "@type": string;
  mainEntity: {
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }[];
}

// Données structurées pour La Maison Sattvaïa
export function getLocalBusinessData(): LocalBusinessData {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "La Maison Sattvaïa",
    description: "Accompagnement holistique unique alliant naturopathie, soins énergétiques et guidance spirituelle pour humains et animaux.",
    url: "https://www.maisonsattvaia.fr",
    telephone: "+33 7 67 22 97 43",
    email: "contact@maisonsattvaia.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "30760 Salazac",
      addressLocality: "Salazac",
      addressRegion: "Gard",
      postalCode: "30760",
      addressCountry: "FR"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.2333,
      longitude: 4.4167
    },
    openingHours: [
      "Mo-Fr 09:00-18:00",
      "Sa 09:00-17:00"
    ],
    priceRange: "€€",
    serviceArea: {
      "@type": "GeoShape",
      "description": "Gard, Vaucluse, Drôme, Ardèche"
    },
    areaServed: [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 44.2333,
          "longitude": 4.4167
        },
        "geoRadius": 80000
      }
    ],
    image: "https://www.maisonsattvaia.fr/images/og-image.webp",
    logo: "https://www.maisonsattvaia.fr/favicon/favicon.svg",
    sameAs: [
      "https://www.facebook.com/maisonsattvaia",
      "https://www.instagram.com/maisonsattvaia"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services d'accompagnement holistique",
      itemListElement: getServicesData()
    }
  };
}

// Données des services
export function getServicesData(): ServiceData[] {
  return [
    {
      "@type": "Service",
      name: "MAISON : L'Offre Signature en Duo",
      description: "Lecture systémique du binôme humain-animal, harmonisation et soin vibratoire en duo (3h-4h), à domicile ou en visio.",
      provider: {
        "@type": "Person",
        name: "Aïa"
      },
      areaServed: "Gard, Vaucluse, Drôme, Ardèche",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceType: "Consultation en présentiel ou à distance"
      },
      offers: {
        "@type": "Offer",
        price: "180",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock"
      }
    },
    {
      "@type": "Service",
      name: "SATTVA : L'Offre Humaine",
      description: "Bilan de terrain, magnétisme, MTC et lecture vibratoire pour retrouver votre axe originel.",
      provider: {
        "@type": "Person",
        name: "Aïa"
      },
      areaServed: "Gard, Vaucluse, Drôme, Ardèche",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceType: "Consultation en présentiel ou à distance"
      },
      offers: {
        "@type": "Offer",
        price: "120",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock"
      }
    },
    {
      "@type": "Service",
      name: "AÏA : L'Offre Animale",
      description: "Santé naturelle, communication intuitive et soins vibratoires pour le bien-être de vos compagnons.",
      provider: {
        "@type": "Person",
        name: "Aïa"
      },
      areaServed: "Gard, Vaucluse, Drôme, Ardèche",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceType: "Consultation en présentiel ou à distance"
      },
      offers: {
        "@type": "Offer",
        price: "80",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock"
      }
    }
  ];
}

// Données structurées pour les témoignages
export function getReviewsData(): ReviewData[] {
  return [
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5
      },
      author: {
        "@type": "Person",
        name: "Marie L."
      },
      reviewBody: "Un accompagnement exceptionnel qui m'a permis de retrouver mon équilibre naturel. Naima a une approche très professionnelle et bienveillante.",
      datePublished: "2024-01-15"
    },
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5
      },
      author: {
        "@type": "Person",
        name: "Jean-Pierre M."
      },
      reviewBody: "Les soins énergétiques ont transformé ma relation avec mon chien. Communication intuitive remarquable et résultats visibles dès la première séance.",
      datePublished: "2024-02-03"
    },
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5
      },
      author: {
        "@type": "Person",
        name: "Sophie D."
      },
      reviewBody: "Pendant le soin, j'ai ressenti une chaleur douce et un apaisement profond. Après, c'était comme si un poids s'était levé. Je dors enfin sereinement, ça a changé mon quotidien.",
      datePublished: "2024-03-10"
    },
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5
      },
      author: {
        "@type": "Person",
        name: "Élodie M."
      },
      reviewBody: "Cet accompagnement a été une vraie révélation. J'ai compris des choses que je ressentais sans jamais réussir à les exprimer. Ça m'a donné une confiance nouvelle pour avancer dans mes choix de vie.",
      datePublished: "2024-03-20"
    }
  ];
}

// Données structurées pour les FAQ
export function getFAQData(): FAQData {
  return {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Qu'est-ce que la naturopathie et comment peut-elle m'aider ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La naturopathie est une médecine naturelle qui vise à stimuler les mécanismes naturels d'auto-guérison du corps. Elle utilise des méthodes naturelles comme l'alimentation, les plantes, l'exercice physique et la gestion du stress. Nous proposons des consultations personnalisées pour retrouver votre équilibre naturel dans le Gard, Vaucluse, Drôme et Ardèche."
        }
      },
      {
        "@type": "Question",
        name: "Les consultations naturopathie peuvent-elles se faire à distance ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, la plupart de nos accompagnements peuvent se faire à distance via visioconférence. Cela inclut la naturopathie humaine et animale et les soins énergétiques. Nous servons le Gard, Vaucluse, Drôme et Ardèche avec des consultations en présentiel et à distance."
        }
      },
      {
        "@type": "Question",
        name: "Proposez-vous des soins énergétiques pour les animaux ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolument ! Nous proposons des soins naturopathiques et énergétiques spécialisés pour les animaux de compagnie, avec une approche douce et respectueuse de leur nature. Communication animale, soins énergétiques et naturopathie vétérinaire naturelle."
        }
      },
      {
        "@type": "Question",
        name: "Combien de séances de naturopathie sont nécessaires ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le nombre de séances varie selon chaque situation. Nous proposons généralement un premier bilan suivi de 2-3 séances de suivi, mais chaque accompagnement est personnalisé selon vos besoins. Pour les soins énergétiques, 1 à 3 séances suffisent souvent."
        }
      },
      {
        "@type": "Question",
        name: "Quelle est la différence entre naturopathie et soins énergétiques ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La naturopathie s'occupe du corps physique (alimentation, hygiène de vie, plantes), tandis que les soins énergétiques travaillent sur les corps subtils et les blocages énergétiques. Nous combinons les deux approches pour un accompagnement holistique complet."
        }
      },
      {
        "@type": "Question",
        name: "Comment prendre rendez-vous avec La Maison Sattvaïa ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vous pouvez prendre rendez-vous facilement via notre site internet ou nous contacter directement. Nous proposons des consultations en présentiel dans le Gard, Vaucluse, Drôme et Ardèche, ou à distance pour toute la France. Horaires : du lundi au vendredi 9h-18h, samedi 9h-17h."
        }
      }
    ]
  };
}

// Données structurées pour le breadcrumb
export function getBreadcrumbData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Données structurées pour les articles de blog
export function getArticleData(article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: "La Maison Sattvaïa",
      logo: {
        "@type": "ImageObject",
        url: "https://www.maisonsattvaia.fr/favicon/favicon.svg"
      }
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: article.image,
    url: article.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url
    }
  };
}
