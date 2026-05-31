// src/components/CourtBanner.tsx
// ---------------------------------------------------
// Top banner with trial ID, timer, and phase indicator
// ---------------------------------------------------

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrialPhase } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { Scale, Timer, AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
  trialId: string;
  phase: TrialPhase;
  elapsedTime: number;
}

const phaseLabels: Record<TrialPhase, string> = {
  IDLE: "Awaiting Case Filing",
  INPUTTING: "Filing Case Brief",
  PROSECUTION_STREAMING: "⚔️ Prosecution Presenting",
  DEFENSE_STREAMING: "🛡️ Defense Rebuttal",
  JUDGEMENT_PENDING: "⚖️ Judge Deliberating",
  FINAL_VERDICT: "🔨 Verdict Delivered",
  MISTRIAL: "❌ Mistrial Declared",
};

const phaseColors: Record<TrialPhase, string> = {
  IDLE: "text-slate-400",
  INPUTTING: "text-slate-300",
  PROSECUTION_STREAMING: "text-red-400",
  DEFENSE_STREAMING: "text-blue-400",
  JUDGEMENT_PENDING: "text-amber-400",
  FINAL_VERDICT: "text-emerald-400",
  MISTRIAL: "text-red-500",
};

export default function CourtBanner({ trialId, phase, elapsedTime }: Props) {
  const isActive = phase !== "IDLE" && phase !== "INPUTTING";

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-strong rounded-2xl px-6 py-4 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Scale className="w-8 h-8 text-amber-400" />
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-400/20"
              animate={
                phase === "JUDGEMENT_PENDING"
                  ? { scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-gold tracking-wide">
              AI JURIS DOCTOR
            </h1>
            <p className="text-xs text-slate-500 tracking-widest uppercase">
              Real-Time Legal Battle Simulator
            </p>
          </div>
        </div>

        {/* Trial Info */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-6"
            >
              {/* Trial ID */}
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Trial ID
                </p>
                <p className="text-sm font-mono text-slate-300">{trialId}</p>
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Elapsed
                </p>
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3 text-slate-400" />
                  <p className="text-sm font-mono text-slate-300">
                    {formatTime(elapsedTime)}
                  </p>
                </div>
              </div>

              {/* Phase */}
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Phase
                </p>
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm font-semibold ${phaseColors[phase]}`}
                >
                  {phaseLabels[phase]}
                </motion.p>
              </div>

              {/* Status Icon */}
              <motion.div
                animate={
                  phase === "FINAL_VERDICT"
                    ? { rotate: [0, 0, 0] }
                    : phase === "MISTRIAL"
                      ? { rotate: [0, 5, -5, 0] }
                      : { rotate: 0 }
                }
                transition={{ duration: 0.5, repeat: phase === "MISTRIAL" ? Infinity : 0 }}
              >
                {phase === "MISTRIAL" ? (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                ) : phase === "FINAL_VERDICT" ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <motion.div
                    className="w-3 h-3 rounded-full bg-amber-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}