'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderNotification {
  type: string;
  data: {
    orderId?: string;
    total?: number;
    status?: string;
    name?: string;
    phone?: string;
    address?: string;
    itemsCount?: number;
    createdAt?: string;
    updatedAt?: string;
    message?: string;
  };
}

interface OrderNotificationToastProps {
  notification: OrderNotification;
  onClose: () => void;
}

export function OrderNotificationToast({ notification, onClose }: OrderNotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Анимация появления
    setTimeout(() => setIsVisible(true), 10);

    // Автоматическое скрытие через 8 секунд
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Даём время на анимацию исчезновения
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-24 right-6 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-2xl p-4 max-w-md transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/20 rounded-full animate-pulse">
          <Bell className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            {notification.type === 'order_updated' ? '📦 Заказ обновлён' : '🎉 Новый заказ!'}
          </h3>
          <p className="text-sm opacity-90">
            <strong>{notification.data.name || 'Гость'}</strong>{' '}
            {notification.type === 'order_updated' 
              ? `обновил статус на ${notification.data.status}` 
              : `оформил заказ на сумму `}
            {notification.type !== 'order_updated' && (
              <strong>{Number(notification.data.total || 0).toFixed(0)}₽</strong>
            )}
          </p>
          {notification.data.phone && (
            <p className="text-xs opacity-75 mt-2">
              📞 {notification.data.phone}
            </p>
          )}
          {notification.data.address && (
            <p className="text-xs opacity-75">
              📍 {notification.data.address}
            </p>
          )}
          {notification.data.itemsCount !== undefined && (
            <p className="text-xs opacity-75">
              🛍️ Позиций в заказе: {notification.data.itemsCount}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/20 rounded-full transition"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface OrderNotificationsContainerProps {
  notifications: OrderNotification[];
  onClear: () => void;
}

export function OrderNotificationsContainer({
  notifications,
  onClear,
}: OrderNotificationsContainerProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<OrderNotification[]>([]);

  useEffect(() => {
    // Показываем только последние 3 уведомления
    setVisibleNotifications(notifications.slice(0, 3));
  }, [notifications]);

  // Проверяем, нужно ли очистить все уведомления
  useEffect(() => {
    if (visibleNotifications.length === 0 && notifications.length > 0) {
      onClear();
    }
  }, [visibleNotifications.length, notifications.length, onClear]);

  const handleClose = (index: number) => {
    setVisibleNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence mode="popLayout">
      {visibleNotifications.map((notification, index) => (
        <motion.div
          key={`${notification.data.orderId}-${index}`}
          style={{ top: `${6 + index * 12}rem` }}
          initial={{ opacity: 0, scale: 0.95, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 100 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <OrderNotificationToast
            notification={notification}
            onClose={() => handleClose(index)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
