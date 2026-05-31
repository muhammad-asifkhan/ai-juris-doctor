// src/components/GavelAnimation.tsx
// ---------------------------------------------------
// Animated gavel that strikes during judge deliberation
// ---------------------------------------------------

"use client";

import { motion } from "framer-motion";

interface Props {
  isActive: boolean;
}

export default function GavelAnimation({ isActive }: Props) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="flex flex-col items-center gap-4 py-8"
    >
      {/* Gavel */}
      <motion.div
        className="text-6xl"
        animate={{
          rotate: [0, -30, 0],
          y: [0, -10, 5, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: "easeInOut",
        }}
      >
        🔨
      </motion.div>

      {/* Strike effect */}
      <motion.div
        className="w-16 h-1 rounded-full bg-amber-400"
        animate={{
          scaleX: [0, 1.5, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 0.8,
          delay: 0.5,
        }}
      />

      {/* Text */}
      <motion.p
        className="text-amber-400 text-sm font-semibold tracking-widest uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        The Court is Deliberating...
      </motion.p>

      {/* Orbiting dots */}
      <div className="relative w-20 h-20">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-400/60"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: [
                Math.cos((i * Math.PI) / 2) * 30,
                Math.cos((i * Math.PI) / 2 + Math.PI / 2) * 30,
                Math.cos((i * Math.PI) / 2 + Math.PI) * 30,
                Math.cos((i * Math.PI) / 2 + (3 * Math.PI) / 2) * 30,
                Math.cos((i * Math.PI) / 2) * 30,
              ],
              y: [
                Math.sin((i * Math.PI) / 2) * 30,
                Math.sin((i * Math.PI) / 2 + Math.PI / 2) * 30,
                Math.sin((i * Math.PI) / 2 + Math.PI) * 30,
                Math.sin((i * Math.PI) / 2 + (3 * Math.PI) / 2) * 30,
                Math.sin((i * Math.PI) / 2) * 30,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}