"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2, Loader2, Package2 } from "lucide-react";

type Ingredient = {
  id: string;
  name: string;
  unit: string; // "g" | "ml" | "pcs"
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier?: string | null;
  createdAt: string;
  updatedAt: string;
};

type IngredientFormData = {
  name: string;
  unit: string;
  currentStock: string;
  minStock: string;
  maxStock: string;
  costPerUnit: string;
  supplier: string;
};

export default function AdminIngredientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState<IngredientFormData>({
    name: "",
    unit: "g",
    currentStock: "0",
    minStock: "10",
    maxStock: "1000",
    costPerUnit: "0",
    supplier: "",
  });

  const units = [
    { value: "g", label: "Граммы (г)" },
    { value: "ml", label: "Миллилитры (мл)" },
    { value: "pcs", label: "Штуки (шт)" },
  ];

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?callbackUrl=/admin/ingredients");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchIngredients();
    }
  }, [user]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
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
      console.log("📦 Ingredients data:", data);
      setIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
      setError("Не удалось загрузить ингредиенты");
      setIngredients([]);
    } finally {
      setLoading(false);
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
          currentStock: parseFloat(formData.currentStock),
          minStock: parseFloat(formData.minStock),
          maxStock: parseFloat(formData.maxStock),
          costPerUnit: parseFloat(formData.costPerUnit),
          supplier: formData.supplier || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save ingredient");
      }

      await fetchIngredients();
      
      setShowForm(false);
      setEditingIngredient(null);
      setFormData({
        name: "",
        unit: "g",
        currentStock: "0",
        minStock: "10",
        maxStock: "1000",
        costPerUnit: "0",
        supplier: "",
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
      currentStock: ingredient.currentStock.toString(),
      minStock: ingredient.minStock.toString(),
      maxStock: ingredient.maxStock.toString(),
      costPerUnit: ingredient.costPerUnit.toString(),
      supplier: ingredient.supplier || "",
    });
    setShowForm(true);
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
    setFormData({
      name: "",
      unit: "g",
      currentStock: "0",
      minStock: "10",
      maxStock: "1000",
      costPerUnit: "0",
      supplier: "",
    });
  };

  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.currentStock <= ingredient.minStock) {
      return { color: "text-red-500", bg: "bg-red-500/20", label: "Критический уровень" };
    } else if (ingredient.currentStock <= ingredient.minStock * 2) {
      return { color: "text-yellow-500", bg: "bg-yellow-500/20", label: "Низкий запас" };
    } else {
      return { color: "text-green-500", bg: "bg-green-500/20", label: "В наличии" };
    }
  };

  const getUnitLabel = (unit: string) => {
    const unitObj = units.find((u) => u.value === unit);
    return unitObj?.label.split(" ")[1] || unit;
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

        {/* Форма */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingIngredient ? "Редактировать ингредиент" : "Добавить новый ингредиент"}
            </h2>
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

                <div>
                  <label className="block text-sm font-medium mb-2">Текущий запас *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Минимальный запас *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Максимальный запас *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Стоимость за единицу (₽) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
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
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Название</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Запас</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Мин/Макс</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Стоимость</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Поставщик</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Статус</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {ingredients.map((ingredient) => {
                    const status = getStockStatus(ingredient);
                    return (
                      <tr key={ingredient.id} className="hover:bg-gray-700/50 transition">
                        <td className="px-6 py-4">
                          <p className="font-medium">{ingredient.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold">
                            {ingredient.currentStock} {getUnitLabel(ingredient.unit)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          <p className="text-sm">
                            {ingredient.minStock} / {ingredient.maxStock} {getUnitLabel(ingredient.unit)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-orange-500">
                            {ingredient.costPerUnit} ₽/{getUnitLabel(ingredient.unit)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {ingredient.supplier || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(ingredient)}
                              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              title="Редактировать"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(ingredient.id, ingredient.name)}
                              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
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
            <p className="text-gray-400 text-sm">Критический уровень</p>
            <p className="text-2xl font-bold text-red-500">
              {ingredients.filter((i) => i.currentStock <= i.minStock).length}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Низкий запас</p>
            <p className="text-2xl font-bold text-yellow-500">
              {ingredients.filter((i) => i.currentStock > i.minStock && i.currentStock <= i.minStock * 2).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
