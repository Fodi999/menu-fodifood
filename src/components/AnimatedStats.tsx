"use client";

import { Store, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import type { Business } from "@/types/business";

interface AnimatedStatsProps {
  businesses: Business[];
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay = 0,
}: {
  icon: any;
  value: number;
  label: string;
  color: string;
  delay?: number;
}) {
  const animatedValue = useCountUp(value, 2000);
  
  const colorClasses = {
    orange: {
      icon: "text-orange-500",
      text: "text-orange-400",
      border: "hover:border-orange-500/30 hover:shadow-orange-500/10",
      glow: "from-orange-500/5 via-orange-500/10 to-transparent",
    },
    blue: {
      icon: "text-blue-500",
      text: "text-blue-400",
      border: "hover:border-blue-500/30 hover:shadow-blue-500/10",
      glow: "from-blue-500/5 via-blue-500/10 to-transparent",
    },
    green: {
      icon: "text-green-500",
      text: "text-green-400",
      border: "hover:border-green-500/30 hover:shadow-green-500/10",
      glow: "from-green-500/5 via-green-500/10 to-transparent",
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      className={`rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-800/50 shadow-2xl p-6 transition-all duration-300 group relative overflow-hidden ${colors.border}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      {/* Soft glow inside card */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        initial={false}
      />
      
      <div className="space-y-3 relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.icon} mx-auto transition-transform`} />
        </motion.div>
        
        <motion.p 
          className={`text-2xl sm:text-3xl font-bold ${colors.text}`}
          key={animatedValue}
        >
          {animatedValue.toLocaleString()}
        </motion.p>
        
        <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export function AnimatedStats({ businesses }: AnimatedStatsProps) {
  const totalSubscribers = businesses.reduce((sum, b) => sum + (b.subscribers_count || 0), 0);
  const averageRating = businesses.length > 0
    ? businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mt-12">
      <StatCard
        icon={Store}
        value={businesses.length}
        label="Активных бизнесов"
        color="orange"
        delay={0.1}
      />
      
      <StatCard
        icon={Users}
        value={totalSubscribers}
        label="Подписчиков"
        color="blue"
        delay={0.2}
      />
      
      <StatCard
        icon={TrendingUp}
        value={Math.round(averageRating * 10) / 10}
        label="Средний рейтинг"
        color="green"
        delay={0.3}
      />
    </div>
  );
}
