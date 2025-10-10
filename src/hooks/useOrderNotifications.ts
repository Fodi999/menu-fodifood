'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface OrderNotification {
  type: string; // "new_order" | "order_updated" | "connected"
  data: {
    orderId?: string;
    total?: number;
    status?: string;
    name?: string;
    phone?: string;
    address?: string;
    itemsCount?: number;
    createdAt?: string;
    updatedAt?: string;
    message?: string;
  };
}

interface UseOrderNotificationsReturn {
  isConnected: boolean;
  notifications: OrderNotification[];
  clearNotifications: () => void;
  reconnect: () => void;
}

/**
 * Хук для подключения к WebSocket и получения уведомлений о новых заказах
 * Используется только в админ-панели
 */
export function useOrderNotifications(token: string | null): UseOrderNotificationsReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!token) {
      console.log('⚠️ No token provided, skipping WebSocket connection');
      return;
    }

    // Проверка на клиентскую сторону (для SSR совместимости)
    if (typeof window === 'undefined') {
      console.log('⚠️ Window is undefined, skipping WebSocket connection');
      return;
    }

    // Определяем URL для WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '')
      : 'localhost:8080';
    const wsUrl = `${protocol}//${host}/api/admin/ws?token=${encodeURIComponent(token)}`;

    console.log('🔌 Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: OrderNotification = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message);

          // Обрабатываем приветственное сообщение
          if (message.type === 'connected') {
            console.log('✅ WebSocket acknowledged connection:', message.data.message);
            return;
          }

          // Показываем уведомление только для новых заказов
          if (message.type === 'new_order') {
            setNotifications((prev) => [message, ...prev]);

            // Показываем браузерное уведомление (если разрешено)
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🎉 Новый заказ!', {
                body: `Заказ на сумму ${message.data.total}₽ от ${message.data.name}`,
                icon: '/favicon.ico',
                tag: message.data.orderId,
              });
            }

            // Воспроизводим звук уведомления
            try {
              const audio = new Audio('/notification.mp3');
              audio.volume = 0.5; // Средняя громкость
              audio.play().catch((error) => {
                console.log('🔇 Не удалось воспроизвести звук уведомления:', error);
              });
            } catch (error) {
              console.log('🔇 Звук уведомления недоступен:', error);
            }
          }

          // Обрабатываем обновление статуса заказа
          if (message.type === 'order_updated') {
            console.log('🔄 Order status updated:', message.data);
            // Уведомление об обновлении (опционально, можно добавить визуальную индикацию)
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);

        // Автоматическое переподключение через 5 секунд
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 5000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setIsConnected(false);
    }
  }, [token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Подключение при монтировании компонента
  useEffect(() => {
    connect();

    // Запрашиваем разрешение на уведомления
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('🔔 Notification permission:', permission);
      });
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    notifications,
    clearNotifications,
    reconnect,
  };
}
