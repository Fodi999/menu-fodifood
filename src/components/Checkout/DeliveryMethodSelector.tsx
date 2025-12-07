'use client';

import { useState } from 'react';
import { Bike, Store, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export type DeliveryMethod = 'delivery' | 'pickup';
export type DeliveryTime = 'asap' | 'scheduled';

export interface DeliveryOptions {
  method: DeliveryMethod;
  time: DeliveryTime;
  scheduledTime?: string; // "18:30"
  scheduledDate?: string; // "2025-12-07"
}

interface DeliveryMethodSelectorProps {
  onChange: (options: DeliveryOptions) => void;
  defaultMethod?: DeliveryMethod;
}

export function DeliveryMethodSelector({ 
  onChange, 
  defaultMethod = 'delivery' 
}: DeliveryMethodSelectorProps) {
  const [method, setMethod] = useState<DeliveryMethod>(defaultMethod);
  const [time, setTime] = useState<DeliveryTime>('asap');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleMethodChange = (newMethod: DeliveryMethod) => {
    setMethod(newMethod);
    onChange({
      method: newMethod,
      time,
      scheduledDate,
      scheduledTime,
    });
  };

  const handleTimeChange = (newTime: DeliveryTime) => {
    setTime(newTime);
    onChange({
      method,
      time: newTime,
      scheduledDate,
      scheduledTime,
    });
  };

  const handleScheduledDateChange = (date: string) => {
    setScheduledDate(date);
    onChange({
      method,
      time,
      scheduledDate: date,
      scheduledTime,
    });
  };

  const handleScheduledTimeChange = (newTime: string) => {
    setScheduledTime(newTime);
    onChange({
      method,
      time,
      scheduledDate,
      scheduledTime: newTime,
    });
  };

  // Минимальная дата - сегодня
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-3">
      {/* Способ доставки */}
      <div>
        <label className="block text-xs font-medium mb-2">
          Sposób dostawy
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* Dostawa */}
          <button
            onClick={() => handleMethodChange('delivery')}
            className={`relative p-2.5 rounded-lg border-2 transition-all ${
              method === 'delivery'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                method === 'delivery' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Bike className="w-4 h-4" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-xs">Dostawa</div>
                <div className="text-[10px] text-muted-foreground">30-45 min</div>
              </div>
            </div>
            {method === 'delivery' && (
              <motion.div
                layoutId="delivery-method-indicator"
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>
            )}
          </button>

          {/* Odbiór osobisty */}
          <button
            onClick={() => handleMethodChange('pickup')}
            className={`relative p-2.5 rounded-lg border-2 transition-all ${
              method === 'pickup'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                method === 'pickup' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Store className="w-4 h-4" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-xs">Odbiór</div>
                <div className="text-[10px] text-muted-foreground">20-30 min</div>
              </div>
            </div>
            {method === 'pickup' && (
              <motion.div
                layoutId="delivery-method-indicator"
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>
            )}
          </button>
        </div>

        {/* Adres odbioru */}
        {method === 'pickup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-2 bg-muted/50 rounded-lg text-xs"
          >
            <div className="flex items-start gap-1.5">
              <Store className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <div className="font-medium">Fodifood Restaurant</div>
                <div className="text-muted-foreground text-[10px]">
                  ul. Marszałkowska 123, 00-001 Warszawa
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Czas dostawy */}
      <div>
        <label className="block text-xs font-medium mb-2">
          Czas {method === 'delivery' ? 'dostawy' : 'odbioru'}
        </label>
        <div className="space-y-2">
          {/* Jak najszybciej */}
          <button
            onClick={() => handleTimeChange('asap')}
            className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
              time === 'asap'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  time === 'asap' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs">Jak najszybciej</div>
                  <div className="text-[10px] text-muted-foreground">
                    {method === 'delivery' ? '30-45 min' : '20-30 min'}
                  </div>
                </div>
              </div>
              {time === 'asap' && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>

          {/* Zaplanuj czas */}
          <button
            onClick={() => handleTimeChange('scheduled')}
            className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
              time === 'scheduled'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  time === 'scheduled' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs">Zaplanuj czas</div>
                  <div className="text-[10px] text-muted-foreground">
                    Wybierz datę i godzinę
                  </div>
                </div>
              </div>
              {time === 'scheduled' && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>

          {/* Wybór daty i czasu */}
          {time === 'scheduled' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-2 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium mb-1">Data</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => handleScheduledDateChange(e.target.value)}
                    min={today}
                    className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1">Godzina</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => handleScheduledTimeChange(e.target.value)}
                    min="11:00"
                    max="22:00"
                    className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                ⏰ Godziny: 11:00 - 22:00
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
