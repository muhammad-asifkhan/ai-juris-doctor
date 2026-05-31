// src/hooks/useTrialEngine.ts
// ---------------------------------------------------
// Custom hook managing the entire trial state machine
// Handles API calls, phased streaming simulation,
// timing, and error recovery
// ---------------------------------------------------

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TrialState, INITIAL_TRIAL_STATE } from "@/lib/types";
import { generateTrialId, parseJudgeVerdict } from "@/lib/utils";

export function useTrialEngine() {
  const [state, setState] = useState<TrialState>(INITIAL_TRIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const streamCleanupRef = useRef<(() => void) | null>(null);

  const clearStreaming = useCallback(() => {
    const stop = streamCleanupRef.current;
    streamCleanupRef.current = null;
    stop?.();
  }, []);

  // Timer: track how long the trial has been running
  useEffect(() => {
    if (
      state.startTime &&
      state.phase !== "FINAL_VERDICT" &&
      state.phase !== "IDLE" &&
      state.phase !== "MISTRIAL"
    ) {
      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          elapsedTime: Date.now() - (prev.startTime || Date.now()),
        }));
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.startTime, state.phase]);

  /**
   * Simulate streaming by revealing text character by character
   */
  const simulateStreaming = useCallback(
    (text: string, field: "prosecutionArgument" | "defenseArgument") => {
      clearStreaming();
      if (!text) return Promise.resolve();

      return new Promise<void>((resolve) => {
        let index = 0;
        const speed = 15;

        const intervalId = setInterval(() => {
          if (index < text.length) {
            const chunkSize = Math.floor(Math.random() * 3) + 1;
            const chunk = text.substring(index, index + chunkSize);
            index += chunkSize;

            setState((prev) => ({
              ...prev,
              [field]: prev[field] + chunk,
            }));
          } else {
            clearInterval(intervalId);
            streamCleanupRef.current = null;
            resolve();
          }
        }, speed);

        streamCleanupRef.current = () => {
          clearInterval(intervalId);
        };
      });
    },
    [clearStreaming]
  );

  /**
   * Start a new trial with the given conflict
   */
  const startTrial = useCallback(
    async (conflict: string) => {
      if (abortRef.current) abortRef.current.abort();
      clearStreaming();
      abortRef.current = new AbortController();
      const { signal } = abortRef.current;

      const trialId = generateTrialId();

      setState({
        ...INITIAL_TRIAL_STATE,
        phase: "PROSECUTION_STREAMING",
        conflict: conflict.trim(),
        trialId,
        startTime: Date.now(),
      });

      try {
        const response = await fetch("/api/debate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conflict: conflict.trim() }),
          signal,
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as {
            error?: string;
            details?: string;
          };
          const base = errorData.error || `API Error: ${response.status} ${response.statusText}`;
          const extra = errorData.details ? ` — ${errorData.details}` : "";
          throw new Error(`${base}${extra}`);
        }

        const data = (await response.json()) as {
          success?: boolean;
          error?: string;
          prosecution?: string;
          defense?: string;
          judgeRaw?: string;
        };

        if (!data.success) {
          throw new Error(data.error || "Unknown API error");
        }

        if (signal.aborted) return;

        await simulateStreaming(data.prosecution ?? "", "prosecutionArgument");
        if (signal.aborted) return;

        await new Promise((r) => setTimeout(r, 1200));
        if (signal.aborted) return;

        setState((prev) => ({ ...prev, phase: "DEFENSE_STREAMING" }));

        await simulateStreaming(data.defense ?? "", "defenseArgument");
        if (signal.aborted) return;

        await new Promise((r) => setTimeout(r, 1500));
        if (signal.aborted) return;

        setState((prev) => ({ ...prev, phase: "JUDGEMENT_PENDING" }));

        await new Promise((r) => setTimeout(r, 3000));
        if (signal.aborted) return;

        const verdict = parseJudgeVerdict(data.judgeRaw ?? "");

        setState((prev) => ({
          ...prev,
          phase: "FINAL_VERDICT",
          verdict,
          elapsedTime: Date.now() - (prev.startTime || Date.now()),
        }));
      } catch (err: unknown) {
        clearStreaming();
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";

        setState((prev) => ({
          ...prev,
          phase: "MISTRIAL",
          error: errorMessage,
          elapsedTime: Date.now() - (prev.startTime || Date.now()),
        }));
      }
    },
    [simulateStreaming, clearStreaming]
  );

  /**
   * Reset the trial completely
   */
  const resetTrial = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    clearStreaming();
    if (timerRef.current) clearInterval(timerRef.current);
    setState(INITIAL_TRIAL_STATE);
  }, [clearStreaming]);

  return {
    state,
    startTrial,
    resetTrial,
    setConflict: (conflict: string) =>
      setState((prev) => ({ ...prev, conflict, phase: "INPUTTING" })),
  };
}
