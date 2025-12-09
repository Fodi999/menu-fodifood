'use client';

import { useEffect, useState, useCallback } from 'react';
import { wsService, type WsMessage, type DashboardStats } from '@/lib/websocket';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [latestOrder, setLatestOrder] = useState<WsMessage | null>(null);

  useEffect(() => {
    // Check if WebSocket is available
    if (typeof WebSocket === 'undefined') {
      console.warn('⚠️ WebSocket not available in this environment');
      return;
    }

    try {
      // Connect to WebSocket
      wsService.connect();

      // Subscribe to connection events
      const unsubConnect = wsService.onConnect(() => {
        console.log('🟢 WebSocket connected');
        setIsConnected(true);
      });

      const unsubDisconnect = wsService.onDisconnect(() => {
        console.log('🔴 WebSocket disconnected');
        setIsConnected(false);
      });

      // Subscribe to messages
      const unsubMessage = wsService.onMessage((message) => {
        console.log('📨 Received WS message:', JSON.stringify(message, null, 2));
        
        switch (message.type) {
          case 'new_order':
            console.log('🛒 New order received:', message);
            setLatestOrder(message);
            break;

          case 'analytics_update':
            console.log('📊 Analytics update:', message);
            setStats({
              totalOrders: message.total_orders || 0,
              totalRevenue: parseFloat(message.total_revenue || '0'),
              pendingOrders: message.pending_orders || 0,
            });
            break;

          case 'order_status_update':
            console.log('📝 Order status update:', message);
            break;

          case 'ping':
            // Server heartbeat - no action needed
            console.log('💓 Heartbeat ping received');
            break;

          case 'pong':
            // Heartbeat response - no action needed
            console.log('💓 Heartbeat pong received');
            break;

          default:
            console.warn('⚠️ Unknown message type:', message.type, '| Full:', message);
        }
      });

      // Cleanup on unmount
      return () => {
        unsubConnect();
        unsubDisconnect();
        unsubMessage();
        wsService.disconnect();
      };
    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error);
      setIsConnected(false);
    }
  }, []);

  const sendPing = useCallback(() => {
    wsService.send({ type: 'ping' });
  }, []);

  return {
    isConnected,
    stats,
    latestOrder,
    sendPing,
  };
}
