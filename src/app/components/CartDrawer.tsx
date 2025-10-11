"use client";

import { useTranslation } from "react-i18next";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  weight: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartDrawer({
  items,
  onClose,
  onUpdateQuantity,
  onRemove,
}: CartDrawerProps) {
  const { t } = useTranslation("ns1");
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    comment: "",
  });

  const cartLabels = t("cart", { returnObjects: true }) as {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    continueShopping: string;
    remove: string;
  };
  
  const orderLabels = t("order", { returnObjects: true }) as {
    title: string;
    name: string;
    phone: string;
    address: string;
    comment: string;
    submit: string;
    success: string;
    deliveryTime: string;
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        comment: formData.comment,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      
      alert(`✅ ${orderLabels.success}\n\nЗаказ №${result.orderId.slice(0, 8)}\nСумма: ${result.total}₽\n\nМы свяжемся с вами в ближайшее время!`);
      
      // Очищаем корзину
      items.forEach((item) => onRemove(item.id));
      
      // Сбрасываем форму
      setFormData({
        name: "",
        phone: "",
        address: "",
        comment: "",
      });
      setShowCheckout(false);
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("❌ Не удалось создать заказ. Попробуйте снова или свяжитесь с нами по телефону.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
            <ShoppingBag size={24} className="sm:w-7 sm:h-7" />
            {cartLabels.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} className="sm:w-7 sm:h-7" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 sm:py-20 flex-1 flex flex-col justify-center">
            <ShoppingBag size={48} className="sm:w-16 sm:h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-base sm:text-lg">{cartLabels.empty}</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-sm sm:text-base"
            >
              {cartLabels.continueShopping}
            </button>
          </div>
        ) : (
          <>
            {!showCheckout ? (
              <>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 flex-1 overflow-y-auto">
                  {items && items.length > 0 ? (
                    items.map((item) => item ? (
                      <div
                        key={item.id}
                        className="bg-gray-700 rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4"
                      >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name || 'Продукт'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                            {item.name || 'Без названия'}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400">{item.weight}</p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-2">
                            <button
                              onClick={() =>
                              onUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition"
                          >
                            <Minus size={14} className="sm:w-4 sm:h-4" />
                          </button>
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
                          >
                            <Plus size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                        <div className="text-right flex flex-col justify-between">
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                          >
                            {cartLabels.remove}
                          </button>
                          <span className="text-orange-500 font-bold text-base sm:text-lg">
                            {item.price * item.quantity}₽
                          </span>
                        </div>
                      </div>
                    ) : null)
                    ) : (
                      <p className="text-gray-400 text-center py-4 text-sm sm:text-base">Корзина пуста</p>
                    )}
                  </div>

                  <div className="border-t border-gray-700 pt-4 flex-shrink-0">
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-gray-400 mb-2">
                        <span className="text-xs sm:text-sm">
                          Товаров в корзине:
                        </span>
                        <span className="text-xs sm:text-sm font-semibold">
                          {items.reduce((sum, item) => sum + item.quantity, 0)} шт
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg sm:text-xl font-semibold text-white">
                          {cartLabels.total}:
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold text-orange-500">
                          {total}₽
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full py-3 sm:py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-base sm:text-lg font-semibold"
                    >
                      {cartLabels.checkout}
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                    {orderLabels.title}
                  </h3>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">
                      {orderLabels.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">
                      {orderLabels.phone}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">
                      {orderLabels.address}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">
                      {orderLabels.comment}
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm sm:text-base">{cartLabels.total}:</span>
                      <span className="text-orange-500 font-bold text-lg sm:text-xl">
                        {total}₽
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {orderLabels.deliveryTime}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-2 sm:py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition text-sm sm:text-base"
                    >
                      {cartLabels.continueShopping}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 sm:py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSubmitting ? "Отправка..." : orderLabels.submit}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
      </div>
    </>
  );
}
