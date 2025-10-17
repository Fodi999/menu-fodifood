'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Используем sonner для toast уведомлений

const INSIGHT_WS_URL = process.env.NEXT_PUBLIC_INSIGHT_WS || 'ws://127.0.0.1:8000/api/v1/insight';

interface UIEvent {
  type: 'ui_redirect' | 'ui_toast' | 'ui_refresh' | 'ui_update' | 'ui_modal';
  target?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  data?: any;
}

export function useUIEvents() {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const connect = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('⚠️ No auth token - skipping UI events WebSocket');
        return;
      }

      const ws = new WebSocket(`${INSIGHT_WS_URL}?token=${token}&channel=ui_events`);

      ws.onopen = () => {
        console.log('✅ UI Events WebSocket connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const msg: UIEvent = JSON.parse(event.data);
          console.log('💡 [UI Event received]', msg);

          switch (msg.type) {
            case 'ui_redirect':
              if (msg.target) {
                console.log(`🔀 Redirecting to: ${msg.target}`);
                router.push(msg.target);
              }
              break;

            case 'ui_toast':
              const variant = msg.variant || 'success';
              if (variant === 'success') {
                toast.success(msg.title || 'Уведомление', {
                  description: msg.description,
                  duration: 4000,
                });
              } else if (variant === 'error') {
                toast.error(msg.title || 'Ошибка', {
                  description: msg.description,
                  duration: 4000,
                });
              } else if (variant === 'warning') {
                toast.warning(msg.title || 'Предупреждение', {
                  description: msg.description,
                  duration: 4000,
                });
              } else if (variant === 'info') {
                toast.info(msg.title || 'Информация', {
                  description: msg.description,
                  duration: 4000,
                });
              } else {
                toast(msg.title || 'Уведомление', {
                  description: msg.description,
                  duration: 4000,
                });
              }
              break;

            case 'ui_refresh':
              console.log('🔄 Refreshing page...');
              window.location.reload();
              break;

            case 'ui_update':
              // Триггерим custom event для компонентов
              window.dispatchEvent(
                new CustomEvent('ui-update', { detail: msg.data })
              );
              break;

            case 'ui_modal':
              // Триггерим custom event для модальных окон
              window.dispatchEvent(
                new CustomEvent('ui-modal', { detail: msg.data })
              );
              break;

            default:
              console.log('💡 [Unknown UI Event]', msg);
          }
        } catch (err) {
          console.error('❌ UI Event parse error:', err);
        }
      };

      ws.onerror = (error) => {
        // WebSocket ошибка - не критично, сервер может быть не запущен
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ UI Events WebSocket unavailable (optional feature)');
        }
      };

      ws.onclose = () => {
        console.log('🔌 UI Events WebSocket closed');
        wsRef.current = null;

        // Переподключение с экспоненциальной задержкой
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`⏳ Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          console.log('❌ Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('❌ Failed to create UI Events WebSocket:', err);
    }
  }, [router]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    reconnect: connect,
  };
}

// Hook для подписки на конкретные UI события
export function useUIEventListener<T = any>(
  eventType: 'ui-update' | 'ui-modal',
  handler: (data: T) => void
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<T>;
      handler(customEvent.detail);
    };

    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, handler]);
}
