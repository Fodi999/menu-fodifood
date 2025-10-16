"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import api from "@/lib/api";

// Импорт компонентов
import {
  ProductsHeader,
  ProductsTable,
  LoadingState,
  ErrorMessage,
  ProductForm,
} from "./components";

// Импорт типов
import type {
  Product,
} from "./types";

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Auth check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== UserRole.BUSINESS_OWNER)) {
      router.push("/auth/signin?callbackUrl=/admin/products");
    }
  }, [user, authLoading, router]);

  // Fetch products
  useEffect(() => {
    if (user && user.role === UserRole.BUSINESS_OWNER) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get<Product[]>("/admin/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Не удалось загрузить продукты");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Удалить продукт "${productName}"?`)) return;

    try {
      await api.delete(`/admin/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
      alert(`Продукт "${productName}" удалён`);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Не удалось удалить продукт");
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      await api.put(`/admin/products/${product.id}`, {
        ...product,
        isVisible: !product.isVisible,
      });

      await fetchProducts();
    } catch (err) {
      console.error("Error updating visibility:", err);
      alert("Не удалось изменить видимость");
    }
  };

  // Render
  if (authLoading || loading) return <LoadingState />;
  if (!user || user.role !== UserRole.BUSINESS_OWNER) return null;

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
            <ProductForm
              product={editingProduct}
              onSubmit={async (data) => {
                try {
                  if (editingProduct) {
                    await api.put(`/admin/products/${editingProduct.id}`, data);
                  } else {
                    await api.post("/admin/products", data);
                  }

                  await fetchProducts();
                  setShowForm(false);
                  setEditingProduct(null);
                  alert(editingProduct ? "Продукт обновлён" : "Продукт добавлен");
                } catch (err) {
                  console.error("Error saving product:", err);
                  throw err;
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
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
