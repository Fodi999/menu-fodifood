'use client';

import { Button } from '@/components/ui/button';
import {
  X,
  Clock,
  Truck as TruckIcon,
  CheckCircle2,
  XCircle,
  ChefHat,
  CreditCard,
  Banknote
} from 'lucide-react';

interface OrderDetailsSidebarProps {
  selectedOrder: any;
  orderDetails: any;
  isLoadingDetails: boolean;
  onClose: () => void;
}

export function OrderDetailsSidebar({
  selectedOrder,
  orderDetails,
  isLoadingDetails,
  onClose
}: OrderDetailsSidebarProps) {
  if (!selectedOrder) return null;

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[600px] bg-background/95 backdrop-blur-sm shadow-2xl border-l transform transition-transform duration-300 ease-in-out ${
          selectedOrder ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-primary/5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Zamówienie #{selectedOrder?.order_number}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {selectedOrder && new Date(selectedOrder.created_at).toLocaleString('pl-PL')}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
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
                <p className="mt-4 text-sm text-muted-foreground">Ładowanie szczegółów...</p>
              </div>
            ) : orderDetails ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Order Status */}
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Status zamówienia</h3>
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
                    {orderDetails.status === 'pending' ? 'Oczekuje na potwierdzenie' :
                     orderDetails.status === 'preparing' ? 'Przygotowywane' :
                     orderDetails.status === 'ready' ? 'Gotowe do odbioru' :
                     orderDetails.status === 'delivered' ? 'Dostarczone' :
                     'Anulowane'}
                  </span>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Dane klienta</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p><strong>Imię:</strong> {orderDetails.customer_name}</p>
                    <p><strong>Telefon:</strong> {orderDetails.customer_phone}</p>
                    {orderDetails.customer_email && (
                      <p><strong>Email:</strong> {orderDetails.customer_email}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                {orderDetails.delivery_street && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Adres dostawy</h3>
                    <div className="text-xs sm:text-sm space-y-1">
                      <p>{orderDetails.delivery_street}, {orderDetails.delivery_building}</p>
                      {orderDetails.delivery_apartment && (
                        <p>Mieszkanie: {orderDetails.delivery_apartment}</p>
                      )}
                      {orderDetails.delivery_floor && (
                        <p>Piętro: {orderDetails.delivery_floor}</p>
                      )}
                      {orderDetails.delivery_entrance && (
                        <p>Klatka: {orderDetails.delivery_entrance}</p>
                      )}
                      {orderDetails.delivery_intercom && (
                        <p>Domofon: {orderDetails.delivery_intercom}</p>
                      )}
                      <p>{orderDetails.delivery_city}, {orderDetails.delivery_postal_code}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">Zawartość zamówienia</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {orderDetails.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{item.menu_item_name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {item.quantity} x {parseFloat(item.menu_item_price).toFixed(2)} zł
                          </p>
                          {item.special_instructions && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Uwaga: {item.special_instructions}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base">
                            {(parseFloat(item.menu_item_price) * item.quantity).toFixed(2)} zł
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {orderDetails.special_instructions && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Uwagi specjalne</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {orderDetails.special_instructions}
                    </p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">Podsumowanie</h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suma częściowa:</span>
                      <span>{parseFloat(orderDetails.subtotal).toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dostawa:</span>
                      <span>{parseFloat(orderDetails.delivery_fee).toFixed(2)} zł</span>
                    </div>
                    {parseFloat(orderDetails.tax) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Podatek:</span>
                        <span>{parseFloat(orderDetails.tax).toFixed(2)} zł</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2">
                      <span>Razem:</span>
                      <span className="text-primary">{parseFloat(orderDetails.total).toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Metoda płatności:</span>
                      <span className="font-medium flex items-center gap-1.5">
                        {orderDetails.payment_method === 'card' ? (
                          <><CreditCard className="w-3.5 h-3.5" /> Karta</>
                        ) : orderDetails.payment_method === 'cash' ? (
                          <><Banknote className="w-3.5 h-3.5" /> Gotówka</>
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
                <p>Nie udało się załadować szczegółów zamówienia</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
    </>
  );
}
