'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { AIInsight } from '@/types/metrics';

const INSIGHT_WS_URL = process.env.NEXT_PUBLIC_INSIGHT_WS || 'ws://127.0.0.1:8000/api/v1/insight';

export function useInsights(businessId: string | null) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!businessId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      const ws = new WebSocket(`${INSIGHT_WS_URL}?business_id=${businessId}&token=${token}`);

      ws.onopen = () => {
        console.log('✅ Connected to AI Insights WebSocket');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const insight: AIInsight = JSON.parse(event.data);
          setInsights((prev) => [insight, ...prev].slice(0, 50)); // Ограничить 50 инсайтами
        } catch (err) {
          console.error('Failed to parse insight:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('❌ WebSocket error:', event);
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('🔌 Disconnected from AI Insights WebSocket');
        setIsConnected(false);
        
        // Переподключение через 5 секунд
        setTimeout(() => {
          if (wsRef.current === ws) {
            connect();
          }
        }, 5000);
      };

      wsRef.current = ws;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  }, [businessId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [businessId, connect, disconnect]);

  return {
    insights,
    isConnected,
    error,
    reconnect: connect,
  };
}
