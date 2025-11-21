"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useResume } from "@/contexts/ResumeContext";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  const [imageUrl, setImageUrl] = useState(src);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        onSave(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = () => {
    const url = prompt("Введите URL изображения:", imageUrl);
    if (url && url.trim()) {
      setImageUrl(url.trim());
      onSave(url.trim());
    }
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

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="transition-opacity"
        style={{ opacity: isHovered ? 0.5 : 1 }}
      />
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <label htmlFor={`file-upload-${alt}`}>
            <Button
              size="sm"
              className="h-9 w-9 p-0 rounded-full"
              onClick={() => document.getElementById(`file-upload-${alt}`)?.click()}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </label>
          <input
            id={`file-upload-${alt}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-9 px-3 rounded-full text-xs"
            onClick={handleUrlInput}
          >
            URL
          </Button>
        </div>
      )}
    </motion.div>
  );
}
