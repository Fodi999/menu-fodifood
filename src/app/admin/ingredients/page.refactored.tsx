"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";

// Types
import { Ingredient, IngredientFormData, StockMovement } from "./types";

// Constants
import { UNITS, CATEGORIES } from "./constants";

// Utils
import { groupIngredientsByName } from "./utils/grouping";

// Components
import { CategoryTabs } from "./components/CategoryTabs";
import { IngredientForm } from "./components/IngredientForm";
import { IngredientsTable } from "./components/IngredientsTable";
import { MovementsModal } from "./components/MovementsModal";

export default function AdminIngredientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIngredientMovements, setSelectedIngredientMovements] = useState<{
    ingredientId: string;
    ingredientName: string;
    batchNumber: string;
    movements: StockMovement[];
  } | null>(null);
  const [showMovementsModal, setShowMovementsModal] = useState(false);

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

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?callbackUrl=/admin/ingredients");
    }
  }, [user, authLoading, router]);

  // Fetch ingredients
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchIngredients();
    }
  }, [user]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/api/admin/ingredients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.status}`);
      }

      const data = await response.json();

      // Process ingredients data
      const ingredientsPromises = Array.isArray(data)
        ? data.map(async (item) => {
            let movementsCount = 0;
            try {
              const movementsResponse = await fetch(
                `${apiUrl}/api/admin/ingredients/${item.id}/movements`,
                { headers: { Authorization: `Bearer ${token}` } }
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
              bruttoWeight: typeof item.bruttoWeight === "number" ? item.bruttoWeight : null,
              nettoWeight: typeof item.nettoWeight === "number" ? item.nettoWeight : null,
              wastePercentage: typeof item.wastePercentage === "number" ? item.wastePercentage : null,
              expiryDays: typeof item.expiryDays === "number" ? item.expiryDays : null,
              priceBrutto: typeof item.priceBrutto === "number" ? item.priceBrutto : null,
              priceNetto: typeof item.priceNetto === "number" ? item.priceNetto : null,
              createdAt: item.ingredient?.createdAt || item.updatedAt,
              updatedAt: item.updatedAt,
              movementsCount,
            };
          })
        : [];

      const ingredients = await Promise.all(ingredientsPromises);
      setIngredients(ingredients);
      setError("");
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
      setError("Не удалось загрузить ингредиенты");
    } finally {
      setLoading(false);
    }
  };

  // Group ingredients by name
  const groupedIngredients = groupIngredientsByName(ingredients);

  // Filter by category
  const filteredGroupedIngredients =
    selectedCategory === "all"
      ? groupedIngredients
      : groupedIngredients.filter((group) => {
          return group.batches.some((batch) => batch.category === selectedCategory);
        });

  // Category counts
  const getCategoryCount = (category: string): number => {
    if (category === "all") {
      return groupedIngredients.length;
    }
    return groupedIngredients.filter((group) =>
      group.batches.some((batch) => batch.category === category)
    ).length;
  };

  // Search filtered ingredients
  const searchFilteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle select existing ingredient
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      category: ingredient.category || "",
      supplier: "",
      bruttoWeight: "",
      nettoWeight: "",
      wastePercentage: "",
      expiryDays: "7",
      priceBrutto: "",
      priceNetto: "",
    });
    setSearchQuery(ingredient.name);
    setShowSearchResults(false);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const payload = {
        name: formData.name.trim(),
        unit: formData.unit,
        category: formData.category || null,
        supplier: formData.supplier.trim() || null,
        bruttoWeight: formData.bruttoWeight ? parseFloat(formData.bruttoWeight) : null,
        nettoWeight: formData.nettoWeight ? parseFloat(formData.nettoWeight) : null,
        wastePercentage: formData.wastePercentage ? parseFloat(formData.wastePercentage) : null,
        expiryDays: formData.expiryDays ? parseInt(formData.expiryDays) : null,
        priceBrutto: formData.priceBrutto ? parseFloat(formData.priceBrutto) : null,
        priceNetto: formData.priceNetto ? parseFloat(formData.priceNetto) : null,
      };

      const url = editingIngredient
        ? `${apiUrl}/api/admin/ingredients/${editingIngredient.id}`
        : `${apiUrl}/api/admin/ingredients`;

      const method = editingIngredient ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save ingredient: ${response.status}`);
      }

      await fetchIngredients();
      handleCancelForm();
    } catch (err) {
      console.error("Failed to save ingredient:", err);
      setError("Не удалось сохранить ингредиент");
    }
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIngredient(null);
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
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Handle edit
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
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить партию "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/api/admin/ingredients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ingredient: ${response.status}`);
      }

      await fetchIngredients();
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
      setError("Не удалось удалить ингредиент");
    }
  };

  // Handle view movements
  const handleViewMovements = async (id: string, name: string, batchNumber: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/api/admin/ingredients/${id}/movements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch movements: ${response.status}`);
      }

      const movements = await response.json();
      setSelectedIngredientMovements({
        ingredientId: id,
        ingredientName: name,
        batchNumber: batchNumber || "Без номера",
        movements: Array.isArray(movements) ? movements : [],
      });
      setShowMovementsModal(true);
    } catch (err) {
      console.error("Failed to fetch movements:", err);
      setError("Не удалось загрузить историю поступлений");
    }
  };

  // Toggle group
  const toggleGroup = (name: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedGroups(newExpanded);
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  // Not authorized
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад в админ панель</span>
            </Link>
            <h1 className="text-3xl font-bold">Склад сырья</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span>{showForm ? "Скрыть форму" : "Добавить партию"}</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Category Tabs */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          getCategoryCount={getCategoryCount}
        />

        {/* Form */}
        {showForm && (
          <IngredientForm
            formData={formData}
            setFormData={setFormData}
            editingIngredient={editingIngredient}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSearchResults={showSearchResults}
            setShowSearchResults={setShowSearchResults}
            filteredIngredients={searchFilteredIngredients}
            onSelectIngredient={handleSelectIngredient}
          />
        )}

        {/* Ingredients Table */}
        <IngredientsTable
          groupedIngredients={filteredGroupedIngredients}
          expandedGroups={expandedGroups}
          categories={CATEGORIES}
          units={UNITS}
          onToggleGroup={toggleGroup}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMovements={handleViewMovements}
        />

        {/* Empty state */}
        {filteredGroupedIngredients.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {selectedCategory === "all"
              ? "Нет ингредиентов. Добавьте первый ингредиент."
              : "Нет ингредиентов в этой категории."}
          </div>
        )}

        {/* Movements Modal */}
        <MovementsModal
          isOpen={showMovementsModal}
          ingredientName={selectedIngredientMovements?.ingredientName || ""}
          batchNumber={selectedIngredientMovements?.batchNumber || ""}
          movements={selectedIngredientMovements?.movements || []}
          onClose={() => {
            setShowMovementsModal(false);
            setSelectedIngredientMovements(null);
          }}
        />
      </div>
    </div>
  );
}
