/*
  # Ajout de produits de test

  1. Nouveaux Produits
    - Guide de phytothérapie
    - Guide d'alimentation naturelle pour chiens et chats
    - Guide de gestion du stress
    - Guide de nutrition holistique

  2. Catégories
    - Naturopathie
    - Animaux
    - Bien-être
    - Nutrition
*/

INSERT INTO products (title, description, price, category, pdf_path)
VALUES
  (
    'Guide Complet de Phytothérapie',
    'Un guide détaillé sur l''utilisation des plantes médicinales au quotidien.\n\nDécouvrez les propriétés de plus de 50 plantes essentielles et apprenez à les utiliser en toute sécurité.\n\nInclut des fiches pratiques et des recettes de préparations maison.',
    29.99,
    'Naturopathie',
    'guides/phytotherapie.pdf'
  ),
  (
    'Alimentation Naturelle pour Animaux',
    'Guide pratique pour une alimentation saine et équilibrée de vos animaux de compagnie.\n\nApprenez à préparer des repas adaptés aux besoins de vos chiens et chats.\n\nInclut des menus types et des conseils nutritionnels.',
    24.99,
    'Animaux',
    'guides/alimentation-animale.pdf'
  ),
  (
    'Guide Anti-Stress Naturel',
    'Méthodes et techniques naturelles pour gérer efficacement le stress.\n\nDécouvrez des exercices de respiration, de méditation et des remèdes naturels.\n\nInclut un programme de 21 jours pour retrouver la sérénité.',
    19.99,
    'Bien-être',
    'guides/anti-stress.pdf'
  ),
  (
    'Nutrition Holistique',
    'Les fondamentaux d''une alimentation saine selon les principes de la naturopathie.\n\nApprenez à équilibrer vos repas et à choisir des aliments de qualité.\n\nInclut des recettes et des plans de repas hebdomadaires.',
    34.99,
    'Nutrition',
    'guides/nutrition.pdf'
  );