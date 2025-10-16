'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import api from '@/lib/api';

interface RoleContextType {
  currentRole: UserRole;
  switchRole: (role: UserRole) => Promise<void>;
  canSwitchRole: boolean;
  user: User | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
  user: User | null;
}

export function RoleProvider({ children, user }: RoleProviderProps) {
  // Текущая активная роль (сохраняется в localStorage)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('active_role');
      return (saved as UserRole) || user?.role || UserRole.USER;
    }
    return user?.role || UserRole.USER;
  });

  // Может ли пользователь переключаться между ролями?
  // Все авторизованные пользователи могут выбирать роль
  const canSwitchRole = !!user;

  // Переключить роль
  const switchRole = async (role: UserRole) => {
    console.log('🔄 RoleContext: switchRole called', { role, user: !!user });
    
    if (!user) {
      console.warn('⚠️ RoleContext: User must be authenticated to switch roles');
      return;
    }
    
    console.log('📝 RoleContext: Setting current role to', role);
    setCurrentRole(role);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('active_role', role);
      // Сохраняем роль в cookie для middleware
      document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`;
      console.log('💾 RoleContext: Saved to localStorage and cookie:', localStorage.getItem('active_role'));
    }

    // 🦀 Обновляем роль в базе данных через Rust API
    try {
      console.log('🦀 RoleContext: Updating role in database...');
      await api.patch('/user/role', { role });
      console.log('✅ RoleContext: Role updated in database successfully');
    } catch (error) {
      console.error('❌ RoleContext: Failed to update role in database:', error);
      // Не прерываем процесс - локальная роль уже изменена
      // В будущем можно добавить toast notification об ошибке
    }
  };

  // Сброс роли при выходе пользователя
  useEffect(() => {
    if (!user) {
      setCurrentRole(UserRole.USER);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('active_role');
      }
    }
  }, [user]);

  // Автоматически сбросить роль на user, если пользователь не авторизован
  useEffect(() => {
    if (!user && currentRole !== UserRole.USER) {
      setCurrentRole(UserRole.USER);
      if (typeof window !== 'undefined') {
        localStorage.setItem('active_role', UserRole.USER);
      }
    }
  }, [user, currentRole]);

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        switchRole,
        canSwitchRole,
        user,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
