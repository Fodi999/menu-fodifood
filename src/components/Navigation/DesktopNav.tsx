'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingBag, User, LogIn, LogOut, Truck, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DesktopNavProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

const navItems = [
  { href: '/', label: 'Główna', icon: Home },
  { href: '/#menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/#about', label: 'O nas', icon: User },
  { href: '/#reservation', label: 'Rezerwacja', icon: Calendar },
  { href: '/#delivery', label: 'Dostawa', icon: Truck },
  { href: '/#contact', label: 'Kontakt', icon: Phone },
];

export function DesktopNav({ 
  isAuthenticated = false, 
  onLogin, 
  onLogout, 
  userName = 'Пользователь',
  userEmail,
  userAvatar 
}: DesktopNavProps) {
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="hidden md:flex items-center gap-6">
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
            <span>{item.label}</span>
          </Link>
        );
      })}
      
      <div className="ml-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  {userEmail && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Moje konto
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj się
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={onLogin} variant="default" className="gap-2">
            <LogIn className="h-4 w-4" />
            Zaloguj się
          </Button>
        )}
      </div>
    </nav>
  );
}
