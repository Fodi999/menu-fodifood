"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ShoppingCart, User, LogIn, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  const { t } = useTranslation("ns1");
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("🔍 Header auth loading:", loading);
    console.log("👤 Header user:", user);
  }, [user, loading]);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity">
          <Image 
            src="/svg%201.svg" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="w-8 h-8 sm:w-10 sm:h-10" 
          />
          <div className="text-lg sm:text-xl font-bold">
            <span className="text-orange-500">FODI</span>{" "}
            <span className="text-white">SUSHI</span>
          </div>
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild className="text-gray-300 hover:text-orange-500 hover:bg-gray-800/50 transition-colors">
              <a href="#menu">{t("buttonLabels.menu")}</a>
            </Button>
            <Button variant="ghost" asChild className="text-gray-300 hover:text-orange-500 hover:bg-gray-800/50 transition-colors">
              <a href="#about">{t("buttonLabels.about")}</a>
            </Button>
            <Button variant="ghost" asChild className="text-gray-300 hover:text-orange-500 hover:bg-gray-800/50 transition-colors">
              <a href="#contact">{t("buttonLabels.contact")}</a>
            </Button>
          </div>
          
          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full hover:bg-gray-800/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-orange-500 text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 text-white border-gray-700 shadow-xl" align="end">
                <DropdownMenuLabel className="font-normal px-2 py-3">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-semibold leading-none text-white">
                      {user.name || "Пользователь"}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-gray-700" />
                
                <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer px-2 py-2 focus:bg-gray-700">
                  <Link href="/profile" className="flex items-center gap-2 text-gray-200">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Профиль</span>
                  </Link>
                </DropdownMenuItem>
                
                {user.role === UserRole.BUSINESS_OWNER && (
                  <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer px-2 py-2 focus:bg-gray-700">
                    <Link href="/admin" className="flex items-center gap-2 text-gray-200">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span>Админ-панель</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator className="bg-gray-700" />
                
                <DropdownMenuItem 
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }}
                  className="hover:bg-gray-700 cursor-pointer text-red-400 px-2 py-2"
                >
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Desktop Login Button */}
              <Button 
                variant="ghost" 
                asChild 
                className="hidden sm:flex text-gray-300 hover:text-orange-500 hover:bg-gray-800/50 transition-colors"
              >
                <Link href="/auth/signin" className="flex items-center gap-2">
                  <LogIn size={18} />
                  <span>Войти</span>
                </Link>
              </Button>
              
              {/* Mobile Login Icon */}
              <Button 
                variant="ghost" 
                asChild 
                className="sm:hidden text-gray-300 hover:text-orange-500 hover:bg-gray-800/50 p-2 transition-colors"
              >
                <Link href="/auth/signin">
                  <LogIn size={20} />
                </Link>
              </Button>
            </>
          )}
          
          {/* Cart Button */}
          <Button
            onClick={onCartClick}
            className="relative bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 transition-colors shadow-lg"
            size="sm"
          >
            <ShoppingCart size={18} className="sm:mr-2" />
            <span className="hidden sm:inline font-medium">{t("buttonLabels.cart")}</span>
            {cartItemsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center p-0 text-xs font-bold shadow-md"
              >
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}





