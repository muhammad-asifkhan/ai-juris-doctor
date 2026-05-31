// src/components/InputStage.tsx
// ---------------------------------------------------
// The case filing input — where the user describes
// their conflict. Includes sample quick-picks.
// ---------------------------------------------------

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ArrowRight, FileText } from "lucide-react";
import { SAMPLE_CONFLICTS } from "@/lib/utils";

interface Props {
  onSubmit: (conflict: string) => void;
  isLoading: boolean;
}

export default function InputStage({ onSubmit, isLoading }: Props) {
  const [input, setInput] = useState("");
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = () => {
    if (input.trim().length >= 5 && !isLoading) {
      onSubmit(input.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="text-7xl mb-4"
          animate={{ 
            rotateY: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
        >
          ⚖️
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-black text-gradient-gold mb-3">
          File Your Case
        </h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          Describe your conflict and watch two AI attorneys battle it out in a
          dramatic courtroom showdown, with a final verdict from AI Judge Blackwell.
        </p>
      </motion.div>

      {/* Input Area */}
      <motion.div
        className="glass-strong rounded-2xl p-6 border border-amber-500/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <label className="flex items-center gap-2 text-xs text-amber-400/60 uppercase tracking-[0.2em] mb-3">
          <FileText className="w-3 h-3" />
          Case Brief
        </label>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="e.g., My roommate ate my clearly labeled leftovers from the fridge..."
          disabled={isLoading}
          rows={4}
          className="w-full bg-black/30 rounded-xl px-4 py-3 text-sm text-slate-200 
            placeholder-slate-600 border border-slate-700/50 
            focus:border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500/20
            transition-all resize-none disabled:opacity-50"
        />

        {/* Character count */}
        <div className="flex items-center justify-between mt-3">
          <p
            className={`text-xs ${
              input.trim().length < 5 && input.length > 0
                ? "text-red-400"
                : "text-slate-600"
            }`}
          >
            {input.trim().length < 5 && input.length > 0
              ? "Minimum 5 characters required"
              : `${input.length} characters`}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={input.trim().length < 5 || isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 
              text-black font-bold text-sm tracking-wider uppercase
              hover:from-amber-500 hover:to-amber-400
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all flex items-center gap-2
              shadow-lg shadow-amber-500/20"
          >
            {isLoading ? (
              <motion.div
                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isLoading ? "Filing..." : "Begin Trial"}
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Pick Section */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={() => setShowSamples(!showSamples)}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mx-auto"
        >
          <Sparkles className="w-3 h-3" />
          {showSamples ? "Hide" : "Show"} sample conflicts
          <motion.div animate={{ rotate: showSamples ? 90 : 0 }}>
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showSamples && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {SAMPLE_CONFLICTS.map((sample, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setInput(sample)}
                    className="text-left px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]
                      hover:bg-white/[0.05] hover:border-amber-500/20
                      text-xs text-slate-400 hover:text-slate-200
                      transition-all duration-200"
                  >
                    &ldquo;{sample}&rdquo;
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}