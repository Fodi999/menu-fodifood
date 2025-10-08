"use client";

import React, { useEffect, useState, Fragment, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2, Loader2, Package2 } from "lucide-react";

type Ingredient = {
  id: string;
  name: string;
  unit: string; // "g" | "ml" | "pcs"
  batchNumber?: string | null;
  category?: string | null;
  supplier?: string | null;
  bruttoWeight?: number | null;
  nettoWeight?: number | null;
  wastePercentage?: number | null;
  expiryDays?: number | null;
  priceBrutto?: number | null;
  priceNetto?: number | null;
  createdAt: string;
  updatedAt: string;
  movementsCount?: number; // Количество поступлений
};

type GroupedIngredient = {
  name: string;
  unit: string;
  batches: Ingredient[]; // Все партии этого ингредиента
};

type StockMovement = {
  id: string;
  ingredientId: string;
  quantity: number;
  type: string; // "addition" | "removal" | "adjustment"
  notes?: string;
  createdAt: string;
};

type IngredientFormData = {
  name: string;
  unit: string;
  category: string;
  supplier: string;
  bruttoWeight: string;
  nettoWeight: string;
  wastePercentage: string;
  expiryDays: string;
  priceBrutto: string;
  priceNetto: string;
};

export default function AdminIngredientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [groupedIngredients, setGroupedIngredients] = useState<GroupedIngredient[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIngredientMovements, setSelectedIngredientMovements] = useState<{
    ingredientId: string;
    ingredientName: string;
    batchNumber: string;
    movements: StockMovement[];
  } | null>(null);
  const [showMovementsModal, setShowMovementsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Новое состояние для фильтра
  const [formData, setFormData] = useState<IngredientFormData>({
    name: "",
    unit: "g",
    category: "",
    supplier: "",
    bruttoWeight: "",
    nettoWeight: "",
    wastePercentage: "",
    expiryDays: "7",
    priceBrutto: "",
    priceNetto: "",
  });

  const units = [
    { value: "g", label: "Граммы (г)" },
    { value: "ml", label: "Миллилитры (мл)" },
    { value: "pcs", label: "Штуки (шт)" },
  ];

  const categories = [
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

  // Нормализация числового ввода - замена запятой на точку
  const normalizeNumberInput = (value: string): string => {
    // Заменяем запятую на точку
    return value.replace(',', '.');
  };

  // Форматирование числа при потере фокуса с поддержкой разного количества знаков
  const formatNumber = (value: string, decimals: number = 3): string => {
    if (!value) return '';
    
    // Нормализуем ввод (запятую на точку)
    const normalized = normalizeNumberInput(value);
    const num = parseFloat(normalized);
    
    if (isNaN(num)) return '';
    
    // Форматируем с нужным количеством знаков после запятой
    return num.toFixed(decimals);
  };

  // Автоматический расчёт процента отхода или нетто
  const calculateWaste = (brutto: string, netto: string, wastePercent: string, field: 'netto' | 'waste') => {
    const bruttoNum = parseFloat(normalizeNumberInput(brutto));
    const nettoNum = parseFloat(normalizeNumberInput(netto));
    const wasteNum = parseFloat(normalizeNumberInput(wastePercent));

    if (field === 'netto' && bruttoNum > 0 && wasteNum >= 0 && wasteNum <= 100) {
      // Рассчитываем нетто: нетто = брутто - (брутто * отход%)
      const calculatedNetto = bruttoNum - (bruttoNum * wasteNum / 100);
      return calculatedNetto.toFixed(3);
    } else if (field === 'waste' && bruttoNum > 0 && nettoNum > 0 && nettoNum <= bruttoNum) {
      // Рассчитываем процент отхода: отход% = ((брутто - нетто) / брутто) * 100
      const calculatedWaste = ((bruttoNum - nettoNum) / bruttoNum) * 100;
      return calculatedWaste.toFixed(2);
    }
    return '';
  };

  // Вычисление даты истечения срока годности
  const getExpiryDate = (days: string): string => {
    if (!days || parseInt(days) <= 0) return 'не указано';
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    
    return expiryDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Вычисление процента выхода продукта
  const getYieldPercent = (brutto: string, netto: string): number => {
    const bruttoNum = parseFloat(brutto);
    const nettoNum = parseFloat(netto);
    
    if (bruttoNum > 0 && nettoNum > 0) {
      return (nettoNum / bruttoNum) * 100;
    }
    return 0;
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?callbackUrl=/admin/ingredients");
    }
  }, [user, authLoading, router]);

  const fetchIngredients = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      
      console.log('Fetching ingredients from:', `${apiUrl}/api/admin/ingredients`);
      console.log('Token:', token ? 'present' : 'missing');
      
      const response = await fetch(
        `${apiUrl}/api/admin/ingredients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch ingredients: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Разворачиваем вложенную структуру StockItem с ingredient внутри
      const ingredientsPromises = Array.isArray(data)
        ? data.map(async (item) => {
            // Получаем количество поступлений для каждого ингредиента
            let movementsCount = 0;
            try {
              const movementsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/ingredients/${item.id}/movements`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (movementsResponse.ok) {
                const movements = await movementsResponse.json();
                movementsCount = Array.isArray(movements) ? movements.length : 0;
              }
            } catch (err) {
              console.error(`Failed to fetch movements for ingredient ${item.id}:`, err);
            }

            return {
              id: item.id,
              name: item.ingredient?.name?.trim() || "Без названия",
              unit: item.ingredient?.unit || "g",
              batchNumber: item.batchNumber?.trim() || null,
              category: item.category?.trim() || null,
              supplier: item.supplier?.trim() || null,
              bruttoWeight: typeof item.bruttoWeight === 'number' ? item.bruttoWeight : null,
              nettoWeight: typeof item.nettoWeight === 'number' ? item.nettoWeight : null,
              wastePercentage: typeof item.wastePercentage === 'number' ? item.wastePercentage : null,
              expiryDays: typeof item.expiryDays === 'number' ? item.expiryDays : null,
              priceBrutto: typeof item.priceBrutto === 'number' ? item.priceBrutto : null,
              priceNetto: typeof item.priceNetto === 'number' ? item.priceNetto : null,
              createdAt: item.ingredient?.createdAt || item.updatedAt,
              updatedAt: item.updatedAt,
              movementsCount,
            };
          })
        : [];
      
      const ingredients = await Promise.all(ingredientsPromises);
      setIngredients(ingredients);
      
      // Группируем ингредиенты по названию
      const grouped = groupIngredientsByName(ingredients);
      setGroupedIngredients(grouped);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
      setError("Не удалось загрузить ингредиенты");
      setIngredients([]);
      setGroupedIngredients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchIngredients();
    }
  }, [user, fetchIngredients]);

  // Функция группировки ингредиентов по названию
  const groupIngredientsByName = (ingredients: Ingredient[]): GroupedIngredient[] => {
    const groups = new Map<string, Ingredient[]>();
    
    ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase().trim();
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(ingredient);
    });
    
    return Array.from(groups.entries()).map(([, batches]) => ({
      name: batches[0].name, // Используем оригинальное название первой партии
      unit: batches[0].unit,
      batches: batches.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }));
  };

  const toggleGroup = (name: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedGroups(newExpanded);
  };

  const fetchMovements = async (ingredientId: string, ingredientName: string, batchNumber: string = "N/A") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/ingredients/${ingredientId}/movements`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movements");
      }

      const movements = await response.json();
      setSelectedIngredientMovements({
        ingredientId,
        ingredientName,
        batchNumber,
        movements: Array.isArray(movements) ? movements : [],
      });
      setShowMovementsModal(true);
    } catch (err) {
      console.error("Error fetching movements:", err);
      alert("Не удалось загрузить историю поступлений");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const url = editingIngredient
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/ingredients/${editingIngredient.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/ingredients`;
      
      const method = editingIngredient ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          unit: formData.unit,
          quantity: 0, // Значение по умолчанию для совместимости с backend
          category: formData.category || null,
          supplier: formData.supplier || null,
          bruttoWeight: formData.bruttoWeight ? parseFloat(normalizeNumberInput(formData.bruttoWeight)) : null,
          nettoWeight: formData.nettoWeight ? parseFloat(normalizeNumberInput(formData.nettoWeight)) : null,
          wastePercentage: formData.wastePercentage ? parseFloat(normalizeNumberInput(formData.wastePercentage)) : null,
          expiryDays: formData.expiryDays ? parseInt(formData.expiryDays) : null,
          priceBrutto: formData.priceBrutto ? parseFloat(normalizeNumberInput(formData.priceBrutto)) : null,
          priceNetto: formData.priceNetto ? parseFloat(normalizeNumberInput(formData.priceNetto)) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save ingredient");
      }

      await response.json();
      await fetchIngredients();
      
      setShowForm(false);
      setEditingIngredient(null);
      setSearchQuery("");
      setShowSearchResults(false);
      setFormData({
        name: "",
        unit: "g",
        category: "",
        supplier: "",
        bruttoWeight: "",
        nettoWeight: "",
        wastePercentage: "",
        expiryDays: "7",
        priceBrutto: "",
        priceNetto: "",
      });

      alert(editingIngredient ? "Ингредиент обновлён!" : "Ингредиент добавлен!");
    } catch (err) {
      console.error("Error saving ingredient:", err);
      alert("Не удалось сохранить ингредиент");
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      category: ingredient.category || "",
      supplier: ingredient.supplier || "",
      bruttoWeight: ingredient.bruttoWeight?.toString() || "",
      nettoWeight: ingredient.nettoWeight?.toString() || "",
      wastePercentage: ingredient.wastePercentage?.toString() || "",
      expiryDays: ingredient.expiryDays?.toString() || "7",
      priceBrutto: ingredient.priceBrutto?.toString() || "",
      priceNetto: ingredient.priceNetto?.toString() || "",
    });
    setShowForm(true);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    // Быстрое добавление поступления - загружаем базовые данные существующего ингредиента
    // НЕ устанавливаем editingIngredient, чтобы создать НОВУЮ партию, а не обновить существующую
    setEditingIngredient(null);
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      category: ingredient.category || "",
      supplier: ingredient.supplier || "",
      // Данные партии оставляем пустыми для ввода новых значений
      bruttoWeight: "",
      nettoWeight: "",
      wastePercentage: ingredient.wastePercentage?.toString() || "",
      expiryDays: "7",
      priceBrutto: "",
      priceNetto: "",
    });
    setShowForm(true);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleDelete = async (ingredientId: string, ingredientName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить ингредиент "${ingredientName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/ingredients/${ingredientId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete ingredient");
      }

      setIngredients(ingredients.filter((i) => i.id !== ingredientId));
      alert(`Ингредиент "${ingredientName}" удалён`);
    } catch (err) {
      console.error("Error deleting ingredient:", err);
      alert("Не удалось удалить ингредиент");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIngredient(null);
    setSearchQuery("");
    setShowSearchResults(false);
    setFormData({
      name: "",
      unit: "g",
      category: "",
      supplier: "",
      bruttoWeight: "",
      nettoWeight: "",
      wastePercentage: "",
      expiryDays: "7",
      priceBrutto: "",
      priceNetto: "",
    });
  };

  // Статус на основе срока годности
  const getExpiryStatus = (expiryDays: number | null | undefined) => {
    if (!expiryDays) {
      return { color: "text-gray-400", bg: "bg-gray-500/20", label: "Не указан" };
    }
    if (expiryDays <= 3) {
      return { color: "text-red-500", bg: "bg-red-500/20", label: "Срочно использовать" };
    } else if (expiryDays <= 7) {
      return { color: "text-yellow-500", bg: "bg-yellow-500/20", label: "Скоро истекает" };
    } else {
      return { color: "text-green-500", bg: "bg-green-500/20", label: "Свежий" };
    }
  };

  const getUnitLabel = (unit: string) => {
    const unitObj = units.find((u) => u.value === unit);
    // Извлекаем текст в скобках, например "Граммы (г)" -> "г"
    const match = unitObj?.label.match(/\((.*?)\)/);
    return match ? match[1] : unit;
  };

  // Фильтрация по поисковому запросу
  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ing.category && ing.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ing.supplier && ing.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Подсчёт ингредиентов по категориям
  const getCategoryCount = (categoryValue: string) => {
    if (categoryValue === "all") return ingredients.length;
    return ingredients.filter(ing => ing.category === categoryValue).length;
  };

  // Фильтрация по выбранной категории
  const displayedIngredients = selectedCategory === "all" 
    ? groupedIngredients 
    : groupedIngredients.filter(group => 
        group.batches.some(batch => batch.category === selectedCategory)
      );

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
            <Package2 className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500">Склад сырья</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Добавить ингредиент
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

        {/* Вкладки категорий */}
        {!showForm && (
          <div className="mb-6 bg-gray-800 rounded-lg shadow-xl p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span>📦 Все</span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {getCategoryCount("all")}
                </span>
              </button>
              
              {categories.map((cat) => {
                const count = getCategoryCount(cat.value);
                if (count === 0) return null; // Не показываем пустые категории
                
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      selectedCategory === cat.value
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Форма */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingIngredient ? "Редактировать ингредиент" : "Добавить новый ингредиент"}
            </h2>
            
            {/* Поиск существующего ингредиента */}
            {!editingIngredient && (
              <div className="mb-6 relative">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Быстрое добавление новой партии
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">Найдите существующий ингредиент, чтобы добавить к нему новую партию с обновлёнными данными</p>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="🔍 Поиск по названию, категории или поставщику..."
                  />
                  
                  {/* Результаты поиска */}
                  {showSearchResults && filteredIngredients.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      {filteredIngredients.slice(0, 5).map((ing) => (
                        <button
                          key={ing.id}
                          type="button"
                          onClick={() => handleSelectIngredient(ing)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 transition border-b border-gray-700 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">{ing.name}</p>
                              <p className="text-xs text-gray-400">
                                {ing.category && `📦 ${ing.category}`}
                                {ing.supplier && ` | 🏪 ${ing.supplier}`}
                                {ing.bruttoWeight && ` | ⚖️ ${ing.bruttoWeight}${getUnitLabel(ing.unit)}`}
                              </p>
                            </div>
                            <div className="text-xs text-orange-400">➕ Добавить партию</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showSearchResults && searchQuery && filteredIngredients.length === 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 text-center text-gray-400">
                      Ничего не найдено. Создайте новый ингредиент ниже.
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Лосось"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Единица измерения *</label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Не выбрана</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Для удобства поиска и фильтрации</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Поставщик</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="ООО Рыбный Двор"
                  />
                </div>
              </div>

              {/* Секция учёта отходов */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-2 text-orange-400">📊 Учёт отходов (Брутто/Нетто)</h3>
                <p className="text-xs text-gray-400 mb-4">
                  💡 Введите брутто и либо процент отхода, либо нетто — остальное пересчитается автоматически
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Вес брутто ({getUnitLabel(formData.unit)})
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.bruttoWeight}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Разрешаем только цифры, точку и запятую
                        if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                          setFormData({ ...formData, bruttoWeight: value });
                          // Автопересчёт нетто если задан процент отхода
                          if (formData.wastePercentage && value) {
                            const calculatedNetto = calculateWaste(value, formData.nettoWeight, formData.wastePercentage, 'netto');
                            if (calculatedNetto) {
                              setFormData(prev => ({ ...prev, bruttoWeight: value, nettoWeight: calculatedNetto }));
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        // Форматирование при потере фокуса
                        if (e.target.value) {
                          const formatted = formatNumber(e.target.value, 3);
                          setFormData(prev => ({ ...prev, bruttoWeight: formatted }));
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="3,650 или 3.650"
                    />
                    <p className="text-xs text-gray-400 mt-1">Вес с отходами (можно вводить через запятую или точку)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Процент отхода (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.wastePercentage}
                      onChange={(e) => {
                        const newWaste = e.target.value;
                        setFormData({ ...formData, wastePercentage: newWaste });
                        // Автопересчёт нетто если задан брутто
                        if (formData.bruttoWeight) {
                          const calculatedNetto = calculateWaste(formData.bruttoWeight, formData.nettoWeight, newWaste, 'netto');
                          if (calculatedNetto) {
                            setFormData(prev => ({ ...prev, wastePercentage: newWaste, nettoWeight: calculatedNetto }));
                          }
                        }
                      }}
                      onBlur={(e) => {
                        // Форматирование при потере фокуса
                        if (e.target.value) {
                          const formatted = parseFloat(e.target.value).toFixed(1);
                          setFormData(prev => ({ ...prev, wastePercentage: formatted }));
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="15.0"
                    />
                    <p className="text-xs text-gray-400 mt-1">% потерь при обработке (0-100%)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Вес нетто ({getUnitLabel(formData.unit)})
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.nettoWeight}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Разрешаем только цифры, точку и запятую
                        if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                          setFormData({ ...formData, nettoWeight: value });
                          // Автопересчёт процента отхода если задан брутто
                          if (formData.bruttoWeight && value) {
                            const calculatedWaste = calculateWaste(formData.bruttoWeight, value, formData.wastePercentage, 'waste');
                            if (calculatedWaste) {
                              setFormData(prev => ({ ...prev, nettoWeight: value, wastePercentage: calculatedWaste }));
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        // Форматирование при потере фокуса
                        if (e.target.value) {
                          const formatted = formatNumber(e.target.value, 3);
                          setFormData(prev => ({ ...prev, nettoWeight: formatted }));
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="0,560 или 24.567"
                    />
                    <p className="text-xs text-gray-400 mt-1">Чистый вес без отходов (можно вводить через запятую или точку)</p>
                  </div>
                </div>

                {formData.bruttoWeight && formData.nettoWeight && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-400">
                      ✅ Выход продукта: <span className="font-bold">
                        {getYieldPercent(formData.bruttoWeight, formData.nettoWeight).toFixed(1)}%
                      </span> | 
                      🗑️ Потери: <span className="font-bold">
                        {formData.wastePercentage || '0'}%
                      </span> | 
                      📦 Чистый вес: <span className="font-bold">
                        {parseFloat(formData.nettoWeight).toFixed(2)} {getUnitLabel(formData.unit)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Секция срока годности */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-4 text-orange-400">📅 Срок годности</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Срок годности (дней)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.expiryDays}
                      onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="7"
                    />
                    <p className="text-xs text-gray-400 mt-1">Количество дней до истечения срока</p>
                  </div>
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg w-full">
                      <p className="text-sm text-blue-400">
                        ⏰ Использовать до: <span className="font-bold">
                          {getExpiryDate(formData.expiryDays)}
                        </span>
                      </p>
                      {formData.expiryDays && parseInt(formData.expiryDays) > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          Срок хранения: {formData.expiryDays} {parseInt(formData.expiryDays) === 1 ? 'день' : parseInt(formData.expiryDays) < 5 ? 'дня' : 'дней'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Секция цены */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-4 text-orange-400">💰 Стоимость</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Цена брутто (₽)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.priceBrutto}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Разрешаем только цифры, точку и запятую
                        if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                          setFormData(prev => ({ ...prev, priceBrutto: value }));
                          
                          // Автоматический расчет цены нетто на основе процента отхода
                          if (value && formData.wastePercentage) {
                            const bruttoPrice = parseFloat(normalizeNumberInput(value));
                            const wastePercent = parseFloat(normalizeNumberInput(formData.wastePercentage));
                            if (bruttoPrice > 0 && wastePercent >= 0 && wastePercent <= 100) {
                              const nettoPrice = bruttoPrice / (1 - wastePercent / 100);
                              setFormData(prev => ({ ...prev, priceBrutto: value, priceNetto: nettoPrice.toFixed(2) }));
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const formatted = formatNumber(e.target.value, 2);
                          setFormData(prev => ({ ...prev, priceBrutto: formatted }));
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="1000,50 или 1000.50"
                    />
                    <p className="text-xs text-gray-400 mt-1">Цена за брутто вес</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Цена нетто (₽)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.priceNetto}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Разрешаем только цифры, точку и запятую
                        if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                          setFormData(prev => ({ ...prev, priceNetto: value }));
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const formatted = formatNumber(e.target.value, 2);
                          setFormData(prev => ({ ...prev, priceNetto: formatted }));
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="1222,22 или 1222.22"
                    />
                    <p className="text-xs text-gray-400 mt-1">Цена за чистый вес</p>
                  </div>
                </div>

                {formData.priceBrutto && formData.priceNetto && (
                  <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-purple-400">
                      💵 Стоимость брутто: <span className="font-bold">{parseFloat(formData.priceBrutto).toFixed(2)} ₽</span>
                      {" | "}
                      💎 Стоимость нетто: <span className="font-bold">{parseFloat(formData.priceNetto).toFixed(2)} ₽</span>
                      {formData.wastePercentage && (
                        <>
                          {" | "}
                          📊 Наценка: <span className="font-bold">
                            {((parseFloat(formData.priceNetto) / parseFloat(formData.priceBrutto) - 1) * 100).toFixed(1)}%
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  {editingIngredient ? "Сохранить изменения" : "Добавить ингредиент"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список ингредиентов */}
        {ingredients.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center">
            <Package2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Ингредиенты на складе отсутствуют</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Добавить первый ингредиент
            </button>
          </div>
        ) : displayedIngredients.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center">
            <Package2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              В категории &quot;{categories.find(c => c.value === selectedCategory)?.label}&quot; нет ингредиентов
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Показать все категории
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Название</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Категория</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Партии</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {displayedIngredients.map((group) => {
                    const isExpanded = expandedGroups.has(group.name);
                    const totalBatches = group.batches.length;
                    const firstBatch = group.batches[0];
                    const categoryLabel = firstBatch.category 
                      ? categories.find(c => c.value === firstBatch.category)?.label || firstBatch.category
                      : null;
                    
                    return (
                      <React.Fragment key={group.name}>
                        {/* Основная строка с названием ингредиента */}
                        <tr className="hover:bg-gray-700/50 transition cursor-pointer">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleGroup(group.name)}
                              className="flex items-center gap-3 text-left w-full"
                            >
                              <span className={`transform transition-transform text-orange-500 ${isExpanded ? 'rotate-90' : ''}`}>
                                ▶
                              </span>
                              <span className="font-bold text-lg text-white">{group.name}</span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-300">{categoryLabel || "—"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg font-semibold text-sm">
                              {totalBatches} {totalBatches === 1 ? 'партия' : totalBatches < 5 ? 'партии' : 'партий'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroup(group.name);
                                }}
                                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-sm"
                              >
                                {isExpanded ? 'Скрыть' : 'Показать'} партии
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Развернутые партии */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={4} className="px-0 py-0">
                              <div className="bg-gray-750 border-t border-gray-700">
                                {(() => {
                                  // Вычисляем общие суммы для всех партий
                                  const totalBrutto = group.batches.reduce((sum, b) => sum + (b.bruttoWeight || 0), 0);
                                  const totalNetto = group.batches.reduce((sum, b) => sum + (b.nettoWeight || 0), 0);
                                  const totalPriceBrutto = group.batches.reduce((sum, b) => sum + (b.priceBrutto || 0), 0);
                                  const totalPriceNetto = group.batches.reduce((sum, b) => sum + (b.priceNetto || 0), 0);
                                  const avgWaste = totalBrutto > 0 ? ((totalBrutto - totalNetto) / totalBrutto * 100) : 0;
                                  
                                  return (
                                    <>
                                      {/* Строка с общими суммами */}
                                      <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-b-2 border-orange-500/30 px-6 py-4">
                                        <div className="flex flex-wrap items-center gap-6 text-sm">
                                          <div className="flex items-center gap-2">
                                            <span className="text-gray-400 font-medium">📦 Общий вес:</span>
                                            <span className="text-white font-bold">
                                              Брутто: {totalBrutto.toFixed(3)} {getUnitLabel(group.batches[0].unit)}
                                            </span>
                                            <span className="text-gray-500">|</span>
                                            <span className="text-green-400 font-bold">
                                              Нетто: {totalNetto.toFixed(3)} {getUnitLabel(group.batches[0].unit)}
                                            </span>
                                            <span className="text-gray-500">|</span>
                                            <span className="text-orange-400 font-medium">
                                              Отход: {avgWaste.toFixed(1)}%
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 border-l border-gray-600 pl-6">
                                            <span className="text-gray-400 font-medium">💰 Общая цена:</span>
                                            <span className="text-white font-bold">
                                              Брутто: {totalPriceBrutto.toFixed(2)} ₽
                                            </span>
                                            <span className="text-gray-500">|</span>
                                            <span className="text-green-400 font-bold">
                                              Нетто: {totalPriceNetto.toFixed(2)} ₽
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                                
                                <table className="w-full">
                                  <thead className="bg-gray-700/50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">№ Партии</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Брутто</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Нетто</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">% отхода</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Цена нетто</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Срок годности</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Поставщик</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">История</th>
                                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Статус</th>
                                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400">Действия</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-700/50">
                                    {group.batches.map((batch) => {
                                      const status = getExpiryStatus(batch.expiryDays);
                                      const expiryDate = batch.expiryDays 
                                        ? new Date(Date.now() + batch.expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
                                        : null;
                                      
                                      return (
                                        <tr key={batch.id} className="hover:bg-gray-700/30 transition">
                                          <td className="px-6 py-3">
                                            {batch.batchNumber ? (
                                              <p className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded inline-block">
                                                {batch.batchNumber}
                                              </p>
                                            ) : (
                                              <p className="text-gray-500 text-sm">—</p>
                                            )}
                                          </td>
                                          <td className="px-6 py-3">
                                            <p className="font-medium text-sm text-gray-200">
                                              {batch.bruttoWeight ? `${batch.bruttoWeight.toFixed(3)} ${getUnitLabel(batch.unit)}` : "—"}
                                            </p>
                                          </td>
                                          <td className="px-6 py-3">
                                            <p className="font-medium text-sm text-green-400">
                                              {batch.nettoWeight ? `${batch.nettoWeight.toFixed(3)} ${getUnitLabel(batch.unit)}` : "—"}
                                            </p>
                                          </td>
                                          <td className="px-6 py-3">
                                            <p className="text-sm text-gray-400">
                                              {batch.wastePercentage ? `${batch.wastePercentage.toFixed(1)}%` : "—"}
                                            </p>
                                          </td>
                                          <td className="px-6 py-3">
                                            {batch.priceNetto ? (
                                              <div>
                                                <p className="font-medium text-sm text-green-400">{batch.priceNetto.toFixed(2)} ₽</p>
                                                {batch.priceBrutto && (
                                                  <p className="text-xs text-gray-500 mt-0.5">
                                                    брутто: {batch.priceBrutto.toFixed(2)} ₽
                                                  </p>
                                                )}
                                              </div>
                                            ) : (
                                              <p className="text-gray-500 text-sm">—</p>
                                            )}
                                          </td>
                                          <td className="px-6 py-3">
                                            {batch.expiryDays ? (
                                              <div>
                                                <p className="text-sm font-medium text-gray-200">{batch.expiryDays} дн.</p>
                                                {expiryDate && (
                                                  <p className="text-xs text-gray-500 mt-0.5">до {expiryDate}</p>
                                                )}
                                              </div>
                                            ) : (
                                              <p className="text-gray-500 text-sm">—</p>
                                            )}
                                          </td>
                                          <td className="px-6 py-3">
                                            <p className="text-sm text-gray-400">{batch.supplier || "—"}</p>
                                          </td>
                                          <td className="px-6 py-3">
                                            <button
                                              onClick={() => fetchMovements(batch.id, batch.name, batch.batchNumber || "N/A")}
                                              className="flex items-center gap-2 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded transition text-sm"
                                              title="Посмотреть историю поступлений"
                                            >
                                              <Package2 className="w-3 h-3" />
                                              <span className="font-medium">{batch.movementsCount || 0}</span>
                                            </button>
                                          </td>
                                          <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                              {status.label}
                                            </span>
                                          </td>
                                          <td className="px-6 py-3">
                                            <div className="flex justify-center gap-2">
                                              <button
                                                onClick={() => handleEdit(batch)}
                                                className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                title="Редактировать"
                                              >
                                                <Edit2 className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={() => handleDelete(batch.id, `${batch.name} (${batch.batchNumber})`)}
                                                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                title="Удалить"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Всего ингредиентов</p>
            <p className="text-2xl font-bold text-orange-500">{ingredients.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Срочно использовать (≤3 дня)</p>
            <p className="text-2xl font-bold text-red-500">
              {ingredients.filter((i) => i.expiryDays && i.expiryDays <= 3).length}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Скоро истекает (≤7 дней)</p>
            <p className="text-2xl font-bold text-yellow-500">
              {ingredients.filter((i) => i.expiryDays && i.expiryDays > 3 && i.expiryDays <= 7).length}
            </p>
          </div>
        </div>

        {/* Модальное окно с историей поступлений */}
        {showMovementsModal && selectedIngredientMovements && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      📦 История поступлений
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {selectedIngredientMovements.ingredientName}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowMovementsModal(false);
                      setSelectedIngredientMovements(null);
                    }}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {selectedIngredientMovements.movements.length === 0 ? (
                  <div className="text-center py-12">
                    <Package2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">История поступлений пуста</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedIngredientMovements.movements.map((movement, index) => {
                      const date = new Date(movement.createdAt);
                      const formattedDate = date.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div key={movement.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-bold text-white">
                                  #{selectedIngredientMovements.movements.length - index}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  movement.type === 'addition' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : movement.type === 'removal'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {movement.type === 'addition' ? '➕ Добавление' : 
                                   movement.type === 'removal' ? '➖ Списание' : 
                                   '🔄 Корректировка'}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                <div>
                                  <p className="text-gray-400 text-sm">Количество</p>
                                  <p className="text-white font-semibold text-lg">
                                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">Дата и время</p>
                                  <p className="text-white font-medium">{formattedDate}</p>
                                </div>
                              </div>

                              {movement.notes && (
                                <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
                                  <p className="text-gray-400 text-sm mb-1">Примечание</p>
                                  <p className="text-white">{movement.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-700 bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">
                    Всего записей: <span className="text-white font-semibold">{selectedIngredientMovements.movements.length}</span>
                  </p>
                  <button
                    onClick={() => {
                      setShowMovementsModal(false);
                      setSelectedIngredientMovements(null);
                    }}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
