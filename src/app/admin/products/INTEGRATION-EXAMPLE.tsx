// Пример интеграции компонентов в page.tsx

/*
БЫЛО (1406 строк):
- Все типы в одном файле
- Вся разметка в одном файле
- Сложно читать и поддерживать

СТАЛО (разбито на модули):
- types.ts - типы и константы
- components/ProductsHeader.tsx - заголовок
- components/ProductsTable.tsx - таблица с адаптивностью
- components/LoadingState.tsx - загрузка
- components/ErrorMessage.tsx - ошибки
- components/ProductForm.tsx - форма (TODO)
*/

// ====================================
// ОСНОВНОЙ ФАЙЛ page.tsx
// ====================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Импорт компонентов
import {
  ProductsHeader,
  ProductsTable,
  LoadingState,
  ErrorMessage,
} from "./components";

// Импорт типов
import {
  Product,
} from './types'

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Auth check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?callbackUrl=/admin/products");
    }
  }, [user, authLoading, router]);

  // Fetch products
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProducts();
    }
  }, [user]);

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

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Не удалось загрузить продукты");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    setShowForm(true);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Удалить продукт "${productName}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setProducts(products.filter((p) => p.id !== productId));
      alert(`Продукт "${productName}" удалён`);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Не удалось удалить продукт");
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...product,
            isVisible: !product.isVisible,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      await fetchProducts();
    } catch (err) {
      console.error("Error updating visibility:", err);
      alert("Не удалось изменить видимость");
    }
  };

  // Render
  if (authLoading || loading) return <LoadingState />;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Заголовок с кнопками */}
        <ProductsHeader
          productsCount={products.length}
          onAddProduct={() => setShowForm(true)}
        />

        {/* Ошибки */}
        {error && <ErrorMessage message={error} />}

        {/* Форма добавления/редактирования */}
        {showForm && (
          <div className="mb-6">
            {/* TODO: Компонент ProductForm */}
            <p className="text-white">Форма добавления продукта (в разработке)</p>
          </div>
        )}

        {/* Таблица продуктов */}
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
        />

        {/* Футер */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            Всего продуктов на складе:{" "}
            <span className="font-bold text-orange-500">{products.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ====================================
// ИТОГ:
// ====================================
// • Главный файл уменьшен с 1406 до ~170 строк
// • Легко читается и поддерживается
// • Все компоненты переиспользуемые
// • Адаптивность встроена в каждый компонент
// • Готово к дальнейшему расширению
