"use client";

import { useResume } from "@/contexts/ResumeContext";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface EditableArrayItem {
  id: string;
  [key: string]: any;
}

interface EditableArrayProps<T extends EditableArrayItem> {
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addButtonText?: string;
  className?: string;
}

export function EditableArray<T extends EditableArrayItem>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonText = "Добавить элемент",
  className = "",
}: EditableArrayProps<T>) {
  const { isEditMode } = useResume();

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            {renderItem(item, index)}
            {isEditMode && items.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {isEditMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            {addButtonText}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
