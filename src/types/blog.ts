export interface BlogPostAuthor {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

export interface BlogPostTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPostCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: BlogPostCategory | null;
  author: BlogPostAuthor;
  tags: BlogPostTag[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  views_count: number;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: BlogPostCategory | null;
  author: BlogPostAuthor;
  tags: BlogPostTag[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at: string | null;
  views_count: number;
  reading_time_minutes: number;
  created_at: string;
}

export interface BlogFilters {
  page?: number;
  category?: string;
  tag?: string;
  q?: string;
  status?: string;
}

export interface CreateBlogPostPayload {
  title: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  category_id?: number | null;
  tags?: number[];
  status: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  published_at?: string | null;
}

export interface UpdateBlogPostPayload extends Partial<CreateBlogPostPayload> {}
