// 🦀 Rust Gateway API Client - Unified Interface

import type { 
  Business, 
  CreateBusinessDto, 
  UpdateBusinessDto, 
  BusinessFilters,
  Subscription 
} from '@/types/business';
import type { ChatRequest, ChatResponse, Conversation } from '@/types/chat';
import type { BusinessMetrics, AIInsight } from '@/types/metrics';
import { MetricsPeriod } from '@/types/metrics';
import type { User, AuthTokens, LoginDto, SignupDto } from '@/types/user';

const RUST_API_URL = process.env.NEXT_PUBLIC_RUST_API || 'http://127.0.0.1:8000';

// ==================== AUTH HEADER ====================
function getAuthHeader(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// ==================== FETCH WRAPPER ====================

async function fetchRust<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${RUST_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API Error: ${response.status}`);
  }

  return response.json();
}

// ==================== BUSINESSES API ====================

export const businessesApi = {
  // Получить все бизнесы (для витрины)
  getAll: async (filters?: BusinessFilters): Promise<Business[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    
    const query = params.toString();
    return fetchRust<Business[]>(`/businesses${query ? `?${query}` : ''}`);
  },

  // Получить бизнес по ID
  getById: async (id: string): Promise<Business> => {
    return fetchRust<Business>(`/businesses/${id}`);
  },

  // Получить бизнес по slug
  getBySlug: async (slug: string): Promise<Business> => {
    return fetchRust<Business>(`/businesses/slug/${slug}`);
  },

  // Создать бизнес
  create: async (data: CreateBusinessDto): Promise<Business> => {
    return fetchRust<Business>('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Обновить бизнес
  update: async (id: string, data: UpdateBusinessDto): Promise<Business> => {
    return fetchRust<Business>(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Удалить бизнес
  delete: async (id: string): Promise<void> => {
    return fetchRust<void>(`/businesses/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== SUBSCRIPTIONS API ====================

export const subscriptionsApi = {
  // Подписаться на бизнес
  subscribe: async (business_id: string): Promise<Subscription> => {
    return fetchRust<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ business_id }),
    });
  },

  // Отписаться
  unsubscribe: async (subscription_id: string): Promise<void> => {
    return fetchRust<void>(`/subscriptions/${subscription_id}`, {
      method: 'DELETE',
    });
  },

  // Получить подписки пользователя
  getUserSubscriptions: async (): Promise<Subscription[]> => {
    return fetchRust<Subscription[]>('/subscriptions');
  },
};

// ==================== CHAT API ====================

export const chatApi = {
  // Отправить сообщение
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    return fetchRust<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Получить подсказки для начала разговора
  getSuggestions: async (business_id?: string): Promise<string[]> => {
    const params = business_id ? `?business_id=${business_id}` : '';
    return fetchRust<string[]>(`/chat/suggestions${params}`);
  },

  // Получить историю бесед
  getConversations: async (): Promise<Conversation[]> => {
    return fetchRust<Conversation[]>('/chat/conversations');
  },

  // Получить конкретную беседу
  getConversation: async (id: string): Promise<Conversation> => {
    return fetchRust<Conversation>(`/chat/conversations/${id}`);
  },
};

// ==================== METRICS API (Admin) ====================

export const metricsApi = {
  // Получить метрики бизнеса
  getMetrics: async (business_id: string, period: MetricsPeriod = MetricsPeriod.MONTH): Promise<BusinessMetrics> => {
    return fetchRust<BusinessMetrics>(`/admin/metrics?business_id=${business_id}&period=${period}`);
  },

  // Получить выручку
  getRevenue: async (business_id: string, period: MetricsPeriod): Promise<BusinessMetrics['revenue']> => {
    return fetchRust(`/admin/metrics/revenue?business_id=${business_id}&period=${period}`);
  },

  // Получить статистику заказов
  getOrdersMetrics: async (business_id: string, period: MetricsPeriod): Promise<BusinessMetrics['orders']> => {
    return fetchRust(`/admin/metrics/orders?business_id=${business_id}&period=${period}`);
  },

  // Получить конверсию
  getConversion: async (business_id: string, period: MetricsPeriod): Promise<BusinessMetrics['conversion']> => {
    return fetchRust(`/admin/metrics/conversion?business_id=${business_id}&period=${period}`);
  },
};

// ==================== INSIGHTS API ====================

export const insightsApi = {
  // Получить AI инсайты
  getInsights: async (business_id: string): Promise<AIInsight[]> => {
    return fetchRust<AIInsight[]>(`/insights?business_id=${business_id}`);
  },

  // Запросить генерацию новых инсайтов
  generateInsights: async (business_id: string): Promise<AIInsight[]> => {
    return fetchRust<AIInsight[]>('/insights/generate', {
      method: 'POST',
      body: JSON.stringify({ business_id }),
    });
  },
};

// ==================== AUTH API ====================

export const authApi = {
  // Вход
  login: async (data: LoginDto): Promise<{ user: User; tokens: AuthTokens }> => {
    return fetchRust('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Регистрация
  signup: async (data: SignupDto): Promise<{ user: User; tokens: AuthTokens }> => {
    return fetchRust('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Получить текущего пользователя
  getCurrentUser: async (): Promise<User> => {
    return fetchRust('/auth/me');
  },

  // Обновить токен
  refreshToken: async (refresh_token: string): Promise<AuthTokens> => {
    return fetchRust('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    });
  },
};

// ==================== SIMPLIFIED EXPORTS ====================

/**
 * 🏪 Получить все бизнесы для витрины
 */
export async function fetchBusinesses(filters?: BusinessFilters): Promise<Business[]> {
  return businessesApi.getAll(filters);
}

/**
 * 💬 Отправить сообщение в AI чат
 */
export async function sendChatMessage(userId: string, message: string, businessId?: string): Promise<any> {
  return fetchRust('/api/v1/chat/message', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      message,
      business_id: businessId,
    }),
  });
}

/**
 * 📊 Получить метрики бизнеса
 */
export async function fetchMetrics(businessId: string, period: MetricsPeriod = MetricsPeriod.MONTH): Promise<BusinessMetrics> {
  return fetchRust<BusinessMetrics>(`/admin/metrics?business_id=${businessId}&period=${period}`);
}

/**
 * 💡 Получить AI инсайты
 */
export async function fetchInsights(businessId: string): Promise<AIInsight[]> {
  return fetchRust<AIInsight[]>(`/api/v1/insights?business=${businessId}`);
}

/**
 * 🔄 Health check
 */
export async function healthCheck(): Promise<{ status: string }> {
  return fetchRust('/health');
}
