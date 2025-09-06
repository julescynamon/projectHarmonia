// src/lib/constants.ts

// Catégories du blog - centralisées pour éviter les incohérences
export const BLOG_CATEGORIES = [
  { id: 'sante-naturelle et bien-etre', label: 'Santé Naturelle et Bien-être' },
  { id: 'bien-être animal', label: 'Bien-être Animal' },
  { id: 'developpement-personnel', label: 'Développement Personnel' },
  { id: 'spiritualite et energie', label: 'Spiritualité et Énergie' },
  { id: 'inspiration et vie quotidienne', label: 'Inspiration et Vie Quotidienne' }
] as const;

// Type pour les IDs de catégories
export type BlogCategoryId = typeof BLOG_CATEGORIES[number]['id'];

// Fonction utilitaire pour obtenir le label d'une catégorie
export function getCategoryLabel(categoryId: string): string {
  const category = BLOG_CATEGORIES.find(cat => cat.id === categoryId);
  return category?.label || categoryId;
}
