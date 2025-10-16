"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import api from "@/lib/api";
import { Trash2, Loader2 } from "lucide-react";

// Импорт компонентов
import {
  SemiFinishedHeader,
  SemiFinishedTable,
  ErrorMessage,
} from "./components";

type Ingredient = {
  id: string; // StockItem ID
  ingredientId: string; // Ingredient ID (для связи с таблицей Ingredient)
  name: string;
  unit: string;
  priceNetto: number | null;
  nettoWeight: number | null;
  category: string | null;
};

type SemiFinishedIngredient = {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
};

type SemiFinished = {
  id: string;
  name: string;
  description: string | null;
  outputQuantity: number;
  outputUnit: string;
  costPerUnit: number;
  category: string;
  createdAt: string;
};

type SemiFinishedFormData = {
  name: string;
  description: string;
  outputQuantity: string;
  outputUnit: string;
  category: string;
};

export default function AdminSemiFinishedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [semiFinished, setSemiFinished] = useState<SemiFinished[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SemiFinishedIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SemiFinished | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>("");
  const [ingredientQuantity, setIngredientQuantity] = useState<string>("");
  const [selectedIngredientCategory, setSelectedIngredientCategory] = useState<string>("all");
  const [hasThermalProcessing, setHasThermalProcessing] = useState<boolean>(false);
  const [formData, setFormData] = useState<SemiFinishedFormData>({
    name: "",
    description: "",
    outputQuantity: "",
    outputUnit: "g",
    category: "Рис и крупы",
  });

  const categories = [
    "Рис и крупы",
    "Соусы и маринады",
    "Заготовки",
    "Овощные смеси",
    "Морепродукты обработанные",
    "Прочее"
  ];

  const units = [
    { value: "g", label: "г (граммы)" },
    { value: "kg", label: "кг (килограммы)" },
    { value: "ml", label: "мл (миллилитры)" },
    { value: "l", label: "л (литры)" },
    { value: "pcs", label: "шт (штуки)" },
  ];

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

  const filteredIngredients = selectedIngredientCategory === "all"
    ? ingredients
    : ingredients.filter(ing => ing.category === selectedIngredientCategory);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== UserRole.BUSINESS_OWNER)) {
      router.push("/auth/signin?callbackUrl=/admin/semi-finished");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === UserRole.BUSINESS_OWNER) {
      fetchSemiFinished();
      fetchIngredients();
    }
  }, [user]);

  const fetchIngredients = async () => {
    try {
      const data = await api.get<any[]>("/admin/ingredients");
      const processedIngredients = Array.isArray(data)
        ? data.map((item: { id: number; ingredientId: number; ingredient?: { name?: string; unit?: string }; priceNetto: number; nettoWeight: number; category: string }) => ({
            id: String(item.id), // StockItem ID для отображения
            ingredientId: String(item.ingredientId), // Ingredient ID для связи
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
      setLoading(true);
      const data = await api.get<SemiFinished[]>("/admin/semi-finished");
      setSemiFinished(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching semi-finished:", err);
      setError("Не удалось загрузить полуфабрикаты");
      setSemiFinished([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const totalCost = calculateTotalCost();
      const outputQty = parseFloat(formData.outputQuantity);
      const costPerUnit = outputQty > 0 ? totalCost / outputQty : 0;

      const payload = {
        name: formData.name,
        description: formData.description || null,
        outputQuantity: outputQty,
        outputUnit: formData.outputUnit,
        costPerUnit: costPerUnit,
        category: formData.category,
        ingredients: selectedIngredients.map(ing => ({
          ingredientId: ing.ingredientId,
          ingredientName: ing.ingredientName,
          quantity: ing.quantity,
          unit: ing.unit,
          pricePerUnit: ing.pricePerUnit,
          totalPrice: ing.totalPrice,
        })),
      };

      if (editingItem) {
        await api.put(`/admin/semi-finished/${editingItem.id}`, payload);
      } else {
        await api.post("/admin/semi-finished", payload);
      }

      await fetchSemiFinished();
      
      setShowForm(false);
      setEditingItem(null);
      setSelectedIngredients([]);
      setFormData({
        name: "",
        description: "",
        outputQuantity: "",
        outputUnit: "g",
        category: "Рис и крупы",
      });

      alert(editingItem ? "Полуфабрикат обновлён!" : "Полуфабрикат добавлен!");
    } catch (err) {
      console.error("Error saving semi-finished:", err);
      alert("Не удалось сохранить полуфабрикат. Возможно, функционал ещё не реализован на бэкенде.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить полуфабрикат "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/semi-finished/${id}`);
      setSemiFinished(semiFinished.filter((sf) => sf.id !== id));
      alert(`Полуфабрикат "${name}" удалён`);
    } catch (err) {
      console.error("Error deleting semi-finished:", err);
      alert("Не удалось удалить полуфабрикат");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setSelectedIngredients([]);
    setSelectedIngredientId("");
    setIngredientQuantity("");
    setSelectedIngredientCategory("all");
    setHasThermalProcessing(false);
    setFormData({
      name: "",
      description: "",
      outputQuantity: "",
      outputUnit: "g",
      category: "Рис и крупы",
    });
  };

  const handleAddIngredient = () => {
    if (!selectedIngredientId || !ingredientQuantity) {
      alert("Выберите ингредиент и укажите количество");
      return;
    }

    const ingredient = ingredients.find((ing) => ing.id === selectedIngredientId);
    if (!ingredient) return;

    if (selectedIngredients.some((si) => si.ingredientId === selectedIngredientId)) {
      alert("Этот ингредиент уже добавлен");
      return;
    }

    const quantity = parseFloat(ingredientQuantity);
    // Расчёт цены за единицу из данных склада
    // Для штучных товаров: priceNetto = цена всей партии, nettoWeight = кол-во штук
    // Для весовых: priceNetto = цена партии, nettoWeight = вес партии
    // => цена за 1 ед. = priceNetto / nettoWeight
    const pricePerUnit = ingredient.priceNetto && ingredient.nettoWeight 
      ? ingredient.priceNetto / ingredient.nettoWeight 
      : 0;
    const totalPrice = pricePerUnit * quantity;

    const newIngredient: SemiFinishedIngredient = {
      ingredientId: ingredient.ingredientId, // ✅ Используем ingredientId из Ingredient таблицы
      ingredientName: ingredient.name,
      quantity,
      unit: ingredient.unit,
      pricePerUnit,
      totalPrice,
    };

    const updatedIngredients = [...selectedIngredients, newIngredient];
    setSelectedIngredients(updatedIngredients);
    
    // Автоматически обновляем вес если термообработка отключена
    if (!hasThermalProcessing) {
      const newTotalWeight = calculateTotalWeightFromIngredients(updatedIngredients);
      setFormData({ 
        ...formData, 
        outputQuantity: newTotalWeight.toFixed(3),
        outputUnit: 'g'
      });
    }
    
    setSelectedIngredientId("");
    setIngredientQuantity("");
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    const updatedIngredients = selectedIngredients.filter((si) => si.ingredientId !== ingredientId);
    setSelectedIngredients(updatedIngredients);
    
    // Автоматически обновляем вес если термообработка отключена
    if (!hasThermalProcessing) {
      const newTotalWeight = calculateTotalWeightFromIngredients(updatedIngredients);
      setFormData({ 
        ...formData, 
        outputQuantity: newTotalWeight.toFixed(3),
        outputUnit: 'g'
      });
    }
  };

  // Рассчитать общий вес из ингредиентов
  const calculateTotalWeightFromIngredients = (ingredients: SemiFinishedIngredient[]): number => {
    return ingredients.reduce((sum, ing) => {
      // Суммируем количество всех ингредиентов кроме штучных
      if (ing.unit === 'pcs') {
        return sum;
      }
      return sum + ing.quantity;
    }, 0);
  };

  const calculateTotalCost = (): number => {
    return selectedIngredients.reduce((sum, ing) => sum + ing.totalPrice, 0);
  };

  const calculateCostPerUnit = (): number => {
    const totalCost = calculateTotalCost();
    const outputQty = parseFloat(formData.outputQuantity) || 0;
    return outputQty > 0 ? totalCost / outputQty : 0;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== UserRole.BUSINESS_OWNER) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950/20 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header с shadcn компонентами */}
        <SemiFinishedHeader
          itemsCount={semiFinished.length}
          showForm={showForm}
          onToggleForm={() => setShowForm(!showForm)}
        />

        {/* Error message */}
        {error && <ErrorMessage message={error} />}

        {/* Форма добавления/редактирования */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-purple-500">
                  {editingItem ? "Редактировать полуфабрикат" : "Добавить новый полуфабрикат"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Полуфабрикаты - это промежуточные продукты, которые используются в других блюдах
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                  📋 Основная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Название полуфабриката *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Рис для суши готовый"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Категория *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 transition"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Выход продукта */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                  📊 Выход готового продукта
                </h3>
                <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasThermalProcessing}
                      onChange={(e) => {
                        setHasThermalProcessing(e.target.checked);
                        // Если отключаем термообработку, автоматически устанавливаем вес ингредиентов
                        if (!e.target.checked && selectedIngredients.length > 0) {
                          const totalWeight = calculateTotalWeightFromIngredients(selectedIngredients);
                          setFormData({ 
                            ...formData, 
                            outputQuantity: totalWeight.toFixed(3),
                            outputUnit: 'g'
                          });
                        }
                      }}
                      className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-white">🔥 Проходит термообработку или изменяет объем</span>
                      <p className="text-xs text-gray-400 mt-1">
                        {hasThermalProcessing 
                          ? "✏️ Вы можете вручную указать вес/объем на выходе" 
                          : "⚖️ Вес рассчитывается автоматически по сумме ингредиентов"
                        }
                      </p>
                    </div>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Количество на выходе *</label>
                    <input
                      type="text"
                      required
                      inputMode="decimal"
                      value={hasThermalProcessing ? formData.outputQuantity : (selectedIngredients.length > 0 ? calculateTotalWeightFromIngredients(selectedIngredients).toFixed(3) : formData.outputQuantity)}
                      onChange={(e) => {
                        if (hasThermalProcessing) {
                          const value = e.target.value;
                          if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                            setFormData({ ...formData, outputQuantity: value.replace(',', '.') });
                          }
                        }
                      }}
                      disabled={!hasThermalProcessing && selectedIngredients.length > 0}
                      className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 transition ${
                        !hasThermalProcessing && selectedIngredients.length > 0 ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      placeholder="1000"
                    />
                    {!hasThermalProcessing && selectedIngredients.length > 0 ? (
                      <p className="text-xs text-green-400 mt-1">
                        ✅ Автоматически рассчитан: {calculateTotalWeightFromIngredients(selectedIngredients).toFixed(3)} г
                      </p>
                    ) : hasThermalProcessing ? (
                      <p className="text-xs text-orange-400 mt-1">
                        🔥 Укажите количество после обработки (может отличаться от {selectedIngredients.length > 0 ? calculateTotalWeightFromIngredients(selectedIngredients).toFixed(3) : '0'} г)
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Сколько получается готового полуфабриката
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Единица измерения *</label>
                    <select
                      required
                      value={formData.outputUnit}
                      onChange={(e) => setFormData({ ...formData, outputUnit: e.target.value })}
                      disabled={!hasThermalProcessing && selectedIngredients.length > 0}
                      className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 transition ${
                        !hasThermalProcessing && selectedIngredients.length > 0 ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      {units.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                    {!hasThermalProcessing && selectedIngredients.length > 0 && (
                      <p className="text-xs text-green-400 mt-1">
                        🔒 Автоматически установлено: граммы (г)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Состав (ингредиенты) */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                  🧮 Состав и себестоимость
                </h3>
                
                <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <p className="text-sm font-medium mb-3 text-gray-300">
                    Добавьте ингредиенты из склада
                  </p>
                  
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
                                ? "bg-cyan-500 text-white"
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium mb-2 text-gray-400">
                        2️⃣ Выберите ингредиент
                      </label>
                      <select
                        value={selectedIngredientId}
                        onChange={(e) => setSelectedIngredientId(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
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
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                      />
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
                </div>

                {selectedIngredients.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-gray-700/30 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">Ингредиент</th>
                            <th className="px-4 py-2 text-right font-medium">Количество</th>
                            <th className="px-4 py-2 text-right font-medium">Цена за ед.</th>
                            <th className="px-4 py-2 text-right font-medium">Сумма</th>
                            <th className="px-4 py-2 text-center font-medium">Действие</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                          {selectedIngredients.map((ing) => (
                            <tr key={ing.ingredientId} className="hover:bg-gray-700/30">
                              <td className="px-4 py-2 text-gray-300">{ing.ingredientName}</td>
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
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedIngredients.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-400 font-medium mb-1">Общая себестоимость</p>
                      <p className="text-lg font-bold text-blue-300">
                        {calculateTotalCost().toFixed(2)} ₽
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Цены автоматически рассчитаны из склада
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <p className="text-xs text-purple-400 font-medium mb-1">Выход продукта</p>
                      <p className="text-lg font-bold text-purple-300">
                        {formData.outputQuantity || '—'} {formData.outputUnit}
                      </p>
                    </div>
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <p className="text-xs text-cyan-400 font-medium mb-1">Себестоимость за единицу</p>
                      <p className="text-lg font-bold text-cyan-300">
                        {calculateCostPerUnit().toFixed(3)} ₽/{formData.outputUnit}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Описание */}
              <div className="border-b border-gray-700 pb-6">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                  📝 Описание и примечания
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Технология приготовления</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 transition"
                    placeholder="Промыть рис 3 раза, отварить с рисовым уксусом..."
                  />
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 md:flex-none px-8 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-semibold shadow-lg hover:shadow-cyan-500/50"
                >
                  {editingItem ? "💾 Сохранить изменения" : "✨ Добавить полуфабрикат"}
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

        {/* Список полуфабрикатов с shadcn */}
        <SemiFinishedTable
          items={semiFinished}
          onEdit={(item) => {
            setEditingItem(item);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
