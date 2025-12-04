// Single-User Portfolio API Client
// Shuttle Production: https://portfolio-a4yb.shuttle.app
// Local Development: http://localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-a4yb.shuttle.app';

console.log('🔧 API Client initialized with URL:', API_BASE_URL);
console.log('🔧 NEXT_PUBLIC_API_URL from env:', process.env.NEXT_PUBLIC_API_URL);

export interface Portfolio {
  id: string;
  slug: string;
  theme: string;
  data: any;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
}

// Auth API (Single-User)
export const authAPI = {
  /**
   * Admin login - single password
   */
  async login(password: string): Promise<AuthResponse> {
    console.log('🔐 Attempting login to:', `${API_BASE_URL}/api/auth/login`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Login error:', error);
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ Login successful');
      
      // Save token to localStorage
      if (data.token) {
        tokenStorage.set(data.token);
      }

      return data;
    } catch (error) {
      console.error('❌ Login exception:', error);
      throw error;
    }
  },

  /**
   * Logout - clear token
   */
  logout(): void {
    tokenStorage.remove();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.get() !== null;
  },
};

// Portfolio API (Single-User)
export const portfolioAPI = {
  /**
   * Get portfolio (public access)
   */
  async get(): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/api/portfolio`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Portfolio not found');
    }

    return response.json();
  },

  /**
   * Update portfolio (requires authentication)
   */
  async update(data: {
    theme?: string;
    data: any;
  }): Promise<Portfolio> {
    const token = tokenStorage.get();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update portfolio');
    }

    return response.json();
  },
};

// Token management
export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('portfolio_token');
  },

  set(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('portfolio_token', token);
  },

  remove(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('portfolio_token');
  },
};

// Health check
export const healthAPI = {
  async check(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};

// Image Upload API (Cloudinary)
export interface UploadResponse {
  url: string;
  public_id: string;
  width: number;
  height: number;
}

export const uploadAPI = {
  /**
   * Upload image file (multipart form-data)
   */
  async uploadFile(file: File, folder?: string): Promise<UploadResponse> {
    const token = tokenStorage.get();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('📤 Upload response status:', response.status);
    console.log('📤 Upload response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload error response:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error || 'Upload failed');
      } catch {
        throw new Error(`Upload failed: ${errorText}`);
      }
    }

    const result = await response.json();
    console.log('✅ Upload result:', result);
    return result;
  },

  /**
   * Upload image from base64 string
   */
  async uploadBase64(base64Image: string, folder?: string): Promise<UploadResponse> {
    const token = tokenStorage.get();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/upload/base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        image: base64Image,
        folder,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    const token = tokenStorage.get();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }
  },
};

// Blog API
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
  readTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
  readTime: string;
}

export interface UpdateBlogPost {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  author?: string;
  image?: string;
  category?: string;
  readTime?: string;
}

export const blogAPI = {
  /**
   * Get all blog posts (public)
   */
  async getAll(): Promise<BlogPost[]> {
    const response = await fetch(`${API_BASE_URL}/api/blog`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch blog posts');
    }

    const posts = await response.json();
    
    // Convert snake_case to camelCase for frontend
    return posts.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
      image: post.image,
      category: post.category,
      readTime: post.read_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }));
  },

  /**
   * Get single blog post by slug (public)
   */
  async getBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/api/blog/slug/${slug}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Blog post not found');
    }

    const post = await response.json();
    
    // Convert snake_case to camelCase
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
      image: post.image,
      category: post.category,
      readTime: post.read_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };
  },

  /**
   * Create new blog post (requires authentication)
   */
  async create(data: CreateBlogPost): Promise<BlogPost> {
    const token = tokenStorage.get();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Convert camelCase to snake_case for backend
    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      date: data.date,
      author: data.author,
      image: data.image,
      category: data.category,
      read_time: data.readTime,
    };

    const response = await fetch(`${API_BASE_URL}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create blog post');
    }

    const post = await response.json();
    
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
      image: post.image,
      category: post.category,
      readTime: post.read_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };
  },

  /**
   * Update blog post (requires authentication)
   */
  async update(id: string, data: UpdateBlogPost): Promise<BlogPost> {
    const token = tokenStorage.get();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Convert camelCase to snake_case for backend
    const payload: any = {};
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.title !== undefined) payload.title = data.title;
    if (data.excerpt !== undefined) payload.excerpt = data.excerpt;
    if (data.content !== undefined) payload.content = data.content;
    if (data.date !== undefined) payload.date = data.date;
    if (data.author !== undefined) payload.author = data.author;
    if (data.image !== undefined) payload.image = data.image;
    if (data.category !== undefined) payload.category = data.category;
    if (data.readTime !== undefined) payload.read_time = data.readTime;

    const response = await fetch(`${API_BASE_URL}/api/blog/id/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update blog post');
    }

    const post = await response.json();
    
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
      image: post.image,
      category: post.category,
      readTime: post.read_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };
  },

  /**
   * Delete blog post (requires authentication)
   */
  async delete(id: string): Promise<void> {
    const token = tokenStorage.get();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/blog/id/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete blog post');
    }
  },
};
