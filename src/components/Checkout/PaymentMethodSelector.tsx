'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export type PaymentMethod = 'blik' | 'card' | 'p24' | 'cash';

interface PaymentMethodSelectorProps {
  onChange: (method: PaymentMethod) => void;
  defaultMethod?: PaymentMethod;
  deliveryMethod?: 'delivery' | 'pickup'; // для отображения cash только при pickup
}

export function PaymentMethodSelector({ 
  onChange, 
  defaultMethod = 'blik',
  deliveryMethod = 'delivery'
}: PaymentMethodSelectorProps) {
  const [method, setMethod] = useState<PaymentMethod>(defaultMethod);

  const handleMethodChange = (newMethod: PaymentMethod) => {
    setMethod(newMethod);
    onChange(newMethod);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium">
        Sposób płatności
      </label>

      <div className="space-y-2">
        {/* BLIK */}
        <button
          onClick={() => handleMethodChange('blik')}
          className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
            method === 'blik'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                method === 'blik' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs">BLIK</div>
                <div className="text-[10px] text-muted-foreground">
                  Płatność mobilna
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="bg-white px-2 py-0.5 rounded border border-border">
                <span className="text-[10px] font-bold text-[#00A3E0]">BLIK</span>
              </div>
              {method === 'blik' && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Karta płatnicza (Stripe) */}
        <button
          onClick={() => handleMethodChange('card')}
          className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
            method === 'card'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                method === 'card' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs">Karta</div>
                <div className="text-[10px] text-muted-foreground">
                  Visa, Mastercard
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <div className="w-6 h-4 bg-[#1434CB] rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#EB001B] rounded-full" />
                  <div className="w-1.5 h-1.5 bg-[#FF5F00] rounded-full -ml-0.5" />
                </div>
                <div className="w-6 h-4 bg-[#00579F] rounded-sm flex items-center justify-center">
                  <div className="text-[6px] font-bold text-white">VISA</div>
                </div>
              </div>
              {method === 'card' && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Przelewy24 */}
        <button
          onClick={() => handleMethodChange('p24')}
          className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
            method === 'p24'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                method === 'p24' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs">Przelewy24</div>
                <div className="text-[10px] text-muted-foreground">
                  Przelew bankowy
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="bg-[#D8232A] px-2 py-0.5 rounded">
                <span className="text-[10px] font-bold text-white">P24</span>
              </div>
              {method === 'p24' && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Gotówka (tylko przy odbiorze osobistym) */}
        {deliveryMethod === 'pickup' && (
          <button
            onClick={() => handleMethodChange('cash')}
            className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
              method === 'cash'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  method === 'cash' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs">Gotówka</div>
                  <div className="text-[10px] text-muted-foreground">
                    Przy odbiorze
                  </div>
                </div>
              </div>
              {method === 'cash' && (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Информация о безпеке - COMPACT */}
      <div className="p-2 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>
          <div className="text-[10px] text-muted-foreground">
            <span className="font-medium text-foreground">Bezpieczna płatność</span> - szyfrowane połączenie SSL
          </div>
        </div>
      </div>
    </div>
  );
}
