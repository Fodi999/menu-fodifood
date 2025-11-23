"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResume } from "@/contexts/ResumeContext";
import { Check, X, Edit2 } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  onSave,
  className = "",
  multiline = false,
  placeholder = "Введите текст...",
}: EditableTextProps) {
  const { isEditMode } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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
      <span className={`relative group block w-full max-w-full ${buttonsBelow ? '' : 'pr-14 sm:pr-16 md:pr-20'}`}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} w-full max-w-full bg-muted/50 border-2 border-primary rounded-lg px-2 py-2 sm:px-3 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none box-border min-h-[80px]`}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} w-full max-w-full bg-muted/50 border-2 border-primary rounded-lg px-2 py-2 sm:px-3 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 box-border h-9 sm:h-10`}
            placeholder={placeholder}
          />
        )}
        <span className={`flex gap-1 sm:gap-1.5 flex-shrink-0 ${
          buttonsBelow 
            ? 'justify-end mt-2' 
            : 'absolute right-0 top-1/2 -translate-y-1/2'
        }`}>
          <button
            onClick={handleSave}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all flex-shrink-0 touch-manipulation"
            type="button"
          >
            <Check className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all flex-shrink-0 touch-manipulation"
            type="button"
          >
            <X className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </span>
      </span>
    );
  }

  return (
    <span
      className={`relative group cursor-pointer inline-block ${isEditMode ? 'hover:scale-105 transition-transform' : ''}`}
      onClick={() => isEditMode && setIsEditing(true)}
    >
      <span className={`${className} ${isEditMode ? 'border-2 border-dashed border-transparent group-hover:border-primary/30 rounded px-2 py-1 transition-colors' : ''}`}>
        {value}
      </span>
      {isEditMode && (
        <span className="absolute -right-7 sm:-right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-70 transition-opacity">
          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
        </span>
      )}
    </span>
  );
}
