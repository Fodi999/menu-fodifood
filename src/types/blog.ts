export interface BlogPost {
  id: number;
  slug: string; // URL-friendly identifier (e.g., "my-first-post")
  title: string;
  excerpt: string; // Short description for preview cards and meta description
  content: string; // Full article content (Markdown or HTML)
  coverImage: string; // Main image URL from Cloudinary
  authorName?: string;
  authorImage?: string;
  publishedAt: string; // ISO date string
  updatedAt?: string;
  tags?: string[]; // Categories/tags for filtering
  metaTitle?: string; // SEO title (defaults to title if not set)
  metaDescription?: string; // SEO description (defaults to excerpt)
  metaKeywords?: string; // SEO keywords
  isPublished: boolean; // Draft vs published state
  viewCount?: number;
  readingTime?: number; // Estimated reading time in minutes
}

export interface CreateBlogPostDTO {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName?: string;
  authorImage?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isPublished?: boolean;
}

export interface UpdateBlogPostDTO {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  authorName?: string;
  authorImage?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isPublished?: boolean;
}
