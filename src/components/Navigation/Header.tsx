'use client';

import Link from 'next/link';
import { MobileNav } from './MobileNav';
import { DesktopNav } from './DesktopNav';
import { CartButton } from '@/components/CartButton';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function Header({ 
  isAuthenticated = false,
  onLogin,
  onLogout,
  userName,
  userEmail,
  userAvatar
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Mobile menu + Logo */}
        <div className="flex items-center gap-4">
          <MobileNav
            isAuthenticated={isAuthenticated}
            onLogin={onLogin}
            onLogout={onLogout}
            userName={userName}
          />
          
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FodiFood
            </span>
          </Link>
        </div>

        {/* Center - Desktop navigation */}
        <DesktopNav
          isAuthenticated={isAuthenticated}
          onLogin={onLogin}
          onLogout={onLogout}
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />

        {/* Right side - Cart + Theme toggle */}
        <div className="flex items-center gap-2">
          <CartButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
