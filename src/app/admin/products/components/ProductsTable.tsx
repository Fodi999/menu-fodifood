import Image from "next/image";
import { Package, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string, productName: string) => void;
  onToggleVisibility: (product: Product) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onToggleVisibility,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
        <CardContent className="pt-12 pb-12 text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-base sm:text-lg">
            Продукты на складе отсутствуют
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Мобильная версия - карточки */}
      <div className="block lg:hidden space-y-3 sm:space-y-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="bg-gray-800/50 border-gray-700 backdrop-blur-xl overflow-hidden"
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex gap-3 sm:gap-4">
                {/* Изображение */}
                <div className="flex-shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {product.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs whitespace-nowrap ${
                        product.isVisible !== false
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {product.isVisible !== false ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Видимый
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Скрытый
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                        {product.category}
                      </Badge>
                      <span className="font-semibold text-orange-500">
                        {product.price} ₽
                      </span>
                    </div>
                    {product.weight && (
                      <div>Вес: {product.weight}</div>
                    )}
                    {product.description && (
                      <p className="text-xs line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Действия */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => onToggleVisibility(product)}
                      size="sm"
                      variant="outline"
                      className={`flex-1 text-xs ${
                        product.isVisible !== false
                          ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                          : "border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                      }`}
                    >
                      {product.isVisible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      onClick={() => onEdit(product)}
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-xs"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Изменить
                    </Button>
                    <Button
                      onClick={() => onDelete(product.id, product.name)}
                      size="sm"
                      variant="destructive"
                      className="flex-1 text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Десктопная версия - таблица */}
      <Card className="hidden lg:block bg-gray-800/50 border-gray-700 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Фото
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Название
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Категория
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Цена
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Вес
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300">
                  Статус
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-700/30 transition text-white"
                >
                  <td className="px-4 py-3">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {product.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-orange-500 text-sm">
                      {product.price} ₽
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {product.weight || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs cursor-pointer ${
                        product.isVisible !== false
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}
                      onClick={() => onToggleVisibility(product)}
                    >
                      {product.isVisible !== false ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Видимый
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Скрытый
                        </>
                      )}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() => onEdit(product)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => onDelete(product.id, product.name)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
