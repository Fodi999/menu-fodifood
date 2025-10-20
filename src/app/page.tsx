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
import { Loader2, Store, Menu, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { WalletButton } from "@/components/WalletButton";
import { AnimatedStats } from "@/components/AnimatedStats";

export default function HomePage() {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#1a1005] text-gray-100 relative overflow-x-hidden">
      {/* Enhanced noise texture with deeper contrast */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />
      
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
      
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <span className="text-xl sm:text-2xl font-bold">
                <span className="text-orange-500">FODI</span>{" "}
                <span className="text-white hidden xs:inline">MARKET</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/about" className="gap-2">
                    <span className="hidden lg:inline">О проекте</span>
                    <span className="lg:hidden">О нас</span>
                    <motion.span 
                      className="text-orange-400 text-xs"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ⚡
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <WalletButton />
              <LanguageSwitcher />
              {user && user.role === UserRole.BUSINESS_OWNER && <RoleSwitcher />}
              {user ? (
                <Button asChild variant="outline" size="sm">
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Профиль
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/auth/signin">Войти</Link>
                </Button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <WalletButton />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-300">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-gray-900 border-gray-800">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-white">
                      <Store className="w-6 h-6 text-orange-500" />
                      <span>
                        <span className="text-orange-500">FODI</span> MARKET
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-4 mt-8">
                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-start gap-3 text-base"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/about">
                          <span>О проекте</span>
                          <span className="text-orange-400 text-sm">⚡</span>
                        </Link>
                      </Button>
                    </nav>

                    <div className="border-t border-gray-800 my-2" />

                    {/* Mobile Settings */}
                    <div className="flex flex-col gap-3">
                      <LanguageSwitcher />
                      {user && user.role === UserRole.BUSINESS_OWNER && <RoleSwitcher />}
                      {user ? (
                        <Button asChild variant="outline" onClick={() => setMobileMenuOpen(false)}>
                          <Link href="/profile">
                            <User className="w-4 h-4 mr-2" />
                            Профиль
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/auth/signin">Войти</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 relative z-10">
        {/* Hero Section with Parallax */}
        <motion.div 
          className="text-center space-y-8 py-8 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-6 relative">
            {/* Pulsing glow under logo */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 rounded-full blur-[100px] -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
                FODI MARKET
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Future of Digital Interaction
            </motion.p>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto font-light tracking-wide leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Метавселенная, объединяющая AI, Web3 и реальные бизнесы в единую экосистему
            </motion.p>
            
            {/* CTA Buttons with pulsing glow */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Glow under buttons */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 rounded-full blur-[60px] -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <Button 
                asChild 
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-orange-500/50 transition-all duration-300 relative group"
              >
                <Link href="/about">
                  🚀 Узнать о проекте
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-30 blur-xl -z-10"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold px-8 py-6 text-base sm:text-lg rounded-full transition-all duration-300 relative group"
              >
                <Link href="/about/web3/token">
                  💎 Токен FODI
                  <motion.div
                    className="absolute inset-0 rounded-full bg-orange-500 opacity-0 group-hover:opacity-20 blur-xl -z-10"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Stats - Premium Dashboard Panel with Animated Counters */}
          <AnimatedStats businesses={businesses} />
        </motion.div>

        {/* Divider with "Витрина бизнесов" - Parallax Effect */}
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Store className="w-5 h-5 text-orange-500 relative z-10" />
            </motion.div>
            
            <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent relative z-10">
              Витрина бизнесов
            </span>
          </motion.div>
        </motion.div>

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

        {/* CTA for Business Owners - Parallax Effect */}
        {(!user || currentRole === UserRole.USER) && (
          <motion.div 
            className="mt-16 rounded-2xl bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-orange-700/10 border border-orange-600/30 backdrop-blur-sm overflow-hidden relative shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            />
            
            {/* Pulsing glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[120px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <div className="relative p-10 sm:p-16 text-center space-y-8">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  Владеете бизнесом?
                </h2>
                <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                  Зарегистрируйтесь и создайте витрину вашего заведения <span className="text-orange-400 font-semibold">бесплатно</span>!<br/>
                  Привлекайте новых клиентов и увеличивайте продажи.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold px-10 py-7 text-lg shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 rounded-xl relative group"
                >
                  <Link href="/auth/signup" className="flex items-center gap-2">
                    Создать бизнес-аккаунт
                    <motion.span 
                      className="text-xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                    
                    {/* Button glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-30 blur-2xl -z-10"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
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
