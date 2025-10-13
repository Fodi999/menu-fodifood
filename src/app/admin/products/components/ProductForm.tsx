import { useState } from "react";
import { X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductFormData } from "../types";
import { CATEGORIES } from "../types";

interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price.toString() || "",
    imageUrl: product?.imageUrl || "",
    weight: product?.weight || "",
    category: product?.category || "Роллы",
    isVisible: product?.isVisible ?? false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl sm:text-2xl text-orange-500">
              {product ? "Редактировать продукт" : "Добавить новый продукт"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Заполните все обязательные поля для создания продукта
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-400 hover:text-white self-end sm:self-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Основная информация */}
          <div className="border-b border-gray-700 pb-4 sm:pb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-orange-400 flex items-center gap-2">
              📋 Основная информация
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Название */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Название продукта *
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Например: Калифорния"
                />
                <p className="text-xs text-gray-400">
                  💡 Укажите точное название, которое увидят клиенты
                </p>
              </div>

              {/* Категория */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                  Категория *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  📂 Категория для группировки в меню
                </p>
              </div>

              {/* Описание */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                  Описание
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 min-h-[80px]"
                  placeholder="Краткое описание продукта..."
                />
                <p className="text-xs text-gray-400">
                  📝 Опишите состав и особенности продукта
                </p>
              </div>
            </div>
          </div>

          {/* Цена и вес */}
          <div className="border-b border-gray-700 pb-4 sm:pb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-orange-400 flex items-center gap-2">
              💰 Цена и параметры
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Цена */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-300">
                  Цена (₽) *
                </Label>
                <Input
                  id="price"
                  type="text"
                  required
                  inputMode="decimal"
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                      setFormData({ ...formData, price: value.replace(',', '.') });
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const num = parseFloat(e.target.value);
                      if (!isNaN(num)) {
                        setFormData({ ...formData, price: num.toFixed(2) });
                      }
                    }
                  }}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="450.00"
                />
                <p className="text-xs text-gray-400">
                  💵 Можно вводить через запятую или точку
                </p>
                {formData.price && !isNaN(parseFloat(formData.price)) && (
                  <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs sm:text-sm text-green-400">
                      ✅ Цена для клиента: <span className="font-bold">{parseFloat(formData.price).toFixed(2)} ₽</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Вес */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium text-gray-300">
                  Вес порции
                </Label>
                <Input
                  id="weight"
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="280г"
                />
                <p className="text-xs text-gray-400">
                  ⚖️ Укажите вес порции (например: 280г, 300мл)
                </p>
              </div>
            </div>
          </div>

          {/* Изображение */}
          <div className="border-b border-gray-700 pb-4 sm:pb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-orange-400 flex items-center gap-2">
              🖼️ Изображение продукта
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* URL изображения */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-300">
                  URL изображения
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="/products/california.jpg"
                />
                <p className="text-xs text-gray-400">
                  📷 Добавьте ссылку на изображение продукта
                </p>
              </div>

              {/* Превью */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Превью</Label>
                {formData.imageUrl ? (
                  <div className="relative w-full h-32 sm:h-40 bg-gray-700 rounded-lg overflow-hidden border-2 border-orange-500/30">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500"><p>❌ Ошибка загрузки</p></div>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 sm:h-40 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                    <p className="text-gray-500 text-sm">📷 Превью появится здесь</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Видимость */}
          <div className="border-b border-gray-700 pb-4 sm:pb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-orange-400 flex items-center gap-2">
              👁️ Видимость на сайте
            </h3>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
              />
              <Label htmlFor="isVisible" className="text-sm text-gray-300 cursor-pointer">
                Показывать продукт на главной странице
              </Label>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-7">
              {formData.isVisible 
                ? "✅ Продукт будет виден клиентам" 
                : "🔒 Продукт будет скрыт (можно использовать для подготовки)"
              }
            </p>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {product ? "Сохранить изменения" : "Добавить продукт"}
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
