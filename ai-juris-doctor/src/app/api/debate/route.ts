// src/app/api/debate/route.ts
// ---------------------------------------------------
// API Route: Orchestrates the 3-agent debate pipeline
// Prosecution -> Defense -> Judge (sequential chain)
// Uses Google Gemini API for all three agents
// ---------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  PROSECUTION_PROMPT,
  DEFENSE_PROMPT,
  JUDGE_PROMPT,
} from "@/lib/prompts";

function geminiErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return err instanceof Error ? err.message : String(err);
}

export async function POST(req: NextRequest) {
  try {
    const { conflict } = await req.json();

    if (!conflict || typeof conflict !== "string" || conflict.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid conflict description (min 5 characters)." },
        { status: 400 }
      );
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Set GEMINI_API_KEY in your .env.local file." },
        { status: 500 }
      );
    }

    // gemini-1.5-flash is deprecated; use a current stable id (override with GEMINI_MODEL in .env.local).
    const modelId = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    // ========================================
    // PHASE 1: Prosecution builds their case
    // ========================================
    let prosecutionArgument: string;
    try {
      const prosecutionResult = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${PROSECUTION_PROMPT}\n\nTHE CONFLICT:\n"${conflict}"\n\nPresent your prosecution case now.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1024,
          topP: 0.95,
        },
      });

      prosecutionArgument =
        prosecutionResult.response?.text() || "The prosecution rests without argument.";
    } catch (err) {
      console.error("Prosecution agent failed:", err);
      return NextResponse.json(
        {
          error: "MISTRIAL: The Prosecution attorney suffered a catastrophic malfunction. Court is adjourned.",
          phase: "PROSECUTION",
          ...(process.env.NODE_ENV === "development" && {
            details: geminiErrorMessage(err),
          }),
        },
        { status: 500 }
      );
    }

    // ========================================
    // PHASE 2: Defense rebuts the prosecution
    // ========================================
    let defenseArgument: string;
    try {
      const defenseResult = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${DEFENSE_PROMPT}\n\nTHE ORIGINAL CONFLICT:\n"${conflict}"\n\nTHE PROSECUTION'S ARGUMENT:\n"${prosecutionArgument}"\n\nPresent your defense rebuttal now. Address their specific points.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 1024,
          topP: 0.95,
        },
      });

      defenseArgument =
        defenseResult.response?.text() || "The defense rests without rebuttal.";
    } catch (err) {
      console.error("Defense agent failed:", err);
      return NextResponse.json(
        {
          error: "MISTRIAL: The Defense attorney has been rendered incapacitated. Court is adjourned.",
          phase: "DEFENSE",
          ...(process.env.NODE_ENV === "development" && {
            details: geminiErrorMessage(err),
          }),
        },
        { status: 500 }
      );
    }

    // ========================================
    // PHASE 3: Judge delivers verdict
    // ========================================
    let judgeRaw: string;
    try {
      const judgeResult = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${JUDGE_PROMPT}\n\nCASE DETAILS:\nConflict: "${conflict}"\n\nPROSECUTION ARGUMENT:\n"${prosecutionArgument}"\n\nDEFENSE ARGUMENT:\n"${defenseArgument}"\n\nDeliver your verdict as the specified JSON object.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          topP: 0.8,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              verdict: { type: SchemaType.STRING },
              reasoning: { type: SchemaType.STRING },
              damages: { type: SchemaType.STRING },
              confidence: { type: SchemaType.NUMBER },
              precedent: { type: SchemaType.STRING },
            },
            required: ["verdict", "reasoning", "damages", "confidence", "precedent"],
          },
        },
      });

      judgeRaw =
        judgeResult.response?.text() ||
        '{"verdict":"MISTRIAL","reasoning":"Judge could not respond","damages":"None","confidence":0,"precedent":"N/A"}';
    } catch (err) {
      console.error("Judge agent failed:", err);
      return NextResponse.json(
        {
          error: "MISTRIAL: The Honorable Judge has recused themselves due to a system failure.",
          phase: "JUDGE",
          ...(process.env.NODE_ENV === "development" && {
            details: geminiErrorMessage(err),
          }),
        },
        { status: 500 }
      );
    }

    // ========================================
    // Return complete trial data
    // ========================================
    return NextResponse.json({
      success: true,
      prosecution: prosecutionArgument,
      defense: defenseArgument,
      judgeRaw: judgeRaw,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Unhandled debate error:", err);
    return NextResponse.json(
      {
        error: "CATASTROPHIC MISTRIAL: An unprecedented system failure has occurred. All parties are dismissed.",
        ...(process.env.NODE_ENV === "development" && {
          details: geminiErrorMessage(err),
        }),
      },
      { status: 500 }
    );
  }
}