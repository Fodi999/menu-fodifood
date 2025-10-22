// 🦀 Rust Gateway API Client - Unified Interface

import type { 
  Business, 
  CreateBusinessDto, 
  UpdateBusinessDto, 
  BusinessFilters,
  Subscription 
} from '@/types/business';
import type { ChatRequest, ChatResponse, Conversation } from '@/types/chat';
import { MessageRole } from '@/types/chat';
import type { BusinessMetrics, AIInsight } from '@/types/metrics';
import { MetricsPeriod } from '@/types/metrics';
import type { User, AuthTokens, LoginDto, SignupDto } from '@/types/user';

// 🚀 Shuttle Production URL
const RUST_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bot-fodifood-lcon.shuttle.app/api/v1';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://bot-fodifood-lcon.shuttle.app/ws';

// Debug: Log API URL on load
if (typeof window !== 'undefined') {
  console.log('🔧 Rust API URL:', RUST_API_URL);
  console.log('🔌 WebSocket URL:', WS_URL);
}

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

  // Получить статистику бизнеса
  getStats: async (businessId?: string): Promise<{
    orders_today: number;
    revenue_today: number;
    clients_total: number;
    rating: number;
    products_count: number;
    reviews_count: number;
    subscribers_count: number;
  }> => {
    const endpoint = businessId 
      ? `/businesses/${businessId}/stats` 
      : '/businesses/stats';
    return fetchRust(endpoint);
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
    // Backend Shuttle возвращает {intent, response, suggestions, products}
    // Нужно трансформировать в ChatResponse
    const backendResponse = await fetchRust<{
      intent: string;
      response: string;
      suggestions: string[] | null;
      products: any[] | null;
    }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    // Преобразуем ответ backend в ChatResponse
    return {
      message: {
        id: `msg_${Date.now()}`,
        user_id: request.user_id || 'anonymous',
        business_id: request.business_id,
        role: MessageRole.ASSISTANT,
        content: backendResponse.response,
        product_suggestions: backendResponse.products?.map(p => ({
          product_id: p.id || p.product_id,
          product_name: p.name || p.product_name,
          product_description: p.description || p.product_description || '',
          product_price: p.price || p.product_price || 0,
          product_image_url: p.image_url || p.product_image_url,
          reason: p.reason || 'Рекомендовано AI'
        })),
        created_at: new Date().toISOString(),
      },
      suggestions: backendResponse.products?.map(p => ({
        product_id: p.id || p.product_id,
        product_name: p.name || p.product_name,
        product_description: p.description || p.product_description || '',
        product_price: p.price || p.product_price || 0,
        product_image_url: p.image_url || p.product_image_url,
        reason: p.reason || 'Рекомендовано AI'
      })),
    };
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
  // Регистрация (используем /auth/register, не /auth/signup)
  signup: async (data: SignupDto): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetchRust<{ 
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      }
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Преобразуем ответ в ожидаемый формат
    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      tokens: {
        access_token: response.token,
        refresh_token: response.token, // Shuttle использует один токен
        expires_in: 86400,
      },
    };
  },

  // Вход
  login: async (data: LoginDto): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetchRust<{ 
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Преобразуем ответ в ожидаемый формат
    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      tokens: {
        access_token: response.token,
        refresh_token: response.token,
        expires_in: 86400,
      },
    };
  },

  // Получить текущего пользователя
  getCurrentUser: async (): Promise<User> => {
    const response = await fetchRust<{
      id: string;
      email: string;
      name: string;
      role: string;
    }>('/user/profile');

    return {
      id: response.id,
      email: response.email,
      name: response.name,
      role: response.role as any,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  // Обновить токен (Shuttle использует тот же токен)
  refreshToken: async (refresh_token: string): Promise<AuthTokens> => {
    return {
      access_token: refresh_token,
      refresh_token: refresh_token,
      expires_in: 86400,
    };
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

// ==================== WEBSOCKET API ====================

/**
 * 🔌 WebSocket connection for real-time updates
 */
export class FodiWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    private onMessage: (data: any) => void,
    private onError?: (error: Event) => void,
    private onClose?: () => void
  ) {}

  connect(userId?: string) {
    const url = userId ? `${WS_URL}?user_id=${userId}` : WS_URL;
    
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected to Shuttle backend');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.onError?.(error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.onClose?.();
        this.attemptReconnect(userId);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  private attemptReconnect(userId?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect(userId);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

/**
 * 🔌 Create WebSocket connection
 */
export function createWebSocket(
  onMessage: (data: any) => void,
  onError?: (error: Event) => void,
  onClose?: () => void
): FodiWebSocket {
  return new FodiWebSocket(onMessage, onError, onClose);
}

// ==================== 🏦 BANK API ====================

import type { BankStats, FullBalance, RewardRequest, RewardResponse, TransferRequest, TransferResponse } from '@/types/bank';

/**
 * 🏦 Bank API for FODI token management
 */
export const bankApi = {
  /**
   * Get bank statistics (total supply, transactions, users, etc.)
   */
  getStats: async (): Promise<BankStats> => {
    const response = await fetch('https://bot-fodifood-lcon.shuttle.app/api/bank/stats');
    if (!response.ok) throw new Error('Failed to fetch bank stats');
    return response.json();
  },

  /**
   * Get full balance for a user (bank + Solana)
   */
  getBalance: async (userId: string): Promise<FullBalance> => {
    const response = await fetch(`https://bot-fodifood-lcon.shuttle.app/api/bank/balance/${userId}/full`);
    if (!response.ok) throw new Error('Failed to fetch balance');
    return response.json();
  },

  /**
   * Issue reward to a user
   */
  issueReward: async (data: RewardRequest): Promise<RewardResponse> => {
    const response = await fetch('https://bot-fodifood-lcon.shuttle.app/api/bank/reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to issue reward');
    return response.json();
  },

  /**
   * Transfer tokens between users
   */
  transfer: async (data: TransferRequest): Promise<TransferResponse> => {
    const response = await fetch('https://bot-fodifood-lcon.shuttle.app/api/bank/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to transfer tokens');
    return response.json();
  },
};
