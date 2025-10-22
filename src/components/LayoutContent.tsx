"use client";

import { useRole } from "@/hooks/useRole";
import RoleNavbar from "@/components/RoleNavbar";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";

interface LayoutContentProps {
  children: ReactNode;
}

/**
 * Динамический layout-обертка с умной навигацией
 * 
 * Особенности:
 * - Показывает RoleNavbar только для авторизованных пользователей
 * - Скрывает навигацию на страницах /auth/*
 * - Адаптируется под роль пользователя
 */
export default function LayoutContent({ children }: LayoutContentProps) {
  const { currentRole } = useRole();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Предотвращаем hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Скрываем навигацию на страницах авторизации
  const hideNavbar = pathname?.startsWith("/auth") || 
                     pathname?.startsWith("/signin") || 
                     pathname?.startsWith("/signup");

  // Показываем навигацию только если есть роль и не на auth-страницах
  const showNavbar = mounted && !hideNavbar && currentRole;

  return (
    <>
      {showNavbar && <RoleNavbar />}
      <main className={showNavbar ? "" : "min-h-screen"}>
        {children}
      </main>
      {/* Глобальная плавающая кнопка смены языка - доступна на всех страницах */}
      <LanguageSwitcher />
    </>
  );
}
