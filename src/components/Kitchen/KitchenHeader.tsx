import { Button } from '@/components/ui/button';
import { ChefHat, Volume2, VolumeX, Bell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface KitchenHeaderProps {
  orderCount: number;
  isConnected: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTestSound: () => void;
}

export function KitchenHeader({
  orderCount,
  isConnected,
  soundEnabled,
  onToggleSound,
  onTestSound
}: KitchenHeaderProps) {
  return (
    <div className="mb-4 md:mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/dashboard"
            className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">Monitor Kuchni</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                Aktywne zamówienia: <span className="font-bold text-orange-600 dark:text-orange-400">{orderCount}</span>
              </p>
              {isConnected && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={soundEnabled ? "default" : "outline"}
            size="lg"
            onClick={onToggleSound}
            className="gap-2 shadow-md"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="hidden sm:inline">Dźwięk</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onTestSound();
              toast.info('🔊 Test dźwięku');
            }}
            disabled={!soundEnabled}
            className="gap-1.5 shadow-md hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Przetestuj dźwięk powiadomienia"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline text-xs">Test</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
