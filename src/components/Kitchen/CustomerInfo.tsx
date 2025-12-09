import { User, Phone, Truck, Store } from 'lucide-react';
import type { OrderWithItems } from '@/lib/restaurant-api';

interface CustomerInfoProps {
  order: OrderWithItems;
}

export function CustomerInfo({ order }: CustomerInfoProps) {
  return (
    <div className="mt-3 space-y-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{order.customer_name}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
        <span className="text-sm text-slate-700 dark:text-slate-300">{order.customer_phone}</span>
      </div>
      <div className="flex items-center gap-2">
        {order.payment_method === 'delivery' ? (
          <>
            <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
              {order.delivery_street} {order.delivery_building}
            </span>
          </>
        ) : (
          <>
            <Store className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">Odbiór osobisty</span>
          </>
        )}
      </div>
    </div>
  );
}
