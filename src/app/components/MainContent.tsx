"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  weight: string;
}

interface MainContentProps {
  onAddToCart: (product: Product) => void;
}

export default function MainContent({ onAddToCart }: MainContentProps) {
  const { t } = useTranslation("ns1");
  
  const hero = t("hero", { returnObjects: true }) as {
    title: string;
    subtitle: string;
    description: string;
    orderButton: string;
    viewMenuButton: string;
  };

  const menu = t("menu", { returnObjects: true }) as {
    title: string;
    categories: string[];
  };

  const products = t("products", { returnObjects: true }) as Product[];
  const cartLabels = t("cart", { returnObjects: true }) as {
    addToCart: string;
  };

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notification, setNotification] = useState<string | null>(null);

  const filteredProducts =
    selectedCategory === "All" || selectedCategory === "Все" || selectedCategory === "Wszystko"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    setNotification(`${product.name} добавлен в корзину!`);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white pt-20">
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/00031.jpg"
            alt="Sushi background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-orange-500">
            {hero.title}
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 text-gray-300">
            {hero.subtitle}
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-400 max-w-2xl mx-auto">
            {hero.description}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#menu"
              className="px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-lg font-semibold"
            >
              {hero.orderButton}
            </a>
            <a
              href="#menu"
              className="px-8 py-4 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition text-lg font-semibold"
            >
              {hero.viewMenuButton}
            </a>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-orange-500">
          {menu.title}
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {menu.categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-2 text-sm">{product.weight}</p>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-orange-500">
                    {product.price}₽
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition flex items-center gap-2"
                  >
                    <Plus size={18} />
                    {cartLabels.addToCart}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
    </div>
  );
}
