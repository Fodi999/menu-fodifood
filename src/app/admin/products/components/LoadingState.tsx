import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 flex items-center justify-center">
      <Card className="w-64 bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-gray-400">Загрузка продуктов...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
