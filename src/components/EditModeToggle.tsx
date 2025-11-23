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
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50"
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
              className="bg-card border-2 border-primary/20 rounded-lg shadow-2xl p-2.5 sm:p-4 w-[160px] sm:w-auto sm:max-w-[280px]"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-center justify-center">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span>Просмотр</span>
                </div>
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-input rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 box-border"
                />
                <Button
                  onClick={handleUnlock}
                  size="sm"
                  className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9 w-full"
                >
                  <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Открыть</span>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex gap-1.5 sm:gap-2"
            >
              <Button
                onClick={toggleEditMode}
                size="sm"
                variant={isEditMode ? "default" : "outline"}
                className="gap-1.5 shadow-lg text-xs sm:text-sm h-10 sm:h-10 px-3 sm:px-4 touch-manipulation"
              >
                {isEditMode ? (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Сохранить</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Редактировать</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  if (confirm("Сбросить все данные к значениям по умолчанию (Dmytro Fomin)?")) {
                    resetToDefault();
                  }
                }}
                size="sm"
                variant="secondary"
                className="shadow-lg h-10 w-10 p-0 touch-manipulation"
                title="Сбросить к значениям по умолчанию"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                onClick={handleLock}
                size="sm"
                variant="destructive"
                className="shadow-lg h-10 w-10 p-0 touch-manipulation"
                title="Заблокировать"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
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
            className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground py-2 sm:py-3 px-3 sm:px-4 z-50 shadow-lg"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-xs sm:text-sm md:text-base block sm:inline truncate">
                    Режим редактирования
                  </span>
                  <span className="hidden md:inline text-xs opacity-80 ml-2">
                    Нажмите на элементы для изменения
                  </span>
                </div>
              </div>
              <Button
                onClick={toggleEditMode}
                size="sm"
                variant="secondary"
                className="gap-1 sm:gap-2 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0 touch-manipulation"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Выйти</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
