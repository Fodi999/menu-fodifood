/**
 * Тест улучшенного API с поддержкой всех endpoints
 * Запуск: node test-improved-api.js
 */

console.log("🧪 Testing Improved API with MockAPI fallback...\n");

// Simulate fetch for Node.js
global.fetch = async (url, options = {}) => {
  console.log(`📡 Attempting fetch: ${url}`);
  
  // Simulate Rust backend is down
  if (url.includes("/health")) {
    console.log("❌ Health check failed - Rust backend unavailable");
    throw new Error("Connection refused");
  }
  
  throw new Error("Rust backend unreachable");
};

// Simulate sessionStorage for Node.js
global.sessionStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  }
};

// Mock API implementation (simplified)
const mockApi = {
  async getBusinesses() {
    return [
      { id: "1", name: "Sushi Gdansk", city: "Gdansk", revenue: 12000 },
      { id: "2", name: "CoffeeLab Warsaw", city: "Warsaw", revenue: 8900 },
    ];
  },
  
  async getProducts() {
    return [
      { id: "p1", name: "Philadelphia Roll", price: 45 },
      { id: "p2", name: "Latte", price: 18 },
    ];
  },
  
  async getOrders() {
    return [
      { id: "o1", product: "Philadelphia Roll", status: "Delivered" },
      { id: "o2", product: "Latte", status: "Pending" },
    ];
  },
  
  async getMarketData() {
    return [
      { business: "Sushi Gdansk", token: "FODI-SUSHI", price: 1.18 },
      { business: "CoffeeLab Warsaw", token: "FODI-COFFEE", price: 0.93 },
    ];
  },
  
  async getAnalytics() {
    return {
      revenue: 12000,
      orders: 320,
      customers: 280,
      growth: 4.3,
    };
  },
  
  async getMetrics() {
    return {
      totalRevenue: 45000,
      activeOrders: 23,
      completedOrders: 1250,
      averageOrderValue: 36,
    };
  },
  
  async getUsers() {
    return [
      { id: "1", email: "test@example.com", name: "Test User" },
      { id: "2", email: "admin@fodifood.com", name: "Admin User" },
    ];
  }
};

// Simplified API implementation based on improved api.ts
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
let rustAvailable = true;
let checkedOnce = false;

async function checkRustHealth() {
  try {
    const res = await fetch(`${API_BASE_URL.replace(/\/api\/v1$/, "")}/health`, {
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function callMockAPI(endpoint) {
  if (endpoint.includes("/businesses")) {
    return await mockApi.getBusinesses();
  }
  if (endpoint.includes("/products")) {
    return await mockApi.getProducts();
  }
  if (endpoint.includes("/orders")) {
    return await mockApi.getOrders();
  }
  if (endpoint.includes("/market")) {
    return await mockApi.getMarketData();
  }
  if (endpoint.includes("/analytics")) {
    return await mockApi.getAnalytics();
  }
  if (endpoint.includes("/metrics")) {
    return await mockApi.getMetrics();
  }
  if (endpoint.includes("/users")) {
    return await mockApi.getUsers();
  }
  
  console.warn(`⚠️ Mock API: No mock data for endpoint: ${endpoint}`);
  return null;
}

async function apiRequest(endpoint) {
  // Check health with sessionStorage caching
  if (!checkedOnce) {
    const cached = sessionStorage.getItem("rustHealthy");
    
    if (cached !== null) {
      rustAvailable = cached === "true";
      checkedOnce = true;
      console.log(
        rustAvailable
          ? "✅ Connected to Rust backend (cached)"
          : "⚠️ Rust API unreachable — switching to MockAPI (cached)"
      );
    } else {
      const healthy = await checkRustHealth();
      rustAvailable = healthy;
      checkedOnce = true;
      sessionStorage.setItem("rustHealthy", healthy ? "true" : "false");
      console.log(
        healthy
          ? "✅ Connected to Rust backend"
          : "⚠️ Rust API unreachable — switching to MockAPI"
      );
    }
  }

  if (!rustAvailable) {
    const mockResult = await callMockAPI(endpoint);
    if (mockResult) return mockResult;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.warn("⚠️ Rust API error, using MockAPI fallback");
    rustAvailable = false;
    sessionStorage.setItem("rustHealthy", "false");
    const mockResult = await callMockAPI(endpoint);
    return mockResult ?? [];
  }
}

// Test all endpoints
async function runTests() {
  const endpoints = [
    "/businesses",
    "/products",
    "/orders",
    "/market",
    "/analytics",
    "/metrics",
    "/users"
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing endpoint: ${endpoint}`);
      const result = await apiRequest(endpoint);
      console.log(`✅ Success! Data:`, JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`❌ Failed:`, error.message);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 All tests completed!");
  console.log("📊 SessionStorage cache:", sessionStorage.data);
}

runTests().catch(console.error);
