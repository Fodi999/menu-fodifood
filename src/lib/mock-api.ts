/**
 * Mock API для разработки Frontend
 * Используется когда Rust backend еще не реализовал эндпоинты
 */

export interface MockProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  weight: string;
}

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface MockOrder {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  createdAt: string;
}

// Mock products database
const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Филадельфия",
    category: "Роллы",
    description: "Лосось, сливочный сыр, авокадо",
    price: 45.99,
    imageUrl: "/products/philadelphia.jpg",
    weight: "250г"
  },
  {
    id: "2",
    name: "Калифорния",
    category: "Роллы",
    description: "Краб, авокадо, огурец, икра тобико",
    price: 39.99,
    imageUrl: "/products/california.jpg",
    weight: "230г"
  },
  {
    id: "3",
    name: "Нигири с лососем",
    category: "Нигири",
    description: "Рис, свежий лосось",
    price: 12.99,
    imageUrl: "/products/nigiri-salmon.jpg",
    weight: "40г"
  },
  {
    id: "4",
    name: "Сет Mix",
    category: "Сеты",
    description: "Ассорти из 30 кусочков роллов",
    price: 89.99,
    imageUrl: "/products/mix-set.jpg",
    weight: "750г"
  },
  {
    id: "5",
    name: "Кола 0.5л",
    category: "Напитки",
    description: "Coca-Cola Original",
    price: 4.99,
    imageUrl: "/products/cola.jpg",
    weight: "500мл"
  }
];

// Mock users database
const mockUsers: Map<string, MockUser & { password: string }> = new Map([
  ["test@example.com", {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    role: "user",
    password: "password123"
  }],
  ["admin@fodifood.com", {
    id: "2",
    email: "admin@fodifood.com",
    name: "Admin User",
    role: "admin",
    password: "admin123"
  }]
]);

// Mock orders database
const mockOrders: MockOrder[] = [];

// Mock businesses database
const mockBusinesses = [
  { id: "1", name: "Sushi Gdansk", city: "Gdansk", revenue: 12000, category: "Restaurant" },
  { id: "2", name: "CoffeeLab Warsaw", city: "Warsaw", revenue: 8900, category: "Cafe" },
];

// Mock market data
const mockMarketData = [
  { business: "Sushi Gdansk", token: "FODI-SUSHI", price: 1.18, change: 2.5 },
  { business: "CoffeeLab Warsaw", token: "FODI-COFFEE", price: 0.93, change: -1.2 },
];

// Mock analytics data
const mockAnalytics = {
  revenue: 12000,
  orders: 320,
  customers: 280,
  growth: 4.3,
};

// Mock metrics data
const mockMetrics = {
  totalRevenue: 45000,
  activeOrders: 23,
  completedOrders: 1250,
  averageOrderValue: 36,
};

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API Client
 */
export const mockApi = {
  // Products
  async getProducts(): Promise<MockProduct[]> {
    await delay();
    return mockProducts;
  },

  async getProduct(id: string): Promise<MockProduct | null> {
    await delay();
    return mockProducts.find(p => p.id === id) || null;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: MockUser }> {
    await delay();
    
    const user = mockUsers.get(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    return {
      token,
      user: userWithoutPassword
    };
  },

  async register(email: string, password: string, name: string): Promise<{ token: string; user: MockUser }> {
    await delay();
    
    if (mockUsers.has(email)) {
      throw new Error("User already exists");
    }

    const newUser: MockUser & { password: string } = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "user",
      password
    };

    mockUsers.set(email, newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = `mock-token-${newUser.id}-${Date.now()}`;

    return {
      token,
      user: userWithoutPassword
    };
  },

  async getCurrentUser(token: string): Promise<MockUser> {
    await delay();
    
    // Extract user ID from mock token
    const match = token.match(/mock-token-(.+?)-/);
    if (!match) {
      throw new Error("Invalid token");
    }

    const userId = match[1];
    const user = Array.from(mockUsers.values()).find(u => u.id === userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Orders
  async getOrders(): Promise<MockOrder[]> {
    await delay();
    return mockOrders;
  },

  async createOrder(orderData: Omit<MockOrder, "id" | "status" | "createdAt">): Promise<MockOrder> {
    await delay();
    
    const newOrder: MockOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    mockOrders.push(newOrder);
    return newOrder;
  },

  // Businesses
  async getBusinesses(): Promise<typeof mockBusinesses> {
    await delay();
    return mockBusinesses;
  },

  async getBusiness(id: string): Promise<typeof mockBusinesses[0] | null> {
    await delay();
    return mockBusinesses.find(b => b.id === id) || null;
  },

  // Market Data
  async getMarketData(): Promise<typeof mockMarketData> {
    await delay();
    return mockMarketData;
  },

  // Analytics
  async getAnalytics(): Promise<typeof mockAnalytics> {
    await delay();
    return mockAnalytics;
  },

  // Metrics
  async getMetrics(): Promise<typeof mockMetrics> {
    await delay();
    return mockMetrics;
  },

  // Users (admin)
  async getUsers(): Promise<MockUser[]> {
    await delay();
    return Array.from(mockUsers.values()).map(({ password: _, ...user }) => user);
  }
};

/**
 * Check if we should use mock API
 * Returns true if Rust backend is not available
 */
export async function shouldUseMockApi(): Promise<boolean> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    // Убираем /api/v1 из URL для health check
    const baseUrl = API_URL.replace('/api/v1', '');
    const response = await fetch(`${baseUrl}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(1000)
    });
    return !response.ok;
  } catch {
    return true; // Backend не доступен - используем mock
  }
}
