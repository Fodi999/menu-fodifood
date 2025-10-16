import { useRole } from '@/contexts/RoleContext';

// Re-export useRole для удобства
export { useRole } from '@/contexts/RoleContext';

// Хелпер для проверки, находится ли пользователь в режиме бизнеса
export function useIsBusinessMode() {
  const { currentRole } = useRole();
  return currentRole === 'business_owner';
}

// Хелпер для проверки, может ли пользователь переключать роли
export function useCanManageBusiness() {
  const { canSwitchRole } = useRole();
  return canSwitchRole;
}
