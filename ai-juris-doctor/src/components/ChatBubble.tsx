// src/components/ChatBubble.tsx
// ---------------------------------------------------
// Glassmorphic chat bubble for attorney arguments
// Shows text with typing cursor while streaming
// ---------------------------------------------------

"use client";

import { motion } from "framer-motion";

interface Props {
  type: "prosecution" | "defense";
  text: string;
  isStreaming: boolean;
}

const styles = {
  prosecution: {
    borderColor: "border-red-500/20",
    accentBg: "bg-red-500/10",
    accentText: "text-red-400",
    label: "PROSECUTION",
    icon: "⚔️",
    gradientBorder: "from-red-500/30 to-transparent",
  },
  defense: {
    borderColor: "border-blue-500/20",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-400",
    label: "DEFENSE",
    icon: "🛡️",
    gradientBorder: "from-blue-500/30 to-transparent",
  },
};

export default function ChatBubble({ type, text, isStreaming }: Props) {
  const s = styles[type];

  if (!text && !isStreaming) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`
        glass rounded-2xl p-5 
        border ${s.borderColor}
        ${isStreaming ? (type === "prosecution" ? "glow-prosecution" : "glow-defense") : ""}
        relative overflow-hidden
      `}
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.gradientBorder}`}
      />

      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`${s.accentBg} ${s.accentText} px-2 py-0.5 rounded text-xs font-bold tracking-wider`}>
          {s.icon} {s.label}
        </span>
        {isStreaming && (
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${type === "prosecution" ? "bg-red-400" : "bg-blue-400"}`}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Text content */}
      <div
        className={`text-sm leading-relaxed text-slate-300 whitespace-pre-wrap ${
          isStreaming ? "typing-cursor" : ""
        }`}
      >
        {text || (
          <motion.span
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-slate-500 italic"
          >
            Preparing argument...
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}