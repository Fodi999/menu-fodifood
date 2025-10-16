"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import type { User } from "@/types/user";

interface DashboardRedirectProps {
  user: User | null;
}

/**
 * Компонент для автоматического редиректа на нужный дашборд
 * в зависимости от роли пользователя
 */
export default function DashboardRedirect({ user }: DashboardRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    console.log("🔄 DashboardRedirect: Redirecting user based on role:", user.role);

    // Редирект в зависимости от роли
    switch (user.role) {
      case UserRole.ADMIN:
        console.log("🧠 Admin detected, redirecting to /admin/dashboard");
        router.push("/admin/dashboard");
        break;
      
      case UserRole.BUSINESS_OWNER:
        console.log("👨‍🍳 Business owner detected, redirecting to /business/dashboard");
        router.push("/business/dashboard");
        break;
      
      case UserRole.INVESTOR:
        console.log("💰 Investor detected, redirecting to /invest");
        router.push("/invest");
        break;
      
      case UserRole.USER:
      default:
        console.log("👤 Regular user detected, redirecting to /");
        router.push("/");
        break;
    }
  }, [user, router]);

  return null;
}
