'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  MapPin, 
  User,
  Users,
  Phone, 
  Mail, 
  ArrowLeft,
  ArrowRight,
  Check,
  Navigation,
  Loader2,
  CreditCard
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types/restaurant';
import { ordersAPI } from '@/lib/restaurant-api';
import { analytics } from '@/lib/analytics';
import { DeliveryMethodSelector, type DeliveryMethod, type DeliveryOptions } from '@/components/Checkout/DeliveryMethodSelector';
import { PaymentMethodSelector, type PaymentMethod as PaymentMethodType } from '@/components/Checkout/PaymentMethodSelector';
import { CouponInput, type AppliedCoupon } from '@/components/Marketing/CouponInput';
import { CartPointsPreview } from '@/components/Loyalty/PointsIndicator';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Step navigation
  const [currentStep, setCurrentStep] = useState(1);

  // Delivery & Payment state
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptions>({
    method: 'delivery',
    time: 'asap',
    scheduledDate: '',
    scheduledTime: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('blik');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    numberOfPeople: 1,
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
  });

  // Get user's current location
  const getUserLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      if (!navigator.geolocation) {
        toast.error('Геолокация не поддерживается вашим браузером');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pl`
      );

      if (!response.ok) throw new Error('Failed to fetch address');

      const data = await response.json();
      const address = data.address;
      const street = address.road || address.pedestrian || '';
      const houseNumber = address.house_number || '';
      const fullAddress = `${street} ${houseNumber}`.trim();

      setFormData(prev => ({ ...prev, address: fullAddress }));
      toast.success('✅ Адрес определен автоматически', { description: fullAddress });

    } catch (error: unknown) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('❌ Доступ к геолокации запрещен', { description: 'Разрешите доступ в настройках браузера' });
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('❌ Местоположение недоступно');
            break;
          case error.TIMEOUT:
            toast.error('⏱️ Время ожидания истекло', { description: 'Попробуйте еще раз' });
            break;
        }
      } else {
        toast.error('Не удалось определить адрес');
      }
      console.error('Geolocation error:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Calculate coupon discount
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return (totalPrice * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === 'fixed_amount') {
      return appliedCoupon.discount;
    }
    return 0;
  };

  const couponDiscount = calculateCouponDiscount();
  const subtotalAfterCoupon = Math.max(totalPrice - couponDiscount, 0);
  
  const isFreeDeliveryFromCoupon = appliedCoupon?.type === 'free_delivery';
  
  const deliveryFee = deliveryOptions.method === 'pickup' ? 0 : 
    (isFreeDeliveryFromCoupon ? 0 : (subtotalAfterCoupon >= 100 ? 0 : 10));
  
  const totalWithDelivery = subtotalAfterCoupon + deliveryFee;

  // Step navigation handlers
  const goToNextStep = () => {
    if (currentStep === 1) {
      // Validate Step 1: delivery options
      if (deliveryOptions.time === 'scheduled' && (!deliveryOptions.scheduledDate || !deliveryOptions.scheduledTime)) {
        toast.error('Wybierz datę i godzinę dostawy!');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate Step 2: contact info
      if (!formData.name.trim()) {
        toast.error('Wypełnij pole "Imię"!');
        return;
      }
      if (!formData.phone.trim()) {
        toast.error('Wypełnij pole "Telefon"!');
        return;
      }
      // Only validate address if delivery method is 'delivery'
      if (deliveryOptions.method === 'delivery' && !formData.address.trim()) {
        toast.error('Wypełnij adres dostawy!');
        return;
      }
      setCurrentStep(3);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Заполните имя и телефон!');
      return;
    }

    if (deliveryOptions.method === 'delivery' && !formData.address.trim()) {
      toast.error('Заполните адрес доставки!');
      return;
    }

    setIsLoading(true);

    try {
      const backendPaymentMethod = 
        paymentMethod === 'blik' ? PaymentMethod.ONLINE :
        paymentMethod === 'card' ? PaymentMethod.CARD :
        paymentMethod === 'p24' ? PaymentMethod.ONLINE :
        PaymentMethod.CASH;

      const fullAddress = deliveryOptions.method === 'delivery' 
        ? [
            formData.address,
            formData.apartment && `Mieszkanie ${formData.apartment}`,
            formData.entrance && `Klatka ${formData.entrance}`,
            formData.floor && `Piętro ${formData.floor}`,
            formData.intercom && `Domofon ${formData.intercom}`
          ].filter(Boolean).join(', ')
        : 'Odbiór osobisty';

      const specialInstructions = [
        `👥 Liczba osób: ${formData.numberOfPeople}`,
        `🚚 ${deliveryOptions.method === 'delivery' ? 'Dostawa' : 'Odbiór osobisty'}`,
        `⏰ ${deliveryOptions.time === 'asap' ? 'Jak najszybciej' : `${deliveryOptions.scheduledDate} ${deliveryOptions.scheduledTime}`}`,
        appliedCoupon ? `🎟️ Kupon: ${appliedCoupon.code}` : '',
        formData.comment ? `💬 ${formData.comment}` : ''
      ].filter(Boolean).join('\n');

      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email || undefined,
        customer_phone: formData.phone,
        delivery_address: fullAddress,
        delivery_street: formData.address || 'Odbiór osobisty',
        delivery_building: formData.apartment || '',
        delivery_city: 'Warszawa',
        delivery_postal_code: '00-000',
        payment_method: backendPaymentMethod,
        special_instructions: specialInstructions,
        items: items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
          modifiers: []
        }))
      };

      console.log('📦 Submitting order:', orderData);

      const response = await ordersAPI.create(orderData);

      // analytics.track('order_completed', {
      //   order_id: response.id,
      //   total: totalWithDelivery,
      //   items_count: items.length,
      //   payment_method: paymentMethod,
      //   delivery_method: deliveryOptions.method,
      //   coupon_used: appliedCoupon?.code || null
      // });

      toast.success('✅ Zamówienie złożone!', {
        description: `Numer zamówienia: #${response.id}`
      });

      clearCart();
      router.push('/order-success');

    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Ошибка при оформлении заказа', {
        description: 'Попробуйте еще раз или свяжитесь с нами'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Koszyk jest pusty</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">Dodaj produkty do koszyka, aby kontynuować</p>
          <Button asChild size="sm" className="h-10 sm:h-11">
            <Link href="/#menu">Zobacz menu</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-3 sm:py-4 px-3 sm:px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Powrót do menu
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Оформление заказа</h1>
        </div>

        {/* Progress Bar */}
        <div className="bg-card rounded-lg p-2 sm:p-3 border border-border/50 mb-3 sm:mb-4 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {/* Step 1 */}
            <button 
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <p className={`text-[10px] sm:text-xs font-medium ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                Dostawa
              </p>
            </button>

            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />

            {/* Step 2 */}
            <button 
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <p className={`text-[10px] sm:text-xs font-medium ${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                Kontakt
              </p>
            </button>

            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />

            {/* Step 3 */}
            <button 
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
            >
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <p className={`text-[10px] sm:text-xs font-medium ${currentStep >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                Płatność
              </p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <AnimatePresence mode="wait">
            {/* STEP 1: Delivery Method */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-muted/50 px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-border">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] sm:text-xs font-bold">
                        1
                      </div>
                      <h2 className="text-xs sm:text-sm font-bold">Sposób dostawy i czas</h2>
                    </div>
                  </div>
                  <CardContent className="p-2.5 sm:p-3">
                    <DeliveryMethodSelector
                      onChange={setDeliveryOptions}
                      defaultMethod={deliveryOptions.method}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end mt-2 sm:mt-3">
                  <Button type="button" onClick={goToNextStep} size="sm" className="gap-1.5 sm:gap-2 h-9 text-xs sm:text-sm">
                    Dalej <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Contact Info */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-muted/50 px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-border">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] sm:text-xs font-bold">
                        2
                      </div>
                      <h2 className="text-xs sm:text-sm font-bold">Dane kontaktowe i adres</h2>
                    </div>
                  </div>
                  <CardContent className="p-2.5 sm:p-3 space-y-2.5 sm:space-y-3">
                    {/* Contact Section */}
                    <div>
                      <h3 className="text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2">📞 Kontakt</h3>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium mb-1">Imię *</label>
                          <div className="relative">
                            <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input
                              placeholder="Jan"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="pl-7 h-8 text-xs sm:text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium mb-1">Telefon *</label>
                          <div className="relative">
                            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input
                              type="tel"
                              placeholder="+48 123 456 789"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="pl-7 h-8 text-xs sm:text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium mb-1">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="jan@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="pl-7 h-8 text-xs sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium mb-1">Liczba osób</label>
                          <div className="relative">
                            <Users className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              max="20"
                              value={formData.numberOfPeople}
                              onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })}
                              className="pl-7 h-8 text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Section (only for delivery) */}
                    {deliveryOptions.method === 'delivery' && (
                      <>
                        <div className="h-px bg-border" />
                        
                        <div>
                          <h3 className="text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2">📍 Adres dostawy</h3>
                          
                          <div className="space-y-1.5 sm:space-y-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] sm:text-xs font-medium">Ulica i numer *</label>
                                <button
                                  type="button"
                                  onClick={getUserLocation}
                                  disabled={isLoadingLocation}
                                  className="text-[9px] sm:text-[10px] text-primary hover:underline flex items-center gap-0.5 sm:gap-1"
                                >
                                  {isLoadingLocation ? (
                                    <>
                                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                      GPS...
                                    </>
                                  ) : (
                                    <>
                                      <Navigation className="w-2.5 h-2.5" />
                                      GPS
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="relative">
                                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                <Input
                                  placeholder="ul. Główna 15"
                                  value={formData.address}
                                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                  className="pl-7 h-8 text-xs sm:text-sm"
                                  required={deliveryOptions.method === 'delivery'}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                              <div>
                                <label className="block text-[10px] sm:text-xs font-medium mb-1">Mieszk.</label>
                                <Input
                                  placeholder="15"
                                  value={formData.apartment}
                                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                                  className="h-8 text-xs sm:text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] sm:text-xs font-medium mb-1">Klatka</label>
                                <Input
                                  placeholder="A"
                                  value={formData.entrance}
                                  onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                                  className="h-8 text-xs sm:text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] sm:text-xs font-medium mb-1">Piętro</label>
                                <Input
                                  placeholder="3"
                                  value={formData.floor}
                                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                  className="h-8 text-xs sm:text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] sm:text-xs font-medium mb-1">Domof.</label>
                                <Input
                                  placeholder="15"
                                  value={formData.intercom}
                                  onChange={(e) => setFormData({ ...formData, intercom: e.target.value })}
                                  className="h-8 text-xs sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium mb-1">Komentarz</label>
                              <Input
                                placeholder="Dodatkowe informacje..."
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                className="h-8 text-xs sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-2 sm:mt-3">
                  <Button type="button" onClick={goToPreviousStep} variant="outline" size="sm" className="gap-1 h-9 text-xs sm:text-sm">
                    <ArrowRight className="w-3 h-3 rotate-180" /> Назад
                  </Button>
                  <Button type="button" onClick={goToNextStep} size="sm" className="gap-1 h-9 text-xs sm:text-sm">
                    Dalej <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Hint */}
                {deliveryOptions.method === 'pickup' && (
                  <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground mt-1.5 sm:mt-2">
                    💡 Dla odbioru osobistego adres nie jest wymagany
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 3: Payment & Coupons */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-muted/50 px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-border">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] sm:text-xs font-bold">
                        3
                      </div>
                      <h2 className="text-xs sm:text-sm font-bold">Płatność i kupony</h2>
                    </div>
                  </div>
                  <CardContent className="p-2.5 sm:p-3 space-y-2.5 sm:space-y-3">
                    {/* Coupon */}
                    <div>
                      <h3 className="text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2">🎟️ Kupon</h3>
                      <CouponInput 
                        orderTotal={totalPrice}
                        onApply={setAppliedCoupon}
                        onRemove={() => setAppliedCoupon(null)}
                        currentCoupon={appliedCoupon}
                      />
                    </div>

                    <div className="h-px bg-border" />

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2">💳 Płatność</h3>
                      <PaymentMethodSelector
                        onChange={setPaymentMethod}
                        defaultMethod={paymentMethod}
                        deliveryMethod={deliveryOptions.method}
                      />
                    </div>

                    <div className="h-px bg-border" />

                    {/* Loyalty Points */}
                    {/* <div>
                      <h3 className="text-xs font-semibold mb-2">💎 Punkty</h3>
                      <CartPointsPreview 
                        currentPoints={0} 
                        orderAmount={totalPrice}
                        appliedCoupon={appliedCoupon}
                      />
                    </div>

                    <div className="h-px bg-border" /> */}

                    {/* Order Summary */}
                    <div className="bg-muted/30 rounded-lg p-2 sm:p-2.5 space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-xs">
                        <span>Produkty:</span>
                        <span>{totalPrice.toFixed(2)} zł</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between text-[10px] sm:text-xs text-green-600">
                          <span>Rabat ({appliedCoupon.code}):</span>
                          <span>-{couponDiscount.toFixed(2)} zł</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-[10px] sm:text-xs">
                        <span>Dostawa:</span>
                        <span>{deliveryFee === 0 ? 'Gratis' : `${deliveryFee.toFixed(2)} zł`}</span>
                      </div>
                      
                      <div className="h-px bg-border" />
                      
                      <div className="flex justify-between font-bold text-xs sm:text-sm">
                        <span>Razem:</span>
                        <span className="text-primary">{totalWithDelivery.toFixed(2)} zł</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-2 sm:mt-3 gap-1.5 sm:gap-2">
                  <Button type="button" onClick={goToPreviousStep} variant="outline" size="sm" className="gap-1 h-9 text-xs sm:text-sm">
                    <ArrowRight className="w-3 h-3 rotate-180" /> Назад
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading}
                    className="flex-1 gap-1 h-9 text-[10px] sm:text-xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="hidden sm:inline">Przetwarzanie...</span>
                        <span className="sm:hidden">Czekaj...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3 h-3" />
                        <span className="hidden sm:inline">Potwierdź ({totalWithDelivery.toFixed(2)} zł)</span>
                        <span className="sm:hidden">Zamów ({totalWithDelivery.toFixed(2)} zł)</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
