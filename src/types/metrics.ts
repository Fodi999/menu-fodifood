// 📊 Типы для аналитики бизнеса

export interface BusinessMetrics {
  business_id?: string;
  period?: MetricsPeriod;
  
  // Финансовые метрики
  revenue: Revenue;
  
  // Заказы
  orders: OrdersMetrics;
  
  // Продукты
  products?: {
    total: number;
    active: number;
    out_of_stock: number;
  };
  popular_products?: PopularProduct[];
  
  // Конверсия
  conversion: ConversionMetrics;
  
  // AI Инсайты
  insights?: AIInsight[];
  
  generated_at?: string;
}

export enum MetricsPeriod {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  CUSTOM = "custom"
}

export interface Revenue {
  total: number;
  growth: number; // % изменения относительно предыдущего периода
  currency?: string;
  chart_data: ChartDataPoint[];
}

export interface OrdersMetrics {
  total: number; // Общее количество заказов
  completed: number; // Завершенные
  cancelled: number; // Отменённые
  average_value: number; // Средний чек
  chart_data?: ChartDataPoint[];
}

export interface PopularProduct {
  product_id: string;
  product_name: string;
  product_image_url?: string;
  orders_count: number;
  revenue: number;
  rank: number;
}

export interface ConversionMetrics {
  rate: number; // Процент конверсии
  completed: number; // Успешных заказов
  total: number; // Всего попыток
  views?: number;
  cart_additions?: number;
  checkouts?: number;
}

export interface ChartDataPoint {
  label: string; // Дата или период
  value: number;
}

export interface AIInsight {
  id: string;
  business_id?: string;
  type?: InsightType;
  category?: string; // Альтернатива для type
  title: string;
  description: string;
  priority: InsightPriority | 'high' | 'medium' | 'low'; // Поддержка строк
  action_required?: boolean;
  action_text?: string;
  actions?: string[]; // Список возможных действий
  created_at: string;
}

export enum InsightType {
  REVENUE_TREND = "revenue_trend",
  PRODUCT_PERFORMANCE = "product_performance",
  CUSTOMER_BEHAVIOR = "customer_behavior",
  INVENTORY_ALERT = "inventory_alert",
  RECOMMENDATION = "recommendation"
}

export enum InsightPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}
