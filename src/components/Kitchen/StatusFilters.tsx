import type { OrderWithItems } from '@/lib/restaurant-api';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  pending: { label: 'Nowe', color: 'text-yellow-700 dark:text-yellow-300', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', borderColor: 'border-yellow-400 dark:border-yellow-600' },
  confirmed: { label: 'Potwierdzone', color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-400 dark:border-blue-600' },
  preparing: { label: 'W przygotowaniu', color: 'text-orange-700 dark:text-orange-300', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-400 dark:border-orange-600' },
  ready: { label: 'Gotowe', color: 'text-green-700 dark:text-green-300', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-400 dark:border-green-600' },
  delivering: { label: 'W dostawie', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-400 dark:border-purple-600' },
  completed: { label: 'Zakończone', color: 'text-gray-700 dark:text-gray-300', bgColor: 'bg-gray-50 dark:bg-gray-900/20', borderColor: 'border-gray-400 dark:border-gray-600' },
  cancelled: { label: 'Anulowane', color: 'text-red-700 dark:text-red-300', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-400 dark:border-red-600' }
};

interface StatusFiltersProps {
  orders: OrderWithItems[];
  statusFilter: OrderStatus[];
  onFilterChange: (newFilter: OrderStatus[]) => void;
}

export function StatusFilters({ orders, statusFilter, onFilterChange }: StatusFiltersProps) {
  const toggleStatus = (status: OrderStatus) => {
    if (statusFilter.includes(status)) {
      onFilterChange(statusFilter.filter(s => s !== status));
    } else {
      onFilterChange([...statusFilter, status]);
    }
  };

  return (
    <div className="mt-5 flex flex-wrap gap-4">
      {Object.entries(statusConfig)
        .filter(([status]) => status !== 'completed' && status !== 'cancelled')
        .map(([status, config]) => {
          const count = orders.filter(o => o.status === status).length;
          const isActive = statusFilter.includes(status as OrderStatus);
          
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status as OrderStatus)}
              className={`
                px-3.5 py-2 rounded-lg font-semibold text-xs transition-all duration-200 border-2
                ${isActive
                  ? `${config.bgColor} ${config.color} border-current shadow-lg scale-105 ring-2 ring-offset-2 ring-current/20`
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105 hover:shadow-md'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {config.label}
                <span className={`
                  inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold
                  ${isActive 
                    ? 'bg-white/90 text-slate-900' 
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                  }
                `}>
                  {count}
                </span>
              </span>
            </button>
          );
        })}
    </div>
  );
}

export { statusConfig };
export type { OrderStatus };
