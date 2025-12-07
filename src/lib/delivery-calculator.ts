// Калькулятор стоимости доставки

export interface DeliveryZone {
  id: string;
  name: string;
  namePl: string;
  postalCodes: string[]; // Почтовые индексы
  basePrice: number; // Базовая цена доставки
  freeDeliveryThreshold: number; // Порог бесплатной доставки
  estimatedTime: string; // Примерное время доставки
  priority: number; // Приоритет зоны (для overlapping)
}

export interface DeliveryCalculation {
  zone: DeliveryZone | null;
  basePrice: number;
  finalPrice: number;
  isFree: boolean;
  estimatedTime: string;
  message: string;
  messagePl: string;
}

// Зоны доставки Варшавы и окрестностей
export const deliveryZones: DeliveryZone[] = [
  // Центр Варшавы - самая дешевая доставка
  {
    id: 'warsaw-center',
    name: 'Warsaw Center',
    namePl: 'Warszawa Centrum',
    postalCodes: ['00', '01', '02'],
    basePrice: 5.00,
    freeDeliveryThreshold: 80,
    estimatedTime: '25-35 min',
    priority: 1,
  },
  
  // Близкие районы Варшавы
  {
    id: 'warsaw-near',
    name: 'Warsaw Near Districts',
    namePl: 'Warszawa (bliskie dzielnice)',
    postalCodes: ['03', '04', '10', '20'],
    basePrice: 8.00,
    freeDeliveryThreshold: 100,
    estimatedTime: '30-45 min',
    priority: 2,
  },
  
  // Дальние районы Варшавы
  {
    id: 'warsaw-far',
    name: 'Warsaw Far Districts',
    namePl: 'Warszawa (dalekie dzielnice)',
    postalCodes: ['05', '06', '07', '08'],
    basePrice: 12.00,
    freeDeliveryThreshold: 120,
    estimatedTime: '40-55 min',
    priority: 3,
  },
  
  // Пригороды
  {
    id: 'suburbs',
    name: 'Suburbs',
    namePl: 'Okolice Warszawy',
    postalCodes: ['09', '11', '12', '21', '22'],
    basePrice: 15.00,
    freeDeliveryThreshold: 150,
    estimatedTime: '50-70 min',
    priority: 4,
  },
];

// Специальные условия доставки
export const deliveryRules = {
  // Минимальная сумма заказа (общая для всех зон)
  minimumOrderAmount: 30,
  
  // Время работы доставки
  workingHours: {
    start: '10:00',
    end: '22:00',
  },
  
  // Надбавка за срочную доставку
  expressDelivery: {
    enabled: true,
    extraCost: 10,
    timeReduction: '15-20 min',
  },
  
  // Надбавка за доставку в выходные
  weekendSurcharge: {
    enabled: false,
    extraCost: 5,
  },
  
  // Скидка на доставку для новых клиентов
  newCustomerDiscount: {
    enabled: true,
    discount: 5, // фиксированная скидка
  },
};

/**
 * Полный адрес из геолокации
 */
export interface DetectedAddress {
  postalCode: string;
  street?: string;
  houseNumber?: string;
  city: string;
  suburb?: string;
  district?: string;
  fullAddress: string; // Форматированный адрес
}

/**
 * Определяет полный адрес по координатам (геолокация)
 * Использует Nominatim API (OpenStreetMap) - бесплатно
 */
export async function getAddressFromCoordinates(
  latitude: number,
  longitude: number
): Promise<DetectedAddress | null> {
  try {
    // Nominatim API - бесплатный геокодинг от OpenStreetMap
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'FodifoodRestaurant/1.0', // Обязательно для Nominatim
        },
      }
    );

    if (!response.ok) {
      console.error('Nominatim API error:', response.status);
      return null;
    }

    const data = await response.json();
    const addr = data.address;
    
    if (!addr?.postcode) {
      return null;
    }

    // Формируем полный адрес
    const parts: string[] = [];
    
    if (addr.road) parts.push(addr.road);
    if (addr.house_number) parts.push(addr.house_number);
    if (addr.suburb) parts.push(addr.suburb);
    if (addr.city || addr.town || addr.village) {
      parts.push(addr.city || addr.town || addr.village);
    }

    const fullAddress = parts.join(', ');

    const detectedAddress: DetectedAddress = {
      postalCode: addr.postcode,
      street: addr.road,
      houseNumber: addr.house_number,
      city: addr.city || addr.town || addr.village || 'Warszawa',
      suburb: addr.suburb,
      district: addr.city_district,
      fullAddress: fullAddress || `${addr.postcode}, ${addr.city || 'Warszawa'}`,
    };

    console.log('✅ Address detected:', detectedAddress);
    return detectedAddress;
  } catch (error) {
    console.error('Error fetching address from coordinates:', error);
    return null;
  }
}

