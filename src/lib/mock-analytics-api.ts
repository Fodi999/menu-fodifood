// Mock Analytics API
// TODO: Заменить на реальный Rust API endpoint

import { format, subDays } from "date-fns";

export interface AnalyticsDataPoint {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface AnalyticsPeriod {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  avg_order_value: number;
  growth_revenue: number; // процент роста
  growth_orders: number;
  data: AnalyticsDataPoint[];
}

export type PeriodType = 'day' | 'week' | 'month';

// Генерация mock данных
function generateMockData(period: PeriodType): AnalyticsDataPoint[] {
  const now = new Date();
  let days = 0;
  
  switch (period) {
    case 'day':
      days = 24; // почасовые данные за день
      return Array.from({ length: days }, (_, i) => ({
        date: `${i}:00`,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 20) + 5,
        customers: Math.floor(Math.random() * 15) + 3,
      }));
    
    case 'week':
      days = 7;
      return Array.from({ length: days }, (_, i) => {
        const date = subDays(now, 6 - i);
        return {
          date: format(date, 'EEE'),
          revenue: Math.floor(Math.random() * 30000) + 10000,
          orders: Math.floor(Math.random() * 50) + 20,
          customers: Math.floor(Math.random() * 40) + 15,
        };
      });
    
    case 'month':
      days = 30;
      return Array.from({ length: days }, (_, i) => {
        const date = subDays(now, 29 - i);
        return {
          date: format(date, 'dd MMM'),
          revenue: Math.floor(Math.random() * 35000) + 15000,
          orders: Math.floor(Math.random() * 60) + 25,
          customers: Math.floor(Math.random() * 50) + 20,
        };
      });
  }
}

export async function getBusinessAnalytics(
  businessId: string,
  period: PeriodType = 'week'
): Promise<AnalyticsPeriod> {
  // Симуляция задержки API
  await new Promise(resolve => setTimeout(resolve, 500));

  const data = generateMockData(period);
  
  const total_revenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const total_orders = data.reduce((sum, d) => sum + d.orders, 0);
  const total_customers = data.reduce((sum, d) => sum + d.customers, 0);
  const avg_order_value = total_revenue / total_orders;

  // Mock рост (случайный от -5% до +20%)
  const growth_revenue = Math.random() * 25 - 5;
  const growth_orders = Math.random() * 25 - 5;

  return {
    total_revenue,
    total_orders,
    total_customers,
    avg_order_value,
    growth_revenue,
    growth_orders,
    data,
  };
}

// Дополнительная статистика
export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export async function getTopProducts(
  businessId: string,
  limit: number = 5
): Promise<TopProduct[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockProducts = [
    { id: '1', name: 'California Roll', sales: 145, revenue: 21750 },
    { id: '2', name: 'Philadelphia Roll', sales: 132, revenue: 23760 },
    { id: '3', name: 'Dragon Roll', sales: 98, revenue: 19600 },
    { id: '4', name: 'Salmon Nigiri', sales: 87, revenue: 13050 },
    { id: '5', name: 'Spicy Tuna Roll', sales: 76, revenue: 11400 },
  ];

  return mockProducts.slice(0, limit);
}

export interface PeakHour {
  hour: string;
  orders: number;
}

export async function getPeakHours(_businessId: string): Promise<PeakHour[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    { hour: '12:00', orders: 45 },
    { hour: '13:00', orders: 52 },
    { hour: '18:00', orders: 38 },
    { hour: '19:00', orders: 61 },
    { hour: '20:00', orders: 48 },
  ];
}
