"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download, Mail, Star, ChevronDown, Send, Phone } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
  },
};

export function HeroSection() {
  const { resumeData, updateData } = useResume();
  const { hero } = resumeData;

  return (
    <motion.section
      id="hero"
      className="relative min-h-[95vh] flex items-center justify-center px-4 py-20 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Avatar with glow effect */}
        <motion.div 
          variants={scaleIn} 
          className="mb-8 relative"
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-6 relative z-10">
            <EditableImage
              src={hero.avatar}
              alt={hero.name}
              onSave={(newSrc) => updateData({ hero: { avatar: newSrc } })}
              className="rounded-full ring-4 ring-primary/20 shadow-2xl transition-transform hover:scale-105 duration-300"
              width={144}
              height={144}
              variant="avatar"
            />
          </div>
        </motion.div>

        {/* Animated badge */}
        <motion.div
          variants={fadeIn}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Star className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-medium text-primary">
            Dostępny do pracy
          </span>
        </motion.div>

        <motion.h1
          variants={fadeIn}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 px-4"
        >
          <EditableText
            value={hero.name}
            onSave={(newName) => updateData({ hero: { name: newName } })}
            className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
          />
        </motion.h1>

        <motion.p
          variants={fadeIn}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-6 text-foreground/80 px-4"
        >
          <EditableText
            value={hero.role}
            onSave={(newRole) => updateData({ hero: { role: newRole } })}
          />
        </motion.p>

        <motion.p
          variants={fadeIn}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed px-4"
        >
          <EditableText
            value={hero.description}
            onSave={(newDesc) => updateData({ hero: { description: newDesc } })}
            multiline
          />
        </motion.p>

        <motion.div
          variants={fadeIn}
          className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center px-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="sm" className="gap-2 shadow-lg shadow-primary/20 sm:size-default md:size-lg">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Pobierz CV</span>
              <span className="sm:hidden">CV</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="sm"
              variant="outline" 
              className="gap-2 sm:size-default md:size-lg"
              onClick={() => window.location.href = `mailto:${hero.email}`}
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                <EditableText
                  value={hero.email}
                  onSave={(newEmail) => updateData({ hero: { email: newEmail } })}
                />
              </span>
              <span className="sm:hidden text-xs">Email</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="sm"
              variant="outline" 
              className="gap-2 sm:size-default md:size-lg"
              onClick={() => window.open(`https://t.me/${hero.telegram.replace('@', '')}`, '_blank')}
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                <EditableText
                  value={hero.telegram}
                  onSave={(newTelegram) => updateData({ hero: { telegram: newTelegram } })}
                />
              </span>
              <span className="sm:hidden text-xs">TG</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="sm" variant="outline" className="gap-2 sm:size-default md:size-lg">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                <EditableText
                  value={hero.phone}
                  onSave={(newPhone) => updateData({ hero: { phone: newPhone } })}
                />
              </span>
              <span className="sm:hidden text-xs">Тел</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeIn}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
