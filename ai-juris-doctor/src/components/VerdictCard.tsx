// src/components/VerdictCard.tsx
// ---------------------------------------------------
// The final verdict display with staggered animations
// Shows verdict, reasoning, damages, confidence
// ---------------------------------------------------

"use client";

import { motion } from "framer-motion";
import { Verdict } from "@/lib/types";
import {
  Gavel,
  BookOpen,
  AlertCircle,
  BarChart3,
  Landmark,
} from "lucide-react";

interface Props {
  verdict: Verdict;
}

// Staggered children container
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.3,
    },
  },
};

// Individual child animation
const item = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function VerdictCard({ verdict }: Props) {
  const isGuilty = verdict.verdict.toUpperCase().includes("GUILTY") &&
    !verdict.verdict.toUpperCase().includes("NOT GUILTY");

  const verdictColor = isGuilty ? "text-red-400" : "text-emerald-400";
  const verdictBg = isGuilty ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Main Verdict */}
      <motion.div
        variants={item}
        className={`glass-strong rounded-2xl p-6 text-center glow-verdict relative overflow-hidden`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px]">
            ⚖️
          </div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <Gavel className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          </motion.div>

          <p className="text-xs text-amber-400/60 uppercase tracking-[0.3em] mb-2">
            The Court Has Reached a Verdict
          </p>

          <motion.h2
            className={`text-3xl md:text-4xl font-black ${verdictColor} tracking-wide`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {verdict.verdict}
          </motion.h2>

          {/* Confidence bar */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Confidence</span>
              <span>{verdict.confidence}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${verdict.confidence}%` }}
                transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reasoning */}
      <motion.div
        variants={item}
        className="glass rounded-2xl p-5 border border-amber-500/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
            Court&apos;s Reasoning
          </h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {verdict.reasoning}
        </p>
      </motion.div>

      {/* Damages */}
      <motion.div
        variants={item}
        className={`rounded-2xl p-5 border ${verdictBg}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className={`w-4 h-4 ${verdictColor}`} />
          <h3 className={`text-sm font-bold ${verdictColor} uppercase tracking-wider`}>
            Sentence / Remedy
          </h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {verdict.damages}
        </p>
      </motion.div>

      {/* Precedent */}
      <motion.div
        variants={item}
        className="glass rounded-2xl p-5 border border-slate-700/50"
      >
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Precedent Set
          </h3>
        </div>
        <p className="text-sm text-slate-400 italic leading-relaxed">
          &quot;{verdict.precedent}&quot;
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        variants={item}
        className="glass rounded-xl p-4 flex items-center justify-center gap-2"
      >
        <BarChart3 className="w-4 h-4 text-slate-500" />
        <p className="text-xs text-slate-500">
          This verdict was generated by a panel of 3 AI agents analyzing logical
          consistency, emotional weight, and legal precedent.
        </p>
      </motion.div>
    </motion.div>
  );
}