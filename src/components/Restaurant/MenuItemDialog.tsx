"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Flame, 
  Leaf, 
  Clock,
  Weight,
  AlertCircle,
  Check
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: number;
  weight?: string;
  calories?: number;
  cookingTime?: number;
  allergens?: string[];
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface UpsellOption {
  id: string;
  name: string;
  price: number;
  category: 'sauce' | 'extra' | 'double';
}

interface MenuItemDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const allergenIcons: Record<string, { icon: string; label: string }> = {
  gluten: { icon: '🌾', label: 'Gluten' },
  lactose: { icon: '🥛', label: 'Laktoza' },
  nuts: { icon: '🥜', label: 'Orzechy' },
  eggs: { icon: '🥚', label: 'Jajka' },
  fish: { icon: '🐟', label: 'Ryby' },
  shellfish: { icon: '🦐', label: 'Skorupiaki' },
  soy: { icon: '🫘', label: 'Soja' },
  celery: { icon: '🥬', label: 'Seler' },
  mustard: { icon: '🟨', label: 'Gorczyca' },
  sesame: { icon: '⚪', label: 'Sezam' },
};

const upsellOptions: UpsellOption[] = [
  { id: 'sauce-garlic', name: 'Sos czosnkowy', price: 3, category: 'sauce' },
  { id: 'sauce-spicy', name: 'Sos ostry', price: 3, category: 'sauce' },
  { id: 'sauce-sweet', name: 'Sos słodko-kwaśny', price: 3, category: 'sauce' },
  { id: 'extra-cheese', name: 'Dodatkowy ser', price: 5, category: 'extra' },
  { id: 'extra-veggies', name: 'Dodatkowe warzywa', price: 4, category: 'extra' },
  { id: 'double-portion', name: 'Podwójna porcja', price: 15, category: 'double' },
];

export function MenuItemDialog({ item, isOpen, onClose }: MenuItemDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { addItem } = useCart();

  if (!item) return null;

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const calculateTotal = () => {
    const basePrice = item.price * quantity;
    const optionsPrice = selectedOptions.reduce((sum, optionId) => {
      const option = upsellOptions.find(o => o.id === optionId);
      return sum + (option?.price || 0);
    }, 0);
    return basePrice + optionsPrice;
  };

  const handleAddToCart = () => {
    // Convert to proper MenuItem format
    const cartItem = {
      id: item.id,
      name: item.name,
      categoryId: item.category_id,
      nameRu: item.name,
      namePl: item.name,
      description: item.description,
      descriptionRu: item.description,
      descriptionPl: item.description,
      price: item.price,
      image: item.image_url || '/placeholder.jpg',
      isAvailable: true,
      isPopular: false,
      isNew: false,
      weight: item.weight,
      calories: item.calories,
      allergens: item.allergens,
      ingredients: item.ingredients,
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
    };
    
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }
    
    const optionsText = selectedOptions.length > 0 
      ? ` + ${selectedOptions.map(id => upsellOptions.find(o => o.id === id)?.name).join(', ')}`
      : '';
    
    toast.success(`Dodano ${item.name}${optionsText} do koszyka!`);
    setQuantity(1);
    setSelectedOptions([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{item.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Szczegóły dania i opcje zamówienia
          </DialogDescription>
        </DialogHeader>

        {/* Large Image */}
        <div className="relative w-full h-64 sm:h-80 -mx-6 -mt-6">
          <Image
            src={item.image_url || '/placeholder.jpg'}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          {/* Badges on image */}
          <div className="absolute top-4 right-4 flex gap-2">
            {item.isVegetarian && (
              <Badge className="bg-green-600 hover:bg-green-700">
                <Leaf className="w-3 h-3 mr-1" />
                Wegetariańskie
              </Badge>
            )}
            {item.isSpicy && (
              <Badge className="bg-red-600 hover:bg-red-700">
                <Flame className="w-3 h-3 mr-1" />
                Ostre
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 pb-6">
          {/* Title & Price */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <p className="text-muted-foreground mt-1">{item.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{item.price.toFixed(2)} zł</p>
            </div>
          </div>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-3">
            {item.weight && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                <Weight className="w-4 h-4" />
                {item.weight}
              </div>
            )}
            {item.calories && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                <Flame className="w-4 h-4" />
                {item.calories} kcal
              </div>
            )}
            {item.cookingTime && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {item.cookingTime} min
              </div>
            )}
          </div>

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Składniki
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.ingredients.join(', ')}
              </p>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                Alergeny
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="border-amber-600 text-amber-600">
                    <span className="mr-1">{allergenIcons[allergen]?.icon}</span>
                    {allergenIcons[allergen]?.label || allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Upsell Options */}
          <div>
            <h3 className="font-semibold mb-3">Dodatki (opcjonalnie)</h3>
            
            {/* Sauces */}
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Sosy:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {upsellOptions.filter(o => o.category === 'sauce').map(option => (
                  <Button
                    key={option.id}
                    variant={selectedOptions.includes(option.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption(option.id)}
                    className="justify-between"
                  >
                    <span className="text-xs">{option.name}</span>
                    <span className="text-xs">+{option.price} zł</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Extra Ingredients */}
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Dodatki:</p>
              <div className="grid grid-cols-2 gap-2">
                {upsellOptions.filter(o => o.category === 'extra').map(option => (
                  <Button
                    key={option.id}
                    variant={selectedOptions.includes(option.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleOption(option.id)}
                    className="justify-between"
                  >
                    <span className="text-xs">{option.name}</span>
                    <span className="text-xs">+{option.price} zł</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Double Portion */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Wielkość porcji:</p>
              {upsellOptions.filter(o => o.category === 'double').map(option => (
                <Button
                  key={option.id}
                  variant={selectedOptions.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOption(option.id)}
                  className="w-full justify-between"
                >
                  <span>{option.name}</span>
                  <span>+{option.price} zł</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Ilość:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} size="lg" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Dodaj - {calculateTotal().toFixed(2)} zł
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
