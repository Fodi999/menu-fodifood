"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ShoppingCart, User, LogIn, Settings, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
      <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-4 hover:opacity-80 transition">
          <Image src="/svg%201.svg" alt="Logo" width={32} height={32} className="sm:w-10 sm:h-10" />
          <div className="text-base sm:text-xl font-bold">
            <span className="text-orange-500">FODI</span>{" "}
            <span className="text-white">SUSHI</span>
          </div>
        </Link>
        
        <nav className="flex items-center space-x-1 sm:space-x-4 text-sm">
          <Button variant="ghost" asChild className="hidden md:flex text-white hover:text-orange-500">
            <a href="#menu">{t("buttonLabels.menu")}</a>
          </Button>
          <Button variant="ghost" asChild className="hidden md:flex text-white hover:text-orange-500">
            <a href="#about">{t("buttonLabels.about")}</a>
          </Button>
          <Button variant="ghost" asChild className="hidden md:flex text-white hover:text-orange-500">
            <a href="#contact">{t("buttonLabels.contact")}</a>
          </Button>
          
          {/* AI Chat Button */}
          <Button variant="ghost" asChild className="text-white hover:text-orange-500">
            <Link href="/chat" className="flex items-center gap-1 sm:gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">AI Chat</span>
            </Link>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-orange-500 text-white">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 text-white border-gray-700" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || "Пользователь"}</p>
                    <p className="text-xs leading-none text-gray-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
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
                  className="hover:bg-gray-700 cursor-pointer text-red-400"
                >
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild className="hidden sm:flex text-white hover:text-orange-500">
              <Link href="/auth/signin" className="flex items-center space-x-2">
                <LogIn size={18} />
                <span>Войти</span>
              </Link>
            </Button>
          )}
          
          {/* Mobile Login Icon Only */}
          {!user && (
            <Button variant="ghost" asChild className="sm:hidden text-white hover:text-orange-500p-2">
              <Link href="/auth/signin">
                <LogIn size={20} />
              </Link>
            </Button>
          )}
          
          <Button
            onClick={onCartClick}
            className="relative bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4"
            size="sm"
          >
            <ShoppingCart size={18} className="sm:mr-2" />
            <span className="hidden sm:inline">{t("buttonLabels.cart")}</span>
            {cartItemsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center p-0 text-xs"
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





