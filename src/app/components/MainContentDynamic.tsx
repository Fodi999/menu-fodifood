"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Plus, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  weight: string | null;
}

interface MainContentDynamicProps {
  onAddToCart: (product: {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    weight: string;
  }) => void;
}

export default function MainContentDynamic({ onAddToCart }: MainContentDynamicProps) {
  const { t } = useTranslation("ns1");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notification, setNotification] = useState<string | null>(null);

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

  const cartLabels = t("cart", { returnObjects: true }) as {
    addToCart: string;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/products`
      );
      const data = await res.json();
      // Проверяем, что data это массив
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Products data is not an array:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...Array.from(new Set((products || []).map(p => p.category)))];

  const filteredProducts =
    selectedCategory === "All"
      ? products || []
      : (products || []).filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || "",
      price: Number(product.price),
      image: product.imageUrl || "/00029.jpg",
      weight: product.weight || "",
    });
    
    setNotification(`${product.name} добавлен в корзину!`);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="py-20 px-6 relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-20 text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {hero.title}
        </h1>
        <p className="text-2xl md:text-3xl text-gray-300 mb-4">{hero.subtitle}</p>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">{hero.description}</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition">
            {hero.orderButton}
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition">
            {hero.viewMenuButton}
          </button>
        </div>
      </section>

      {/* Menu Section */}
      <section className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-orange-500">
          {menu.title}
        </h2>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category === "All" ? "Все" : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Продукты не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-64 bg-gray-700">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/00029.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <Package className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  {product.weight && (
                    <p className="text-gray-400 text-sm mb-2">{product.weight}</p>
                  )}
                  {product.description && (
                    <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-orange-500">
                      {Number(product.price).toFixed(0)}₽
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition"
                      title={cartLabels.addToCart}
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
