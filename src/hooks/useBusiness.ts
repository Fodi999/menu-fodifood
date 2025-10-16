import { useBusiness } from '@/contexts/BusinessContext';

// Re-export useBusiness для удобства
export { useBusiness } from '@/contexts/BusinessContext';

// Хелпер для проверки, есть ли у пользователя бизнес
export function useHasBusiness() {
  const { currentBusiness } = useBusiness();
  return currentBusiness !== null;
}

// Хелпер для получения ID текущего бизнеса
export function useBusinessId() {
  const { currentBusiness } = useBusiness();
  return currentBusiness?.id || null;
}