/**
 * Определяет только код почтовый (legacy function)
 */
export async function getPostalCodeFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const address = await getAddressFromCoordinates(latitude, longitude);
  return address?.postalCode || null;
}

/**
 * Получает текущие координаты пользователя через браузерную геолокацию
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Кеш на 5 минут
      }
    );
  });
}

/**
 * Określa zonu dostawy po kodzie pocztowym
 */
export function detectDeliveryZone(postalCode: string): DeliveryZone | null {
  if (!postalCode || postalCode.length < 2) return null;
  
  // Убираем пробелы, дефисы и приводим к верхнему регистру
  const cleanCode = postalCode.trim().toUpperCase().replace(/[-\s]/g, '');
  
  // Извлекаем первые 2 цифры (префикс зоны)
  const prefix = cleanCode.slice(0, 2);
  
  // Ищем зону, которая подходит по почтовому индексу
  const matchingZones = deliveryZones.filter(zone => 
    zone.postalCodes.some(zonePrefix => prefix.startsWith(zonePrefix))
  );
  
  if (matchingZones.length === 0) return null;
  
  // Возвращаем зону с наивысшим приоритетом (lowest priority number)
  return matchingZones.sort((a, b) => a.priority - b.priority)[0];
}

/**
 * Рассчитывает стоимость доставки
 */
export function calculateDelivery(
  postalCode: string,
  orderTotal: number,
  options?: {
    isExpress?: boolean;
    isWeekend?: boolean;
    isNewCustomer?: boolean;
  }
): DeliveryCalculation {
  const zone = detectDeliveryZone(postalCode);
  
  // Если зона не определена, возвращаем дефолтные значения
  if (!zone) {
    return {
      zone: null,
      basePrice: 10,
      finalPrice: 10,
      isFree: false,
      estimatedTime: '30-45 min',
      message: 'Please enter postal code for accurate delivery cost',
      messagePl: 'Wprowadź kod pocztowy, aby obliczyć koszt dostawy',
    };
  }
  
  let deliveryPrice = zone.basePrice;
  
  // Добавляем надбавку за срочную доставку
  if (options?.isExpress && deliveryRules.expressDelivery.enabled) {
    deliveryPrice += deliveryRules.expressDelivery.extraCost;
  }
  
  // Добавляем надбавку за выходной
  if (options?.isWeekend && deliveryRules.weekendSurcharge.enabled) {
    deliveryPrice += deliveryRules.weekendSurcharge.extraCost;
  }
  
  // Скидка для новых клиентов
  if (options?.isNewCustomer && deliveryRules.newCustomerDiscount.enabled) {
    deliveryPrice = Math.max(0, deliveryPrice - deliveryRules.newCustomerDiscount.discount);
  }
  
  // Проверяем порог бесплатной доставки
  const isFree = orderTotal >= zone.freeDeliveryThreshold;
  const finalPrice = isFree ? 0 : deliveryPrice;
  
  // Формируем сообщение
  let message = '';
  let messagePl = '';
  
  if (isFree) {
    message = `Free delivery to ${zone.name}`;
    messagePl = `Darmowa dostawa do ${zone.namePl}`;
  } else {
    const remaining = zone.freeDeliveryThreshold - orderTotal;
    if (remaining > 0 && remaining <= 30) {
      message = `Add ${remaining.toFixed(2)} zł for free delivery`;
      messagePl = `Dodaj ${remaining.toFixed(2)} zł do darmowej dostawy`;
    } else {
      message = `Delivery to ${zone.name}`;
      messagePl = `Dostawa do ${zone.namePl}`;
    }
  }
  
  return {
    zone,
    basePrice: zone.basePrice,
    finalPrice,
    isFree,
    estimatedTime: options?.isExpress 
      ? deliveryRules.expressDelivery.timeReduction 
      : zone.estimatedTime,
    message,
    messagePl,
  };
}

/**
 * Проверяет, доступна ли доставка в данный момент
 */
export function isDeliveryAvailable(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  const [startHour, startMinute] = deliveryRules.workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = deliveryRules.workingHours.end.split(':').map(Number);
  
  const currentTime = hours * 60 + minutes;
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Возвращает список всех зон доставки
 */
export function getAllDeliveryZones(): DeliveryZone[] {
  return deliveryZones;
}

/**
 * Проверяет, является ли сегодня выходным
 */
export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6; // Воскресенье или суббота
}
