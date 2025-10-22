'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, TrendingUp, Check } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function RoleSwitcher() {
  const router = useRouter();
  const { currentRole, switchRole, canSwitchRole } = useRole();
  const [isLoading, setIsLoading] = useState(false);

  console.log('🎯 RoleSwitcher rendered:', { currentRole, canSwitchRole });

  if (!canSwitchRole) {
    console.log('⚠️ RoleSwitcher: Cannot switch role, hiding component');
    return null;
  }

  const roles = [
    {
      value: UserRole.USER,
      label: 'Пользователь',
      description: 'Заказывать еду и просматривать рестораны',
      icon: User,
      redirect: '/',
      gradient: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/50',
      features: ['📱 Заказы онлайн', '⭐ Отзывы и рейтинги', '💬 AI рекомендации'],
    },
    {
      value: UserRole.BUSINESS_OWNER,
      label: 'Владелец бизнеса',
      description: 'Управлять рестораном и принимать заказы',
      icon: Briefcase,
      redirect: '/business/dashboard',
      gradient: 'from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/50',
      features: ['📊 Аналитика', '🛠️ Управление меню', '💰 Финансы'],
    },
    {
      value: UserRole.INVESTOR,
      label: 'Инвестор',
      description: 'Инвестировать в перспективные рестораны',
      icon: TrendingUp,
      redirect: '/invest',
      gradient: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/50',
      features: ['📈 Портфель', '💎 Токены FODI', '🎯 ROI трекинг'],
    },
  ];

  const handleRoleChange = async (newRole: UserRole, redirect: string) => {
    console.log('🔄 RoleSwitcher: Attempting to change role', { 
      from: currentRole, 
      to: newRole, 
      redirect 
    });
    
    if (newRole === currentRole) {
      console.log('⚠️ RoleSwitcher: Role already active, skipping');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📝 RoleSwitcher: Calling switchRole...');
      await switchRole(newRole);
      console.log('✅ RoleSwitcher: Role switched successfully');
      
      // Показываем уведомление
      const roleLabels = {
        [UserRole.USER]: 'Пользователь',
        [UserRole.BUSINESS_OWNER]: 'Владелец бизнеса',
        [UserRole.INVESTOR]: 'Инвестор',
        [UserRole.ADMIN]: 'Администратор',
      };
      
      toast.success(`Роль изменена на "${roleLabels[newRole]}"`, {
        description: 'Переход на новую панель...',
        duration: 2000,
      });
      
      console.log('🚀 RoleSwitcher: Redirecting to', redirect);
      // Редирект с небольшой задержкой для показа toast
      setTimeout(() => {
        router.push(redirect);
      }, 300);
    } catch (error) {
      console.error('❌ RoleSwitcher: Failed to switch role:', error);
      toast.error('Не удалось переключить роль', {
        description: 'Попробуйте еще раз',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white">Выберите роль</CardTitle>
        <CardDescription className="text-gray-400">
          Переключайтесь между режимами в любое время
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.value;

          return (
            <Button
              key={role.value}
              variant="outline"
              onClick={() => handleRoleChange(role.value, role.redirect)}
              disabled={isLoading || isActive}
              className={`
                relative h-auto p-4 justify-start text-left transition-all
                bg-gradient-to-br ${role.gradient}
                border ${isActive ? role.borderColor : 'border-gray-800'}
                hover:${role.borderColor}
                ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a]' : ''}
                ${isActive && role.value === UserRole.USER ? 'ring-blue-500/50' : ''}
                ${isActive && role.value === UserRole.BUSINESS_OWNER ? 'ring-orange-500/50' : ''}
                ${isActive && role.value === UserRole.INVESTOR ? 'ring-green-500/50' : ''}
              `}
            >
              <div className="flex items-start gap-4 w-full">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-lg
                  bg-gradient-to-br ${role.gradient}
                  border ${isActive ? role.borderColor : 'border-gray-700'}
                `}>
                  <Icon className={`w-6 h-6 ${role.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-base">
                      {role.label}
                    </span>
                    {isActive && (
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full ${role.iconColor} bg-current/20`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {role.description}
                  </p>
                  {/* Features list */}
                  <div className="flex flex-wrap gap-2">
                    {role.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-400 border border-gray-700/50"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
