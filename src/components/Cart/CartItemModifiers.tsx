"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Modifier {
  id: string;
  name: string;
  namePl: string;
  price: number; // 0 для бесплатных, отрицательное для "без чего-то"
  category: 'extra' | 'remove' | 'replace' | 'size';
  maxQuantity?: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  namePl: string;
  type: 'single' | 'multiple'; // single = radio, multiple = checkbox
  required: boolean;
  modifiers: Modifier[];
}

// Пример модификаторов для разных категорий блюд
const modifierGroups: { [key: string]: ModifierGroup[] } = {
  // Для пиццы
  pizza: [
    {
      id: 'size',
      name: 'Size',
      namePl: 'Wielkość',
      type: 'single',
      required: true,
      modifiers: [
        { id: 'small', name: 'Small', namePl: 'Mała (30cm)', price: 0, category: 'size' },
        { id: 'medium', name: 'Medium', namePl: 'Średnia (35cm)', price: 5, category: 'size' },
        { id: 'large', name: 'Large', namePl: 'Duża (40cm)', price: 10, category: 'size' },
      ],
    },
    {
      id: 'extras',
      name: 'Extras',
      namePl: 'Dodatki',
      type: 'multiple',
      required: false,
      modifiers: [
        { id: 'extra-cheese', name: 'Extra cheese', namePl: 'Dodatkowy ser', price: 5, category: 'extra' },
        { id: 'extra-mushrooms', name: 'Extra mushrooms', namePl: 'Dodatkowe pieczarki', price: 4, category: 'extra' },
        { id: 'extra-olives', name: 'Extra olives', namePl: 'Dodatkowe oliwki', price: 3, category: 'extra' },
        { id: 'extra-bacon', name: 'Extra bacon', namePl: 'Dodatkowy bekon', price: 6, category: 'extra' },
      ],
    },
    {
      id: 'remove',
      name: 'Remove',
      namePl: 'Usuń',
      type: 'multiple',
      required: false,
      modifiers: [
        { id: 'no-onion', name: 'No onion', namePl: 'Bez cebuli', price: 0, category: 'remove' },
        { id: 'no-mushrooms', name: 'No mushrooms', namePl: 'Bez pieczarek', price: 0, category: 'remove' },
        { id: 'no-olives', name: 'No olives', namePl: 'Bez oliwek', price: 0, category: 'remove' },
      ],
    },
  ],
  
  // Для суши
  sushi: [
    {
      id: 'extras',
      name: 'Extras',
      namePl: 'Dodatki',
      type: 'multiple',
      required: false,
      modifiers: [
        { id: 'extra-salmon', name: 'Extra salmon', namePl: 'Extra łosoś', price: 8, category: 'extra' },
        { id: 'extra-avocado', name: 'Extra avocado', namePl: 'Extra awokado', price: 5, category: 'extra' },
        { id: 'extra-cream-cheese', name: 'Extra cream cheese', namePl: 'Extra ser kremowy', price: 4, category: 'extra' },
        { id: 'extra-sesame', name: 'Extra sesame', namePl: 'Extra sezam', price: 2, category: 'extra' },
      ],
    },
    {
      id: 'remove',
      name: 'Remove',
      namePl: 'Usuń',
      type: 'multiple',
      required: false,
      modifiers: [
        { id: 'no-cucumber', name: 'No cucumber', namePl: 'Bez ogórka', price: 0, category: 'remove' },
        { id: 'no-ginger', name: 'No ginger', namePl: 'Bez imbiru', price: 0, category: 'remove' },
        { id: 'no-wasabi', name: 'No wasabi', namePl: 'Bez wasabi', price: 0, category: 'remove' },
      ],
    },
    {
      id: 'sauce',
      name: 'Sauce',
      namePl: 'Sos',
      type: 'single',
      required: false,
      modifiers: [
        { id: 'soy-sauce', name: 'Soy sauce', namePl: 'Sos sojowy', price: 0, category: 'replace' },
        { id: 'spicy-sauce', name: 'Spicy sauce', namePl: 'Sos pikantny', price: 1, category: 'replace' },
        { id: 'sweet-sauce', name: 'Sweet sauce', namePl: 'Sos słodki', price: 1, category: 'replace' },
      ],
    },
  ],
  
  // Для бургеров
  burger: [
    {
      id: 'size',
      name: 'Size',
      namePl: 'Wielkość',
      type: 'single',
      required: true,
      modifiers: [
        { id: 'single', name: 'Single', namePl: 'Pojedynczy', price: 0, category: 'size' },
        { id: 'double', name: 'Double', namePl: 'Podwójny', price: 10, category: 'size' },
        { id: 'triple', name: 'Triple', namePl: 'Potrójny', price: 18, category: 'size' },
      ],
    },
    {
      id: 'extras',
      name: 'Extras',
      namePl: 'Dodatki',
      type: 'multiple',
      required: false,
      modifiers: [
        { id: 'extra-cheese', name: 'Extra cheese', namePl: 'Dodatkowy ser', price: 3, category: 'extra' },
        { id: 'extra-bacon', name: 'Extra bacon', namePl: 'Dodatkowy bekon', price: 5, category: 'extra' },
        { id: 'extra-onion', name: 'Extra onion', namePl: 'Dodatkowa cebula', price: 2, category: 'extra' },
        { id: 'extra-pickles', name: 'Extra pickles', namePl: 'Dodatkowe ogórki', price: 2, category: 'extra' },
      ],
    },
    {
      id: 'remove',
      name: 'Remove',
      namePl: 'Usuń',
      type: 'multiple',
      required: false,
      modifiers: [
        { id: 'no-onion', name: 'No onion', namePl: 'Bez cebuli', price: 0, category: 'remove' },
        { id: 'no-pickles', name: 'No pickles', namePl: 'Bez ogórków', price: 0, category: 'remove' },
        { id: 'no-tomato', name: 'No tomato', namePl: 'Bez pomidora', price: 0, category: 'remove' },
        { id: 'no-lettuce', name: 'No lettuce', namePl: 'Bez sałaty', price: 0, category: 'remove' },
      ],
    },
    {
      id: 'sauce',
      name: 'Sauce',
      namePl: 'Sos',
      type: 'single',
      required: false,
      modifiers: [
        { id: 'ketchup', name: 'Ketchup', namePl: 'Ketchup', price: 0, category: 'replace' },
        { id: 'bbq', name: 'BBQ', namePl: 'Sos BBQ', price: 1, category: 'replace' },
        { id: 'garlic', name: 'Garlic', namePl: 'Sos czosnkowy', price: 1, category: 'replace' },
        { id: 'spicy', name: 'Spicy', namePl: 'Sos pikantny', price: 1, category: 'replace' },
      ],
    },
  ],
};

