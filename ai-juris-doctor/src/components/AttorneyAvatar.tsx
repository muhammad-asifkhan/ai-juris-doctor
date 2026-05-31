// src/components/AttorneyAvatar.tsx
// ---------------------------------------------------
// Animated avatar for each attorney / judge
// Glows and pulses when that agent is active
// ---------------------------------------------------

"use client";

import { motion } from "framer-motion";

interface Props {
  type: "prosecution" | "defense" | "judge";
  isActive: boolean;
  size?: "sm" | "md" | "lg";
}

const config = {
  prosecution: {
    emoji: "⚔️",
    name: "Rex Harrington III",
    title: "Lead Prosecutor",
    bgGradient: "from-red-950 to-red-900",
    borderColor: "border-red-500/30",
    glowClass: "pulse-red",
    ringColor: "ring-red-500/40",
    textColor: "text-red-400",
  },
  defense: {
    emoji: "🛡️",
    name: "Elena Vasquez",
    title: "Defense Attorney",
    bgGradient: "from-blue-950 to-blue-900",
    borderColor: "border-blue-500/30",
    glowClass: "pulse-blue",
    ringColor: "ring-blue-500/40",
    textColor: "text-blue-400",
  },
  judge: {
    emoji: "⚖️",
    name: "Justice Blackwell",
    title: "Presiding Judge",
    bgGradient: "from-amber-950 to-amber-900",
    borderColor: "border-amber-500/30",
    glowClass: "pulse-amber",
    ringColor: "ring-amber-500/40",
    textColor: "text-amber-400",
  },
};

const sizes = {
  sm: "w-12 h-12 text-lg",
  md: "w-16 h-16 text-2xl",
  lg: "w-20 h-20 text-3xl",
};

export default function AttorneyAvatar({ type, isActive, size = "md" }: Props) {
  const c = config[type];

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`
          ${sizes[size]} 
          rounded-full 
          bg-gradient-to-br ${c.bgGradient} 
          border-2 ${c.borderColor}
          flex items-center justify-center
          relative
          ${isActive ? c.glowClass : ""}
        `}
        animate={
          isActive
            ? {
                scale: [1, 1.05, 1],
              }
            : { scale: 1 }
        }
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Active ring indicator */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 rounded-full ring-2 ${c.ringColor}`}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <span role="img" aria-label={type}>
          {c.emoji}
        </span>
      </motion.div>

      <div className="text-center">
        <p className={`text-xs font-bold ${c.textColor}`}>{c.name}</p>
        <p className="text-[10px] text-slate-500">{c.title}</p>
        {isActive && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`text-[10px] ${c.textColor} mt-0.5`}
          >
            SPEAKING...
          </motion.p>
        )}
      </div>
    </div>
  );
}