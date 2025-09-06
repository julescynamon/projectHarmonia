// Types pour le système de blog avec TipTap
// src/types/blog.ts

// Type pour le contenu TipTap JSON
export interface TipTapContent {
  type: string;
  content?: TipTapContent[];
  attrs?: Record<string, any>;
  text?: string;
  marks?: TipTapMark[];
}

export interface TipTapMark {
  type: string;
  attrs?: Record<string, any>;
}

// Type pour le statut d'un article
export type PostStatus = 'draft' | 'published';

// Type principal pour un article
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_url?: string;
  cover_alt?: string;
  content: TipTapContent;
  status: PostStatus;
  published_at?: string;
  author_id?: string;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

// Type pour créer un nouvel article
export type NewPost = Omit<Post, 'id' | 'created_at' | 'updated_at' | 'slug' | 'author_id'>;

// Type pour mettre à jour un article
export type UpdatePost = Partial<Omit<Post, 'id' | 'created_at' | 'updated_at' | 'author_id'>>;

// Type pour l'upload d'images
export interface ImageUploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  mime_type: string;
}

// Type pour la réponse de l'API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Type pour la liste des articles avec pagination
export interface PostsListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Type pour les filtres de recherche
export interface PostFilters {
  status?: PostStatus;
  author_id?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

// Types hérités pour la compatibilité (à supprimer progressivement)
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}

export type NewBlogPost = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'slug' | 'author_id'>;
