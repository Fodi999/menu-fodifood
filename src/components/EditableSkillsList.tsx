"use client";

import { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Plus, Trash2, Check, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface EditableSkillsListProps {
  items: string[];
  onUpdate: (newItems: string[]) => void;
}

export function EditableSkillsList({ items, onUpdate }: EditableSkillsListProps) {
  const { isEditMode } = useResume();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isEditMode) {
    return (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 group"
          >
            <motion.span 
              className="text-primary mt-1 text-lg"
              whileHover={{ scale: 1.3, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              •
            </motion.span>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    );
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const newItems = [...items];
      newItems[editingIndex] = editValue.trim();
      onUpdate(newItems);
    }
    setEditingIndex(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  const handleAdd = () => {
    if (newItemValue.trim()) {
      onUpdate([...items, newItemValue.trim()]);
      setNewItemValue("");
      setIsAdding(false);
    }
  };

  return (
    <ul className="space-y-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-2 group"
          >
            {editingIndex === index ? (
              <div className="flex-1 flex gap-1.5 sm:gap-2 min-w-0 max-w-full">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  className="text-sm min-w-0 flex-1 h-9 sm:h-10"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex-shrink-0 touch-manipulation active:scale-95"
                  type="button"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex-shrink-0 touch-manipulation active:scale-95"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="text-primary mt-1 text-lg flex-shrink-0">•</span>
                <span className="text-sm text-muted-foreground flex-1 min-w-0 break-words">
                  {item}
                </span>
                <div className="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-70 transition-opacity flex gap-0.5 sm:gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(index)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 touch-manipulation active:scale-95"
                    type="button"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  {items.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(index)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive touch-manipulation active:scale-95"
                      type="button"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </motion.li>
        ))}
      </AnimatePresence>

      {isAdding ? (
        <motion.li
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-1.5 sm:gap-2 min-w-0 max-w-full"
        >
          <Input
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewItemValue("");
              }
            }}
            placeholder="Nowa umiejętność..."
            className="text-sm min-w-0 flex-1 h-9 sm:h-10"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAdd}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex-shrink-0 touch-manipulation active:scale-95"
            type="button"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsAdding(false);
              setNewItemValue("");
            }}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex-shrink-0 touch-manipulation active:scale-95"
            type="button"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.li>
      ) : (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed h-9 sm:h-10 text-xs sm:text-sm touch-manipulation active:scale-[0.98]"
            type="button"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Dodaj umiejętność
          </Button>
        </motion.li>
      )}
    </ul>
  );
}
