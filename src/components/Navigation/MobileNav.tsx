'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, UtensilsCrossed, ShoppingBag, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

interface MobileNavProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  userName?: string;
}

const navItems = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/menu', label: 'Меню', icon: UtensilsCrossed },
  { href: '/orders', label: 'Мои заказы', icon: ShoppingBag },
  { href: '/profile', label: 'Профиль', icon: User },
];

export function MobileNav({ isAuthenticated = false, onLogin, onLogout, userName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={handleNavClick} className="text-2xl font-bold">
              FodiFood
            </Link>
          </SheetTitle>
          <SheetDescription className="text-left">
            Навигация по сайту
          </SheetDescription>
        </SheetHeader>
        
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
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
          
          <div className="border-t pt-4 mt-4">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm text-muted-foreground">Вы вошли как</p>
                  <p className="font-medium">{userName || 'Пользователь'}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    handleNavClick();
                    onLogout?.();
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Выйти
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full justify-start gap-3"
                onClick={() => {
                  handleNavClick();
                  onLogin?.();
                }}
              >
                <LogIn className="h-5 w-5" />
                Войти
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
