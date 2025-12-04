// Restaurant Data Types

export interface Category {
  id: number;
  name: string;
  nameRu: string;
  namePl: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  nameRu: string;
  namePl: string;
  description: string;
  descriptionRu: string;
  descriptionPl: string;
  price: number;
  originalPrice?: number; // For discounts
  image: string;
  images?: string[]; // Additional images
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
  weight?: string; // e.g., "250g"
  calories?: number;
  cookingTime?: number; // in minutes
  ingredients?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface DeliveryAddress {
  street: string;
  building: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  intercom?: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
  BLIK = 'blik',
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: Customer;
  deliveryAddress: DeliveryAddress;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  specialInstructions?: string;
  deliveryTime?: string; // Expected delivery time
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface RestaurantInfo {
  name: string;
  nameRu: string;
  namePl: string;
  description: string;
  descriptionRu: string;
  descriptionPl: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  openingHours: {
    [key: string]: { open: string; close: string } | null;
  };
  deliveryRadius: number; // in km
  minimumOrder: number;
  deliveryFee: number;
  freeDeliveryFrom: number;
  averageDeliveryTime: number; // in minutes
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface CreateOrderDTO {
  customer: Customer;
  deliveryAddress: DeliveryAddress;
  items: { menuItemId: number; quantity: number; specialInstructions?: string }[];
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  deliveryTime?: string;
}

export interface UpdateMenuItemDTO {
  name?: string;
  nameRu?: string;
  namePl?: string;
  description?: string;
  descriptionRu?: string;
  descriptionPl?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  categoryId?: number;
}

export interface CreateMenuItemDTO {
  categoryId: number;
  name: string;
  nameRu: string;
  namePl: string;
  description: string;
  descriptionRu: string;
  descriptionPl: string;
  price: number;
  image: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}
