// Add shared types here.
// src/lib/types.ts
export type TrialPhase =
  | "IDLE"
  | "INPUTTING"
  | "PROSECUTION_STREAMING"
  | "DEFENSE_STREAMING"
  | "JUDGEMENT_PENDING"
  | "FINAL_VERDICT"
  | "MISTRIAL";

export interface Verdict {
  verdict: string;
  reasoning: string;
  damages: string;
  confidence: number;
  precedent: string;
}

export interface TrialState {
  phase: TrialPhase;
  conflict: string;
  prosecutionArgument: string;
  defenseArgument: string;
  verdict: Verdict | null;
  error: string | null;
  trialId: string;
  startTime: number | null;
  elapsedTime: number;
}

export interface AgentResponse {
  agent: "prosecution" | "defense" | "judge";
  content: string;
  done: boolean;
}

export interface DebateRequest {
  conflict: string;
}

export const INITIAL_TRIAL_STATE: TrialState = {
  phase: "IDLE",
  conflict: "",
  prosecutionArgument: "",
  defenseArgument: "",
  verdict: null,
  error: null,
  trialId: "",
  startTime: null,
  elapsedTime: 0,
};