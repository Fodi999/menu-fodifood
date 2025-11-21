"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useResume } from "@/contexts/ResumeContext";
import { Edit3, Save, X, Lock, Unlock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function EditModeToggle() {
  const { isEditMode, toggleEditMode, resetToDefault } = useResume();
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const ADMIN_PASSWORD = "admin123"; // В продакшене использовать env переменную

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLocked(false);
      toggleEditMode();
      setPassword("");
    } else {
      alert("Неверный пароль!");
      setPassword("");
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    if (isEditMode) {
      toggleEditMode();
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-card border-2 border-primary/20 rounded-lg shadow-2xl p-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Режим просмотра</span>
                </div>
                <input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  onClick={handleUnlock}
                  size="sm"
                  className="gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Разблокировать
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex gap-2"
            >
              <Button
                onClick={toggleEditMode}
                size="lg"
                variant={isEditMode ? "default" : "outline"}
                className="gap-2 shadow-lg"
              >
                {isEditMode ? (
                  <>
                    <Save className="w-5 h-5" />
                    Сохранить
                  </>
                ) : (
                  <>
                    <Edit3 className="w-5 h-5" />
                    Редактировать
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  if (confirm("Сбросить все данные к значениям по умолчанию (Dmytro Fomin)?")) {
                    resetToDefault();
                  }
                }}
                size="lg"
                variant="secondary"
                className="gap-2 shadow-lg"
                title="Сбросить к значениям по умолчанию"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleLock}
                size="lg"
                variant="destructive"
                className="gap-2 shadow-lg"
              >
                <Lock className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Индикатор режима редактирования */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground py-3 px-4 z-50 shadow-lg"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Режим редактирования активен</span>
                <span className="text-xs opacity-80">
                  Нажмите на элементы для изменения
                </span>
              </div>
              <Button
                onClick={toggleEditMode}
                size="sm"
                variant="secondary"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Выйти
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
