'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Package,
  DollarSign,
  ArrowUpRight,
  Eye,
  X,
  Clock,
  Loader2,
  Truck as TruckIcon,
  CheckCircle2,
  XCircle,
  ChefHat,
  Store,
  CreditCard,
  Banknote
} from 'lucide-react';
import Link from 'next/link';
import { authAPI } from '@/lib/api-client';
import { ordersAPI, categoriesAPI, menuAPI } from '@/lib/restaurant-api';
import { toast } from 'sonner';
import { analytics, type AnalyticsData } from '@/lib/analytics';
import { useWebSocket } from '@/hooks/useWebSocket';
import { OrderDetailsSidebar } from '@/components/Admin/OrderDetailsSidebar';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // WebSocket connection for real-time updates
  const { isConnected, stats: wsStats, latestOrder } = useWebSocket();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    totalMenuItems: 0,
    recentOrders: [] as any[],
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load analytics data from localStorage
      const localAnalytics = analytics.getData();
      setAnalyticsData(localAnalytics);

      // Load data from API
      const [categories, menuItems, orders] = await Promise.all([
        categoriesAPI.getAll().catch(() => []),
        menuAPI.getAll().catch(() => []),
        ordersAPI.getAllAdmin().catch((err: any) => {
          console.error('❌ Failed to load orders:', err);
          return [];
        }),
      ]);

      console.log('📦 Loaded orders:', orders.length);

      setStats(prev => ({
        ...prev,
        totalOrders: orders.length || wsStats?.totalOrders || 0, 
        totalRevenue: orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0) || wsStats?.totalRevenue || 0,
        totalCategories: categories.length,
        totalMenuItems: menuItems.length,
        recentOrders: orders.slice(0, 5), // Show last 5 orders
      }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Błąd ładowania danych');
    } finally {
      setIsLoading(false);
    }
  }, [wsStats]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Update stats when WebSocket data changes
  useEffect(() => {
    if (isConnected && wsStats) {
      setStats(prev => ({
        ...prev,
        totalOrders: wsStats.totalOrders || prev.totalOrders,
        totalRevenue: wsStats.totalRevenue || prev.totalRevenue,
      }));
    }
  }, [isConnected, wsStats]);

  // Show toast notification for new orders with debounce
  const lastOrderRef = useRef<string | null>(null);
  useEffect(() => {
    if (latestOrder && latestOrder.type === 'new_order' && latestOrder.order_number && latestOrder.order_number !== lastOrderRef.current) {
      lastOrderRef.current = latestOrder.order_number;
      toast.success(`🛒 Nowe zamówienie #${latestOrder.order_number} od ${latestOrder.customer_name}`);
      
      // Debounce reload - wait 500ms before reloading
      const timeoutId = setTimeout(() => {
        loadDashboardData();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [latestOrder, loadDashboardData]);

  const loadOrderDetails = useCallback(async (orderId: number) => {
    setIsLoadingDetails(true);
    try {
      const details = await ordersAPI.getByIdAdmin(orderId);
      setOrderDetails(details);
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast.error('Błąd ładowania szczegółów zamówienia');
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    loadOrderDetails(order.id);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  // Close sidebar with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedOrder) {
        closeOrderModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation showEditMode={false} />

      <main className="container mx-auto px-4 sm:px-6 py-20 sm:py-24">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-2 sm:gap-3">
                <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                Panel administracyjny
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Zarządzanie restauracją FodiFood
              </p>
            </div>
            {/* WebSocket Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {isConnected ? '🟢 Онлайн' : '⚪ Офлайн'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Zamówień</CardTitle>
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">Wkrótce dostępne</p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Przychód</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalRevenue.toFixed(2)} zł</div>
              <p className="text-xs text-muted-foreground hidden sm:block">Wkrótce dostępne</p>
            </CardContent>
          </Card>

          {/* Total Categories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Kategorie</CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">Aktywnych</p>
            </CardContent>
          </Card>

          {/* Total Menu Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Dania</CardTitle>
              <UtensilsCrossed className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalMenuItems}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">W menu</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        {analyticsData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Analityka odwiedzin
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Visits */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wizyty na stronie</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalVisits}</div>
                  <p className="text-xs text-muted-foreground">Łącznie wizyt</p>
                </CardContent>
              </Card>

              {/* Total Orders from Analytics */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Zamówienia (lokalnie)</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Złożonych zamówień</p>
                </CardContent>
              </Card>

              {/* Cart Items */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produkty w koszyku</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalCartItems}</div>
                  <p className="text-xs text-muted-foreground">Aktualna liczba</p>
                </CardContent>
              </Card>

              {/* Menu Views */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wyświetlenia menu</CardTitle>
                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalMenuViews}</div>
                  <p className="text-xs text-muted-foreground">Przejść do menu</p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Szczegóły analityki</CardTitle>
                <CardDescription>Informacje o odwiedzinach strony</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pierwsza wizyta:</span>
                    <span className="font-medium">
                      {new Date(analyticsData.firstVisit).toLocaleString('pl-PL')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ostatnia wizyta:</span>
                    <span className="font-medium">
                      {new Date(analyticsData.lastVisit).toLocaleString('pl-PL')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Konwersja na zamówienie:</span>
                    <span className="font-medium text-primary">
                      {analyticsData.totalVisits > 0
                        ? ((analyticsData.totalOrders / analyticsData.totalVisits) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Orders */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Ostatnie zamówienia</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Najnowsze zamówienia klientów</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {stats.recentOrders.map((order: any, index: number) => (
                  <div 
                    key={order.id || index} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                        <span className="font-semibold text-base sm:text-lg">#{order.order_number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          order.status === 'pending' ? 'bg-green-100 text-green-800' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'delivered' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'pending' && <Clock className="w-3 h-3" />}
                          {order.status === 'preparing' && <ChefHat className="w-3 h-3" />}
                          {order.status === 'ready' && <CheckCircle2 className="w-3 h-3" />}
                          {order.status === 'delivered' && <TruckIcon className="w-3 h-3" />}
                          {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                          {order.status === 'pending' ? 'Oczekuje' :
                           order.status === 'preparing' ? 'Przygotowywane' :
                           order.status === 'ready' ? 'Gotowe' :
                           order.status === 'delivered' ? 'Dostarczone' :
                           'Anulowane'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {order.customer_name} • {order.customer_phone}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-base sm:text-lg font-bold text-primary">{parseFloat(order.total).toFixed(2)} zł</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {order.delivery_type === 'delivery' ? (
                            <><TruckIcon className="w-3 h-3" /> Dostawa</>
                          ) : (
                            <><Store className="w-3 h-3" /> Odbiór osobisty</>
                          )}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleOrderClick(order)}
                        className="shrink-0"
                      >
                        <Eye className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Szczegóły</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Brak zamówień</p>
                <p className="text-sm mt-2">Zamówienia pojawią się tutaj automatycznie</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Zamówienia
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Przeglądanie i zarządzanie zamówieniami</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <Eye className="w-4 h-4 mr-2" />
                Wkrótce dostępne
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Menu
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Edycja menu i kategorii</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Przejdź do strony głównej
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Analityka
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Statystyki i raporty</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Wkrótce dostępne
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Details Sidebar */}
        <OrderDetailsSidebar
          selectedOrder={selectedOrder}
          orderDetails={orderDetails}
          isLoadingDetails={isLoadingDetails}
          onClose={closeOrderModal}
        />
      </main>
    </div>
  );
}
