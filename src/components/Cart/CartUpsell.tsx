"use client";

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { MenuItem } from '@/types/restaurant';

interface UpsellItem {
  id: number;
  name: string;
  namePl: string;
  nameRu: string;
  price: number;
  image: string;
  category: 'sauce' | 'drink' | 'side' | 'dessert';
  weight?: string;
}

// Upsell предложения - соусы, напитки, закуски
const upsellItems: UpsellItem[] = [
  // Соусы
  {
    id: 201,
    name: 'Garlic Sauce',
    namePl: 'Sos czosnkowy',
    nameRu: 'Чесночный соус',
    price: 3.00,
    image: '/placeholder.jpg', // Will show emoji fallback
    category: 'sauce',
    weight: '50ml'
  },
  {
    id: 202,
    name: 'Spicy Sauce',
    namePl: 'Sos ostry',
    nameRu: 'Острый соус',
    price: 3.00,
    image: '/placeholder.jpg',
    category: 'sauce',
    weight: '50ml'
  },
  {
    id: 203,
    name: 'Sweet & Sour',
    namePl: 'Sos słodko-kwaśny',
    nameRu: 'Кисло-сладкий соус',
    price: 3.00,
    image: '/placeholder.jpg',
    category: 'sauce',
    weight: '50ml'
  },
  {
    id: 204,
    name: 'BBQ Sauce',
    namePl: 'Sos BBQ',
    nameRu: 'Соус BBQ',
    price: 3.50,
    image: '/placeholder.jpg',
    category: 'sauce',
    weight: '50ml'
  },
  
  // Напитки
  {
    id: 211,
    name: 'Coca-Cola',
    namePl: 'Coca-Cola',
    nameRu: 'Кока-Кола',
    price: 5.00,
    image: '/placeholder.jpg',
    category: 'drink',
    weight: '330ml'
  },
  {
    id: 212,
    name: 'Sprite',
    namePl: 'Sprite',
    nameRu: 'Спрайт',
    price: 5.00,
    image: '/placeholder.jpg',
    category: 'drink',
    weight: '330ml'
  },
  {
    id: 213,
    name: 'Orange Juice',
    namePl: 'Sok pomarańczowy',
    nameRu: 'Апельсиновый сок',
    price: 6.00,
    image: '/placeholder.jpg',
    category: 'drink',
    weight: '250ml'
  },
  {
    id: 214,
    name: 'Water',
    namePl: 'Woda mineralna',
    nameRu: 'Минеральная вода',
    price: 3.50,
    image: '/placeholder.jpg',
    category: 'drink',
    weight: '500ml'
  },
  
  // Закуски
  {
    id: 221,
    name: 'French Fries',
    namePl: 'Frytki',
    nameRu: 'Картофель фри',
    price: 8.00,
    image: '/placeholder.jpg',
    category: 'side',
    weight: '200g'
  },
  {
    id: 222,
    name: 'Onion Rings',
    namePl: 'Krążki cebulowe',
    nameRu: 'Луковые кольца',
    price: 9.00,
    image: '/placeholder.jpg',
    category: 'side',
    weight: '150g'
  },
];

// Эмодзи для категорий (fallback если нет изображения)
const categoryEmojis: Record<string, string> = {
  'sauce': '🍯',
  'drink': '🥤',
  'side': '🍟',
  'dessert': '🍰',
};

// "Najczęściej kupowane razem" - популярные комбинации
const frequentlyBoughtTogether: { [key: string]: number[] } = {
  'pizza': [201, 202, 211, 221], // Пицца → соусы, кола, фри
  'burger': [201, 204, 211, 221], // Бургер → чесночный, BBQ, кола, фри
  'sushi': [202, 203, 213, 214], // Суши → острый соус, сладкий, сок, вода
  'pasta': [201, 212, 221], // Паста → чесночный, спрайт, фри
  'salad': [213, 214], // Салат → сок, вода
};

interface CartUpsellProps {
  currentItems: any[];
}

