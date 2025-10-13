import Link from "next/link";
import { Package, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsHeaderProps {
  productsCount: number;
  onAddProduct: () => void;
}

export function ProductsHeader({ productsCount, onAddProduct }: ProductsHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 backdrop-blur-xl">
          <Package className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Управление складом
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Всего продуктов: {productsCount}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
        <Button
          onClick={onAddProduct}
          className="flex-1 sm:flex-initial bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
          size="sm"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
          Добавить продукт
        </Button>
        
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-initial border-orange-500/30 bg-gray-900/50 text-white hover:bg-orange-500/10 hover:text-orange-500 backdrop-blur-xl transition-colors text-xs sm:text-sm"
        >
          <Link href="/admin">
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            Назад
          </Link>
        </Button>
      </div>
    </div>
  );
}
