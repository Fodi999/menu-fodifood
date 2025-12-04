// API Configuration
// Shuttle Production: https://portfolio-a4yb.shuttle.app
// Local Development: http://localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-a4yb.shuttle.app';

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
  read_time: string;
  created_at: string;
  updated_at: string;
}

// Auth API
export const authAPI = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },
};

// Portfolio API (Single Portfolio System)
export const portfolioAPI = {
  // Public - get the single portfolio
  async get(): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/api/portfolio`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Portfolio not found');
    }

    return response.json();
  },

  // Protected - update portfolio (requires admin token)
  async update(token: string, data: {
    slug?: string;
    theme?: string;
    data?: any;
  }): Promise<Portfolio> {
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

// Blog API
export const blogAPI = {
  // Public - get all posts
  async getAll(): Promise<BlogPost[]> {
    const response = await fetch(`${API_BASE_URL}/api/blog`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch blog posts');
    }

    return response.json();
  },

  // Public - get post by slug
  async getBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/api/blog/slug/${slug}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Blog post not found');
    }

    return response.json();
  },

  // Protected - create post (requires admin token)
  async create(token: string, data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create blog post');
    }

    return response.json();
  },

  // Protected - update post (requires admin token)
  async update(token: string, id: string, data: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/api/blog/id/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update blog post');
    }

    return response.json();
  },

  // Protected - delete post (requires admin token)
  async delete(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/blog/id/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete blog post');
    }
  },
};

// Token management
export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  set(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },

  remove(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.get();
  },
};

// Upload API (Cloudinary)
export const uploadAPI = {
  // Protected - upload image file (requires admin token)
  async uploadFile(token: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    return response.json();
  },

  // Protected - upload base64 image (requires admin token)
  async uploadBase64(token: string, base64: string): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE_URL}/api/upload/base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ image: base64 }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    return response.json();
  },
};
