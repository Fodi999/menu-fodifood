import type { OrderWithItems } from '@/lib/restaurant-api';

interface OrderItemsProps {
  order: OrderWithItems;
}

export function OrderItems({ order }: OrderItemsProps) {
  return (
    <>
      <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Produkty:</h3>
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
        {order.items && order.items.length > 0 ? (
          order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-600 transition-colors shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold shadow-md flex-shrink-0">
                    {item.quantity}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{item.menu_item_name}</span>
                </div>
                {item.special_instructions && (
                  <div className="ml-12 mt-3 space-y-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                    {item.special_instructions.split('\n').map((instruction, idx) => (
                      <p key={idx} className="text-sm text-orange-700 dark:text-orange-300 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                        {instruction}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap ml-4">
                {(parseFloat(item.menu_item_price) * item.quantity).toFixed(2)} zł
              </span>
            </div>
          ))
        ) : (
          /* TEMPORARY FALLBACK */
          <div className="space-y-2">
            <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">
                    ⚠️ Szczegóły zamówienia nie załadowane z API
                  </p>
                  <div className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                    <p className="font-semibold">Numer zamówienia: <span className="font-bold text-base">{order.order_number}</span></p>
                    <p>Suma: <span className="font-bold text-lg">{parseFloat(order.total).toFixed(2)} zł</span></p>
                    {order.special_instructions && (
                      <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded border border-amber-400 dark:border-amber-600">
                        <p className="font-semibold mb-1">📝 Uwagi klienta:</p>
                        <p className="italic">{order.special_instructions}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-amber-400 dark:border-amber-600">
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-2">💡 Co sprawdzić:</p>
                    <ul className="text-xs space-y-1 text-amber-800 dark:text-amber-300">
                      <li>• Otwórz Console (F12)</li>
                      <li>• Sprawdź log: "📦 First order items"</li>
                      <li>• Jeśli items jest pustą tablicą [], problem w backend</li>
                      <li>• Backend powinien zwracać items w GET /api/restaurant/admin/orders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white">RAZEM:</span>
          <span className="text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">
            {parseFloat(order.total).toFixed(2)} zł
          </span>
        </div>
      </div>
    </>
  );
}
