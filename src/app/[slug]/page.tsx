"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { businessesApi, chatApi, subscriptionsApi } from "@/lib/rust-api";
import type { Business } from "@/types/business";
import type { Product } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Users,
  Package,
  Clock,
  Phone,
  Mail,
  Globe,
  Heart,
  ShoppingCart,
  MessageSquare,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function BusinessPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  // State
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatSending, setChatSending] = useState(false);

  useEffect(() => {
    loadBusinessData();
  }, [slug]);

  const loadBusinessData = async () => {
    try {
      setLoading(true);

      // Try to load business by slug first, fallback to ID
      let businessData: Business;
      try {
        businessData = await businessesApi.getBySlug(slug);
      } catch (slugError) {
        // If slug fails, try by ID (for businesses without slug)
        console.log("Slug lookup failed, trying by ID...");
        businessData = await businessesApi.getById(slug);
      }
      
      setBusiness(businessData);

      // Load products (mock for now - будем добавлять API позже)
      const mockProducts: Product[] = [
        {
          id: "1",
          business_id: businessData.id,
          name: "Филадельфия классик",
          description: "Лосось, сливочный сыр, огурец, рис, нори",
          price: 450,
          image_url: "/products/philadelphia.jpg",
          category: "Роллы",
          is_available: true,
          ingredients: ["Лосось", "Сливочный сыр", "Огурец", "Рис", "Нори"],
          calories: 320,
          weight: 250,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          business_id: businessData.id,
          name: "Калифорния",
          description: "Краб, авокадо, огурец, икра масаго",
          price: 380,
          image_url: "/products/california.jpg",
          category: "Роллы",
          is_available: true,
          ingredients: ["Краб", "Авокадо", "Огурец", "Икра масаго"],
          calories: 280,
          weight: 220,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          business_id: businessData.id,
          name: "Сет Микс",
          description: "Ассорти из 40 популярных роллов",
          price: 1200,
          image_url: "/products/mix-set.jpg",
          category: "Сеты",
          is_available: true,
          calories: 1200,
          weight: 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "4",
          business_id: businessData.id,
          name: "Нигири с лососем",
          description: "Рис, свежий лосось",
          price: 120,
          image_url: "/products/nigiri-salmon.jpg",
          category: "Нигири",
          is_available: true,
          ingredients: ["Рис", "Лосось"],
          calories: 80,
          weight: 40,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "5",
          business_id: businessData.id,
          name: "Кока-Кола 0.5л",
          description: "Охлажденный напиток",
          price: 150,
          image_url: "/products/cola.jpg",
          category: "Напитки",
          is_available: true,
          calories: 210,
          weight: 500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setProducts(mockProducts);

      // Check subscription status
      if (user) {
        try {
          const subscriptions = await subscriptionsApi.getUserSubscriptions();
          const isSubbed = subscriptions.some((sub) => sub.business_id === businessData.id);
          setIsSubscribed(isSubbed);
        } catch (error) {
          console.error("Failed to check subscription:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load business:", error);
      toast.error("Не удалось загрузить бизнес");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Войдите чтобы подписаться");
      router.push("/auth/signin");
      return;
    }

    try {
      setSubscribing(true);
      if (isSubscribed) {
        // Unsubscribe logic (needs subscription ID)
        toast.info("Отписка будет реализована");
      } else {
        await subscriptionsApi.subscribe(business!.id);
        setIsSubscribed(true);
        toast.success("Вы подписались на обновления!");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Не удалось подписаться");
    } finally {
      setSubscribing(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || chatSending) return;

    setChatSending(true);
    try {
      await chatApi.sendMessage({
        message: chatMessage,
        business_id: business?.id,
      });
      setChatMessage("");
      toast.success("Сообщение отправлено AI!");
      // Можно перенаправить на страницу чата
      router.push("/chat");
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Не удалось отправить сообщение");
    } finally {
      setChatSending(false);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a]">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        {business.cover_image_url ? (
          <Image
            src={business.cover_image_url}
            alt={business.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-600 to-yellow-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="bg-black/50 backdrop-blur hover:bg-black/70"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Link>
          </Button>
        </div>

        {/* Business Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {business.name}
                </h1>
                <p className="text-gray-200 text-sm sm:text-base mb-3 max-w-2xl">
                  {business.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    {business.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{business.city}</span>
                  </div>
                  {business.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-white">{business.rating.toFixed(1)}</span>
                      {business.reviews_count && (
                        <span className="text-gray-400">({business.reviews_count})</span>
                      )}
                    </div>
                  )}
                  {business.subscribers_count !== undefined && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{business.subscribers_count.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscribe Button */}
              <Button
                onClick={handleSubscribe}
                disabled={subscribing}
                className={`${
                  isSubscribed
                    ? "bg-green-500/20 border-2 border-green-500 text-green-400 hover:bg-green-500/30"
                    : "bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 text-black"
                }`}
              >
                {subscribing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : isSubscribed ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Heart className="w-4 h-4 mr-2" />
                )}
                {isSubscribed ? "Подписан" : "Подписаться"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Menu */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="bg-gray-800 border-gray-700">
                <TabsTrigger value="menu">Меню</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы ({business.reviews_count || 0})</TabsTrigger>
                <TabsTrigger value="about">О заведении</TabsTrigger>
              </TabsList>

              {/* Menu Tab */}
              <TabsContent value="menu" className="space-y-6 mt-6">
                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    variant={!selectedCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Все
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-[#0d0d0d] border-gray-800 hover:border-orange-500/50 transition-all overflow-hidden group"
                    >
                      {/* Product Image */}
                      {product.image_url && (
                        <div className="relative w-full h-40 overflow-hidden">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {!product.is_available && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                              <Badge variant="destructive">Нет в наличии</Badge>
                            </div>
                          )}
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-white text-base">
                            {product.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Product Details */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {product.weight && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {product.weight}г
                            </span>
                          )}
                          {product.calories && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {product.calories} ккал
                            </span>
                          )}
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-orange-400">
                            ₽{product.price}
                          </div>
                          <Button
                            size="sm"
                            disabled={!product.is_available}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            В корзину
                          </Button>
                        </div>

                        {/* Ingredients */}
                        {product.ingredients && product.ingredients.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {product.ingredients.join(", ")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    Продуктов в этой категории пока нет
                  </div>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <Card className="bg-[#0d0d0d] border-gray-800">
                  <CardContent className="py-12 text-center text-gray-400">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p>Отзывы будут доступны в следующем обновлении</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6">
                <Card className="bg-[#0d0d0d] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">О заведении</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-gray-300">
                    <p>{business.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-500">Город</p>
                          <p className="text-white">{business.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-500">Товаров в меню</p>
                          <p className="text-white">{products.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-500">Подписчиков</p>
                          <p className="text-white">{business.subscribers_count || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-500">Рейтинг</p>
                          <p className="text-white">{business.rating?.toFixed(1) || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: AI Chat & Info */}
          <div className="space-y-6">
            {/* Quick AI Chat */}
            <Card className="bg-[#0d0d0d] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-400" />
                  Спросите AI о заведении
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Есть ли вегетарианские блюда?"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendChatMessage()}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  onClick={handleSendChatMessage}
                  disabled={!chatMessage.trim() || chatSending}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-black hover:from-orange-400 hover:to-yellow-300"
                >
                  {chatSending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <MessageSquare className="w-4 h-4 mr-2" />
                  )}
                  Спросить AI
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/chat">
                    Открыть полный чат
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Business Stats */}
            <Card className="bg-[#0d0d0d] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Товаров</span>
                  <span className="text-white font-semibold">{products.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Подписчиков</span>
                  <span className="text-white font-semibold">
                    {business.subscribers_count?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Отзывов</span>
                  <span className="text-white font-semibold">
                    {business.reviews_count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400 text-sm">Рейтинг</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">
                      {business.rating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {(business.phone || business.email || business.website) && (
              <Card className="bg-[#0d0d0d] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Контакты</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{business.phone}</span>
                    </a>
                  )}
                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{business.email}</span>
                    </a>
                  )}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Веб-сайт</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
