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
    return (
      <span className="relative group inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} w-full bg-muted/50 border-2 border-primary rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20`}
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
            className={`${className} w-full bg-muted/50 border-2 border-primary rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20`}
            placeholder={placeholder}
          />
        )}
        <span className="absolute -right-16 sm:-right-20 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            onClick={handleSave}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
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
        <span className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 className="w-4 h-4 text-primary" />
        </span>
      )}
    </span>
  );
}
