"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ShoppingCart, User, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  const { t } = useTranslation("ns1");
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("🔍 Header session status:", status);
    console.log("👤 Header session data:", session);
  }, [session, status]);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center space-x-4">
          <Image src="/svg%201.svg" alt="Logo" width={40} height={40} />
          <div className="text-xl font-bold">
            <span className="text-orange-500">FODI</span>{" "}
            <span className="text-white">SUSHI</span>
          </div>
        </Link>
        <nav className="flex items-center space-x-6 text-sm">
          <a
            href="#menu"
            className="px-4 py-2 text-white rounded-full transition hover:text-orange-500"
          >
            {t("buttonLabels.menu")}
          </a>
          <a
            href="#about"
            className="px-4 py-2 text-white rounded-full transition hover:text-orange-500"
          >
            {t("buttonLabels.about")}
          </a>
          <a
            href="#contact"
            className="px-4 py-2 text-white rounded-full transition hover:text-orange-500"
          >
            {t("buttonLabels.contact")}
          </a>
          
          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="px-4 py-2 text-white rounded-full transition hover:text-orange-500 flex items-center space-x-2"
              >
                <User size={18} />
                <span>{session.user.name || "Профиль"}</span>
              </Link>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-purple-500 text-white rounded-full transition hover:bg-purple-600 flex items-center space-x-2"
                >
                  <span>⚙️ Админка</span>
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-white rounded-full transition hover:text-orange-500 flex items-center space-x-2"
            >
              <LogIn size={18} />
              <span>Войти</span>
            </Link>
          )}
          
          <button
            onClick={onCartClick}
            className="relative px-4 py-2 bg-orange-500 text-white rounded-full transition hover:bg-orange-600 flex items-center space-x-2"
          >
            <ShoppingCart size={18} />
            <span>{t("buttonLabels.cart")}</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}





