// Утилиты для работы с числами и форматированием

/**
 * Нормализация числового ввода - замена запятой на точку
 */
export const normalizeNumberInput = (value: string): string => {
  return value.replace(',', '.');
};

/**
 * Форматирование числа при потере фокуса с поддержкой разного количества знаков
 */
export const formatNumber = (value: string, decimals: number = 3): string => {
  if (!value) return '';
  
  const normalized = normalizeNumberInput(value);
  const num = parseFloat(normalized);
  
  if (isNaN(num)) return '';
  
  return num.toFixed(decimals);
};

/**
 * Автоматический расчёт процента отхода или нетто
 */
export const calculateWaste = (
  brutto: string, 
  netto: string, 
  wastePercent: string, 
  field: 'netto' | 'waste'
): string => {
  const bruttoNum = parseFloat(normalizeNumberInput(brutto));
  const nettoNum = parseFloat(normalizeNumberInput(netto));
  const wasteNum = parseFloat(normalizeNumberInput(wastePercent));

  if (field === 'netto' && bruttoNum > 0 && wasteNum >= 0 && wasteNum <= 100) {
    // Рассчитываем нетто: нетто = брутто - (брутто * отход%)
    const calculatedNetto = bruttoNum - (bruttoNum * wasteNum / 100);
    return calculatedNetto.toFixed(3);
  } else if (field === 'waste' && bruttoNum > 0 && nettoNum > 0 && nettoNum <= bruttoNum) {
    // Рассчитываем процент отхода: отход% = ((брутто - нетто) / брутто) * 100
    const calculatedWaste = ((bruttoNum - nettoNum) / bruttoNum) * 100;
    return calculatedWaste.toFixed(2);
  }
  return '';
};

/**
 * Вычисление процента выхода продукта
 */
export const getYieldPercent = (brutto: string, netto: string): number => {
  const bruttoNum = parseFloat(brutto);
  const nettoNum = parseFloat(netto);
  
  if (bruttoNum > 0 && nettoNum > 0) {
    return (nettoNum / bruttoNum) * 100;
  }
  return 0;
};

/**
 * Расчёт общей стоимости партии
 * @param weight - вес/объём/количество
 * @param pricePerUnit - цена за единицу (кг/л/шт)
 * @param unit - единица измерения ('g', 'kg', 'ml', 'l', 'pcs')
 * @returns общая стоимость партии в рублях
 * 
 * Примеры:
 * - 12.250 г × 10.25 ₽/кг = (12.250 / 1000) × 10.25 = 0.13 ₽
 * - 5 кг × 10.25 ₽/кг = 5 × 10.25 = 51.25 ₽
 * - 20000 мл × 2.30 ₽/л = (20000 / 1000) × 2.30 = 46.00 ₽
 * - 40 шт × 1.45 ₽/шт = 40 × 1.45 = 58.00 ₽
 */
export const calculateTotalCost = (weight: number, pricePerUnit: number, unit: string): number => {
  if (!weight || !pricePerUnit || weight <= 0 || pricePerUnit <= 0) {
    return 0;
  }

  switch (unit) {
    case 'g':
      // Для граммов: конвертируем в кг и умножаем на цену за кг
      return (weight / 1000) * pricePerUnit;
    
    case 'kg':
      // Для кг: напрямую умножаем вес на цену за кг
      return weight * pricePerUnit;
    
    case 'ml':
      // Для миллилитров: конвертируем в литры и умножаем на цену за литр
      return (weight / 1000) * pricePerUnit;
    
    case 'l':
      // Для литров: напрямую умножаем объём на цену за литр
      return weight * pricePerUnit;
    
    case 'pcs':
      // Для штук: напрямую умножаем количество на цену за штуку
      return weight * pricePerUnit;
    
    default:
      return 0;
  }
};

/**
 * Обратный расчёт цены за единицу из общей стоимости партии
 * @param totalCost - общая стоимость партии
 * @param weight - вес/объём/количество
 * @param unit - единица измерения ('g', 'kg', 'ml', 'l', 'pcs')
 * @returns цена за единицу (₽/кг, ₽/л или ₽/шт)
 * 
 * Примеры:
 * - 51.25 ₽ ÷ 5000 г = 51.25 ÷ (5000 / 1000) = 10.25 ₽/кг
 * - 51.25 ₽ ÷ 5 кг = 51.25 ÷ 5 = 10.25 ₽/кг
 * - 46.00 ₽ ÷ 20000 мл = 46.00 ÷ (20000 / 1000) = 2.30 ₽/л
 * - 58.00 ₽ ÷ 40 шт = 58.00 ÷ 40 = 1.45 ₽/шт
 */
export const calculatePricePerUnit = (totalCost: number, weight: number, unit: string): number => {
  if (!weight || !totalCost || weight <= 0 || totalCost <= 0) {
    return 0;
  }

  switch (unit) {
    case 'g':
      // Для граммов: делим на вес в кг
      return totalCost / (weight / 1000);
    
    case 'kg':
      // Для кг: напрямую делим на вес
      return totalCost / weight;
    
    case 'ml':
      // Для миллилитров: делим на объём в литрах
      return totalCost / (weight / 1000);
    
    case 'l':
      // Для литров: напрямую делим на объём
      return totalCost / weight;
    
    case 'pcs':
      // Для штук: напрямую делим на количество
      return totalCost / weight;
    
    default:
      return 0;
  }
};

/**
 * Вычисление даты истечения срока годности
 */
export const getExpiryDate = (days: string): string => {
  if (!days || parseInt(days) <= 0) return 'не указано';
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(days));
  
  return expiryDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Определение статуса на основе срока годности
 */
export const getExpiryStatus = (expiryDays: number | null | undefined) => {
  if (!expiryDays) {
    return { color: "text-gray-400", bg: "bg-gray-500/20", label: "Не указан" };
  }
  if (expiryDays <= 3) {
    return { color: "text-red-500", bg: "bg-red-500/20", label: "Срочно использовать" };
  } else if (expiryDays <= 7) {
    return { color: "text-yellow-500", bg: "bg-yellow-500/20", label: "Скоро истекает" };
  } else {
    return { color: "text-green-500", bg: "bg-green-500/20", label: "Свежий" };
  }
};

/**
 * Получить короткую метку единицы измерения
 */
export const getUnitLabel = (unit: string, units: Array<{value: string, label: string}>): string => {
  const unitObj = units.find((u) => u.value === unit);
  // Извлекаем текст в скобках, например "Граммы (г)" -> "г"
  const match = unitObj?.label.match(/\((.*?)\)/);
  return match ? match[1] : unit;
};

/**
 * Получить метку категории
 */
export const getCategoryLabel = (
  category: string | null | undefined,
  categories: Array<{value: string, label: string}>
): string => {
  if (!category) return "Не указана";
  const categoryObj = categories.find((c) => c.value === category);
  return categoryObj?.label || category;
};

/**
 * Умное форматирование объема жидкостей
 * Автоматически переводит миллилитры в литры для удобства чтения
 */
export const formatVolumeDisplay = (value: number | null | undefined, unit: string): string => {
  if (value === null || value === undefined) return '—';
  
  // Для миллилитров: если >= 1000, показываем в литрах
  if (unit === 'ml' && value >= 1000) {
    const liters = value / 1000;
    return `${liters.toFixed(3)} л`;
  }
  
  // Для литров: если < 1, показываем в миллилитрах
  if (unit === 'l' && value < 1) {
    const milliliters = value * 1000;
    return `${milliliters.toFixed(3)} мл`;
  }
  
  // Для всех остальных случаев - как есть
  return `${value.toFixed(3)}`;
};
