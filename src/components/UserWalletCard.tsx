"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Copy, CheckCircle2 } from "lucide-react";
import { bankApi } from "@/lib/rust-api";
import type { FullBalance } from "@/types/bank";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface UserWalletCardProps {
  userId: string;
}

/**
 * 💰 Компонент кошелька пользователя
 * 
 * Показывает:
 * - Баланс FODI токенов (банк + Solana)
 * - Доступные и заблокированные токены
 * - Статус сети
 * - Копирование user_id
 */
export function UserWalletCard({ userId }: UserWalletCardProps) {
  const [balance, setBalance] = useState<FullBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBalance();
    // Обновляем каждые 15 секунд
    const interval = setInterval(loadBalance, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadBalance = async () => {
    try {
      const data = await bankApi.getBalance(userId);
      setBalance(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load balance:', err);
      setError(err.message || 'Не удалось загрузить баланс');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUserId = async () => {
    await navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Форматирование токенов (делим на 1_000_000_000 для отображения в FODI)
  const formatTokens = (amount: number): string => {
    const fodi = amount / 1_000_000_000;
    return fodi.toFixed(2);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !balance) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-orange-400" />
            Кошелёк FODI
          </CardTitle>
          <CardDescription className="text-gray-400">
            Ваш баланс токенов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-400 text-sm">
            {error || "Не удалось загрузить баланс"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalFodi = formatTokens(balance.total_balance);
  const availableFodi = formatTokens(balance.bank_balance.available);
  const lockedFodi = formatTokens(balance.bank_balance.locked);

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 blur-3xl pointer-events-none" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 p-[1px]">
                <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              Кошелёк FODI
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Ваш баланс токенов
            </CardDescription>
          </div>
          
          {/* Network Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">{balance.network}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Total Balance */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              {totalFodi}
            </span>
            <span className="text-2xl font-semibold text-gray-400">FODI</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Общий баланс</span>
          </div>
        </div>

        {/* Available & Locked */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Доступно</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {availableFodi}
            </div>
            <div className="text-xs text-gray-500 mt-1">FODI</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">Заблокировано</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {lockedFodi}
            </div>
            <div className="text-xs text-gray-500 mt-1">FODI</div>
          </div>
        </div>

        {/* Solana Balance */}
        {balance.solana_balance !== null && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-purple-400 mb-1">Solana баланс</div>
                <div className="text-2xl font-bold text-white">
                  {formatTokens(balance.solana_balance)}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl">◎</span>
              </div>
            </div>
          </div>
        )}

        {/* User ID */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500">ID кошелька</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-400 font-mono overflow-x-auto">
              {userId}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyUserId}
              className="border-gray-700 hover:border-orange-500 shrink-0"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            disabled
          >
            Пополнить
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-700 hover:border-orange-500"
            disabled
          >
            Перевести
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Кнопки "Пополнить" и "Перевести" скоро будут активны
        </div>
      </CardContent>
    </Card>
  );
}
