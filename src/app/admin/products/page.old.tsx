"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowLeft, Plus, Edit2, Trash2, Loader2 } from "lucide-react";

// Импорт компонентов
import {
  ProductForm,
} from "./components";

// Импорт типов
import type {
  Product,
  Ingredient,
  SemiFinished,
  ProductIngredient,
  ProductSemiFinished,
  ProductFormData,
} from "./types";

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [semiFinished, setSemiFinished] = useState<SemiFinished[]>([]);
  const [productIngredients, setProductIngredients] = useState<ProductIngredient[]>([]);
  const [productSemiFinished, setProductSemiFinished] = useState<ProductSemiFinished[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>("");
  const [selectedSemiFinishedId, setSelectedSemiFinishedId] = useState<string>("");
  const [ingredientQuantity, setIngredientQuantity] = useState<string>("");
  const [semiFinishedQuantity, setSemiFinishedQuantity] = useState<string>("");
  const [selectedIngredientCategory, setSelectedIngredientCategory] = useState<string>("all");
  const [hasThermalProcessing, setHasThermalProcessing] = useState<boolean>(false);
  const [componentType, setComponentType] = useState<"ingredient" | "semifinished">("ingredient");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    weight: "",
    category: "Роллы",
    isVisible: false, // По умолчанию новые продукты скрыты
  });

  const categories = ["Роллы", "Суши", "Сеты", "Напитки", "Десерты", "Закуски"];

  const ingredientCategories = [
    { value: "all", label: "📦 Все категории" },
    { value: "fish", label: "🐟 Рыба" },
    { value: "seafood", label: "🦐 Морепродукты" },
    { value: "vegetables", label: "🥬 Овощи" },
    { value: "rice", label: "🍚 Рис" },
    { value: "nori", label: "🌿 Нори и водоросли" },
    { value: "sauces", label: "🥫 Соусы" },
    { value: "spices", label: "🧂 Специи" },
    { value: "cheese", label: "🧀 Сыр" },
    { value: "other", label: "📦 Прочее" },
  ];

  // Фильтруем ингредиенты по выбранной категории
  const filteredIngredients = selectedIngredientCategory === "all"
    ? ingredients
    : ingredients.filter(ing => ing.category === selectedIngredientCategory);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?callbackUrl=/admin/products");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProducts();
      fetchIngredients();
      fetchSemiFinished();
    }
  }, [user]);

  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/ingredients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
      }

      const data = await response.json();
      // Обрабатываем данные - извлекаем ingredient из StockItem
      const processedIngredients = Array.isArray(data)
        ? data.map((item: { id: number; ingredient?: { name?: string; unit?: string }; priceNetto: number; nettoWeight: number; category: string }) => ({
            id: String(item.id),
            name: item.ingredient?.name || "Без названия",
            unit: item.ingredient?.unit || "g",
            priceNetto: item.priceNetto,
            nettoWeight: item.nettoWeight,
            category: item.category,
          }))
        : [];
      setIngredients(processedIngredients);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
    }
  };

  const fetchSemiFinished = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/semi-finished`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch semi-finished");
      }

      const data = await response.json();
      console.log("📦 Semi-finished data:", data);
      setSemiFinished(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching semi-finished:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log("📦 Products data:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Не удалось загрузить продукты");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/products/${editingProduct.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/products`;
      
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || null,
          weight: formData.weight || null,
          category: formData.category,
          isVisible: formData.isVisible,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      // Обновляем список
      await fetchProducts();
      
      // Сбрасываем форму
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        weight: "",
        category: "Роллы",
        isVisible: false,
      });

      alert(editingProduct ? "Продукт обновлён!" : "Продукт добавлен!");
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Не удалось сохранить продукт");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      imageUrl: product.imageUrl || "",
      weight: product.weight || "",
      category: product.category,
      isVisible: product.isVisible !== undefined ? product.isVisible : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить продукт "${productName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Обновляем список
      setProducts(products.filter((p) => p.id !== productId));
      alert(`Продукт "${productName}" удалён`);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Не удалось удалить продукт");
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    console.log("🔄 Переключение видимости продукта:", product.name, "isVisible:", product.isVisible, "→", !product.isVisible);
    
    try {
      const token = localStorage.getItem("token");
      const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/products/${product.id}`;
      
      const body = {
        ...product,
        isVisible: !product.isVisible,
      };
      
      console.log("📤 Отправка PUT запроса:", url);
      console.log("📦 Тело запроса:", body);
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log("📥 Ответ сервера:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Ошибка ответа:", errorText);
        throw new Error("Failed to update product visibility");
      }

      const updatedProduct = await response.json();
      console.log("✅ Продукт обновлен:", updatedProduct);

      // Обновляем список
      await fetchProducts();
      console.log("✅ Список продуктов обновлен");
    } catch (err) {
      console.error("❌ Error updating product visibility:", err);
      alert("Не удалось изменить видимость продукта");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setProductIngredients([]);
    setProductSemiFinished([]);
    setSelectedIngredientId("");
    setSelectedSemiFinishedId("");
    setIngredientQuantity("");
    setSemiFinishedQuantity("");
    setSelectedIngredientCategory("all");
    setHasThermalProcessing(false);
    setComponentType("ingredient");
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      weight: "",
      category: "Роллы",
      isVisible: false,
    });
  };

  // Добавить ингредиент в рецепт продукта
  const handleAddIngredient = () => {
    if (!selectedIngredientId || !ingredientQuantity) {
      alert("Выберите ингредиент и укажите количество");
      return;
    }

    const ingredient = ingredients.find((ing) => ing.id === selectedIngredientId);
    if (!ingredient) return;

    // Проверяем, не добавлен ли уже этот ингредиент
    if (productIngredients.some((pi) => pi.ingredientId === selectedIngredientId)) {
      alert("Этот ингредиент уже добавлен");
      return;
    }

    const quantity = parseFloat(ingredientQuantity);
    const pricePerUnit = ingredient.priceNetto && ingredient.nettoWeight 
      ? ingredient.priceNetto / ingredient.nettoWeight 
      : 0;
    const totalPrice = pricePerUnit * quantity;

    const newIngredient: ProductIngredient = {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      quantity,
      unit: ingredient.unit,
      pricePerUnit,
      totalPrice,
    };

    const updatedIngredients = [...productIngredients, newIngredient];
    setProductIngredients(updatedIngredients);
    
    // Автоматически обновляем вес если термообработка отключена
    if (!hasThermalProcessing) {
      // Пересчитываем вес с новым ингредиентом
      const newTotalWeight = updatedIngredients.reduce((sum, ing) => {
        if (ing.unit === 'pcs') return sum;
        return sum + ing.quantity;
      }, 0);
      
      const formattedWeight = newTotalWeight >= 1000 
        ? `${(newTotalWeight / 1000).toFixed(3)}кг`
        : `${newTotalWeight.toFixed(3)}г`;
      
      setFormData({ ...formData, weight: formattedWeight });
    }
    
    setSelectedIngredientId("");
    setIngredientQuantity("");
  };

  const handleAddSemiFinished = () => {
    if (!selectedSemiFinishedId || !semiFinishedQuantity) {
      alert("Выберите полуфабрикат и укажите количество");
      return;
    }

    const sf = semiFinished.find((item) => item.id === selectedSemiFinishedId);
    if (!sf) return;

    // Проверяем, не добавлен ли уже этот полуфабрикат
    if (productSemiFinished.some((psf) => psf.semiFinishedId === selectedSemiFinishedId)) {
      alert("Этот полуфабрикат уже добавлен");
      return;
    }

    const quantity = parseFloat(semiFinishedQuantity);
    const totalCost = sf.costPerUnit * quantity;

    const newSemiFinished: ProductSemiFinished = {
      semiFinishedId: sf.id,
      semiFinishedName: sf.name,
      quantity,
      unit: sf.outputUnit,
      costPerUnit: sf.costPerUnit,
      totalCost,
    };

    const updatedSemiFinished = [...productSemiFinished, newSemiFinished];
    setProductSemiFinished(updatedSemiFinished);
    
    // Автоматически обновляем вес если термообработка отключена
    if (!hasThermalProcessing) {
      const sfWeight = updatedSemiFinished.reduce((sum, sf) => sum + sf.quantity, 0);
      const ingWeight = productIngredients.reduce((sum, ing) => {
        if (ing.unit === 'pcs') return sum;
        return sum + ing.quantity;
      }, 0);
      
      const totalWeight = sfWeight + ingWeight;
      const formattedWeight = totalWeight >= 1000 
        ? `${(totalWeight / 1000).toFixed(0)} кг` 
        : `${totalWeight.toFixed(0)} г`;
      
      setFormData(prev => ({ ...prev, weight: formattedWeight }));
    }

    // Сбрасываем выбор
    setSelectedSemiFinishedId("");
    setSemiFinishedQuantity("");
  };

  // Удалить ингредиент из рецепта
  const handleRemoveIngredient = (ingredientId: string) => {
    const updatedIngredients = productIngredients.filter((pi) => pi.ingredientId !== ingredientId);
    setProductIngredients(updatedIngredients);
    
    // Автоматически обновляем вес если термообработка отключена
    if (!hasThermalProcessing) {
      const newTotalWeight = updatedIngredients.reduce((sum, ing) => {
        if (ing.unit === 'pcs') return sum;
        return sum + ing.quantity;
      }, 0);
      
      const formattedWeight = newTotalWeight >= 1000 
        ? `${(newTotalWeight / 1000).toFixed(3)}кг`
        : `${newTotalWeight.toFixed(3)}г`;
      
      setFormData({ ...formData, weight: formattedWeight });
    }
  };

  // Удалить полуфабрикат из рецепта
  const handleRemoveSemiFinished = (index: number) => {
    const updatedSemiFinished = productSemiFinished.filter((_, i) => i !== index);
    setProductSemiFinished(updatedSemiFinished);
    
    // Обновляем вес если термообработка отключена
    if (!hasThermalProcessing) {
      const sfWeight = updatedSemiFinished.reduce((sum, sf) => sum + sf.quantity, 0);
      const ingWeight = productIngredients.reduce((sum, ing) => {
        if (ing.unit === 'pcs') return sum;
        return sum + ing.quantity;
      }, 0);
      
      const totalWeight = sfWeight + ingWeight;
      const formattedWeight = totalWeight >= 1000 
        ? `${(totalWeight / 1000).toFixed(0)} кг` 
        : `${totalWeight.toFixed(0)} г`;
      
      setFormData(prev => ({ ...prev, weight: formattedWeight }));
    }
  };

  // Рассчитать общую себестоимость
  const calculateTotalCost = (): number => {
    const ingredientsCost = productIngredients.reduce((sum, ing) => sum + ing.totalPrice, 0);
    const semiFinishedCost = productSemiFinished.reduce((sum, sf) => sum + sf.totalCost, 0);
    return ingredientsCost + semiFinishedCost;
  };

  // Рассчитать наценку
  const calculateMarkup = (): number => {
    const cost = calculateTotalCost();
    const price = parseFloat(formData.price) || 0;
    if (cost === 0) return 0;
    return ((price - cost) / cost) * 100;
  };

  // Рассчитать рекомендуемую цену (себестоимость + 200%)
  const calculateRecommendedPrice = (): number => {
    return calculateTotalCost() * 3;
  };

  // Рассчитать общий вес порции
  const calculateTotalWeight = (): string => {
    const ingredientsGrams = productIngredients.reduce((sum, ing) => {
      // Суммируем количество всех ингредиентов
      // Для g и ml - просто добавляем количество
      // Для pcs (штук) - не учитываем в весе
      if (ing.unit === 'pcs') {
        return sum;
      }
      
      return sum + ing.quantity;
    }, 0);

    const semiFinishedGrams = productSemiFinished.reduce((sum, sf) => {
      return sum + sf.quantity;
    }, 0);

    const totalGrams = ingredientsGrams + semiFinishedGrams;

    if (totalGrams === 0) return '0г';
    
    // Форматируем вес с 3 знаками после запятой
    if (totalGrams >= 1000) {
      return `${(totalGrams / 1000).toFixed(3)}кг`;
    } else {
      return `${totalGrams.toFixed(3)}г`;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500">Управление складом</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Добавить продукт
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Форма добавления/редактирования */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-orange-500">
                  {editingProduct ? "Редактировать продукт" : "Добавить новый продукт"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Заполните все обязательные поля для создания продукта
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-400 flex items-center gap-2">
                  📋 Основная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Название продукта *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 transition"
                      placeholder="Филадельфия"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      💡 Укажите точное название, которое увидят клиенты
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Категория *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 transition"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      📂 Категория для группировки в меню
                    </p>
                  </div>
                </div>
              </div>

              {/* Цена и вес */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-400 flex items-center gap-2">
                  💰 Цена и параметры
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Цена (₽) *</label>
                    <input
                      type="text"
                      required
                      inputMode="decimal"
                      value={formData.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Разрешаем только цифры, точку и запятую
                        if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                          setFormData({ ...formData, price: value.replace(',', '.') });
                        }
                      }}
                      onBlur={(e) => {
                        // Форматируем при потере фокуса
                        if (e.target.value) {
                          const num = parseFloat(e.target.value);
                          if (!isNaN(num)) {
                            setFormData({ ...formData, price: num.toFixed(2) });
                          }
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 transition"
                      placeholder="450.00"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      💵 Можно вводить через запятую или точку
                    </p>
                    {formData.price && !isNaN(parseFloat(formData.price)) && (
                      <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                        <p className="text-sm text-green-400">
                          ✅ Цена для клиента: <span className="font-bold">{parseFloat(formData.price).toFixed(2)} ₽</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <label className="block text-sm font-medium">Вес порции</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasThermalProcessing}
                          onChange={(e) => {
                            setHasThermalProcessing(e.target.checked);
                            // Если отключаем термообработку, автоматически устанавливаем вес ингредиентов
                            if (!e.target.checked && productIngredients.length > 0) {
                              setFormData({ ...formData, weight: calculateTotalWeight() });
                            }
                          }}
                          className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-400">🔥 Проходит термообработку</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={hasThermalProcessing ? formData.weight : (productIngredients.length > 0 ? calculateTotalWeight() : formData.weight)}
                      onChange={(e) => {
                        if (hasThermalProcessing) {
                          setFormData({ ...formData, weight: e.target.value });
                        }
                      }}
                      disabled={!hasThermalProcessing && productIngredients.length > 0}
                      className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 transition ${
                        !hasThermalProcessing && productIngredients.length > 0 ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      placeholder="280г"
                    />
                    {!hasThermalProcessing && productIngredients.length > 0 ? (
                      <p className="text-xs text-green-400 mt-1">
                        ✅ Автоматически рассчитан: {calculateTotalWeight()}
                      </p>
                    ) : hasThermalProcessing ? (
                      <p className="text-xs text-orange-400 mt-1">
                        � Укажите вес после термообработки (может отличаться от {calculateTotalWeight() || '0г'})
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">
                        ⚖️ Укажите вес порции или добавьте ингредиенты
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Калькулятор ингредиентов и себестоимости */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-400 flex items-center gap-2">
                  🧮 Калькулятор себестоимости
                </h3>
                
                {/* Единая форма добавления компонентов */}
                <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  {/* Переключатель типа компонента */}
                  <div className="mb-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setComponentType("ingredient")}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                        componentType === "ingredient"
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      🥬 Ингредиент
                    </button>
                    <button
                      type="button"
                      onClick={() => setComponentType("semifinished")}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                        componentType === "semifinished"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      📦 Полуфабрикат
                    </button>
                  </div>

                  {/* Форма для ингредиента */}
                  {componentType === "ingredient" && (
                    <>
                      {/* Выбор категории ингредиентов */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-2 text-gray-400">
                          1️⃣ Выберите категорию
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {ingredientCategories.map((cat) => {
                            const count = ingredients.filter(
                              ing => cat.value === "all" || ing.category === cat.value
                            ).length;
                            
                            if (count === 0 && cat.value !== "all") return null;
                            
                            return (
                              <button
                                key={cat.value}
                                type="button"
                                onClick={() => {
                                  setSelectedIngredientCategory(cat.value);
                                  setSelectedIngredientId("");
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                  selectedIngredientCategory === cat.value
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                              >
                                {cat.label}
                                <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Выбор ингредиента и количества */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium mb-2 text-gray-400">
                            2️⃣ Выберите ингредиент
                          </label>
                          <select
                            value={selectedIngredientId}
                            onChange={(e) => setSelectedIngredientId(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                          >
                            <option value="">Выберите ингредиент...</option>
                            {filteredIngredients.map((ing) => (
                              <option key={ing.id} value={ing.id}>
                                {ing.name} ({ing.unit})
                                {ing.priceNetto && ing.nettoWeight 
                                  ? ` - ${(ing.priceNetto / ing.nettoWeight).toFixed(2)} ₽/${ing.unit}`
                                  : ''
                                }
                              </option>
                            ))}
                          </select>
                          {filteredIngredients.length === 0 && (
                            <p className="text-xs text-yellow-400 mt-1">
                              ⚠️ В этой категории нет ингредиентов
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium mb-2 text-gray-400">
                            3️⃣ Укажите количество
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={ingredientQuantity}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                                setIngredientQuantity(value.replace(',', '.'));
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value) {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) {
                                  setIngredientQuantity(num.toFixed(3));
                                }
                              }
                            }}
                            placeholder="100.000"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                          />
                          {selectedIngredientId && ingredients.find(i => i.id === selectedIngredientId) && (
                            <p className="text-xs text-gray-400 mt-1">
                              в {ingredients.find(i => i.id === selectedIngredientId)?.unit}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium mb-2 text-gray-400">
                            4️⃣ Добавить
                          </label>
                          <button
                            type="button"
                            onClick={handleAddIngredient}
                            disabled={!selectedIngredientId || !ingredientQuantity}
                            className={`w-full px-4 py-2 rounded-lg transition text-sm font-medium ${
                              !selectedIngredientId || !ingredientQuantity
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            ➕ Добавить
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Форма для полуфабриката */}
                  {componentType === "semifinished" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium mb-2 text-gray-400">
                          1️⃣ Выберите полуфабрикат
                        </label>
                        <select
                          value={selectedSemiFinishedId}
                          onChange={(e) => setSelectedSemiFinishedId(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-purple-500/50 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                        >
                          <option value="">Выберите полуфабрикат...</option>
                          {semiFinished.filter(sf => sf.isVisible && !sf.isArchived).map((sf) => (
                            <option key={sf.id} value={sf.id}>
                              {sf.name} ({sf.outputUnit}) - {sf.costPerUnit.toFixed(2)} ₽/{sf.outputUnit}
                            </option>
                          ))}
                        </select>
                        {semiFinished.filter(sf => sf.isVisible && !sf.isArchived).length === 0 && (
                          <p className="text-xs text-yellow-400 mt-1">
                            ⚠️ Нет доступных полуфабрикатов
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium mb-2 text-gray-400">
                          2️⃣ Укажите количество
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={semiFinishedQuantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                              setSemiFinishedQuantity(value.replace(',', '.'));
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value) {
                              const num = parseFloat(e.target.value);
                              if (!isNaN(num)) {
                                setSemiFinishedQuantity(num.toFixed(3));
                              }
                            }
                          }}
                          placeholder="100.000"
                          className="w-full px-3 py-2 bg-gray-700 border border-purple-500/50 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                        />
                        {selectedSemiFinishedId && semiFinished.find(sf => sf.id === selectedSemiFinishedId) && (
                          <p className="text-xs text-gray-400 mt-1">
                            в {semiFinished.find(sf => sf.id === selectedSemiFinishedId)?.outputUnit}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium mb-2 text-gray-400">
                          3️⃣ Добавить
                        </label>
                        <button
                          type="button"
                          onClick={handleAddSemiFinished}
                          disabled={!selectedSemiFinishedId || !semiFinishedQuantity}
                          className={`w-full px-4 py-2 rounded-lg transition text-sm font-medium ${
                            !selectedSemiFinishedId || !semiFinishedQuantity
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                        >
                          ➕ Добавить
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Единая таблица компонентов */}
                {(productIngredients.length > 0 || productSemiFinished.length > 0) && (
                  <div className="mb-4">
                    <div className="bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">Компонент</th>
                            <th className="px-4 py-2 text-right font-medium">Количество</th>
                            <th className="px-4 py-2 text-right font-medium">Цена за ед.</th>
                            <th className="px-4 py-2 text-right font-medium">Сумма</th>
                            <th className="px-4 py-2 text-center font-medium">Действие</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                          {/* Ингредиенты */}
                          {productIngredients.map((ing) => (
                            <tr key={`ing-${ing.ingredientId}`} className="hover:bg-gray-700/30">
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-green-400">🥬</span>
                                  <span className="text-gray-300">{ing.ingredientName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-right text-gray-300">
                                {ing.quantity.toFixed(3)} {ing.unit}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-400">
                                {ing.pricePerUnit.toFixed(3)} ₽
                              </td>
                              <td className="px-4 py-2 text-right font-medium text-green-400">
                                {ing.totalPrice.toFixed(2)} ₽
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveIngredient(ing.ingredientId)}
                                  className="p-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {/* Полуфабрикаты */}
                          {productSemiFinished.map((sf, index) => (
                            <tr key={`sf-${index}`} className="hover:bg-purple-500/10">
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-purple-400">📦</span>
                                  <span className="text-gray-300">{sf.semiFinishedName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-right text-gray-300">
                                {sf.quantity.toFixed(3)} {sf.unit}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-400">
                                {sf.costPerUnit.toFixed(3)} ₽
                              </td>
                              <td className="px-4 py-2 text-right font-medium text-purple-400">
                                {sf.totalCost.toFixed(2)} ₽
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSemiFinished(index)}
                                  className="p-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Итоги расчёта */}
                {(productIngredients.length > 0 || productSemiFinished.length > 0) && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                        <p className="text-xs text-indigo-400 font-medium mb-1">Общий вес</p>
                        <p className="text-lg font-bold text-indigo-300">
                          {calculateTotalWeight() || '—'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Вес всех ингредиентов
                        </p>
                      </div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs text-blue-400 font-medium mb-1">Себестоимость</p>
                        <p className="text-lg font-bold text-blue-300">
                          {calculateTotalCost().toFixed(2)} ₽
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <p className="text-xs text-purple-400 font-medium mb-1">Рекомендуемая цена (×3)</p>
                        <p className="text-lg font-bold text-purple-300">
                          {calculateRecommendedPrice().toFixed(2)} ₽
                        </p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, price: calculateRecommendedPrice().toFixed(2) })}
                          className="mt-1 text-xs text-purple-400 hover:text-purple-300 underline"
                        >
                          Установить эту цену
                        </button>
                      </div>
                      <div className={`p-3 rounded-lg border ${
                        calculateMarkup() >= 150 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : calculateMarkup() >= 100
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <p className={`text-xs font-medium mb-1 ${
                          calculateMarkup() >= 150 
                            ? 'text-green-400' 
                            : calculateMarkup() >= 100
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}>
                          Наценка
                        </p>
                        <p className={`text-lg font-bold ${
                          calculateMarkup() >= 150 
                            ? 'text-green-300' 
                            : calculateMarkup() >= 100
                            ? 'text-yellow-300'
                            : 'text-red-300'
                        }`}>
                          {formData.price && !isNaN(parseFloat(formData.price))
                            ? `${calculateMarkup().toFixed(1)}%`
                            : '—'
                          }
                        </p>
                        {formData.price && !isNaN(parseFloat(formData.price)) && (
                          <p className="text-xs text-gray-400 mt-1">
                            Прибыль: {(parseFloat(formData.price) - calculateTotalCost()).toFixed(2)} ₽
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {productIngredients.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm">Добавьте ингредиенты для расчёта себестоимости</p>
                  </div>
                )}
              </div>

              {/* Описание */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-400 flex items-center gap-2">
                  📝 Описание
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Состав продукта</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 transition"
                    placeholder="Лосось, сливочный сыр, авокадо, огурец, нори, рис..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    🍱 Перечислите все ингредиенты через запятую
                  </p>
                  {formData.description && (
                    <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                      <p className="text-xs text-blue-400 mb-1 font-semibold">Предпросмотр:</p>
                      <p className="text-sm text-gray-300">{formData.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Символов: {formData.description.length}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Изображение */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-400 flex items-center gap-2">
                  🖼️ Изображение
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">URL изображения</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 transition"
                      placeholder="/products/philadelphia.jpg"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      📸 Путь к изображению в папке public
                    </p>
                    <div className="mt-2 p-2 bg-purple-500/10 border border-purple-500/30 rounded">
                      <p className="text-xs text-purple-400">
                        💡 <span className="font-semibold">Совет:</span> Используйте изображения из /products/
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Примеры: /products/philadelphia.jpg, /products/california.jpg
                      </p>
                    </div>
                  </div>

                  {/* Превью изображения */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Превью</label>
                    {formData.imageUrl ? (
                      <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden border-2 border-orange-500/30">
                        <Image
                          src={formData.imageUrl}
                          alt="Превью"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><span>❌ Изображение не найдено</span></div>';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                        <p className="text-gray-500">📷 Превью появится здесь</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 md:flex-none px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold shadow-lg hover:shadow-orange-500/50"
                >
                  {editingProduct ? "💾 Сохранить изменения" : "✨ Добавить продукт"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 md:flex-none px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                >
                  ❌ Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список продуктов */}
        {products.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Продукты на складе отсутствуют</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Добавить первый продукт
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Фото</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Название</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Категория</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Цена</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Вес</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Статус</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-orange-500">{product.price} ₽</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {product.weight || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleVisibility(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                            product.isVisible !== false
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                          }`}
                          title={product.isVisible !== false ? "Нажмите, чтобы скрыть с главной" : "Нажмите, чтобы показать на главной"}
                        >
                          <span className={`w-2 h-2 rounded-full ${product.isVisible !== false ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                          {product.isVisible !== false ? (
                            <>
                              <span>👁️ Видимый</span>
                            </>
                          ) : (
                            <>
                              <span>🔒 Скрытый</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleToggleVisibility(product)}
                            className={`p-2 rounded transition ${
                              product.isVisible !== false
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-500 text-white hover:bg-gray-600"
                            }`}
                            title={product.isVisible !== false ? "Скрыть с главной страницы" : "Показать на главной странице"}
                          >
                            {product.isVisible !== false ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-gray-400">
          <p>Всего продуктов на складе: <span className="font-bold text-orange-500">{products.length}</span></p>
        </div>
      </div>
    </div>
  );
}
