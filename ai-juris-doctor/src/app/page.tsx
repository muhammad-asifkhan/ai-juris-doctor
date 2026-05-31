// src/app/page.tsx
// ---------------------------------------------------
// Main page: orchestrates the entire courtroom UI
// Switches between Input and Courtroom views based
// on the trial phase state machine
// ---------------------------------------------------

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTrialEngine } from "@/hooks/useTrialEngine";
import CourtBanner from "@/components/CourtBanner";
import InputStage from "@/components/InputStage";
import CourtRoom from "@/components/CourtRoom";
import MistrialModal from "@/components/MistrialModal";
import ParticleBackground from "@/components/ParticleBackground";

export default function Home() {
  const { state, startTrial, resetTrial } = useTrialEngine();

  const isInCourt =
    state.phase !== "IDLE" &&
    state.phase !== "INPUTTING" &&
    state.phase !== "MISTRIAL";

  const isLoading =
    state.phase === "PROSECUTION_STREAMING" ||
    state.phase === "DEFENSE_STREAMING" ||
    state.phase === "JUDGEMENT_PENDING";

  return (
    <main className="min-h-screen relative">
      {/* Background particles */}
      <ParticleBackground phase={state.phase} />

      {/* Film grain overlay */}
      <div className="grain" />

      {/* Main content */}
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto">
        {/* Top Banner */}
        <CourtBanner
          trialId={state.trialId}
          phase={state.phase}
          elapsedTime={state.elapsedTime}
        />

        {/* Content Area with animated transitions */}
        <AnimatePresence mode="wait">
          {!isInCourt ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <InputStage onSubmit={startTrial} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="courtroom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <CourtRoom state={state} onReset={resetTrial} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8 mt-12"
        >
          <p className="text-xs text-slate-700">
            AI Juris Doctor v1.0 — All verdicts are AI-generated and for entertainment purposes only.
          </p>
          <p className="text-xs text-slate-800 mt-1">
            Powered by Google Gemini • Built with Next.js 14 & Framer Motion
          </p>
        </motion.footer>
      </div>

      {/* Mistrial Error Modal */}
      <MistrialModal
        isOpen={state.phase === "MISTRIAL"}
        error={state.error || "An unknown error occurred."}
        onReset={resetTrial}
      />
    </main>
  );
}