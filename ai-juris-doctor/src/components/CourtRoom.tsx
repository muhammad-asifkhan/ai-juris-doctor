// src/components/CourtRoom.tsx
// ---------------------------------------------------
// Main courtroom layout orchestrating the debate view
// Two-column attorney layout with judge in center
// ---------------------------------------------------

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrialState } from "@/lib/types";
import AttorneyAvatar from "./AttorneyAvatar";
import ChatBubble from "./ChatBubble";
import VerdictCard from "./VerdictCard";
import GavelAnimation from "./GavelAnimation";
import TrialTimeline from "./TrialTimeline";
import { RotateCcw, Quote } from "lucide-react";

interface Props {
  state: TrialState;
  onReset: () => void;
}

export default function CourtRoom({ state, onReset }: Props) {
  const {
    phase,
    conflict,
    prosecutionArgument,
    defenseArgument,
    verdict,
  } = state;

  const isProsecutionActive = phase === "PROSECUTION_STREAMING";
  const isDefenseActive = phase === "DEFENSE_STREAMING";
  const isJudgeActive = phase === "JUDGEMENT_PENDING";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Timeline */}
      <TrialTimeline phase={phase} />

      {/* Conflict Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 mb-6 border border-slate-700/30"
      >
        <div className="flex items-start gap-3">
          <Quote className="w-4 h-4 text-amber-400/60 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-amber-400/60 uppercase tracking-[0.2em] mb-1">
              Case Filing
            </p>
            <p className="text-sm text-slate-300 italic leading-relaxed">
              &ldquo;{conflict}&rdquo;
            </p>
          </div>
        </div>
      </motion.div>

      {/* Attorneys & Arguments - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Prosecution Side */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <AttorneyAvatar
              type="prosecution"
              isActive={isProsecutionActive}
              size="lg"
            />
          </div>
          <ChatBubble
            type="prosecution"
            text={prosecutionArgument}
            isStreaming={isProsecutionActive}
          />
        </div>

        {/* Defense Side */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <AttorneyAvatar
              type="defense"
              isActive={isDefenseActive}
              size="lg"
            />
          </div>
          <AnimatePresence>
            {(isDefenseActive ||
              phase === "JUDGEMENT_PENDING" ||
              phase === "FINAL_VERDICT") && (
              <ChatBubble
                type="defense"
                text={defenseArgument}
                isStreaming={isDefenseActive}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Judge Section */}
      <AnimatePresence>
        {isJudgeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-center mb-2">
              <AttorneyAvatar type="judge" isActive={true} size="lg" />
            </div>
            <GavelAnimation isActive={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verdict */}
      <AnimatePresence>
        {phase === "FINAL_VERDICT" && verdict && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-4">
              <AttorneyAvatar type="judge" isActive={false} size="lg" />
            </div>
            <VerdictCard verdict={verdict} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset after verdict (mistrial uses modal on input view) */}
      <AnimatePresence>
        {phase === "FINAL_VERDICT" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phase === "FINAL_VERDICT" ? 2 : 0 }}
            className="flex justify-center mt-8 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="px-8 py-3 rounded-xl glass border border-amber-500/20
                text-amber-400 font-bold text-sm tracking-wider uppercase
                hover:bg-amber-500/10 transition-all
                flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              File New Case
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}