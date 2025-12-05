// Restaurant API Client - Full Integration with Backend
// Shuttle Production: https://portfolio-a4yb.shuttle.app
// Local Development: http://localhost:8000

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-a4yb.shuttle.app';

console.log('🍽️ Restaurant API Client initialized with URL:', API_BASE_URL);

// ===== TYPE DEFINITIONS =====

export interface Category {
  id: number;
  name: string;
  name_ru: string;
  name_pl: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategory {
  name: string;
  name_ru: string;
  name_pl: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
}

export interface UpdateCategory {
  name?: string;
  name_ru?: string;
  name_pl?: string;
  slug?: string;
  description?: string;
  image?: string;
  order?: number;
  is_active?: boolean;
}

export interface MenuItem {
  id: number;
  category_id?: number;
  name: string;
  name_ru: string;
  name_pl: string;
  description: string;
  description_ru: string;
  description_pl: string;
  price: string; // BigDecimal as string
  original_price?: string;
  image: string;
  images?: string[];
  is_available?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  weight?: string;
  calories?: number;
  cooking_time?: number;
  ingredients?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItem {
  category_id: number;
  name: string;
  name_ru: string;
  name_pl: string;
  description: string;
  description_ru: string;
  description_pl: string;
  price: string;
  original_price?: string;
  image: string;
  images?: string[];
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  weight?: string;
  calories?: number;
  cooking_time?: number;
  ingredients?: string[];
  tags?: string[];
}

export interface UpdateMenuItem {
  category_id?: number;
  name?: string;
  name_ru?: string;
  name_pl?: string;
  description?: string;
  description_ru?: string;
  description_pl?: string;
  price?: string;
  original_price?: string;
  image?: string;
  images?: string[];
  is_available?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  allergens?: string[];
  weight?: string;
  calories?: number;
  cooking_time?: number;
  ingredients?: string[];
  tags?: string[];
}

export interface OrderItem {
  id: number;
  order_id?: number;
  menu_item_id?: number;
  menu_item_name: string;
  menu_item_price: string;
  quantity: number;
  special_instructions?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_street: string;
  delivery_building: string;
  delivery_apartment?: string;
  delivery_floor?: string;
  delivery_entrance?: string;
  delivery_intercom?: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_country: string;
  subtotal: string;
  delivery_fee: string;
  tax: string;
  total: string;
  payment_method: string;
  status: string;
  special_instructions?: string;
  delivery_time?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderItem {
  menu_item_id: number;
  quantity: number;
  special_instructions?: string;
}

export interface CreateOrder {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_street: string;
  delivery_building: string;
  delivery_apartment?: string;
  delivery_floor?: string;
  delivery_entrance?: string;
  delivery_intercom?: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_country?: string;
  payment_method: string;
  special_instructions?: string;
  items: CreateOrderItem[];
}

export interface UpdateOrderStatus {
  status: string;
}

export interface RestaurantInfo {
  id: number;
  name: string;
  name_ru: string;
  name_pl: string;
  description?: string;
  description_ru?: string;
  description_pl?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  opening_hours?: any;
  delivery_radius?: number;
  minimum_order?: string;
  delivery_fee?: string;
  free_delivery_from?: string;
  average_delivery_time?: number;
  social_media?: any;
  updated_at: string;
}

export interface UpdateRestaurantInfo {
  name?: string;
  name_ru?: string;
  name_pl?: string;
  description?: string;
  description_ru?: string;
  description_pl?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  opening_hours?: any;
  delivery_radius?: number;
  minimum_order?: string;
  delivery_fee?: string;
  free_delivery_from?: string;
  average_delivery_time?: number;
  social_media?: any;
}

// ===== HELPER FUNCTIONS =====

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Error:', response.status, errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  return data;
}

// ===== CATEGORIES API =====

export const categoriesAPI = {
  /**
   * Get all categories (public)
   */
  async getAll(): Promise<Category[]> {
    console.log('📂 Fetching all categories');
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/categories`);
    return handleResponse<Category[]>(response);
  },

  /**
   * Get category by ID (public)
   */
  async getById(id: number): Promise<Category> {
    console.log('📂 Fetching category by ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/categories/${id}`);
    return handleResponse<Category>(response);
  },

