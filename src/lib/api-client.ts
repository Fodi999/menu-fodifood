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

// Blog API removed - not needed for restaurant application
