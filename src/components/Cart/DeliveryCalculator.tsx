"use client";

import { useState, useEffect } from 'react';
import { MapPin, Clock, Truck, Info, Zap, Navigation, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  calculateDelivery, 
  isDeliveryAvailable, 
  isWeekend,
  getAddressFromCoordinates,
  getCurrentPosition,
  type DeliveryCalculation,
  type DetectedAddress 
} from '@/lib/delivery-calculator';
import { Button } from '@/components/ui/button';

interface DeliveryCalculatorProps {
  orderTotal: number;
  onDeliveryChange?: (delivery: DeliveryCalculation) => void;
}

export function DeliveryCalculator({ orderTotal, onDeliveryChange }: DeliveryCalculatorProps) {
  const [postalCode, setPostalCode] = useState('');
  const [delivery, setDelivery] = useState<DeliveryCalculation | null>(null);
  const [isExpress, setIsExpress] = useState(false);
  const [showZoneInfo, setShowZoneInfo] = useState(false);
  const [inputValue, setInputValue] = useState(''); // Для debouncing
  const [isLocating, setIsLocating] = useState(false); // Для геолокации
  const [locationError, setLocationError] = useState<string | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<DetectedAddress | null>(null); // Полный адрес
  
  const available = isDeliveryAvailable();
  const weekend = isWeekend();

  // Загружаем сохраненный почтовый индекс из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('delivery_postal_code');
    const savedAddress = localStorage.getItem('delivery_address');
    
    if (saved) {
      setPostalCode(saved);
      setInputValue(saved);
      calculateDeliveryPrice(saved, false);
    }

    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        setDetectedAddress(parsed);
      } catch (e) {
        console.error('Failed to parse saved address');
      }
    }
  }, []);

  // Debouncing для ввода
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length >= 2) {
        setPostalCode(inputValue);
        calculateDeliveryPrice(inputValue, isExpress);
      } else if (inputValue.length === 0) {
        setDelivery(null);
        setPostalCode('');
      }
    }, 500); // Задержка 500ms

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Пересчитываем при изменении суммы заказа
  useEffect(() => {
    if (postalCode && postalCode.length >= 2) {
      calculateDeliveryPrice(postalCode, isExpress);
    }
  }, [orderTotal]);

  const calculateDeliveryPrice = (code: string, express: boolean) => {
    const result = calculateDelivery(code, orderTotal, {
      isExpress: express,
      isWeekend: weekend,
      isNewCustomer: false, // TODO: определять из контекста пользователя
    });
    
    setDelivery(result);
    
    // Сохраняем почтовый индекс
    if (code) {
      localStorage.setItem('delivery_postal_code', code);
    }
    
    // Уведомляем родителя
    if (onDeliveryChange) {
      onDeliveryChange(result);
    }
  };

  const handlePostalCodeChange = (value: string) => {
    // Только цифры и дефис
    const cleaned = value.replace(/[^\d-]/g, '');
    setInputValue(cleaned);
    
    // Очищаем определённый адрес при ручном изменении
    if (detectedAddress) {
      setDetectedAddress(null);
      localStorage.removeItem('delivery_address');
    }
  };

  const handleExpressToggle = () => {
    const newExpress = !isExpress;
    setIsExpress(newExpress);
    if (postalCode) {
      calculateDeliveryPrice(postalCode, newExpress);
    }
  };

  // Геолокация - определить мое местоположение
  const handleGeolocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      // Получаем координаты
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      console.log('📍 Coordinates:', latitude, longitude);

      // Получаем полный адрес из координат
      const address = await getAddressFromCoordinates(latitude, longitude);

      if (address) {
        setInputValue(address.postalCode);
        setPostalCode(address.postalCode);
        setDetectedAddress(address); // Сохраняем полный адрес
        calculateDeliveryPrice(address.postalCode, isExpress);
        
        // Сохраняем в localStorage для автозаполнения checkout
        localStorage.setItem('delivery_address', JSON.stringify(address));
        localStorage.setItem('checkout_autofill', JSON.stringify({
          street: address.street && address.houseNumber 
            ? `${address.street} ${address.houseNumber}`
            : address.street || '',
          postalCode: address.postalCode,
          city: address.city,
          suburb: address.suburb,
          fullAddress: address.fullAddress,
        }));
        
        console.log('✅ Auto-detected address:', address);
      } else {
        setLocationError('Nie udało się określić adresu');
      }
    } catch (error: any) {
      console.error('Geolocation error:', error);
      
      if (error.code === 1) {
        setLocationError('Odmowa dostępu do lokalizacji');
      } else if (error.code === 2) {
        setLocationError('Lokalizacja niedostępna');
      } else if (error.code === 3) {
        setLocationError('Timeout - spróbuj ponownie');
      } else {
        setLocationError('Błąd określania lokalizacji');
      }
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Postal Code Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Kod pocztowy dostawy
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="np. 00-001"
            value={inputValue}
            onChange={(e) => handlePostalCodeChange(e.target.value)}
            className="flex-1 text-sm h-9"
            maxLength={6}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeolocation}
            disabled={isLocating}
            className="px-2 gap-1"
            title="Określ moją lokalizację"
          >
            {isLocating ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowZoneInfo(!showZoneInfo)}
            className="px-2"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Location Error */}
        {locationError && (
          <p className="text-xs text-destructive flex items-center gap-1">
            ⚠️ {locationError}
          </p>
        )}

        {/* Detected Address */}
        {detectedAddress && (
          <div className="bg-primary/5 rounded-lg p-2 border border-primary/20">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span className="font-medium">{detectedAddress.fullAddress}</span>
            </p>
          </div>
        )}
      </div>

      {/* Zone Info */}
      {showZoneInfo && (
        <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-2">
          <p className="font-semibold">Strefy dostawy:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• <strong>00-02</strong>: Centrum (5 zł, darmowa od 80 zł, 25-35 min)</li>
            <li>• <strong>03-04, 10, 20</strong>: Bliskie dzielnice (8 zł, darmowa od 100 zł, 30-45 min)</li>
            <li>• <strong>05-08</strong>: Dalekie dzielnice (12 zł, darmowa od 120 zł, 40-55 min)</li>
            <li>• <strong>09, 11-12, 21-22</strong>: Okolice (15 zł, darmowa od 150 zł, 50-70 min)</li>
          </ul>
          <div className="pt-2 mt-2 border-t border-border">
            <p className="text-muted-foreground flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>Kliknij <Navigation className="w-3 h-3 inline" /> aby automatycznie określić kod pocztowy</span>
            </p>
          </div>
        </div>
      )}

      {/* Delivery Calculation Result */}
      {delivery && delivery.zone && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
          {/* Zone & Time */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {delivery.zone.namePl}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {delivery.estimatedTime}
            </span>
          </div>

          {/* Price Info */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {delivery.isFree ? (
                <span className="text-green-600">✓ Darmowa dostawa</span>
              ) : (
                delivery.messagePl
              )}
            </span>
            <span className={`text-sm font-bold ${delivery.isFree ? 'text-green-600' : 'text-primary'}`}>
              {delivery.isFree ? 'Za darmo' : `${delivery.finalPrice.toFixed(2)} zł`}
            </span>
          </div>

          {/* Progress to free delivery */}
          {!delivery.isFree && (
            <div className="space-y-1">
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, (orderTotal / delivery.zone.freeDeliveryThreshold) * 100)}%` 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {(delivery.zone.freeDeliveryThreshold - orderTotal) > 0 ? (
                  <>
                    Dodaj <strong>{(delivery.zone.freeDeliveryThreshold - orderTotal).toFixed(2)} zł</strong> do darmowej dostawy
                  </>
                ) : (
                  'Osiągnięto próg darmowej dostawy!'
                )}
              </p>
            </div>
          )}

          {/* Express Delivery Option */}
          <button
            onClick={handleExpressToggle}
            className={`
              w-full flex items-center justify-between p-2 rounded-md border transition-all text-xs
              ${isExpress 
                ? 'bg-primary/10 border-primary/50 text-primary' 
                : 'bg-background border-border hover:border-primary/30'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-medium">Ekspresowa dostawa (15-20 min wcześniej)</span>
            </span>
            <span className="font-semibold">+10 zł</span>
          </button>
        </div>
      )}

      {/* Delivery Not Available */}
      {!available && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-xs text-destructive">
          <p className="font-semibold">⚠️ Dostawa niedostępna</p>
          <p className="mt-1">Godziny dostawy: 10:00 - 22:00</p>
        </div>
      )}

      {/* Weekend Notice */}
      {weekend && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-xs text-blue-700">
          <p>📅 Dostawa w weekend - standardowe warunki</p>
        </div>
      )}
    </div>
  );
}
