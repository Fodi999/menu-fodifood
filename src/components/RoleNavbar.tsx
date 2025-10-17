"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UtensilsCrossed, 
  ShoppingBag, 
  BarChart3,
  TrendingUp,
  Briefcase,
  Store
} from "lucide-react";

export default function RoleNavbar() {
  const { currentRole } = useRole();
  const pathname = usePathname();

  const menu: Record<string, Array<{ name: string; href: string; icon: any }>> = {
    admin: [
      { name: "Главная", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Пользователи", href: "/admin/users", icon: Users },
      { name: "Рестораны", href: "/admin/businesses", icon: Store },
      { name: "Настройки", href: "/admin/settings", icon: Settings },
    ],
    business_owner: [
      { name: "Дашборд", href: "/business/dashboard", icon: LayoutDashboard },
      { name: "Меню", href: "/business/menu", icon: UtensilsCrossed },
      { name: "Заказы", href: "/business/orders", icon: ShoppingBag },
      { name: "Аналитика", href: "/business/analytics", icon: BarChart3 },
      { name: "Настройки", href: "/business/settings", icon: Settings },
    ],
    investor: [
      { name: "Обзор", href: "/invest/dashboard", icon: LayoutDashboard },
      { name: "Портфель", href: "/invest/portfolio", icon: Briefcase },
      { name: "Рынок", href: "/invest/market", icon: TrendingUp },
    ],
  };

  const links = menu[currentRole] || [];

  if (links.length === 0) return null;

  const roleLabels: Record<string, string> = {
    admin: "Администратор",
    business_owner: "Владелец бизнеса",
    investor: "Инвестор",
    user: "Пользователь"
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Роль:</span>
            <span className="text-sm font-medium text-white px-3 py-1 bg-white/10 rounded-full border border-white/20">
              {roleLabels[currentRole] || currentRole}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
