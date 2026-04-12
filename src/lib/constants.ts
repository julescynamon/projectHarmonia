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

type PostCategoryFields = {
  category?: string | null;
  tags?: string[] | null;
};

/** Libellé affichable de la catégorie (aligné sur les filtres du blog). */
export function getPostCategory(post: PostCategoryFields): string {
  const raw = typeof post?.category === 'string' ? post.category.trim() : '';
  if (raw) {
    const byId = BLOG_CATEGORIES.find((c) => c.id === raw);
    if (byId) return byId.label;
    const byLabel = BLOG_CATEGORIES.find((c) => c.label.toLowerCase() === raw.toLowerCase());
    if (byLabel) return byLabel.label;
    return raw;
  }
  if (Array.isArray(post?.tags) && post.tags.length > 0) {
    const firstTag = typeof post.tags[0] === 'string' ? post.tags[0].trim() : '';
    if (firstTag) {
      const match = BLOG_CATEGORIES.find((c) => c.label.toLowerCase() === firstTag.toLowerCase());
      if (match) return match.label;
      return firstTag;
    }
  }
  return 'Article';
}

/** URL de liste blog filtrée (paramètre `category` comme sur /blog). */
export function getBlogCategoryListUrl(
  displayLabel: string,
  post?: PostCategoryFields
): string {
  const raw = typeof post?.category === 'string' ? post.category.trim() : '';
  if (raw) {
    if (BLOG_CATEGORIES.some((c) => c.id === raw)) {
      return `/blog?category=${encodeURIComponent(raw)}`;
    }
    const byLabel = BLOG_CATEGORIES.find((c) => c.label.toLowerCase() === raw.toLowerCase());
    if (byLabel) return `/blog?category=${encodeURIComponent(byLabel.id)}`;
  }
  const byDisplay = BLOG_CATEGORIES.find(
    (c) => c.label.toLowerCase() === displayLabel.toLowerCase()
  );
  if (byDisplay) return `/blog?category=${encodeURIComponent(byDisplay.id)}`;
  if (post && Array.isArray(post.tags) && post.tags.length > 0) {
    const tag = String(post.tags[0]).trim();
    const byTag = BLOG_CATEGORIES.find((c) => c.label.toLowerCase() === tag.toLowerCase());
    if (byTag) return `/blog?category=${encodeURIComponent(byTag.id)}`;
  }
  return '/blog';
}
