import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: LucideIcon;
  trendUp?: boolean;
}

export default function DashboardCard({ 
  title, 
  value, 
  trend, 
  icon: Icon,
  trendUp = true 
}: DashboardCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50 hover:border-gray-700/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <h2 className="text-3xl font-bold text-white">{value}</h2>
            {trend && (
              <p className={`text-sm font-medium ${
                trendUp ? 'text-green-400' : 'text-red-400'
              }`}>
                {trend}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