interface CartItemModifiersProps {
  itemName: string;
  onModifiersChange?: (modifiers: SelectedModifier[], totalPrice: number) => void;
}

interface SelectedModifier {
  groupId: string;
  modifierId: string;
  name: string;
  namePl: string;
  price: number;
  category: string;
}

export function CartItemModifiers({ itemName, onModifiersChange }: CartItemModifiersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);

  // Определяем категорию блюда
  const detectCategory = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('pizza') || lower.includes('пицца')) return 'pizza';
    if (lower.includes('burger') || lower.includes('бургер')) return 'burger';
    if (lower.includes('sushi') || lower.includes('roll') || lower.includes('суши')) return 'sushi';
    return 'pizza'; // default
  };

  const category = detectCategory(itemName);
  const groups = modifierGroups[category] || [];

  if (groups.length === 0) return null;

  const handleModifierToggle = (group: ModifierGroup, modifier: Modifier) => {
    setSelectedModifiers(prev => {
      let newModifiers: SelectedModifier[];

      if (group.type === 'single') {
        // Radio: только один выбор в группе
        newModifiers = prev.filter(m => m.groupId !== group.id);
        newModifiers.push({
          groupId: group.id,
          modifierId: modifier.id,
          name: modifier.name,
          namePl: modifier.namePl,
          price: modifier.price,
          category: modifier.category,
        });
      } else {
        // Checkbox: множественный выбор
        const exists = prev.find(m => m.modifierId === modifier.id);
        if (exists) {
          newModifiers = prev.filter(m => m.modifierId !== modifier.id);
        } else {
          newModifiers = [...prev, {
            groupId: group.id,
            modifierId: modifier.id,
            name: modifier.name,
            namePl: modifier.namePl,
            price: modifier.price,
            category: modifier.category,
          }];
        }
      }

      // Вычисляем общую цену модификаторов
      const totalPrice = newModifiers.reduce((sum, m) => sum + m.price, 0);
      
      // Уведомляем родителя
      if (onModifiersChange) {
        onModifiersChange(newModifiers, totalPrice);
      }

      return newModifiers;
    });
  };

  const isSelected = (modifierId: string) => {
    return selectedModifiers.some(m => m.modifierId === modifierId);
  };

  const totalModifiersPrice = selectedModifiers.reduce((sum, m) => sum + m.price, 0);

  return (
    <div className="mt-2 border-t border-border/50 pt-2">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1">
          ⚙️ Dostosuj
          {selectedModifiers.length > 0 && (
            <span className="text-primary font-medium">
              ({selectedModifiers.length})
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {totalModifiersPrice > 0 && (
            <span className="text-primary font-semibold">
              +{totalModifiersPrice.toFixed(2)} zł
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      {/* Modifiers panel */}
      {isExpanded && (
        <div className="mt-3 space-y-3 bg-muted/30 rounded-lg p-3">
          {groups.map(group => (
            <div key={group.id} className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                {group.namePl}
                {group.required && <span className="text-destructive">*</span>}
              </h4>
              
              <div className="space-y-1.5">
                {group.modifiers.map(modifier => {
                  const selected = isSelected(modifier.id);
                  
                  return (
                    <button
                      key={modifier.id}
                      onClick={() => handleModifierToggle(group, modifier)}
                      className={`
                        w-full flex items-center justify-between p-2 rounded-md text-xs transition-all
                        ${selected 
                          ? 'bg-primary/10 border border-primary/50 text-primary font-medium' 
                          : 'bg-background border border-border/50 hover:border-primary/30'
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        {/* Icon based on category */}
                        {modifier.category === 'extra' && <Plus className="w-3 h-3" />}
                        {modifier.category === 'remove' && <Minus className="w-3 h-3" />}
                        {modifier.category === 'replace' && '🔄'}
                        {modifier.category === 'size' && '📏'}
                        
                        {modifier.namePl}
                      </span>
                      
                      <span className={selected ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                        {modifier.price > 0 && `+${modifier.price.toFixed(2)} zł`}
                        {modifier.price === 0 && 'Gratis'}
                        {modifier.price < 0 && `${modifier.price.toFixed(2)} zł`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Selected summary */}
          {selectedModifiers.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Wybrane:</p>
              <div className="flex flex-wrap gap-1">
                {selectedModifiers.map(mod => (
                  <span
                    key={mod.modifierId}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                  >
                    {mod.namePl}
                    {mod.price > 0 && ` +${mod.price}zł`}
                    <button
                      onClick={() => {
                        const group = groups.find(g => g.id === mod.groupId);
                        const modifier = group?.modifiers.find(m => m.id === mod.modifierId);
                        if (group && modifier) {
                          handleModifierToggle(group, modifier);
                        }
                      }}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
