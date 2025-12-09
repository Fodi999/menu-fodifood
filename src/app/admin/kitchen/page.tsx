'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { ordersAPI, type OrderWithItems } from '@/lib/restaurant-api';
import { toast } from 'sonner';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { KitchenHeader } from '@/components/Kitchen/KitchenHeader';
import { StatusFilters, type OrderStatus } from '@/components/Kitchen/StatusFilters';
import { OrderCard } from '@/components/Kitchen/OrderCard';

export default function KitchenModePage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus[]>(['pending', 'confirmed', 'preparing']);
  const previousOrderCountRef = useRef(0);

  // WebSocket connection for real-time updates
  const { isConnected, latestOrder } = useWebSocket();
  
  // Notification sound hook
  const { playSound } = useNotificationSound();

  // Play notification sound (respects soundEnabled state)
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    playSound();
  }, [soundEnabled, playSound]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await ordersAPI.getAllAdmin();
      console.log('📦 Kitchen - All orders:', response.length);
      console.log('📦 First order structure:', response[0]);
      console.log('📦 First order items:', response[0]?.items);
      
      const activeOrders = response.filter((order) => 
        ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(order.status)
      );
      
      // Check for new orders
      if (activeOrders.length > previousOrderCountRef.current) {
        playNotificationSound();
        toast.success('🔔 Nowe zamówienie!', {
          description: 'Sprawdź szczegóły zamówienia'
        });
      }
      
      previousOrderCountRef.current = activeOrders.length;
      setOrders(activeOrders);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Nie udało się pobrać zamówień');
      setIsLoading(false);
    }
  }, [playNotificationSound]);

  // Initial load and polling
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // WebSocket real-time updates
  useEffect(() => {
    if (latestOrder) {
      playNotificationSound();
      fetchOrders();
    }
  }, [latestOrder, fetchOrders, playNotificationSound]);

  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Status zaktualizowany!');
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Nie udało się zaktualizować statusu');
    }
  };

  // Filter orders by status
  const filteredOrders = orders.filter(order => statusFilter.includes(order.status as OrderStatus));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 mx-auto mb-4 text-orange-600 animate-pulse" />
          <p className="text-xl font-semibold text-gray-700">Ładowanie kuchni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-3 md:p-6">
      {/* Header */}
      <KitchenHeader
        orderCount={filteredOrders.length}
        isConnected={isConnected}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onTestSound={playNotificationSound}
      />

      {/* Status Filters */}
      <div className="mb-4 md:mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 md:p-6">
        <StatusFilters
          orders={orders}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-slate-200 dark:border-slate-700">
            <ChefHat className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-2">Brak zamówień</h2>
            <p className="text-slate-500 dark:text-slate-400">Nowe zamówienia pojawią się tutaj automatycznie</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredOrders
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
