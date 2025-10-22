"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, TrendingUp, Users, Coins, Zap } from "lucide-react";
import { bankApi } from "@/lib/rust-api";
import type { BankStats } from "@/types/bank";

/**
 * 🏦 Компонент статистики банка FODI
 * 
 * Показывает:
 * - Общий объем токенов
 * - Количество транзакций
 * - Количество пользователей
 * - Выпущенные награды
 */
export function BankStatsSection() {
  const [stats, setStats] = useState<BankStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    // Обновляем каждые 30 секунд
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const data = await bankApi.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load bank stats:', err);
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !stats) {
    return null; // Не показываем ошибку, просто скрываем секцию
  }

  // Форматирование больших чисел
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toString();
  };

  // Форматирование токенов (делим на 1_000_000_000 для отображения в FODI)
  const formatTokens = (amount: number): string => {
    const fodi = amount / 1_000_000_000;
    return formatNumber(fodi);
  };

  const statCards = [
    {
      icon: Coins,
      label: "Общий объем",
      value: `${formatTokens(stats.bank.net_supply)} FODI`,
      color: "from-orange-500 to-yellow-500",
      iconColor: "text-orange-400",
    },
    {
      icon: TrendingUp,
      label: "Транзакций",
      value: formatNumber(stats.bank.total_transactions),
      color: "from-green-500 to-emerald-500",
      iconColor: "text-green-400",
    },
    {
      icon: Users,
      label: "Пользователей",
      value: formatNumber(stats.bank.unique_users),
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-400",
    },
    {
      icon: Zap,
      label: "Выпущено наград",
      value: `${formatTokens(stats.bank.total_rewards_issued)} FODI`,
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <section className="py-16 px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              FODI Bank
            </span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-3">
            Децентрализованный банк токенов FODI на Solana Devnet
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-300">
              Network: <span className="text-green-400 font-medium">{stats.solana.network}</span>
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 p-5 backdrop-blur-sm hover:border-gray-600 transition-all duration-300">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className="relative mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} p-[1px]`}>
                    <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-5 blur-xl group-hover:opacity-20 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mint Address */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/30 border border-gray-700">
            <span className="text-xs text-gray-500">Mint:</span>
            <code className="text-xs text-orange-400 font-mono">
              {stats.solana.mint_address.slice(0, 6)}...{stats.solana.mint_address.slice(-6)}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(stats.solana.mint_address)}
              className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
              title="Копировать адрес"
            >
              📋
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
