// Add utilities here.
// src/lib/utils.ts
// ---------------------------------------------------
// Utility functions for the trial system
// ---------------------------------------------------

import { Verdict } from "./types";

/**
 * Generate a unique trial ID in courtroom format
 */
export function generateTrialId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const suffix =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];
  return `CASE-${year}-${num}-${suffix}`;
}

/**
 * Best-effort parse when JSON was truncated or slightly malformed.
 */
function parseVerdictLoose(raw: string): Verdict | null {
  const verdictQuoted = raw.match(/"verdict"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
  const verdictBare = raw.match(/"verdict"\s*:\s*([^,}\]]+)/i);
  const verdict =
    (verdictQuoted?.[1] && verdictQuoted[1].replace(/\\"/g, '"').trim()) ||
    (verdictBare?.[1] && verdictBare[1].replace(/^"|"$/g, "").trim()) ||
    "";

  let reasoning = "";
  const reasoningStart = raw.match(/"reasoning"\s*:\s*"/i);
  if (reasoningStart && reasoningStart.index !== undefined) {
    const from = reasoningStart.index + reasoningStart[0].length;
    const rest = raw.slice(from);
    const endQuote = rest.search(/(?<!\\)"/);
    if (endQuote >= 0) {
      reasoning = rest.slice(0, endQuote).replace(/\\n/g, "\n").trim();
    } else {
      reasoning = rest.replace(/\\n/g, "\n").trim().slice(0, 800);
    }
  }

  const damagesM = raw.match(/"damages"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
  const confM = raw.match(/"confidence"\s*:\s*([\d.]+)/i);
  const precM = raw.match(/"precedent"\s*:\s*"((?:[^"\\]|\\.)*)"/i);

  if (!verdict && !reasoning) return null;

  const confidence = confM ? Math.round(Number(confM[1])) : 60;
  return {
    verdict: verdict || "UNDETERMINED",
    reasoning: reasoning || "The court issued a partial record; reasoning was incomplete.",
    damages: damagesM?.[1]?.replace(/\\"/g, '"') || "See court reasoning.",
    confidence: Number.isFinite(confidence) ? Math.min(100, Math.max(0, confidence)) : 60,
    precedent: precM?.[1]?.replace(/\\"/g, '"') || "N/A",
  };
}

/**
 * Parse the judge's JSON response, handling potential formatting issues
 */
export function parseJudgeVerdict(raw: string): Verdict {
  let jsonStr = raw.trim();
  jsonStr = jsonStr.replace(/```json\s*/gi, "").replace(/```\s*/g, "");

  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    return {
      verdict: String(parsed.verdict ?? "UNDETERMINED"),
      reasoning: String(parsed.reasoning ?? "The court could not reach a conclusion."),
      damages: String(parsed.damages ?? "No damages awarded."),
      confidence:
        typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
          ? Math.min(100, Math.max(0, Math.round(parsed.confidence)))
          : 75,
      precedent: String(parsed.precedent ?? "N/A"),
    };
  } catch {
    const loose = parseVerdictLoose(raw);
    if (loose) return loose;
    return {
      verdict: "MISTRIAL — PARSING ERROR",
      reasoning: raw.length > 280 ? `${raw.slice(0, 280)}…` : raw,
      damages: "Case must be retried.",
      confidence: 0,
      precedent: "N/A",
    };
  }
}

/**
 * Format elapsed time in mm:ss format
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Sample conflicts for quick-start buttons
 */
export const SAMPLE_CONFLICTS = [
  "My roommate ate my clearly labeled leftovers from the fridge",
  "My neighbor's dog keeps barking at 3 AM every single night",
  "My coworker keeps stealing my ideas and presenting them as their own",
  "My friend borrowed $50 six months ago and keeps 'forgetting' to pay me back",
  "My landlord refuses to fix the broken heater in the middle of winter",
  "My sibling ate the last slice of pizza that I was saving",
  "Someone keeps parking in my assigned parking spot at the apartment complex",
  "My partner refuses to admit they finished the ice cream and blamed the cat",
];