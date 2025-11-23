"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Star, Folder, Sparkles, Plus, Trash2 } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function PortfolioCard({
  item,
  index,
  onUpdate,
  onDelete,
}: {
  item: {
    id: string;
    title: string;
    category: string;
    image: string;
  };
  index: number;
  onUpdate: (field: string, value: any) => void;
  onDelete?: () => void;
}) {
  const ref = useRef(null);
  const { isEditMode } = useResume();
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-muted to-muted/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full h-full"
      >
        {isEditMode ? (
          <EditableImage
            src={imageError ? "/placeholder.jpg" : item.image}
            alt={item.title}
            onSave={(newSrc) => onUpdate('image', newSrc)}
            className="object-cover"
            width={400}
            height={400}
            variant="portfolio"
          />
        ) : (
          <Image
            src={imageError ? "/placeholder.jpg" : item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </motion.div>

      {/* Animated corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/40 to-transparent"
        initial={{ scale: 0, rotate: 0 }}
        animate={isHovered ? { scale: 1, rotate: 45 } : { scale: 0, rotate: 0 }}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: "top right" }}
      />

      {/* Category badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="absolute top-4 left-4 z-10"
      >
        <motion.span 
          className="px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold shadow-lg"
          whileHover={{ scale: 1.1 }}
        >
          <EditableText
            value={item.category}
            onSave={(newValue) => onUpdate('category', newValue)}
          />
        </motion.span>
      </motion.div>

      {/* Overlay with content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-6"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
            <motion.div
              animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Star className="w-5 h-5" />
            </motion.div>
            <EditableText
              value={item.title}
              onSave={(newValue) => onUpdate('title', newValue)}
            />
          </h3>
          <p className="text-white/90 text-sm flex items-center gap-2">
            <Folder className="w-4 h-4" />
            {item.category}
          </p>
        </motion.div>

        {/* View button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Подробнее →
        </motion.button>
      </motion.div>

      {/* Animated border */}
      <motion.div 
        className="absolute inset-0 border-2 border-primary rounded-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Sparkle effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-primary"
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={isHovered ? { 
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0],
          rotate: [0, 180, 360]
        } : {
          opacity: 0,
          scale: 0
        }}
        transition={{ duration: 0.8 }}
      >
        <Sparkles className="w-10 h-10" />
      </motion.div>

      {/* Delete button (only in edit mode) */}
      {isEditMode && onDelete && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-20"
        >
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="h-8 w-8 p-0 rounded-full shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export function PortfolioSection() {
  const { resumeData, updateData, isEditMode } = useResume();
  const { portfolio } = resumeData;

  const handleUpdatePortfolio = (portfolioId: string, field: string, value: any) => {
    const updatedPortfolio = portfolio.map(item => 
      item.id === portfolioId ? { ...item, [field]: value } : item
    );
    updateData({ portfolio: updatedPortfolio });
  };

  const handleDeletePortfolio = (portfolioId: string) => {
    const updatedPortfolio = portfolio.filter(item => item.id !== portfolioId);
    updateData({ portfolio: updatedPortfolio });
  };

  const handleAddPortfolio = () => {
    const newId = `portfolio-${Date.now()}`;
    const newItem = {
      id: newId,
      title: "Nowe danie",
      category: "Kategoria",
      image: "/placeholder.jpg",
    };
    updateData({ portfolio: [...portfolio, newItem] });
  };

  return (
    <section id="portfolio" className="min-h-screen flex items-center py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Palette className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-semibold text-primary">Portfolio</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent px-4">
            Wybrane prace
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Kolekcja autorskich dań i kulinarnych arcydzieł
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {portfolio.map((item, index) => (
              <PortfolioCard 
                key={item.id} 
                item={item} 
                index={index}
                onUpdate={(field, value) => handleUpdatePortfolio(item.id, field, value)}
                onDelete={portfolio.length > 1 ? () => handleDeletePortfolio(item.id) : undefined}
              />
            ))}
          </AnimatePresence>

          {/* Add new portfolio item button */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square"
            >
              <Card 
                onClick={handleAddPortfolio}
                className="h-full w-full border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer flex items-center justify-center group"
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    Dodaj nowe danie
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kliknij aby dodać
                  </p>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
