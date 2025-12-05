'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Menu, Home, UtensilsCrossed, ShoppingBag, User, 
  LogIn, LogOut, Lock, Unlock, Save, Phone, X, LayoutDashboard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CartButton } from '@/components/CartButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { authAPI } from '@/lib/api-client';
import { toast } from 'sonner';

const navItems = [
  { label: 'Главная', href: '/', icon: Home },
  { label: 'Меню', href: '/menu', icon: UtensilsCrossed },
  { label: 'О нас', href: '#about', icon: User },
  { label: 'Доставка', href: '#delivery', icon: ShoppingBag },
  { label: 'Контакты', href: '#contacts', icon: Phone },
];

interface NavigationProps {
  showEditMode?: boolean; // Показывать функционал редактирования
}

export function Navigation({ showEditMode = true }: NavigationProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Auth state
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Restaurant context (для режима редактирования)
  const { isEditMode, toggleEditMode, saveData, hasChanges, isLoading } = useRestaurant();

  // Check authentication on mount
  useEffect(() => {
    const isAuth = authAPI.isAuthenticated();
    if (isAuth) {
      setIsLocked(false);
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
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

  const handleLogout = () => {
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

  const handleMobileNavClick = () => {
    setMobileOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50'
            : 'bg-background/80 backdrop-blur-sm border-b border-border/20'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <Link href="/" onClick={handleMobileNavClick} className="text-2xl font-bold">
                        🍣 FodiFood
                      </Link>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      Меню навигации
                    </SheetDescription>
                  </SheetHeader>

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-2 mt-6">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleMobileNavClick}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Admin Dashboard Link - Mobile */}
                  {!isLocked && (
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href="/admin/dashboard"
                        onClick={handleMobileNavClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                        <span className="font-medium text-primary">Дашборд</span>
                      </Link>
                    </div>
                  )}

                  {/* Mobile Edit Mode Controls */}
                  {showEditMode && !isLocked && (
                    <div className="mt-6 pt-6 border-t space-y-2">
                      <Button
                        variant={isEditMode ? "default" : "outline"}
                        className="w-full"
                        onClick={() => {
                          toggleEditMode();
                          handleMobileNavClick();
                        }}
                      >
                        {isEditMode ? 'Просмотр' : 'Редактировать'}
                      </Button>

                      {hasChanges && (
                        <Button
                          variant="default"
                          className="w-full gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            handleSave();
                            handleMobileNavClick();
                          }}
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Mobile Auth */}
                  <div className="mt-6 pt-6 border-t">
                    {isLocked ? (
                      <Button
                        variant="default"
                        className="w-full gap-2"
                        onClick={() => {
                          setShowAuthDialog(true);
                          setMobileOpen(false);
                        }}
                      >
                        <LogIn className="h-5 w-5" />
                        Войти
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          handleLogout();
                          handleMobileNavClick();
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Выйти
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  🍣 FodiFood
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Dashboard Button - Desktop (visible when logged in) */}
              {!isLocked && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex gap-2"
                >
                  <Link href="/admin/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Дашборд
                  </Link>
                </Button>
              )}

              {/* Edit Mode Controls - Desktop */}
              {showEditMode && !isLocked && (
                <>
                  <Button
                    variant={isEditMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleEditMode}
                    className="hidden lg:flex"
                  >
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

              {/* Auth - Desktop */}
              {isLocked ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAuthDialog(true)}
                  className="hidden lg:flex gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Войти
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden lg:flex relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Администратор</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Дашборд
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Phone - Desktop */}
              <Link 
                href="tel:+48123456789" 
                className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +48 123 456 789
              </Link>

              {/* Cart */}
              <CartButton />

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Вход в систему</h3>
              <button 
                onClick={() => setShowAuthDialog(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Введите пароль для доступа к редактированию
            </p>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
                className="h-12"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleLogin}
                  className="flex-1 h-12"
                >
                  Войти
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAuthDialog(false);
                    setPassword('');
                  }}
                  className="h-12"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
