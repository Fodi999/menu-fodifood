// 🔧 Утилиты для работы с бизнесами

import type { Business } from '@/types/business';

/**
 * Генерирует URL-friendly slug из названия бизнеса
 */
export function generateBusinessSlug(business: Business): string {
  if (business.slug && business.slug.trim()) {
    return business.slug;
  }

  // Генерируем slug из названия
  const slug = business.name
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-я0-9\s-]/g, '') // Удаляем спецсимволы
    .replace(/\s+/g, '-') // Пробелы в дефисы
    .replace(/-+/g, '-') // Множественные дефисы в один
    .replace(/^-|-$/g, ''); // Удаляем дефисы с краев

  // Если slug пустой или только ASCII, используем id
  if (!slug || slug.length < 3) {
    return business.id;
  }

  return slug;
}

/**
 * Получает полный URL бизнеса
 */
export function getBusinessUrl(business: Business): string {
  return `/business/${business.id}`;
}

/**
 * Форматирует категорию бизнеса для отображения
 */
export function formatBusinessCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    restaurant: 'Ресторан',
    cafe: 'Кафе',
    bakery: 'Пекарня',
    sushi: 'Суши',
    pizza: 'Пицца',
    fastfood: 'Фастфуд',
    healthy: 'Здоровое питание',
    desserts: 'Десерты',
    other: 'Другое',
  };

  return categoryMap[category.toLowerCase()] || category;
}
