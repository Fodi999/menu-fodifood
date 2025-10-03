"use client";

import Head from "next/head";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import CartDrawer from "./components/CartDrawer";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
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

export default function Home() {
  const { t } = useTranslation("ns1");
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Head>
        <title>{t("siteMetadata.title")}</title>
      </Head>
      <div className="relative w-full min-h-screen bg-gray-900 text-white">
        <Header cartItemsCount={totalItems} onCartClick={toggleCart} />
        <MainContent onAddToCart={addToCart} />
        {showCart && (
          <CartDrawer
            items={cartItems}
            onClose={toggleCart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        )}
        <LanguageSwitcher />

        {/* Footer */}
        <footer className="bg-gray-950 py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-4">
                FODI SUSHI
              </h3>
              <p className="text-gray-400">{t("siteMetadata.description")}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">
                {t("buttonLabels.contact")}
              </h4>
              <p className="text-gray-400">{t("footer.phone")}</p>
              <p className="text-gray-400">{t("footer.email")}</p>
              <p className="text-gray-400 mt-2">{t("footer.workingHours")}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">
                {t("siteMetadata.deliveryInfo")}
              </h4>
              <p className="text-gray-400">{t("order.deliveryTime")}</p>
              <p className="text-gray-400">{t("order.minOrder")}</p>
            </div>
          </div>
          <div className="text-center text-gray-500 mt-8 border-t border-gray-800 pt-8">
            © 2025 FODI SUSHI. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}



























