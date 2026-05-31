// src/components/MistrialModal.tsx
// ---------------------------------------------------
// Error modal displayed when the API fails
// Themed as a dramatic "Mistrial" declaration
// ---------------------------------------------------

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RotateCcw, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  error: string;
  onReset: () => void;
}

export default function MistrialModal({ isOpen, error, onReset }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onReset}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateX: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative glass-strong rounded-3xl p-8 max-w-md w-full border border-red-500/30 glow-prosecution"
          >
            {/* Close button */}
            <button
              onClick={onReset}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <motion.div
              className="flex justify-center mb-4"
              animate={{ rotate: [0, 5, -5, 5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-black text-center text-red-400 mb-2 tracking-wide">
              MISTRIAL DECLARED
            </h2>

            <div className="w-16 h-0.5 bg-red-500/30 mx-auto mb-4" />

            {/* Error message */}
            <div className="bg-red-950/30 rounded-xl p-4 mb-6 border border-red-500/10">
              <p className="text-xs text-red-400/60 uppercase tracking-wider mb-1">
                Court Record
              </p>
              <p className="text-sm text-red-300/80 leading-relaxed">
                {error}
              </p>
            </div>

            {/* Reset button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onReset}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-500 
                text-white font-bold tracking-wider uppercase text-sm
                hover:from-red-500 hover:to-red-400 transition-all
                flex items-center justify-center gap-2
                shadow-lg shadow-red-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              File New Case
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}