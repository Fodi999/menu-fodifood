'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Phone } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-4"
        >
          Заказ успешно оформлен!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground mb-8"
        >
          Мы получили ваш заказ и свяжемся с вами в ближайшее время для подтверждения.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 border border-border/50 mb-8"
        >
          <h2 className="font-bold text-lg mb-3">Что дальше?</h2>
          <ul className="text-left space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <span>Наш менеджер позвонит вам для подтверждения заказа</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <span>Наши повара начнут готовить ваш заказ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <span>Курьер доставит заказ в течение 30-45 минут</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button asChild size="lg" className="flex-1 gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              На главную
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 gap-2">
            <Link href="tel:+48123456789">
              <Phone className="w-5 h-5" />
              Позвонить нам
            </Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-muted-foreground mt-6"
        >
          Если у вас возникли вопросы, звоните:{' '}
          <a href="tel:+48123456789" className="text-primary hover:underline">
            +48 123 456 789
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
