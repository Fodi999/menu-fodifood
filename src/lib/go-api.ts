// 🟢 Go Backend API Client (Products & Inventory)

import type { Product, CreateProductDto, UpdateProductDto } from '@/types/product';

const GO_API_URL = process.env.NEXT_PUBLIC_GO_API || 'http://127.0.0.1:8080/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function fetchGo<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${GO_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Go API Error: ${response.status}`);
  }

  return response.json();
}

// ==================== PRODUCTS API ====================

export const productsApi = {
  // Получить все продукты (с фильтром по business_id)
  getAll: async (business_id?: string): Promise<Product[]> => {
    const params = business_id ? `?business_id=${business_id}` : '';
    return fetchGo<Product[]>(`/products${params}`);
  },

  // Получить продукт по ID
  getById: async (id: string): Promise<Product> => {
    return fetchGo<Product>(`/products/${id}`);
  },

  // Создать продукт
  create: async (data: CreateProductDto): Promise<Product> => {
    return fetchGo<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Обновить продукт
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    return fetchGo<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Удалить продукт
  delete: async (id: string): Promise<void> => {
    return fetchGo<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== INGREDIENTS API ====================

export interface Ingredient {
  id: string;
  business_id: string;
  name: string;
  unit: string;
  quantity: number;
  min_quantity: number;
  price_per_unit: number;
  supplier?: string;
  category: string;
}

export const ingredientsApi = {
  getAll: async (business_id: string): Promise<Ingredient[]> => {
    return fetchGo<Ingredient[]>(`/ingredients?business_id=${business_id}`);
  },

  getById: async (id: string): Promise<Ingredient> => {
    return fetchGo<Ingredient>(`/ingredients/${id}`);
  },

  create: async (data: Omit<Ingredient, 'id'>): Promise<Ingredient> => {
    return fetchGo<Ingredient>('/ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Ingredient>): Promise<Ingredient> => {
    return fetchGo<Ingredient>(`/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchGo<void>(`/ingredients/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== SEMI-FINISHED API ====================

export interface SemiFinished {
  id: string;
  business_id: string;
  name: string;
  quantity: number;
  unit: string;
  ingredients: Array<{
    ingredient_id: string;
    quantity: number;
  }>;
  cost: number;
}

export const semiFinishedApi = {
  getAll: async (business_id: string): Promise<SemiFinished[]> => {
    return fetchGo<SemiFinished[]>(`/semi-finished?business_id=${business_id}`);
  },

  getById: async (id: string): Promise<SemiFinished> => {
    return fetchGo<SemiFinished>(`/semi-finished/${id}`);
  },

  create: async (data: Omit<SemiFinished, 'id' | 'cost'>): Promise<SemiFinished> => {
    return fetchGo<SemiFinished>('/semi-finished', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<SemiFinished>): Promise<SemiFinished> => {
    return fetchGo<SemiFinished>(`/semi-finished/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchGo<void>(`/semi-finished/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const goHealthCheck = async (): Promise<{ status: string }> => {
  return fetchGo('/health');
};
