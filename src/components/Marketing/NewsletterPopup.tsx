'use client';

import { useState, useEffect } from 'react';
import { NewsletterForm } from './NewsletterForm';
import { X, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Показать popup через 30 секунд после загрузки страницы
    const timer = setTimeout(() => {
      // Проверить localStorage - показывали ли уже
      const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');
      const lastShown = localStorage.getItem('newsletter_popup_last_shown');
      
      // Не показывать если пользователь уже видел popup в последние 7 дней
      if (lastShown) {
        const daysSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
        if (daysSinceLastShown < 7) {
          return;
        }
      }

      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 30000); // 30 секунд

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletter_popup_seen', 'true');
    localStorage.setItem('newsletter_popup_last_shown', Date.now().toString());
  };

  const handleSuccess = (couponCode: string) => {
    // Сохранить купон для автоматического применения в корзине
    localStorage.setItem('welcome_coupon', couponCode);
    handleClose();

    // TODO: Можно показать toast notification
    console.log('Welcome coupon saved:', couponCode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 bg-background rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Decorative header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Gift className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Otrzymaj 10% rabatu! 🎁
                </h2>
                <p className="text-center text-white/90 text-sm">
                  Zapisz się do newslettera i odbierz ekskluzywny kod rabatowy
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-20 text-white"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Form */}
            <div className="p-6">
              <NewsletterForm
                source="popup"
                compact={false}
                showSMSConsent={true}
                onSuccess={handleSuccess}
              />

              <p className="text-xs text-center text-muted-foreground mt-4">
                Nie przegap naszych promocji! 🔥
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
