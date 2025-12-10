"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Upload, Link2, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { uploadAPI } from "@/lib/api-client";

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (newSrc: string) => void;
  className?: string;
  width?: number;
  height?: number;
  variant?: "avatar" | "portfolio";
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  priority?: boolean;
}

export function EditableImage({
  src,
  alt,
  onSave,
  className = "",
  width = 200,
  height = 200,
  variant = "avatar",
  sizes,
  placeholder,
  blurDataURL,
  priority = false,
}: EditableImageProps) {
  const { isEditMode } = useRestaurant();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(src);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  console.log('📸 EditableImage - isEditMode:', isEditMode, 'src:', src, 'isHovered:', isHovered, 'isEditing:', isEditing);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
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

    try {
      setIsUploading(true);
      toast.loading("Kompresja i przesyłanie...", { id: "upload" });

      // ОПТИМИЗАЦИЯ: Сжимаем изображение перед загрузкой
      const compressedFile = await compressImage(file);
      
      toast.loading("Przesyłanie do Cloudinary...", { id: "upload" });

      // Загружаем в Cloudinary
      const result = await uploadAPI.uploadFile(compressedFile, 'portfolio');
      
      console.log('🔍 Cloudinary response:', result);
      console.log('🔍 result.url:', result.url);
      
      setImageUrl(result.url);
      onSave(result.url);
      setIsEditing(false);
      
      toast.success("Zdjęcie zostało przesłane!", {
        id: "upload",
        description: `Załadowano: ${file.name} (${(compressedFile.size / 1024).toFixed(0)} KB)`
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Błąd podczas przesyłania", {
        id: "upload",
        description: error instanceof Error ? error.message : "Spróbuj ponownie"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Функция сжатия изображения
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Масштабируем до макс 1920px по большей стороне
          const maxSize = 1920;
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              console.log(`📦 Original: ${(file.size / 1024).toFixed(0)} KB → Compressed: ${(compressedFile.size / 1024).toFixed(0)} KB`);
              resolve(compressedFile);
            },
            'image/jpeg',
            0.85 // Качество 85%
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
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
    >
      {isPortfolio ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          priority={priority}
          className={`object-cover transition-all pointer-events-none ${isDragging ? 'opacity-30' : isHovered ? 'opacity-70' : 'opacity-100'}`}
        />
      ) : (
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          priority={priority}
          className={`transition-all pointer-events-none ${isDragging ? 'opacity-30' : isHovered ? 'opacity-70' : 'opacity-100'}`}
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

      {/* Edit buttons - Always visible in edit mode */}
      <AnimatePresence>
        {isEditMode && !isEditing && !isDragging && !isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-4 z-10 pointer-events-none"
          >
            <Button
              size="sm"
              className="h-14 w-14 sm:h-16 sm:w-16 p-0 rounded-full shadow-2xl bg-primary hover:bg-primary/90 hover:scale-110 transition-all pointer-events-auto"
              onClick={() => {
                console.log('🔘 Upload button clicked!');
                fileInputRef.current?.click();
              }}
              title="Загрузить файл"
            >
              <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-14 w-14 sm:h-16 sm:w-16 p-0 rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto"
              onClick={() => {
                console.log('🔘 URL button clicked!');
                setIsEditing(true);
              }}
              title="Вставить URL"
            >
              <Link2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hint for placeholder images - Removed to not block clicks */}
      {/* Edit buttons are always visible now, so hint is not needed */}

      {/* Upload progress overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-20"
          >
            <div className="text-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm font-semibold">Przesyłanie...</p>
            </div>
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
            className="absolute inset-0 bg-card border-2 border-primary rounded-xl p-4 sm:p-5 shadow-2xl z-10"
          >
            <div className="flex flex-col gap-3 sm:gap-4 h-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold truncate">URL образу</span>
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
                className="text-sm sm:text-base h-11 sm:h-12 px-4 rounded-xl"
                autoFocus
              />
              <div className="flex gap-2 sm:gap-3 mt-auto">
                <Button
                  size="sm"
                  onClick={handleUrlSave}
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base touch-manipulation active:scale-95 rounded-xl"
                  disabled={!urlInput.trim()}
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  OK
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base touch-manipulation active:scale-95 rounded-xl"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
