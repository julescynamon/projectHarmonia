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
