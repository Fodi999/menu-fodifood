"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResume } from "@/contexts/ResumeContext";
import { Upload, Link2, Image as ImageIcon, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (newSrc: string) => void;
  className?: string;
  width?: number;
  height?: number;
  variant?: "avatar" | "portfolio";
}

export function EditableImage({
  src,
  alt,
  onSave,
  className = "",
  width = 200,
  height = 200,
  variant = "avatar",
}: EditableImageProps) {
  const { isEditMode } = useResume();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(src);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast.error("Wybierz plik obrazu", {
        description: "Obsługiwane formaty: JPG, PNG, GIF, WebP"
      });
      return;
    }

    // Проверка размера (макс 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Plik jest za duży", {
        description: "Maksymalny rozmiar: 5MB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageUrl(result);
      onSave(result);
      setIsEditing(false);
      toast.success("Zdjęcie zostało zaktualizowane!", {
        description: `Załadowano: ${file.name}`
      });
    };
    reader.onerror = () => {
      toast.error("Błąd podczas ładowania pliku");
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlSave = () => {
    if (urlInput.trim()) {
      // Простая валидация URL
      try {
        new URL(urlInput);
        setImageUrl(urlInput.trim());
        onSave(urlInput.trim());
        setIsEditing(false);
        setUrlInput("");
        toast.success("URL zaktualizowany!");
      } catch {
        toast.error("Nieprawidłowy URL", {
          description: "Wprowadź poprawny adres URL obrazu"
        });
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUrlInput("");
  };

  if (!isEditMode) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // В режиме редактирования используем fill для заполнения контейнера
  const isPortfolio = variant === "portfolio";

  return (
    <motion.div
      className={`relative ${className} ${isPortfolio ? 'w-full h-full' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
    >
      {isPortfolio ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all ${isDragging ? 'opacity-30' : isHovered ? 'opacity-70' : 'opacity-100'}`}
        />
      ) : (
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={`transition-all ${isDragging ? 'opacity-30' : isHovered ? 'opacity-70' : 'opacity-100'}`}
        />
      )}
      
      {/* Drag & Drop overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-4 border-dashed border-primary bg-primary/10 flex items-center justify-center rounded-lg"
          >
            <div className="text-center px-2">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-primary">Upuść zdjęcie tutaj</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit buttons */}
      <AnimatePresence>
        {(isHovered || isEditMode) && !isEditing && !isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 bg-black/40 rounded-lg [@media(hover:none)]:opacity-90"
          >
            <Button
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 rounded-full shadow-lg touch-manipulation active:scale-90"
              onClick={() => fileInputRef.current?.click()}
              title="Загрузить файл"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 rounded-full shadow-lg touch-manipulation active:scale-90"
              onClick={() => setIsEditing(true)}
              title="Вставить URL"
            >
              <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* URL input modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 bg-card border-2 border-primary rounded-lg p-2 sm:p-3 shadow-2xl z-10"
          >
            <div className="flex flex-col gap-1.5 sm:gap-2 h-full">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold truncate">URL obrazu</span>
              </div>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUrlSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                className="text-xs sm:text-sm h-8 sm:h-9"
                autoFocus
              />
              <div className="flex gap-1.5 sm:gap-2 mt-auto">
                <Button
                  size="sm"
                  onClick={handleUrlSave}
                  className="flex-1 h-7 sm:h-8 text-xs touch-manipulation active:scale-95"
                  disabled={!urlInput.trim()}
                >
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                  OK
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-7 sm:h-8 text-xs touch-manipulation active:scale-95"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                  Anuluj
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </motion.div>
  );
}
