// 📦 Типы заказов

export interface Order {
  id: string;
  user_id: string;
  business_id: string; // 🆕 Привязка к бизнесу
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  delivery_address?: string;
  phone: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  DELIVERING = "delivering",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export interface CreateOrderDto {
  business_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
  delivery_address?: string;
  phone: string;
  comment?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
