"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { Menu, Lock, Unlock, Edit3, Save, RotateCcw, Palette, Sun, Moon, Sparkles, Minimize2, Layers, Flame, Droplets } from "lucide-react";
import { useResume, BackgroundTheme } from "@/contexts/ResumeContext";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { id: "hero", label: "Start" },
  { id: "skills", label: "Umiejętności" },
  { id: "experience", label: "Doświadczenie" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Kontakt" },
];

const themeOptions: { id: BackgroundTheme; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "default", label: "Стандартная", icon: <Palette className="w-4 h-4" />, description: "Классический вид" },
  { id: "elegant", label: "Элегантная", icon: <Sparkles className="w-4 h-4" />, description: "Светлая с градиентами" },
  { id: "dark", label: "Темная", icon: <Moon className="w-4 h-4" />, description: "Темный фон" },
  { id: "minimal", label: "Минимал", icon: <Minimize2 className="w-4 h-4" />, description: "Простой дизайн" },
  { id: "gradient", label: "Градиент", icon: <Layers className="w-4 h-4" />, description: "Яркие градиенты" },
  { id: "warm", label: "Теплая", icon: <Flame className="w-4 h-4" />, description: "Теплые цвета" },
  { id: "cool", label: "Холодная", icon: <Droplets className="w-4 h-4" />, description: "Холодные цвета" },
];

export function ResumeNavbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Edit mode state
  const { isEditMode, toggleEditMode, resetToDefault, backgroundTheme, setBackgroundTheme } = useResume();
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const ADMIN_PASSWORD = "admin123";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          const offsetBottom = offsetTop + section.element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => scrollToSection("hero")}
            className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ИИ
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => scrollToSection(item.id)}
                className="relative"
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-primary rounded-md -z-10"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
              </Button>
            ))}
            
            {/* Desktop Settings Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  {isEditMode ? (
                    <Edit3 className="h-5 w-5 text-primary animate-pulse" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[350px]">
                <SheetHeader>
                  <SheetTitle>Настройки</SheetTitle>
                  <SheetDescription>
                    Управление режимом редактирования
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col gap-4 mt-6">
                  {isLocked ? (
                    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Lock className="w-4 h-4 text-primary" />
                        <span>Режим просмотра</span>
                      </div>
                      <Input
                        type="password"
                        placeholder="Введите пароль администратора"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                        className="h-10"
                      />
                      <Button
                        onClick={handleUnlock}
                        size="default"
                        className="gap-2 h-10"
                      >
                        <Unlock className="w-4 h-4" />
                        Разблокировать
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Пароль по умолчанию: admin123
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="p-4 border rounded-lg bg-primary/5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-3 h-3 rounded-full ${isEditMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                          <span className="font-medium">
                            {isEditMode ? 'Редактирование включено' : 'Режим просмотра'}
                          </span>
                        </div>
                        {isEditMode ? (
                          <Button
                            onClick={toggleEditMode}
                            variant="default"
                            className="gap-2 w-full h-10 bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                            Выйти из редактирования
                          </Button>
                        ) : (
                          <Button
                            onClick={toggleEditMode}
                            variant="outline"
                            className="gap-2 w-full h-10"
                          >
                            <Edit3 className="w-4 h-4" />
                            Включить редактирование
                          </Button>
                        )}
                      </div>

                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <h4 className="text-xs font-semibold mb-2">ℹ️ Справка</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Кликайте на элементы для редактирования</li>
                          <li>• Enter - сохранить, Esc - отменить</li>
                          <li>• Данные сохраняются в браузере</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] overflow-y-auto max-h-screen">
                <SheetHeader className="pb-4">
                  <SheetTitle className="text-lg">Menu</SheetTitle>
                  <SheetDescription className="text-xs">
                    Nawigacja i ustawienia
                  </SheetDescription>
                </SheetHeader>
                
                {/* Navigation */}
                <div className="flex flex-col gap-1.5 mt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1">Nawigacja</h3>
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full justify-start h-9 text-sm"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* Edit Mode Controls */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1">Режим редактирования</h3>
                  
                  {isLocked ? (
                    <div className="flex flex-col gap-2 p-2.5 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 text-xs font-medium mb-0.5">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <span>Просмотр</span>
                      </div>
                      <Input
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                        className="h-8 text-sm"
                      />
                      <Button
                        onClick={handleUnlock}
                        size="sm"
                        className="gap-2 h-8 text-xs"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        Открыть
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 px-2">
                      {isEditMode ? (
                        <Button
                          onClick={toggleEditMode}
                          variant="default"
                          size="sm"
                          className="gap-2 w-full justify-start bg-green-600 hover:bg-green-700 h-9"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span className="text-xs">Выйти из редактирования</span>
                        </Button>
                      ) : (
                        <Button
                          onClick={toggleEditMode}
                          variant="outline"
                          size="sm"
                          className="gap-2 w-full justify-start h-9"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="text-xs">Включить редактирование</span>
                        </Button>
                      )}
                      <div className="flex gap-1.5">
                        <Button
                          onClick={() => {
                            if (confirm("Сбросить все данные к значениям по умолчанию?")) {
                              resetToDefault();
                            }
                          }}
                          variant="secondary"
                          size="sm"
                          className="flex-1 gap-1.5 h-8 px-2"
                          title="Сбросить к значениям по умолчанию"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-xs">Сброс</span>
                        </Button>
                        <Button
                          onClick={handleLock}
                          variant="destructive"
                          size="sm"
                          className="flex-1 gap-1.5 h-8 px-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span className="text-xs">Закрыть</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {!isLocked && (
                  <>
                    <Separator className="my-3" />

                    {/* Theme Settings */}
                    <div className="flex flex-col gap-2 pb-4">
                      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1">Тема оформления</h3>
                      <div className="grid grid-cols-2 gap-1.5 px-2">
                        {themeOptions.map((theme) => (
                          <Button
                            key={theme.id}
                            onClick={() => setBackgroundTheme(theme.id)}
                            variant={backgroundTheme === theme.id ? "default" : "outline"}
                            size="sm"
                            className="gap-1.5 justify-start h-9 py-1.5 px-2"
                            title={theme.description}
                          >
                            <span className="w-3.5 h-3.5 flex-shrink-0">{theme.icon}</span>
                            <span className="text-xs truncate">{theme.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Индикатор режима редактирования */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-primary text-primary-foreground py-1.5 px-4 text-center"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            <span className="font-medium">Режим редактирования активен</span>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
