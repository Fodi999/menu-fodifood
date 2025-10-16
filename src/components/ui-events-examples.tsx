/**
 * 📁 Пример использования UI Events в компонентах
 * 
 * Показывает различные сценарии работы с real-time UI обновлениями
 */

'use client';

import { useUIEventListener } from '@/hooks/useUIEvents';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// 1️⃣ Пример: Список заказов с real-time обновлениями
export function OrdersListExample() {
  const [orders, setOrders] = useState<any[]>([]);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);

  // Слушаем обновления заказов от Rust backend
  useUIEventListener<{ orderId: string; status: string }>('ui-update', (data) => {
    if (data.orderId) {
      console.log('📦 Order updated:', data);
      
      // Обновляем статус заказа
      setOrders((prev) =>
        prev.map((order) =>
          order.id === data.orderId
            ? { ...order, status: data.status }
            : order
        )
      );

      // Подсвечиваем обновлённый заказ на 2 секунды
      setHighlightedOrderId(data.orderId);
      setTimeout(() => setHighlightedOrderId(null), 2000);
    }
  });

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card
          key={order.id}
          className={
            highlightedOrderId === order.id
              ? 'border-orange-500 shadow-lg transition-all'
              : ''
          }
        >
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Заказ #{order.id}</span>
              <Badge>{order.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>{/* Order details */}</CardContent>
        </Card>
      ))}
    </div>
  );
}

// 2️⃣ Пример: Dashboard с real-time метриками
export function DashboardMetricsExample() {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
  });

  useUIEventListener<{
    type: 'metrics_update';
    businessId: string;
    metrics: any;
  }>('ui-update', (data) => {
    if (data.type === 'metrics_update') {
      console.log('📊 Metrics updated:', data.metrics);
      setMetrics(data.metrics);
    }
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Выручка</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${metrics.revenue}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Заказы</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{metrics.orders}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Продукты</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{metrics.products}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// 3️⃣ Пример: Модальное окно с AI рекомендациями
export function AIRecommendationsModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useUIEventListener<{
    type: 'ai_recommendations';
    items: string[];
  }>('ui-modal', (data) => {
    if (data.type === 'ai_recommendations') {
      console.log('🤖 AI recommendations:', data.items);
      setRecommendations(data.items);
      setIsOpen(true);
    }
  });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>🤖 AI Рекомендации</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
              >
                Закрыть
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// 4️⃣ Пример: Inventory с real-time уведомлениями о низком запасе
export function InventoryAlertsExample() {
  const [alerts, setAlerts] = useState<
    Array<{ productId: string; name: string; stock: number }>
  >([]);

  useUIEventListener<{
    type: 'low_stock_alert';
    productId: string;
    name: string;
    stock: number;
  }>('ui-update', (data) => {
    if (data.type === 'low_stock_alert') {
      console.log('⚠️ Low stock alert:', data);
      setAlerts((prev) => [...prev, data]);
    }
  });

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => (
        <Card key={idx} className="border-red-500">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">{alert.name}</p>
              <p className="text-sm text-gray-500">
                Осталось: {alert.stock} шт.
              </p>
            </div>
            <Badge variant="destructive">Низкий запас</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 5️⃣ Пример: Chat с real-time сообщениями
export function ChatExample() {
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; sender: string }>
  >([]);

  useUIEventListener<{
    type: 'new_message';
    message: { id: string; text: string; sender: string };
  }>('ui-update', (data) => {
    if (data.type === 'new_message') {
      console.log('💬 New message:', data.message);
      setMessages((prev) => [...prev, data.message]);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>💬 Чат поддержки</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded ${
                msg.sender === 'user'
                  ? 'bg-orange-100 ml-auto max-w-[70%]'
                  : 'bg-gray-100 mr-auto max-w-[70%]'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
