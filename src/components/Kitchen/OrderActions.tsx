import { Button } from '@/components/ui/button';
import { Check, X, ChefHat, Bike } from 'lucide-react';
import type { OrderStatus } from './StatusFilters';

interface OrderActionsProps {
  status: string;
  onUpdateStatus: (newStatus: OrderStatus) => void;
}

export function OrderActions({ status, onUpdateStatus }: OrderActionsProps) {
  if (status === 'pending') {
    return (
      <>
        <Button
          size="lg"
          onClick={() => onUpdateStatus('confirmed')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
        >
          <Check className="w-5 h-5 mr-2" />
          Przyjmij
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={() => onUpdateStatus('cancelled')}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
        >
          <X className="w-5 h-5 mr-2" />
          Odrzuć
        </Button>
      </>
    );
  }

  if (status === 'confirmed') {
    return (
      <Button
        size="lg"
        onClick={() => onUpdateStatus('preparing')}
        className="col-span-2 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 dark:from-orange-600 dark:to-red-600 dark:hover:from-orange-700 dark:hover:to-red-700"
      >
        <ChefHat className="w-5 h-5 mr-2" />
        Zacznij Gotować
      </Button>
    );
  }

  if (status === 'preparing') {
    return (
      <Button
        size="lg"
        onClick={() => onUpdateStatus('ready')}
        className="col-span-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800"
      >
        <Check className="w-5 h-5 mr-2" />
        Gotowe!
      </Button>
    );
  }

  if (status === 'ready') {
    return (
      <Button
        size="lg"
        onClick={() => onUpdateStatus('delivering')}
        className="col-span-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800"
      >
        <Bike className="w-5 h-5 mr-2" />
        W dostawie
      </Button>
    );
  }

  if (status === 'delivering') {
    return (
      <Button
        size="lg"
        onClick={() => onUpdateStatus('completed')}
        className="col-span-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800"
      >
        <Check className="w-5 h-5 mr-2" />
        Dostarczono
      </Button>
    );
  }

  return null;
}
