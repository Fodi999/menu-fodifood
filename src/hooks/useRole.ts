import { useEffect } from 'react';
import { useRole as useRoleContext } from '@/contexts/RoleContext';
import { UserRole } from '@/types/user';

/**
 * Enhanced useRole hook with role change logging and utilities
 * Provides better UX feedback when switching between roles
 */
export function useRole() {
  const context = useRoleContext();

  // При смене роли — логируем в консоль для лучшего UX
  useEffect(() => {
    if (context.currentRole) {
      const roleEmoji = getRoleEmoji(context.currentRole);
      console.info(`${roleEmoji} Current role: ${context.currentRole}`);
    }
  }, [context.currentRole]);

  return context;
}

/**
 * Хелпер для получения emoji по роли
 */
function getRoleEmoji(role: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    [UserRole.USER]: '👤',
    [UserRole.BUSINESS_OWNER]: '💼',
    [UserRole.INVESTOR]: '💰',
    [UserRole.ADMIN]: '👑',
  };
  return roleMap[role] || '🎭';
}

/**
 * Хелпер для проверки, находится ли пользователь в режиме бизнеса
 */
export function useIsBusinessMode() {
  const { currentRole } = useRole();
  return currentRole === UserRole.BUSINESS_OWNER;
}

/**
 * Хелпер для проверки, может ли пользователь переключать роли
 */
export function useCanManageBusiness() {
  const { canSwitchRole } = useRole();
  return canSwitchRole;
}

/**
 * Хелпер для проверки, является ли пользователь администратором
 */
export function useIsAdmin() {
  const { currentRole } = useRole();
  return currentRole === UserRole.ADMIN;
}

/**
 * Хелпер для проверки, является ли пользователь обычным пользователем
 */
export function useIsUser() {
  const { currentRole } = useRole();
  return currentRole === UserRole.USER;
}

/**
 * Хелпер для проверки, является ли пользователь инвестором
 */
export function useIsInvestor() {
  const { currentRole } = useRole();
  return currentRole === UserRole.INVESTOR;
}

/**
 * Хелпер для проверки, имеет ли пользователь доступ к бизнес-функциям
 * (владелец бизнеса или администратор)
 */
export function useHasBusinessAccess() {
  const { currentRole } = useRole();
  return currentRole === UserRole.BUSINESS_OWNER || currentRole === UserRole.ADMIN;
}

/**
 * Хелпер для проверки, имеет ли пользователь административные права
 * (администратор)
 */
export function useHasAdminAccess() {
  const { currentRole } = useRole();
  return currentRole === UserRole.ADMIN;
}
