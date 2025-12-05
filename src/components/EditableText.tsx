"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Check, X } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  onEditingChange?: (isEditing: boolean) => void;
}

export function EditableText({
  value,
  onSave,
  className = "",
  multiline = false,
  placeholder = "Введите текст...",
  onEditingChange,
}: EditableTextProps) {
  const { isEditMode } = useRestaurant();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
    // Notify parent about editing state change
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (editValue.trim()) {
      onSave(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditMode) {
    return <span className={className}>{value}</span>;
  }

  if (isEditing) {
    // Определяем, нужно ли размещать кнопки внизу (для длинных текстов или multiline)
    const buttonsBelow = multiline || value.length > 30;
    
    return (
      <span className={`relative group block w-full max-w-full ${buttonsBelow ? 'p-3' : 'pr-24 sm:pr-28 p-2'}`}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full max-w-full bg-background/95 backdrop-blur-sm border-2 border-primary rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none box-border min-h-[100px] shadow-lg ${className}`}
            placeholder={placeholder}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full max-w-full bg-background/95 backdrop-blur-sm border-2 border-primary rounded-xl px-4 py-2.5 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 box-border h-11 shadow-lg ${className}`}
            placeholder={placeholder}
          />
        )}
        <span className={`flex gap-2 flex-shrink-0 ${
          buttonsBelow 
            ? 'justify-end mt-3' 
            : 'absolute right-2 top-1/2 -translate-y-1/2'
        }`}>
          <button
            onClick={handleSave}
            className="h-10 w-10 p-0 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all flex-shrink-0"
            type="button"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={handleCancel}
            className="h-10 w-10 p-0 inline-flex items-center justify-center rounded-xl border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-lg hover:shadow-xl transition-all flex-shrink-0"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </span>
      </span>
    );
  }

  return (
    <span
      className={`relative group cursor-pointer inline-block ${isEditMode ? 'hover:scale-105 transition-transform' : ''}`}
      onClick={() => {
        console.log('✏️ EditableText clicked! isEditMode:', isEditMode);
        if (isEditMode) {
          setIsEditing(true);
        }
      }}
    >
      <span className={`${className} ${isEditMode ? `border-2 border-dashed border-primary/50 group-hover:border-primary rounded-lg ${multiline ? 'px-4 py-3' : 'px-3 py-1.5'} transition-colors block` : ''}`}>
        {value}
      </span>
    </span>
  );
}
