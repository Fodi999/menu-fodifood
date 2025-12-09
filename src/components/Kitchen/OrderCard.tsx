import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { OrderWithItems } from '@/lib/restaurant-api';
import { CustomerInfo } from './CustomerInfo';
import { OrderItems } from './OrderItems';
import { OrderActions } from './OrderActions';
import { statusConfig, type OrderStatus } from './StatusFilters';

interface OrderCardProps {
  order: OrderWithItems;
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => void;
}

// Calculate time since order
const getTimeSinceOrder = (createdAt: string) => {
  const now = new Date();
  const orderTime = new Date(createdAt);
  const diffMs = now.getTime() - orderTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Teraz';
  if (diffMins < 60) return `${diffMins} min`;
  return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
};

// Calculate remaining time for order completion
const getRemainingTime = (createdAt: string) => {
  const now = new Date();
  const orderTime = new Date(createdAt);
  const diffMs = now.getTime() - orderTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  // Standard preparation time: 30 minutes
  const standardTime = 30;
  const remaining = standardTime - diffMins;
  
  if (remaining <= 0) {
    return { text: 'Opóźnienie!', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' };
  } else if (remaining <= 5) {
    return { text: `Pozostało: ${remaining} min`, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' };
  } else if (remaining <= 15) {
    return { text: `Pozostało: ${remaining} min`, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' };
  } else {
    return { text: `Pozostało: ${remaining} min`, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' };
  }
};

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const orderStatus = order.status as OrderStatus;
  const statusStyle = statusConfig[orderStatus] || statusConfig.pending;
  const timeRemaining = getRemainingTime(order.created_at);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <Card className={`overflow-hidden border-l-8 ${statusStyle.borderColor} border-r-2 border-t-2 border-b-2 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 ${statusStyle.bgColor}`}>
        {/* Order Header */}
        <CardHeader className="bg-white/90 dark:bg-slate-900/90 backdrop-blur pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400">#</span>
                {order.order_number}
              </CardTitle>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {getTimeSinceOrder(order.created_at)}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${timeRemaining.bgColor}`}>
                  <Clock className={`w-3.5 h-3.5 ${timeRemaining.color}`} />
                  <span className={`text-xs font-bold ${timeRemaining.color}`}>
                    {timeRemaining.text}
                  </span>
                </div>
              </div>
            </div>
            <Badge className={`${statusStyle.bgColor} ${statusStyle.color} text-xs font-bold px-3 py-1.5 border-2 ${statusStyle.borderColor}`}>
              {statusStyle.label}
            </Badge>
          </div>

          {/* Customer Info */}
          <CustomerInfo order={order} />
        </CardHeader>

        {/* Order Items */}
        <CardContent className="bg-white dark:bg-slate-900 p-4">
          <OrderItems order={order} />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <OrderActions 
              status={order.status} 
              onUpdateStatus={(newStatus) => onUpdateStatus(order.id, newStatus)} 
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
