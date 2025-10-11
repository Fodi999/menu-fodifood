"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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

  const hero = (t("hero", { returnObjects: true }) as {
    title: string;
    subtitle: string;
    description: string;
    orderButton: string;
    viewMenuButton: string;
  } | undefined) || {
    title: "FODI SUSHI",
    subtitle: "Premium Sushi",
    description: "Loading...",
    orderButton: "Order",
    viewMenuButton: "View Menu"
  };

  const menu = (t("menu", { returnObjects: true }) as {
    title: string;
    categories: string[];
  } | undefined) || {
    title: "Our Menu",
    categories: []
  };

  const cartLabels = (t("cart", { returnObjects: true }) as {
    addToCart: string;
  } | undefined) || {
    addToCart: "Add to Cart"
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

  const categories = ["All", ...Array.from(new Set((products || []).map(p => p?.category).filter(Boolean)))];

  const filteredProducts =
    selectedCategory === "All"
      ? products || []
      : (products || []).filter((p) => p?.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    if (!product || !product.id || !product.name) {
      console.error('Invalid product:', product);
      return;
    }
    
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
    <div className="py-16 sm:py-20 px-3 sm:px-6 relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 sm:top-24 right-3 sm:right-6 z-50 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg animate-fade-in text-sm sm:text-base">
          {notification}
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-12 sm:mb-20 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {hero.title}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-3 sm:mb-4">{hero.subtitle}</p>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">{hero.description}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition text-sm sm:text-base">
            {hero.orderButton}
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition text-sm sm:text-base">
            {hero.viewMenuButton}
          </button>
        </div>
      </section>

      {/* Menu Section */}
      <section className="max-w-7xl mx-auto" id="menu">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-orange-500">
          {menu.title}
        </h2>

        {/* Category Filters with Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto p-2 mb-8 sm:mb-12">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base"
              >
                {category === "All" ? "Все" : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <Skeleton className="h-48 sm:h-64 w-full bg-gray-700" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-1/2 mb-4 bg-gray-700" />
                      <Skeleton className="h-4 w-full bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Продукты не найдены</p>
              </div>
            ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {filteredProducts.map((product) => {
              // Проверка на валидность продукта
              if (!product || !product.id || !product.name) {
                return null;
              }
              
              return (
              <Card
                key={product.id}
                className="bg-gray-800 border-gray-700 overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] flex flex-col h-full"
              >
                <div className="relative h-48 sm:h-64 bg-gray-700 overflow-hidden flex-shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/00029.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <Package className="w-12 sm:w-16 h-12 sm:h-16 text-gray-500" />
                    </div>
                  )}
                  <Badge className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-orange-500 hover:bg-orange-600 border-none text-xs sm:text-sm">
                    {product.category || 'Без категории'}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2 sm:pb-3 flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-xl sm:text-2xl text-white line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 h-5 text-sm sm:text-base">
                    {product.weight || '\u00A0'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-3 sm:pb-4 flex-grow px-4 sm:px-6">
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 h-10">
                    {product.description || '\u00A0'}
                  </p>
                </CardContent>
                
                <CardFooter className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-700 flex-shrink-0 px-4 sm:px-6 pb-4 sm:pb-6">
                  <span className="text-2xl sm:text-3xl font-bold text-orange-500">
                    {Number(product.price || 0).toFixed(0)}₽
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    size="icon"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 shadow-lg hover:shadow-xl transition-all"
                    title={cartLabels.addToCart}
                  >
                    <Plus size={20} className="sm:w-6 sm:h-6" />
                  </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
