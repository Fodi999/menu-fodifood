"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RestaurantNavbar } from "@/components/Restaurant/RestaurantNavbar";
import { RestaurantFooter } from "@/components/Restaurant/RestaurantFooter";
import { ScrollToTop } from "@/components/Resume/ScrollToTop";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// Полное меню с категориями
const menuData = {
  categories: [
    {
      id: 1,
      name: 'Суши',
      slug: 'sushi',
      items: [
        { id: 101, name: 'Нигири с лососем', description: 'Свежий лосось на рисе', price: 12, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 102, name: 'Нигири с тунцом', description: 'Свежий тунец на рисе', price: 14, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 103, name: 'Нигири с угрем', description: 'Угорь на рисе с соусом', price: 13, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 104, name: 'Нигири с креветкой', description: 'Креветка на рисе', price: 11, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 105, name: 'Нигири с осьминогом', description: 'Осьминог на рисе', price: 12, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 106, name: 'Нигири с икрой', description: 'Икра тобико на рисе', price: 15, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 107, name: 'Гунканы с лососем', description: 'Лосось в рисовом корабле', price: 13, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 108, name: 'Гунканы с икрой', description: 'Икра в рисовом корабле', price: 16, image: '/placeholder.jpg', weight: '2 шт' },
        { id: 109, name: 'Сашими лосось', description: 'Тонко нарезанный лосось', price: 25, image: '/placeholder.jpg', weight: '5 шт' },
        { id: 110, name: 'Сашими тунец', description: 'Тонко нарезанный тунец', price: 28, image: '/placeholder.jpg', weight: '5 шт' },
        { id: 111, name: 'Сашими микс', description: 'Ассорти сашими', price: 35, image: '/placeholder.jpg', weight: '9 шт' },
        { id: 112, name: 'Унаги суши', description: 'Запеченный угорь', price: 14, image: '/placeholder.jpg', weight: '2 шт' },
      ]
    },
    {
      id: 2,
      name: 'Роллы',
      slug: 'rolls',
      items: [
        { id: 201, name: 'Калифорния', description: 'Краб, авокадо, огурец, икра тобико', price: 28, image: '/placeholder.jpg', weight: '8 шт', isPopular: true },
        { id: 202, name: 'Филадельфия', description: 'Лосось, сливочный сыр, огурец', price: 32, image: '/placeholder.jpg', weight: '8 шт', isPopular: true },
        { id: 203, name: 'Микс сет', description: 'Ассорти из популярных роллов', price: 85, originalPrice: 95, image: '/placeholder.jpg', weight: '24 шт', isNew: true, isPopular: true },
        { id: 204, name: 'Спайси тунец', description: 'Тунец, огурец, спайси соус', price: 30, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 205, name: 'Дракон', description: 'Угорь, авокадо, огурец', price: 34, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 206, name: 'Радуга', description: 'Краб, авокадо, топпинг из рыбы', price: 36, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 207, name: 'Темпура', description: 'Креветка темпура, авокадо', price: 31, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 208, name: 'Вулкан', description: 'Острый ролл с лососем', price: 33, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 209, name: 'Зеленый дракон', description: 'Креветка темпура, авокадо топпинг', price: 35, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 210, name: 'Бонито', description: 'Лосось, тунец, сыр, хлопья бонито', price: 34, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 211, name: 'Аляска', description: 'Лосось, авокадо, огурец', price: 29, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 212, name: 'Манго ролл', description: 'Креветка, манго, сыр', price: 32, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 213, name: 'Тигр', description: 'Тигровая креветка, авокадо', price: 36, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 214, name: 'Эби', description: 'Креветка, огурец, икра масаго', price: 30, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 215, name: 'Токио', description: 'Лосось, краб, сыр, икра', price: 33, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 216, name: 'Осака', description: 'Угорь, лосось, авокадо', price: 35, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 217, name: 'Киото', description: 'Тунец, огурец, кунжут', price: 31, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 218, name: 'Самурай', description: 'Микс рыбы, спайси соус', price: 34, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 219, name: 'Акула', description: 'Краб, авокадо, кунжут', price: 28, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 220, name: 'Бостон', description: 'Креветка, огурец, салат', price: 29, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 221, name: 'Нью-Йорк', description: 'Лосось, сыр, огурец', price: 32, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 222, name: 'Мехико', description: 'Острый краб, авокадо', price: 30, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 223, name: 'Канада', description: 'Лосось, угорь, сыр', price: 35, image: '/placeholder.jpg', weight: '8 шт' },
        { id: 224, name: 'Гавайи', description: 'Тунец, манго, макадамия', price: 36, image: '/placeholder.jpg', weight: '8 шт' },
      ]
    },
    {
      id: 3,
      name: 'Супы',
      slug: 'soups',
      items: [
        { id: 301, name: 'Мисо суп', description: 'Традиционный японский суп', price: 8, image: '/placeholder.jpg', weight: '300 мл' },
        { id: 302, name: 'Том ям', description: 'Острый тайский суп', price: 15, image: '/placeholder.jpg', weight: '400 мл' },
        { id: 303, name: 'Рамен', description: 'Лапша в бульоне', price: 18, image: '/placeholder.jpg', weight: '450 мл' },
        { id: 304, name: 'Удон суп', description: 'Суп с лапшой удон', price: 16, image: '/placeholder.jpg', weight: '400 мл' },
        { id: 305, name: 'Кокосовый суп', description: 'Суп на кокосовом молоке', price: 14, image: '/placeholder.jpg', weight: '350 мл' },
        { id: 306, name: 'Острый суп', description: 'Суп с морепродуктами', price: 17, image: '/placeholder.jpg', weight: '400 мл' },
        { id: 307, name: 'Вегетарианский суп', description: 'Суп с овощами', price: 12, image: '/placeholder.jpg', weight: '350 мл' },
        { id: 308, name: 'Суп с лососем', description: 'Кремовый суп с лососем', price: 19, image: '/placeholder.jpg', weight: '400 мл' },
      ]
    },
    {
      id: 4,
      name: 'Салаты',
      slug: 'salads',
      items: [
        { id: 401, name: 'Чука', description: 'Салат из водорослей', price: 10, image: '/placeholder.jpg', weight: '150 г' },
        { id: 402, name: 'Кайсо', description: 'Микс водорослей', price: 12, image: '/placeholder.jpg', weight: '150 г' },
        { id: 403, name: 'Салат с лососем', description: 'Свежий лосось с овощами', price: 18, image: '/placeholder.jpg', weight: '200 г' },
        { id: 404, name: 'Салат с креветкой', description: 'Креветки с овощами', price: 16, image: '/placeholder.jpg', weight: '200 г' },
        { id: 405, name: 'Овощной салат', description: 'Свежие овощи с соусом', price: 11, image: '/placeholder.jpg', weight: '180 г' },
        { id: 406, name: 'Цезарь с курицей', description: 'Классический цезарь', price: 15, image: '/placeholder.jpg', weight: '220 г' },
        { id: 407, name: 'Теплый салат', description: 'Теплый салат с морепродуктами', price: 19, image: '/placeholder.jpg', weight: '250 г' },
        { id: 408, name: 'Фруктовый салат', description: 'Микс свежих фруктов', price: 13, image: '/placeholder.jpg', weight: '200 г' },
        { id: 409, name: 'Салат с тунцом', description: 'Тунец с овощами', price: 17, image: '/placeholder.jpg', weight: '200 г' },
        { id: 410, name: 'Азиатский салат', description: 'Салат в азиатском стиле', price: 14, image: '/placeholder.jpg', weight: '200 г' },
      ]
    },
    {
      id: 5,
      name: 'Напитки',
      slug: 'drinks',
      items: [
        { id: 501, name: 'Кока-кола', description: 'Классическая кола', price: 5, image: '/placeholder.jpg', weight: '330 мл' },
        { id: 502, name: 'Спрайт', description: 'Лимонный напиток', price: 5, image: '/placeholder.jpg', weight: '330 мл' },
        { id: 503, name: 'Фанта', description: 'Апельсиновый напиток', price: 5, image: '/placeholder.jpg', weight: '330 мл' },
        { id: 504, name: 'Зеленый чай', description: 'Японский зеленый чай', price: 6, image: '/placeholder.jpg', weight: '250 мл' },
        { id: 505, name: 'Черный чай', description: 'Классический черный чай', price: 6, image: '/placeholder.jpg', weight: '250 мл' },
        { id: 506, name: 'Сок апельсиновый', description: 'Свежевыжатый сок', price: 8, image: '/placeholder.jpg', weight: '250 мл' },
        { id: 507, name: 'Сок яблочный', description: 'Свежевыжатый сок', price: 8, image: '/placeholder.jpg', weight: '250 мл' },
        { id: 508, name: 'Лимонад', description: 'Домашний лимонад', price: 7, image: '/placeholder.jpg', weight: '300 мл' },
        { id: 509, name: 'Милкшейк', description: 'Молочный коктейль', price: 10, image: '/placeholder.jpg', weight: '350 мл' },
        { id: 510, name: 'Смузи', description: 'Фруктовый смузи', price: 12, image: '/placeholder.jpg', weight: '350 мл' },
        { id: 511, name: 'Кофе', description: 'Эспрессо', price: 6, image: '/placeholder.jpg', weight: '30 мл' },
        { id: 512, name: 'Капучино', description: 'Кофе с молоком', price: 8, image: '/placeholder.jpg', weight: '200 мл' },
        { id: 513, name: 'Латте', description: 'Молочный кофе', price: 9, image: '/placeholder.jpg', weight: '250 мл' },
        { id: 514, name: 'Вода', description: 'Минеральная вода', price: 3, image: '/placeholder.jpg', weight: '500 мл' },
        { id: 515, name: 'Пиво', description: 'Японское пиво', price: 12, image: '/placeholder.jpg', weight: '500 мл' },
      ]
    },
    {
      id: 6,
      name: 'Десерты',
      slug: 'desserts',
      items: [
        { id: 601, name: 'Моти', description: 'Японские рисовые пирожные', price: 8, image: '/placeholder.jpg', weight: '3 шт' },
        { id: 602, name: 'Тирамису', description: 'Классический итальянский десерт', price: 12, image: '/placeholder.jpg', weight: '150 г' },
        { id: 603, name: 'Чизкейк', description: 'Нежный чизкейк', price: 11, image: '/placeholder.jpg', weight: '120 г' },
        { id: 604, name: 'Мороженое', description: 'Ванильное мороженое', price: 7, image: '/placeholder.jpg', weight: '100 г' },
        { id: 605, name: 'Панна котта', description: 'Итальянский десерт', price: 10, image: '/placeholder.jpg', weight: '130 г' },
        { id: 606, name: 'Фруктовое ассорти', description: 'Свежие фрукты', price: 14, image: '/placeholder.jpg', weight: '200 г' },
      ]
    },
  ]
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const { addItem } = useCart();

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      nameRu: item.name,
      namePl: item.name,
      description: item.description,
      descriptionRu: item.description,
      descriptionPl: item.description,
      price: item.price,
      image: item.image,
      weight: item.weight || '',
      categoryId: 1,
      isPopular: item.isPopular || false,
      isAvailable: true,
      isNew: item.isNew || false,
    });
    toast.success(`${item.name} добавлен в корзину`);
  };

  const filteredCategories = selectedCategory === 'all' 
    ? menuData.categories 
    : menuData.categories.filter(cat => cat.slug === selectedCategory);

  return (
    <div className="min-h-screen">
      <RestaurantNavbar />
      
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">Наше меню</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Выберите категорию и найдите свое любимое блюдо
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Поиск блюд..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                Все
              </Button>
              {menuData.categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Menu Items by Category */}
          {filteredCategories.map((category) => {
            const items = category.items.filter(item =>
              searchQuery === '' ||
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (items.length === 0) return null;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-8 pb-4 border-b">
                  {category.name}
                  <span className="text-muted-foreground text-lg ml-2">
                    ({items.length} блюд)
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {item.isNew && (
                              <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                Новинка
                              </span>
                            )}
                            {item.originalPrice && (
                              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                Скидка
                              </span>
                            )}
                          </div>

                          {/* Favorite */}
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                favorites.includes(item.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-muted-foreground">
                              {item.weight}
                            </span>
                            <div className="flex items-center gap-2">
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {item.originalPrice} zł
                                </span>
                              )}
                              <span className="text-xl font-bold text-primary">
                                {item.price} zł
                              </span>
                            </div>
                          </div>

                          <Button
                            className="w-full gap-2"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            В корзину
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <RestaurantFooter />
      <ScrollToTop />
    </div>
  );
}