export function CartUpsell({ currentItems }: CartUpsellProps) {
  const { addItem, items: cartItems } = useCart();
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

  // Определяем категории товаров в корзине
  const detectCategory = (itemName: string): string => {
    const name = itemName.toLowerCase();
    if (name.includes('pizza') || name.includes('пицца')) return 'pizza';
    if (name.includes('burger') || name.includes('бургер')) return 'burger';
    if (name.includes('sushi') || name.includes('суши') || name.includes('roll')) return 'sushi';
    if (name.includes('pasta') || name.includes('паста') || name.includes('спагетти')) return 'pasta';
    if (name.includes('salad') || name.includes('салат')) return 'salad';
    return 'pizza'; // default
  };

  // Получаем рекомендации на основе товаров в корзине
  const getRecommendations = (): UpsellItem[] => {
    if (currentItems.length === 0) {
      // Если корзина пуста, показываем популярные товары
      return upsellItems.slice(0, 4);
    }

    const categories = currentItems.map(item => detectCategory(item.name));
    const recommendedIds = new Set<number>();

    // Собираем рекомендации на основе категорий
    categories.forEach(cat => {
      const ids = frequentlyBoughtTogether[cat] || [];
      ids.forEach(id => recommendedIds.add(id));
    });

    // Фильтруем товары, которых еще нет в корзине
    const cartItemIds = new Set(cartItems.map(item => item.id));
    
    return upsellItems
      .filter(item => recommendedIds.has(item.id) && !cartItemIds.has(item.id))
      .slice(0, 6); // Максимум 6 рекомендаций
  };

  const recommendations = getRecommendations();

  // Проверяем, нужно ли показывать палочки (для суши)
  const hasSushi = currentItems.some(item => 
    detectCategory(item.name) === 'sushi'
  );

  const handleAddUpsell = (item: UpsellItem) => {
    const menuItem: MenuItem = {
      id: item.id,
      categoryId: 999, // Специальная категория для upsell
      name: item.name,
      namePl: item.namePl,
      nameRu: item.nameRu,
      description: '',
      descriptionPl: '',
      descriptionRu: '',
      price: item.price,
      image: item.image,
      weight: item.weight || '',
      isAvailable: true,
      isPopular: false,
      isNew: false,
    };

    addItem(menuItem);
    setAddedItems(prev => new Set(prev).add(item.id));

    // Через 2 секунды убираем галочку
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

  if (recommendations.length === 0 && !hasSushi) {
    return null;
  }

  return (
    <div className="border-t border-border pt-4 space-y-4">
      {/* Количество палочек для суши */}
      {hasSushi && (
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            🥢 Ile par pałeczek?
          </h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              1 para
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              2 pary
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              3 pary
            </Button>
          </div>
        </div>
      )}

      {/* Рекомендации */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            ✨ Najczęściej kupowane razem
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map((item) => {
              const isAdded = addedItems.has(item.id);
              const isInCart = cartItems.some(cartItem => cartItem.id === item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => !isInCart && handleAddUpsell(item)}
                  disabled={isInCart}
                  className={`
                    relative bg-card rounded-lg p-2 border transition-all text-left
                    ${isInCart 
                      ? 'border-green-500/50 bg-green-50/50 cursor-default' 
                      : 'border-border/50 hover:border-primary/50 hover:shadow-md cursor-pointer'
                    }
                  `}
                >
                  <div className="flex gap-2">
                    {/* Image with emoji fallback */}
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl">{categoryEmojis[item.category]}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-xs line-clamp-1">
                        {item.namePl}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {item.weight}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-primary">
                          {item.price.toFixed(2)} zł
                        </span>
                        {isInCart ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            W koszyku
                          </span>
                        ) : isAdded ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                          </span>
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Подсказка о преимуществах */}
      {recommendations.some(item => item.category === 'sauce') && (
        <p className="text-xs text-muted-foreground text-center">
          💡 Dodaj sosy - idealne uzupełnienie każdego dania!
        </p>
      )}
    </div>
  );
}
