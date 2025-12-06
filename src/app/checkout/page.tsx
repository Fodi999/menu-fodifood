'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  MapPin, 
  User,
  Users,
  Phone, 
  Mail, 
  CreditCard,
  Banknote,
  Smartphone,
  ArrowLeft,
  Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types/restaurant';
import { ordersAPI } from '@/lib/restaurant-api';
import { analytics } from '@/lib/analytics';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    numberOfPeople: '2',
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
    paymentMethod: PaymentMethod.CASH,
  });

  const deliveryFee = totalPrice >= 100 ? 0 : 10;
  const totalWithDelivery = totalPrice + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Koszyk jest pusty!');
      return;
    }

    if (totalPrice < 30) {
      toast.error('Минимальная сумма заказа - 30 zł');
      return;
    }

    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Заполните обязательные поля!');
      return;
    }

    // Validate number of people
    const numPeople = parseInt(formData.numberOfPeople);
    if (!numPeople || numPeople < 1 || numPeople > 20) {
      toast.error('Укажите корректное количество персон (от 1 до 20)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse address (simple split by comma or space)
      const addressParts = formData.address.split(/,|\s+/);
      const street = addressParts.slice(0, -1).join(' ') || formData.address;
      const building = addressParts[addressParts.length - 1] || '1';

      // Add number of people to special instructions
      const specialInstructions = [
        `👥 Количество персон: ${formData.numberOfPeople}`,
        formData.comment
      ].filter(Boolean).join('\n');

      // Prepare order data for API
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || undefined,
        delivery_street: street,
        delivery_building: building,
        delivery_apartment: formData.apartment || undefined,
        delivery_floor: formData.floor || undefined,
        delivery_entrance: formData.entrance || undefined,
        delivery_intercom: formData.intercom || undefined,
        delivery_city: 'Warszawa', // TODO: Add city selection
        delivery_postal_code: '00-001', // TODO: Add postal code input
        delivery_country: 'Poland',
        payment_method: formData.paymentMethod,
        special_instructions: specialInstructions || undefined,
        items: items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          special_instructions: undefined,
        })),
      };

      console.log('📦 Sending order to backend:', orderData);

      // Send order to backend
      const createdOrder = await ordersAPI.create(orderData);

      console.log('✅ Order created successfully:', createdOrder);

      // Track order in analytics
      analytics.trackOrder();

      toast.success(`Заказ #${createdOrder.order_number} успешно оформлен! Мы свяжемся с вами для подтверждения.`);
      clearCart();
      
      // Redirect to success page with order number
      router.push(`/order-success?order=${createdOrder.order_number}`);
    } catch (error) {
      console.error('❌ Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при оформлении заказа. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Koszyk jest pusty</h1>
          <p className="text-muted-foreground mb-6">
            Dodaj dania z menu, aby złożyć zamówienie
          </p>
          <Button asChild>
            <Link href="/menu">Перейти в меню</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Вернуться на главную
          </Link>
          <h1 className="text-3xl font-bold">Przetwarzanie...каза</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 border border-border/50"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Dane kontaktowe
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Imię *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefon *
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+48 123 456 789"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Email (opcjonalnie)
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Количество персон *
                  </label>
                  <Input
                    required
                    type="number"
                    min="1"
                    max="20"
                    value={formData.numberOfPeople}
                    onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                    placeholder="2"
                  />
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border/50"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Adres dostawy
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ulica i numer domu *
                  </label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="ul. Przykładowa 123"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mieszkanie
                    </label>
                    <Input
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Klatka
                    </label>
                    <Input
                      value={formData.entrance}
                      onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Piętro
                    </label>
                    <Input
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Domofon
                    </label>
                    <Input
                      value={formData.intercom}
                      onChange={(e) => setFormData({ ...formData, intercom: e.target.value })}
                      placeholder="45"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Komentarz do zamówienia
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Например: позвоните за 10 минут до доставки"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 border border-border/50"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Metoda płatności
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: PaymentMethod.CASH })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.paymentMethod === PaymentMethod.CASH
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Banknote className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">Наличными</p>
                  <p className="text-xs text-muted-foreground">При получении</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: PaymentMethod.CARD })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.paymentMethod === PaymentMethod.CARD
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">Kartą</p>
                  <p className="text-xs text-muted-foreground">При получении</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: PaymentMethod.ONLINE })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.paymentMethod === PaymentMethod.ONLINE
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">Онлайн</p>
                  <p className="text-xs text-muted-foreground">Сейчас</p>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 border border-border/50 sticky top-24"
            >
              <h2 className="text-xl font-bold mb-4">Twoje zamówienie</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.weight}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                        <span className="font-semibold text-sm text-primary">
                          {(item.price * item.quantity).toFixed(2)} zł
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 mb-4">
                {formData.numberOfPeople && (
                  <div className="flex items-center justify-between text-sm mb-3 pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Количество персон
                    </span>
                    <span className="font-semibold">{formData.numberOfPeople}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Товары</span>
                  <span className="font-semibold">{totalPrice.toFixed(2)} zł</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dostawa</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Бесплатно</span>
                    ) : (
                      `${deliveryFee.toFixed(2)} zł`
                    )}
                  </span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Razem</span>
                  <span className="font-bold text-lg text-primary">
                    {totalWithDelivery.toFixed(2)} zł
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.phone || !formData.address || !formData.numberOfPeople}
                size="lg"
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  <>Przetwarzanie...</>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Złóż zamówienie
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с условиями доставки
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
