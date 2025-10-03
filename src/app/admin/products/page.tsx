"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Plus, X, ArrowLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  weight: string | null;
  category: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    weight: "",
    category: "Роллы",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      // Проверяем, что data это массив
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Products data is not an array:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          name: "",
          description: "",
          price: "",
          imageUrl: "",
          weight: "",
          category: "Роллы",
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500">Управление продуктами</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Отменить" : "Добавить продукт"}
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

        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Новый продукт</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Название *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Категория *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Роллы</option>
                    <option>Суши</option>
                    <option>Сеты</option>
                    <option>Напитки</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Цена (₽) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Вес/объем
                  </label>
                  <input
                    type="text"
                    placeholder="250г"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL изображения
                  </label>
                  <input
                    type="text"
                    placeholder="/products/product.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Создать продукт
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6">Название</th>
                    <th className="text-left py-4 px-6">Категория</th>
                    <th className="text-left py-4 px-6">Цена</th>
                    <th className="text-left py-4 px-6">Вес</th>
                    <th className="text-left py-4 px-6">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {(products || []).map((product) => (
                    <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-400">{product.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">{product.category}</td>
                      <td className="py-4 px-6 font-semibold text-orange-500">
                        {Number(product.price).toFixed(0)}₽
                      </td>
                      <td className="py-4 px-6 text-gray-400">{product.weight || "—"}</td>
                      <td className="py-4 px-6">
                        <button className="text-blue-400 hover:text-blue-300 mr-3">
                          Редактировать
                        </button>
                        <button className="text-red-400 hover:text-red-300">Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
