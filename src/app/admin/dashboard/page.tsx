'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update stats when WebSocket data changes
  useEffect(() => {
    if (isConnected && wsStats) {
      setStats(prev => ({
        ...prev,
        totalOrders: wsStats.totalOrders,
        totalRevenue: wsStats.totalRevenue,
      }));
    }
  }, [isConnected, wsStats]);

  // Show toast notification for new orders
  useEffect(() => {
    if (latestOrder && latestOrder.type === 'new_order') {
      toast.success(`🛒 Новый заказ #${latestOrder.order_number} от ${latestOrder.customer_name}`);
      // Reload data to show new order
      loadDashboardData();
    }
  }, [latestOrder]);

  const loadDashboardData = async () => {
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
        totalOrders: orders.length || wsStats.totalOrders, 
        totalRevenue: orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0) || wsStats.totalRevenue,
        totalCategories: categories.length,
        totalMenuItems: menuItems.length,
        recentOrders: orders.slice(0, 5), // Show last 5 orders
      }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: number) => {
    setIsLoadingDetails(true);
    try {
      const details = await ordersAPI.getByIdAdmin(orderId);
      setOrderDetails(details);
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast.error('Ошибка загрузки деталей заказа');
    } finally {
      setIsLoadingDetails(false);
    }
  };

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
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
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
                Дашборд администратора
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Управление рестораном FodiFood
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
              <CardTitle className="text-xs sm:text-sm font-medium">Заказов</CardTitle>
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">Скоро доступно</p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Доход</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalRevenue.toFixed(2)} zł</div>
              <p className="text-xs text-muted-foreground hidden sm:block">Скоро доступно</p>
            </CardContent>
          </Card>

          {/* Total Categories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Категории</CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">Активных</p>
            </CardContent>
          </Card>

          {/* Total Menu Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Блюда</CardTitle>
              <UtensilsCrossed className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalMenuItems}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">В меню</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        {analyticsData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Аналитика посещаемости
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Visits */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Посещения сайта</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalVisits}</div>
                  <p className="text-xs text-muted-foreground">Всего посещений</p>
                </CardContent>
              </Card>

              {/* Total Orders from Analytics */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Заказы (локально)</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Оформлено заказов</p>
                </CardContent>
              </Card>

              {/* Cart Items */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Товаров в корзине</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalCartItems}</div>
                  <p className="text-xs text-muted-foreground">Текущее количество</p>
                </CardContent>
              </Card>

              {/* Menu Views */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Просмотры меню</CardTitle>
                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalMenuViews}</div>
                  <p className="text-xs text-muted-foreground">Переходов на меню</p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Детали аналитики</CardTitle>
                <CardDescription>Информация о посещениях сайта</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Первое посещение:</span>
                    <span className="font-medium">
                      {new Date(analyticsData.firstVisit).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Последнее посещение:</span>
                    <span className="font-medium">
                      {new Date(analyticsData.lastVisit).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Конверсия в заказ:</span>
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
            <CardTitle className="text-lg sm:text-xl">Последние заказы</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Недавние заказы клиентов</CardDescription>
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
                          {order.status === 'pending' ? 'Ожидает' :
                           order.status === 'preparing' ? 'Готовится' :
                           order.status === 'ready' ? 'Готов' :
                           order.status === 'delivered' ? 'Доставлен' :
                           'Отменен'}
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
                        <p className="text-base sm:text-lg font-bold text-primary">${order.total}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {order.delivery_type === 'delivery' ? (
                            <><TruckIcon className="w-3 h-3" /> Доставка</>
                          ) : (
                            <><Store className="w-3 h-3" /> Самовывоз</>
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
                        <span className="hidden sm:inline">Детали</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Нет заказов</p>
                <p className="text-sm mt-2">Заказы появятся здесь автоматически</p>
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
                Заказы
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Просмотр и управление заказами</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <Eye className="w-4 h-4 mr-2" />
                Скоро доступно
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Меню
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Редактирование меню и категорий</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Перейти на главную
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Аналитика
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Статистика и отчеты</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Скоро доступно
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Details Sidebar */}
        <div 
          className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[600px] bg-background/95 backdrop-blur-sm shadow-2xl border-l transform transition-transform duration-300 ease-in-out ${
            selectedOrder ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-primary/5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Заказ #{selectedOrder?.order_number}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {selectedOrder && new Date(selectedOrder.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeOrderModal}
                className="hover:bg-destructive/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoadingDetails ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-sm text-muted-foreground">Загрузка деталей...</p>
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Order Status */}
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Статус заказа</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        orderDetails.status === 'pending' ? 'bg-green-100 text-green-800' :
                        orderDetails.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        orderDetails.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                        orderDetails.status === 'delivered' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {orderDetails.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {orderDetails.status === 'preparing' && <ChefHat className="w-3.5 h-3.5" />}
                        {orderDetails.status === 'ready' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {orderDetails.status === 'delivered' && <TruckIcon className="w-3.5 h-3.5" />}
                        {orderDetails.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                        {orderDetails.status === 'pending' ? 'Ожидает подтверждения' :
                         orderDetails.status === 'preparing' ? 'Готовится' :
                         orderDetails.status === 'ready' ? 'Готов к выдаче' :
                         orderDetails.status === 'delivered' ? 'Доставлен' :
                         'Отменен'}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Информация о клиенте</h3>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p><strong>Имя:</strong> {orderDetails.customer_name}</p>
                        <p><strong>Телефон:</strong> {orderDetails.customer_phone}</p>
                        {orderDetails.customer_email && (
                          <p><strong>Email:</strong> {orderDetails.customer_email}</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {orderDetails.delivery_street && (
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Адрес доставки</h3>
                        <div className="text-xs sm:text-sm space-y-1">
                          <p>{orderDetails.delivery_street}, {orderDetails.delivery_building}</p>
                          {orderDetails.delivery_apartment && (
                            <p>Квартира: {orderDetails.delivery_apartment}</p>
                          )}
                          {orderDetails.delivery_floor && (
                            <p>Этаж: {orderDetails.delivery_floor}</p>
                          )}
                          {orderDetails.delivery_entrance && (
                            <p>Подъезд: {orderDetails.delivery_entrance}</p>
                          )}
                          {orderDetails.delivery_intercom && (
                            <p>Домофон: {orderDetails.delivery_intercom}</p>
                          )}
                          <p>{orderDetails.delivery_city}, {orderDetails.delivery_postal_code}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-3 text-sm sm:text-base">Состав заказа</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {orderDetails.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm sm:text-base">{item.menu_item_name}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {item.quantity} x ${item.menu_item_price}
                              </p>
                              {item.special_instructions && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Примечание: {item.special_instructions}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm sm:text-base">
                                ${(parseFloat(item.menu_item_price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {orderDetails.special_instructions && (
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Особые пожелания</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {orderDetails.special_instructions}
                        </p>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3 text-sm sm:text-base">Итого</h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Подитог:</span>
                          <span>${orderDetails.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Доставка:</span>
                          <span>${orderDetails.delivery_fee}</span>
                        </div>
                        {parseFloat(orderDetails.tax) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Налог:</span>
                            <span>${orderDetails.tax}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2">
                          <span>Всего:</span>
                          <span className="text-primary">${orderDetails.total}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Способ оплаты:</span>
                          <span className="font-medium flex items-center gap-1.5">
                            {orderDetails.payment_method === 'card' ? (
                              <><CreditCard className="w-3.5 h-3.5" /> Карта</>
                            ) : orderDetails.payment_method === 'cash' ? (
                              <><Banknote className="w-3.5 h-3.5" /> Наличные</>
                            ) : (
                              orderDetails.payment_method
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Не удалось загрузить детали заказа</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlay */}
          {selectedOrder && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={closeOrderModal}
            />
          )}
        </main>
      </div>
    );
  }
