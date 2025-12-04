'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Menu, X, Phone, Lock, Unlock, Edit3, Save } from 'lucide-react';
import Link from 'next/link';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { CartButton } from '@/components/CartButton';
import { authAPI } from '@/lib/api-client';
import { toast } from 'sonner';

const navItems = [
  { label: 'Главная', href: '/' },
  { label: 'Меню', href: '/menu' },
  { label: 'О нас', href: '#about' },
  { label: 'Доставка', href: '#delivery' },
  { label: 'Контакты', href: '#contacts' },
];

export function RestaurantNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isEditMode, toggleEditMode, saveData, hasChanges, isLoading } = useRestaurant();
  
  // Auth state
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    const isAuth = authAPI.isAuthenticated();
    if (isAuth) {
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUnlock = async () => {
    if (!password.trim()) {
      toast.error('Введите пароль!');
      return;
    }

    try {
      const response = await authAPI.login(password);
      if (response.token) {
        setIsLocked(false);
        setShowAuthDialog(false);
        setPassword('');
        toast.success('Вход выполнен успешно!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Неверный пароль!');
      setPassword('');
    }
  };

  const handleLock = () => {
    authAPI.logout();
    setIsLocked(true);
    setPassword('');
    if (isEditMode) {
      toggleEditMode();
    }
    toast.success('Вы вышли из системы');
  };

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Изменения сохранены!');
    } catch (error) {
      toast.error('Ошибка при сохранении');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50'
          : 'bg-background/80 backdrop-blur-sm border-b border-border/20'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              🍣 FodiFood
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4">
            {/* Edit Mode Controls - Desktop Only */}
            {!isLocked && (
              <>
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleEditMode}
                  className="hidden lg:flex gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditMode ? 'Просмотр' : 'Редактировать'}
                </Button>

                {hasChanges && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="hidden lg:flex gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                )}
              </>
            )}

            {/* Auth Button - Desktop Only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isLocked ? setShowAuthDialog(true) : handleLock()}
              className="hidden lg:flex gap-2"
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  Войти
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Выйти
                </>
              )}
            </Button>

            {/* Phone - Desktop Only */}
            <Link href="tel:+48123456789" className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              +48 123 456 789
            </Link>
            
            {/* Cart Button */}
            <div className="flex-shrink-0">
              <CartButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 top-14 sm:top-16 bg-background z-50 lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Navigation Links */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="text-xs font-semibold text-muted-foreground mb-2 px-4">НАВИГАЦИЯ</div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 sm:py-4 px-4 text-base sm:text-lg font-medium hover:bg-muted active:bg-muted/80 rounded-xl transition-colors border border-border/30 hover:border-primary/30"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Contact */}
              <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-2 px-4">КОНТАКТЫ</div>
                <Link 
                  href="tel:+48123456789" 
                  className="flex items-center gap-3 py-3 sm:py-4 px-4 hover:bg-muted active:bg-muted/80 rounded-xl transition-colors border border-border/30"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Позвонить нам</div>
                    <div className="text-base sm:text-lg font-medium">+48 123 456 789</div>
                  </div>
                </Link>
              </div>

              {/* Edit Mode Controls - Mobile */}
              {!isLocked && (
                <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-border/50">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 px-4">РЕДАКТИРОВАНИЕ</div>
                  <Button
                    variant={isEditMode ? "default" : "outline"}
                    size="lg"
                    onClick={() => {
                      toggleEditMode();
                      setIsOpen(false);
                    }}
                    className="w-full gap-2 text-base h-12 sm:h-14"
                  >
                    <Edit3 className="w-5 h-5" />
                    {isEditMode ? 'Режим просмотра' : 'Режим редактирования'}
                  </Button>

                  {hasChanges && (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => {
                        handleSave();
                        setIsOpen(false);
                      }}
                      disabled={isLoading}
                      className="w-full gap-2 text-base h-12 sm:h-14 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-5 h-5" />
                      {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                  )}
                </div>
              )}

              {/* Auth Button - Mobile */}
              <div className="pt-2 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-2 px-4">АККАУНТ</div>
                <Button
                  variant={isLocked ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    if (isLocked) {
                      setShowAuthDialog(true);
                      setIsOpen(false);
                    } else {
                      handleLock();
                      setIsOpen(false);
                    }
                  }}
                  className="w-full gap-2 text-base h-12 sm:h-14"
                >
                  {isLocked ? (
                    <>
                      <Lock className="w-5 h-5" />
                      Войти в систему
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5" />
                      Выйти из системы
                    </>
                  )}
                </Button>
              </div>

              {/* App Info - Mobile */}
              <div className="pt-4 border-t border-border/50 text-center">
                <div className="text-sm text-muted-foreground">
                  FodiFood © 2025
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Лучшие суши в городе
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Вход в систему</h3>
              <button 
                onClick={() => setShowAuthDialog(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Введите пароль для доступа к редактированию
            </p>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                autoFocus
                className="h-11 sm:h-12 text-base"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleUnlock}
                  className="flex-1 h-11 sm:h-12 text-base"
                >
                  Войти
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAuthDialog(false);
                    setPassword('');
                  }}
                  className="h-11 sm:h-12"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.nav>
  );
}
