"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

/**
 * Универсальный компонент для автоматического редиректа
 * на соответствующий дашборд в зависимости от роли пользователя.
 * 
 * Использование:
 * <DashboardRedirect />
 * 
 * Маршруты:
 * - admin → /admin/dashboard
 * - business_owner → /business/dashboard
 * - investor → /invest/dashboard
 * - user → /profile
 */
export default function DashboardRedirect() {
  const router = useRouter();
  const { currentRole } = useRole();

  useEffect(() => {
    if (!currentRole) return;

    const routes: Record<string, string> = {
      admin: "/admin/dashboard",
      business_owner: "/business/dashboard",
      investor: "/invest/dashboard",
      user: "/profile",
    };

    const targetRoute = routes[currentRole] || "/profile";
    
    console.log(`� DashboardRedirect: Role "${currentRole}" → ${targetRoute}`);
    router.push(targetRoute);
  }, [currentRole, router]);

  return null;
}
