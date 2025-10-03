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

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    alert(orderLabels.success);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-gray-800 z-50 shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <ShoppingBag size={28} />
              {cartLabels.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={28} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">{cartLabels.empty}</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
              >
                {cartLabels.continueShopping}
              </button>
            </div>
          ) : (
            <>
              {!showCheckout ? (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-700 rounded-lg p-4 flex gap-4"
                      >
                        <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-400">{item.weight}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-white font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-between">
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            {cartLabels.remove}
                          </button>
                          <span className="text-orange-500 font-bold text-lg">
                            {item.price * item.quantity}₽
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-semibold">
                        {cartLabels.total}:
                      </span>
                      <span className="text-3xl font-bold text-orange-500">
                        {total}₽
                      </span>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-lg font-semibold"
                    >
                      {cartLabels.checkout}
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {orderLabels.title}
                  </h3>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      {orderLabels.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      {orderLabels.phone}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      {orderLabels.address}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      {orderLabels.comment}
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>{cartLabels.total}:</span>
                      <span className="text-orange-500 font-bold text-xl">
                        {total}₽
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {orderLabels.deliveryTime}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
                    >
                      {cartLabels.continueShopping}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
                    >
                      {orderLabels.submit}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
