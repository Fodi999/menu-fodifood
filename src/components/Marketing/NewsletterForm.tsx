'use client';

import { useState } from 'react';
import { Mail, Check, Loader2, Gift, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterFormProps {
  source?: string; // 'footer', 'checkout', 'popup'
  showSMSConsent?: boolean;
  compact?: boolean;
  onSuccess?: (couponCode: string) => void;
}

export function NewsletterForm({ 
  source = 'footer', 
  showSMSConsent = true,
  compact = false,
  onSuccess 
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailConsent) {
      setError('Musisz wyrazić zgodę na newsletter');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // API вызов (замените на реальный)
      const result = await subscribeToNewsletter({
        email,
        phone: showSMSConsent && smsConsent ? phone : undefined,
        source,
        emailConsent,
        smsConsent,
      });

      if (result.success) {
        setIsSuccess(true);
        setCouponCode(result.couponCode);
        onSuccess?.(result.couponCode);
        
        // Reset form после 5 секунд
        setTimeout(() => {
          setIsSuccess(false);
          setEmail('');
          setPhone('');
          setEmailConsent(false);
          setSmsConsent(false);
        }, 5000);
      } else {
        setError(result.error || 'Wystąpił błąd. Spróbuj ponownie.');
      }
    } catch (err) {
      setError('Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-950/30 border-2 border-green-500 rounded-xl p-6 text-center"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
          Dziękujemy za zapisanie się!
        </h3>
        <p className="text-sm text-green-600 dark:text-green-500 mb-4">
          Sprawdź swoją skrzynkę email
        </p>
        
        {couponCode && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-2 border-dashed border-green-500">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Twój kod rabatowy
              </span>
            </div>
            <div className="font-mono text-2xl font-bold text-green-600">
              {couponCode}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Użyj przy pierwszym zamówieniu
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  if (compact) {
    // Компактная версия для footer
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Twój email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !emailConsent}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-start gap-2">
          <Checkbox
            id={`newsletter-consent-${source}`}
            checked={emailConsent}
            onCheckedChange={(checked: boolean) => setEmailConsent(checked)}
          />
          <label
            htmlFor={`newsletter-consent-${source}`}
            className="text-xs text-muted-foreground leading-tight cursor-pointer"
          >
            Zgadzam się na otrzymywanie newslettera z promocjami.{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              Polityka prywatności
            </a>
          </label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    );
  }

  // Полная версия для popup/checkout
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {/* Email */}
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="jan.kowalski@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Phone (опционально) */}
        {showSMSConsent && (
          <div>
            <label htmlFor="newsletter-phone" className="block text-sm font-medium mb-2">
              Telefon (opcjonalnie)
            </label>
            <Input
              id="newsletter-phone"
              type="tel"
              placeholder="+48 123 456 789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Potrzebny tylko jeśli chcesz otrzymywać SMS
            </p>
          </div>
        )}
      </div>

      {/* Согласия */}
      <div className="space-y-3 pt-2 border-t">
        {/* Email consent */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="email-consent"
            checked={emailConsent}
            onCheckedChange={(checked: boolean) => setEmailConsent(checked)}
          />
          <label htmlFor="email-consent" className="text-sm leading-tight cursor-pointer">
            Zgadzam się na otrzymywanie newslettera z promocjami, nowościami i specjalnymi ofertami *
          </label>
        </div>

        {/* SMS consent */}
        {showSMSConsent && (
          <div className="flex items-start gap-3">
            <Checkbox
              id="sms-consent"
              checked={smsConsent}
              onCheckedChange={(checked: boolean) => setSmsConsent(checked)}
            />
            <label htmlFor="sms-consent" className="text-sm leading-tight cursor-pointer">
              Chcę otrzymywać SMS z informacjami o zamówieniu i promocjach
            </label>
          </div>
        )}

        {/* Privacy policy */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Zapisując się, akceptujesz naszą{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              Politykę Prywatności
            </a>
            . Możesz wypisać się w każdej chwili.
          </p>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting || !emailConsent}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Zapisywanie...
          </>
        ) : (
          <>
            <Gift className="w-5 h-5 mr-2" />
            Zapisz się i otrzymaj 10% rabatu
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Dołącz do <strong>2,340</strong> zadowolonych subskrybentów!
      </p>
    </form>
  );
}

// ========================================
// MOCK API
// ========================================

interface SubscribeData {
  email: string;
  phone?: string;
  source: string;
  emailConsent: boolean;
  smsConsent: boolean;
}

interface SubscribeResult {
  success: boolean;
  couponCode: string;
  error?: string;
}

async function subscribeToNewsletter(data: SubscribeData): Promise<SubscribeResult> {
  // Симуляция API
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Валидация email
  if (!data.email.includes('@')) {
    return {
      success: false,
      couponCode: '',
      error: 'Nieprawidłowy adres email',
    };
  }

  // TODO: Реальный API вызов
  // const response = await fetch('/api/newsletter/subscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });

  // Успешная подписка - генерируем купон
  return {
    success: true,
    couponCode: 'WELCOME10',
  };
}
