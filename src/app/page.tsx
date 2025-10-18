"use client";

import { useEffect, useState } from "react";
import { businessesApi } from "@/lib/rust-api";
import type { Business, BusinessCategory } from "@/types/business";
import { BusinessGrid } from "./components/BusinessGrid";
import { Filters } from "./components/Filters";
import { RoleSwitcher } from "./components/RoleSwitcher";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { UserRole } from "@/types/user";
import { Loader2, Store, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await businessesApi.getAll();
      setBusinesses(data);
      setFilteredBusinesses(data);
    } catch (err: any) {
      console.error("Failed to load businesses:", err);
      setError(err.message || "Не удалось загрузить бизнесы");
      // Mock data for development
      const mockBusinesses: Business[] = [
        {
          id: "1",
          name: "FODI SUSHI",
          slug: "fodi-sushi",
          description: "Лучшие суши в городе с доставкой",
          category: "RESTAURANT" as any,
          city: "Москва",
          address: "ул. Пушкина, д. 10",
          phone: "+7 (999) 123-45-67",
          email: "info@fodisushi.ru",
          logo_url: "/svg 1.svg",
          owner_id: "1",
          is_active: true,
          rating: 4.8,
          subscribers_count: 1250,
          products_count: 45,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setBusinesses(mockBusinesses);
      setFilteredBusinesses(mockBusinesses);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = businesses;

    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (selectedCity) {
      result = result.filter((b) => b.city === selectedCity);
    }

    if (searchQuery) {
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBusinesses(result);
  }, [selectedCategory, selectedCity, searchQuery, businesses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Загрузка бизнесов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] text-gray-100 relative">
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Store className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold">
                  <span className="text-orange-500">FODI</span>{" "}
                  <span className="text-white">MARKET</span>
                </span>
              </Link>
              <Link 
                href="/about" 
                className="hidden sm:block text-gray-400 hover:text-orange-400 transition-colors duration-200 font-medium"
              >
                О проекте
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {user && user.role === UserRole.BUSINESS_OWNER && <RoleSwitcher />}
              {user ? (
                <Button asChild variant="outline">
                  <Link href="/profile">Профиль</Link>
                </Button>
              ) : (
                <Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/auth/signin">Войти</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-8">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
                🌐 Витрина бизнесов
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light tracking-wide">
              Откройте для себя лучшие рестораны, кафе и магазины вашего города
            </p>
          </div>

          {/* Stats - Premium Dashboard Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-800/50 shadow-2xl p-6 hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all duration-300 group">
              <div className="space-y-3">
                <Store className="w-10 h-10 text-orange-500 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-orange-400">{businesses.length}</p>
                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Активных бизнесов</p>
              </div>
            </div>
            
            <div className="rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-800/50 shadow-2xl p-6 hover:border-blue-500/30 hover:shadow-blue-500/10 transition-all duration-300 group">
              <div className="space-y-3">
                <Users className="w-10 h-10 text-blue-500 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-blue-400">
                  {businesses.reduce((sum, b) => sum + (b.subscribers_count || 0), 0).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Подписчиков</p>
              </div>
            </div>
            
            <div className="rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-800/50 shadow-2xl p-6 hover:border-green-500/30 hover:shadow-green-500/10 transition-all duration-300 group">
              <div className="space-y-3">
                <TrendingUp className="w-10 h-10 text-green-500 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-green-400">
                  {businesses.length > 0 
                    ? (businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length).toFixed(1)
                    : '0.0'
                  }
                </p>
                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Средний рейтинг</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Filters
          category={selectedCategory as BusinessCategory | undefined}
          city={selectedCity || undefined}
          search={searchQuery}
          onCategoryChange={(cat) => setSelectedCategory(cat || null)}
          onCityChange={(city) => setSelectedCity(city)}
          onSearchChange={setSearchQuery}
          onReset={() => {
            setSelectedCategory(null);
            setSelectedCity(null);
            setSearchQuery("");
          }}
        />

        {/* Error */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border-l-4 border-yellow-500 text-yellow-200 px-6 py-5 rounded-r-xl backdrop-blur-sm shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div className="space-y-2">
                <p className="font-semibold text-lg">Rust API недоступен</p>
                <p className="text-sm text-yellow-300/80 leading-relaxed">
                  Показаны демонстрационные данные. Запустите Rust backend для полного функционала.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Business Grid */}
        {filteredBusinesses.length > 0 ? (
          <BusinessGrid businesses={filteredBusinesses} />
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <Store className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-xl font-medium mb-2">
                Нет бизнесов по выбранным фильтрам
              </p>
              <p className="text-gray-500 text-sm">
                Попробуйте изменить параметры поиска
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedCity(null);
                  setSearchQuery("");
                }}
                variant="outline"
                className="mt-6 bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA for Business Owners */}
        {(!user || currentRole === UserRole.USER) && (
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-orange-700/10 border border-orange-600/30 backdrop-blur-sm overflow-hidden relative shadow-2xl">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5 animate-pulse" />
            
            <div className="relative p-10 sm:p-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  Владеете бизнесом?
                </h2>
                <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                  Зарегистрируйтесь и создайте витрину вашего заведения <span className="text-orange-400 font-semibold">бесплатно</span>!<br/>
                  Привлекайте новых клиентов и увеличивайте продажи.
                </p>
              </div>
              
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold px-10 py-7 text-lg shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <Link href="/auth/signup" className="flex items-center gap-2">
                  Создать бизнес-аккаунт
                  <span className="text-xl">→</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-24 py-10 bg-[#0a0a0a]/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm font-light tracking-wide">
            © 2025{" "}
            <span className="font-semibold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
              FODI MARKET
            </span>
            {" • "}
            <span className="text-gray-600">Powered by Rust AI Gateway</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
