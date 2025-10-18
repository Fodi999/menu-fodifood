/**
 * Unified API client for Rust Backend (Shuttle)
 * With automatic fallback to Mock API if backend is unavailable.
 */

import { mockApi } from "./mock-api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

let rustAvailable = true;
let checkedOnce = false;

/**
 * Check Rust backend health once per session
 * Uses sessionStorage for caching to reduce network calls
 */
async function checkRustHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL.replace(/\/api\/v1$/, "")}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2000), // 2s timeout
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Get authorization headers with JWT token
 */
function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Проверяем Rust API только один раз с кэшированием в sessionStorage
  if (!checkedOnce) {
    const cached = typeof window !== "undefined" 
      ? sessionStorage.getItem("rustHealthy") 
      : null;
    
    if (cached !== null) {
      rustAvailable = cached === "true";
      checkedOnce = true;
      console.info(
        rustAvailable
          ? "✅ Connected to Rust backend (cached)"
          : "⚠️ Rust API unreachable — switching to MockAPI (cached)"
      );
    } else {
      const healthy = await checkRustHealth();
      rustAvailable = healthy;
      checkedOnce = true;
      
      if (typeof window !== "undefined") {
        sessionStorage.setItem("rustHealthy", healthy ? "true" : "false");
      }
      
      console.info(
        healthy
          ? "✅ Connected to Rust backend"
          : "⚠️ Rust API unreachable — switching to MockAPI"
      );
    }
  }

  if (!rustAvailable) {
    // ⚠️ Если Rust недоступен — используем мок
    const mockResult = await callMockAPI<T>(endpoint, options);
    if (mockResult) return mockResult;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.warn("⚠️ Rust API error, using MockAPI fallback:", error);
    rustAvailable = false;
    
    // Обновляем кэш здоровья
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rustHealthy", "false");
    }
    
    const mockResult = await callMockAPI<T>(endpoint, options);
    // Graceful error handling: возвращаем пустой массив если мок не поддерживает endpoint
    return mockResult ?? ([] as unknown as T);
  }
}

/**
 * Call mock API depending on endpoint
 * Supports all key endpoints: businesses, products, orders, market, analytics, metrics, users
 */
async function callMockAPI<T>(
  endpoint: string,
  _options: RequestInit
): Promise<T | null> {
  // Businesses
  if (endpoint.includes("/businesses")) {
    // Check if it's a single business request (e.g., /businesses/123)
    const match = endpoint.match(/\/businesses\/([^/]+)/);
    if (match) {
      return (await mockApi.getBusiness(match[1])) as T;
    }
    return (await mockApi.getBusinesses()) as T;
  }

  // Products
  if (endpoint.includes("/products")) {
    const match = endpoint.match(/\/products\/([^/]+)/);
    if (match) {
      return (await mockApi.getProduct(match[1])) as T;
    }
    return (await mockApi.getProducts()) as T;
  }

  // Orders
  if (endpoint.includes("/orders")) {
    return (await mockApi.getOrders()) as T;
  }

  // Market
  if (endpoint.includes("/market")) {
    return (await mockApi.getMarketData()) as T;
  }

  // Analytics
  if (endpoint.includes("/analytics")) {
    return (await mockApi.getAnalytics()) as T;
  }

  // Metrics
  if (endpoint.includes("/metrics")) {
    return (await mockApi.getMetrics()) as T;
  }

  // Users (admin)
  if (endpoint.includes("/users")) {
    return (await mockApi.getUsers()) as T;
  }

  // Для неподдерживаемых endpoints возвращаем null
  console.warn(`⚠️ Mock API: No mock data for endpoint: ${endpoint}`);
  return null;
}

/**
 * Public API methods
 */
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),

  patch: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

/**
 * Legacy compatibility - returns full URL for direct fetch calls
 */
export function getApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export default api;
