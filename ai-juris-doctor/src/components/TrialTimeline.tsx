// src/components/TrialTimeline.tsx
// ---------------------------------------------------
// Visual timeline showing progression through phases
// ---------------------------------------------------

"use client";

import { motion } from "framer-motion";
import { TrialPhase } from "@/lib/types";

interface Props {
  phase: TrialPhase;
}

const steps = [
  { id: "PROSECUTION_STREAMING", label: "Prosecution", icon: "⚔️", color: "red" as const },
  { id: "DEFENSE_STREAMING", label: "Defense", icon: "🛡️", color: "blue" as const },
  { id: "JUDGEMENT_PENDING", label: "Deliberation", icon: "⚖️", color: "amber" as const },
  { id: "FINAL_VERDICT", label: "Verdict", icon: "🔨", color: "emerald" as const },
];

const phaseOrder: TrialPhase[] = [
  "IDLE",
  "INPUTTING",
  "PROSECUTION_STREAMING",
  "DEFENSE_STREAMING",
  "JUDGEMENT_PENDING",
  "FINAL_VERDICT",
];

/** Full class names so Tailwind JIT always includes them */
const ACTIVE_RING: Record<(typeof steps)[number]["color"], string> = {
  red: "bg-red-500/20 border-2 border-red-500/40",
  blue: "bg-blue-500/20 border-2 border-blue-500/40",
  amber: "bg-amber-500/20 border-2 border-amber-500/40",
  emerald: "bg-emerald-500/20 border-2 border-emerald-500/40",
};

const ACTIVE_LINE: Record<(typeof steps)[number]["color"], string> = {
  red: "bg-red-500/40",
  blue: "bg-blue-500/40",
  amber: "bg-amber-500/40",
  emerald: "bg-emerald-500/40",
};

export default function TrialTimeline({ phase }: Props) {
  const currentIndex = phaseOrder.indexOf(phase);

  if (phase === "IDLE" || phase === "INPUTTING" || phase === "MISTRIAL")
    return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl px-6 py-3 mb-6"
    >
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const stepPhaseIndex = phaseOrder.indexOf(step.id as TrialPhase);
          const isComplete = currentIndex > stepPhaseIndex;
          const isActive = currentIndex === stepPhaseIndex;

          const circleClass = isComplete
            ? "bg-emerald-500/20 border-2 border-emerald-500/40"
            : isActive
              ? ACTIVE_RING[step.color]
              : "bg-slate-800/50 border-2 border-slate-700/50";

          const lineClass = isComplete
            ? "bg-emerald-500/40"
            : isActive
              ? ACTIVE_LINE[step.color]
              : "bg-transparent";

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${circleClass}`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                >
                  {isComplete ? "✓" : step.icon}
                </motion.div>
                <p
                  className={`text-[10px] mt-1 tracking-wider uppercase ${
                    isActive
                      ? "text-white font-bold"
                      : isComplete
                        ? "text-emerald-400/60"
                        : "text-slate-600"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 mt-[-16px] rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className={`h-full ${lineClass}`}
                    initial={{ width: "0%" }}
                    animate={{
                      width: isComplete ? "100%" : isActive ? "50%" : "0%",
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
