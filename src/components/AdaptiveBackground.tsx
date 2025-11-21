"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAdaptiveBackground } from "@/hooks/useAdaptiveBackground";
import { useEffect, useState } from "react";

export function AdaptiveBackground() {
  const { backgroundConfig, timeOfDay, weather, location, isLoading } = useAdaptiveBackground();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const { gradients, particles, glowCircles } = backgroundConfig;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${timeOfDay}-${weather?.condition || "default"}-${location?.theme || "default"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background: [
              ...gradients,
              "radial-gradient(ellipse 100% 100% at 50% 50%, oklch(var(--background)), oklch(var(--background)))",
            ].join(", "),
          }}
        />
      </AnimatePresence>

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background: gradients[0] || "transparent",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background: gradients[1] || "transparent",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {gradients[2] && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: gradients[2],
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Glow circles effect */}
      {glowCircles && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/3 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-primary/15 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
          <motion.div
            className="absolute top-2/3 left-1/2 w-24 h-24 bg-primary/25 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Particles effect */}
      {particles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, -200],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Info overlay (optional - for debugging) */}
      {process.env.NODE_ENV === "development" && !isLoading && (
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs font-mono space-y-1">
          <div>Time: {timeOfDay}</div>
          {weather && (
            <>
              <div>Weather: {weather.condition}</div>
              <div>Temp: {weather.temp}°C</div>
              <div>{weather.description}</div>
            </>
          )}
          {location && (
            <>
              <div>Location: {location.city}</div>
              <div>Theme: {location.theme}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
