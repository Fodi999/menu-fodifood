'use client';

import { useState, useEffect } from 'react';
import { Crown, TrendingUp, Gift, Award, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface LoyaltyTier {
  id: string;
  level: number;
  name: string;
  color: string;
  minPoints: number;
  icon: React.ReactNode;
  benefits: string[];
  discountPercentage: number;
}

export interface LoyaltyAccount {
  userId: string;
  currentPoints: number;
  lifetimePoints: number;
  tierId: string;
  lastActivity: string;
}

interface LoyaltyDashboardProps {
  account: LoyaltyAccount;
  compact?: boolean;
}

// Уровни лояльности
export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    level: 1,
    name: 'Brązowy',
    color: '#CD7F32',
    minPoints: 0,
    icon: <Award className="w-6 h-6" />,
    benefits: ['1% cashback w punktach', 'Newsletter z promocjami'],
    discountPercentage: 1,
  },
  {
    id: 'silver',
    level: 2,
    name: 'Srebrny',
    color: '#C0C0C0',
    minPoints: 500,
    icon: <Sparkles className="w-6 h-6" />,
    benefits: [
      '2% cashback w punktach',
      'Priorytet w dostawie',
      'Darmowa dostawa od 80 zł',
      'Ekskluzywne promocje',
    ],
    discountPercentage: 2,
  },
  {
    id: 'gold',
    level: 3,
    name: 'Złoty',
    color: '#FFD700',
    minPoints: 2000,
    icon: <Crown className="w-6 h-6" />,
    benefits: [
      '5% cashback w punktach',
      'Darmowa dostawa od 50 zł',
      'Urodzinowa niespodzianka',
      'Wczesny dostęp do nowości',
      'Podwójne punkty w urodziny',
    ],
    discountPercentage: 5,
  },
  {
    id: 'platinum',
    level: 4,
    name: 'Platynowy',
    color: '#E5E4E2',
    minPoints: 5000,
    icon: <Gift className="w-6 h-6" />,
    benefits: [
      '10% cashback w punktach',
      'Zawsze darmowa dostawa',
      'Osobisty menedżer',
      'VIP eventy i degustacje',
      'x2 punkty za każde zamówienie',
      'Ekskluzywne menu items',
    ],
    discountPercentage: 10,
  },
];

export function LoyaltyDashboard({ account, compact = false }: LoyaltyDashboardProps) {
  const currentTier = LOYALTY_TIERS.find((t) => t.id === account.tierId) || LOYALTY_TIERS[0];
  const nextTier = LOYALTY_TIERS.find((t) => t.level === currentTier.level + 1);

  const pointsToNextTier = nextTier ? nextTier.minPoints - account.currentPoints : 0;
  const progressToNextTier = nextTier
    ? ((account.currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  if (compact) {
    // Компактная версия для sidebar/header
    return (
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentTier.color }}
            >
              {currentTier.icon}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="font-bold" style={{ color: currentTier.color }}>
                {currentTier.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Punkty</div>
            <div className="font-bold text-lg">{account.currentPoints}</div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <Progress value={progressToNextTier} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Jeszcze <strong>{pointsToNextTier} pkt</strong> do poziomu {nextTier.name}
            </p>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full mt-3" asChild>
          <Link href="/loyalty">
            Zobacz nagrody
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    );
  }

  // Полная версия для dedicated страницы
  return (
    <div className="space-y-6">
      {/* Текущий статус */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTier.color}15 0%, ${currentTier.color}05 100%)`,
          borderColor: currentTier.color,
          borderWidth: 2,
        }}
      >
        {/* Декоративные элементы */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: currentTier.color }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Twój status</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: currentTier.color }}
                >
                  {currentTier.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: currentTier.color }}>
                    {currentTier.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Poziom {currentTier.level} z {LOYALTY_TIERS.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Twoje punkty</p>
              <p className="text-4xl font-bold text-primary">{account.currentPoints}</p>
              <p className="text-xs text-muted-foreground">
                Lifetime: {account.lifetimePoints} pkt
              </p>
            </div>
          </div>

          {/* Progress do następnego уровня */}
          {nextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Postęp do poziomu {nextTier.name}</span>
                <span className="font-semibold">
                  {Math.round(progressToNextTier)}%
                </span>
              </div>
              <Progress value={progressToNextTier} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Jeszcze <strong className="text-foreground">{pointsToNextTier} punktów</strong> do
                następnego poziomu
              </p>
            </div>
          )}

          {nextTier === undefined && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Osiągnąłeś maksymalny poziom! 🎉</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Korzyści na obecnym poziomie */}
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Twoje korzyści
        </h3>
        <div className="grid gap-3">
          {currentTier.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 text-sm"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${currentTier.color}30` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTier.color }} />
              </div>
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wszystkie poziomy */}
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Wszystkie poziomy
        </h3>
        <div className="space-y-3">
          {LOYALTY_TIERS.map((tier) => {
            const isCurrentTier = tier.id === currentTier.id;
            const isUnlocked = account.currentPoints >= tier.minPoints;

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrentTier
                    ? 'border-primary bg-primary/5'
                    : isUnlocked
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isUnlocked ? 'text-white' : 'text-muted-foreground'
                      }`}
                      style={{
                        backgroundColor: isUnlocked ? tier.color : '#ddd',
                      }}
                    >
                      {tier.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{tier.name}</span>
                        {isCurrentTier && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            Aktualny
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tier.minPoints === 0 ? 'Start' : `Od ${tier.minPoints} punktów`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: tier.color }}>
                      {tier.discountPercentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">cashback</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pl-13">
                  {tier.benefits.slice(0, 2).join(' • ')}
                  {tier.benefits.length > 2 && ` +${tier.benefits.length - 2} więcej`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Button className="flex-1" size="lg" asChild>
          <Link href="/loyalty/rewards">
            <Gift className="w-5 h-5 mr-2" />
            Wymień punkty
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/loyalty/history">Historia</Link>
        </Button>
      </div>
    </div>
  );
}