  /**
   * Get category by slug (public)
   */
  async getBySlug(slug: string): Promise<Category> {
    console.log('📂 Fetching category by slug:', slug);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/categories/slug/${slug}`);
    return handleResponse<Category>(response);
  },

  /**
   * Create new category (admin only)
   */
  async create(data: CreateCategory): Promise<Category> {
    console.log('📂 Creating category:', data);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse<Category>(response);
  },

  /**
   * Update category (admin only)
   */
  async update(id: number, data: UpdateCategory): Promise<Category> {
    console.log('📂 Updating category:', id, data);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse<Category>(response);
  },

  /**
   * Delete category (admin only)
   */
  async delete(id: number): Promise<void> {
    console.log('📂 Deleting category:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete category: ${errorText}`);
    }
  },
};

// ===== MENU API =====

export const menuAPI = {
  /**
   * Get all menu items (public)
   */
  async getAll(): Promise<MenuItem[]> {
    console.log('🍽️ Fetching all menu items');
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/menu`);
    return handleResponse<MenuItem[]>(response);
  },

  /**
   * Get menu item by ID (public)
   */
  async getById(id: number): Promise<MenuItem> {
    console.log('🍽️ Fetching menu item by ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/menu/${id}`);
    return handleResponse<MenuItem>(response);
  },

  /**
   * Get menu items by category (public)
   */
  async getByCategory(categoryId: number): Promise<MenuItem[]> {
    console.log('🍽️ Fetching menu items by category:', categoryId);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/menu/category/${categoryId}`);
    return handleResponse<MenuItem[]>(response);
  },

  /**
   * Create new menu item (admin only)
   */
  async create(data: CreateMenuItem): Promise<MenuItem> {
    console.log('🍽️ Creating menu item:', data);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse<MenuItem>(response);
  },

  /**
   * Update menu item (admin only)
   */
  async update(id: number, data: UpdateMenuItem): Promise<MenuItem> {
    console.log('🍽️ Updating menu item:', id, data);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse<MenuItem>(response);
  },

  /**
   * Delete menu item (admin only)
   */
  async delete(id: number): Promise<void> {
    console.log('🍽️ Deleting menu item:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete menu item: ${errorText}`);
    }
  },
};

// ===== ORDERS API =====

export const ordersAPI = {
  /**
   * Create new order (public)
   */
  async create(data: CreateOrder): Promise<OrderWithItems> {
    console.log('📦 Creating order:', data);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse<OrderWithItems>(response);
  },

  /**
   * Get order by order number (public)
   */
  async getByOrderNumber(orderNumber: string): Promise<OrderWithItems> {
    console.log('📦 Fetching order by number:', orderNumber);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/orders/${orderNumber}`);
    return handleResponse<OrderWithItems>(response);
  },

  /**
   * Get all orders (admin only)
   */
  async getAllAdmin(): Promise<OrderWithItems[]> {
    console.log('📦 Fetching all orders (admin)');
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/orders`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse<OrderWithItems[]>(response);
  },

  /**
   * Get order by ID (admin only)
   */
  async getByIdAdmin(id: number): Promise<OrderWithItems> {
    console.log('📦 Fetching order by ID (admin):', id);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse<OrderWithItems>(response);
  },

  /**
   * Update order status (admin only)
   */
  async updateStatus(id: number, status: string): Promise<Order> {
    console.log('📦 Updating order status:', id, status);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    return handleResponse<Order>(response);
  },

  /**
   * Cancel order (admin only)
   */
  async cancel(id: number): Promise<Order> {
    console.log('📦 Cancelling order:', id);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/orders/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    
    return handleResponse<Order>(response);
  },
};

// ===== RESTAURANT INFO API =====

export const restaurantInfoAPI = {
  /**
   * Get restaurant info (public)
   */
  async get(): Promise<RestaurantInfo> {
    console.log('ℹ️ Fetching restaurant info');
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/info`);
    return handleResponse<RestaurantInfo>(response);
  },

  /**
   * Update restaurant info (admin only)
   */
  async update(data: UpdateRestaurantInfo): Promise<RestaurantInfo> {
    console.log('ℹ️ Updating restaurant info:', data);
    
    const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/info`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse<RestaurantInfo>(response);
  },
};

// ===== CLOUDINARY UPLOAD API =====

export const uploadAPI = {
  /**
   * Upload image to Cloudinary via backend
   */
  async uploadImage(file: File): Promise<{ url: string; public_id: string }> {
    console.log('📤 Uploading image:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload Error:', response.status, errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }
    
    return await response.json();
  },
};

// Export everything
export default {
  categoriesAPI,
  menuAPI,
  ordersAPI,
  restaurantInfoAPI,
  uploadAPI,
};
