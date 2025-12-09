/**
 * WebSocket Service for Real-Time Dashboard Updates
 */

export interface WsMessage {
  type: 'new_order' | 'order_status_update' | 'analytics_update' | 'ping' | 'pong';
  order_id?: number;
  order_number?: string;
  customer_name?: string;
  total?: string;
  status?: string;
  total_orders?: number;
  total_revenue?: string;
  pending_orders?: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

type MessageCallback = (message: WsMessage) => void;
type ConnectCallback = () => void;
type DisconnectCallback = () => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private connectCallbacks: Set<ConnectCallback> = new Set();
  private disconnectCallbacks: Set<DisconnectCallback> = new Set();
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(wsUrl?: string) {
    // Use environment variable or default to production WebSocket URL
    const baseUrl = wsUrl || process.env.NEXT_PUBLIC_WS_URL || 'wss://portfolio-a4yb.shuttle.app';
    this.url = `${baseUrl}/api/ws`;
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket already connected');
      return;
    }

    // Check if WebSocket is available
    if (typeof WebSocket === 'undefined') {
      console.warn('⚠️ WebSocket not available in this environment');
      return;
    }

    try {
      console.log('🔌 Attempting to connect to WebSocket:', this.url);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.startPingInterval();
        this.connectCallbacks.forEach(cb => cb());
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WsMessage = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message);
          this.messageCallbacks.forEach(cb => cb(message));
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        // WebSocket error event doesn't contain much info, just log it
        console.warn('⚠️ WebSocket connection error - this is normal if backend WebSocket is not available');
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected', event.code, event.reason);
        this.stopPingInterval();
        this.disconnectCallbacks.forEach(cb => cb());
        
        // Only attempt reconnect if it was an abnormal closure
        if (event.code !== 1000 && event.code !== 1001) {
          this.attemptReconnect();
        }
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopPingInterval();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  /**
   * Attempt to reconnect to WebSocket
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`⚠️ WebSocket max reconnect attempts (${this.maxReconnectAttempts}) reached - giving up`);
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(`🔄 WebSocket reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      console.log('🔄 Attempting WebSocket reconnection...');
      this.connect();
    }, delay);
  }

  /**
   * Start sending ping messages to keep connection alive
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Send message to WebSocket server
   */
  send(message: WsMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
    }
  }

  /**
   * Subscribe to WebSocket messages
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  /**
   * Subscribe to WebSocket connection events
   */
  onConnect(callback: ConnectCallback): () => void {
    this.connectCallbacks.add(callback);
    return () => this.connectCallbacks.delete(callback);
  }

  /**
   * Subscribe to WebSocket disconnection events
   */
  onDisconnect(callback: DisconnectCallback): () => void {
    this.disconnectCallbacks.add(callback);
    return () => this.disconnectCallbacks.delete(callback);
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
