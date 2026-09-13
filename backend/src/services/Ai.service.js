import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateVisualization = async ({ code, language, prompt }) => {
  const request = {
    model: process.env.AI_MODEL || "gemini-3.6-flash",
    contents: `You are an AI code visualization generator. Given the programming language, source code, and request below, understand the algorithm without executing it. The source may be incomplete; do not invent behavior.

Language: ${language}
Source code:\n${code}
User request: ${prompt}

Return ONLY complete JSX source code, with no Markdown, JSON, or explanation. It must export exactly \`export default function GeneratedVisualization()\` and require no props. It may use only \`import React, { useState, useEffect } from "react";\` (or no import). Use inline styles and no external assets.

Create meaningful states that explain the actual algorithm (arrays, sorting comparisons/swaps, search pointers, linked-list arrows, stack/queue operations, SVG/HTML trees and graphs, or recursion call stacks as appropriate). Include an explanation for the active state.

Implement Previous, Play, Pause, Next, and Reset controls. Previous/Next must stay in bounds, Play must restart at the final state, Reset must stop playback and return to the first state, and timers must be cleaned up in useEffect.

Never use any API, network request, storage, browser global, routing, backend call, filesystem access, eval, new Function, script tag, or import besides the permitted React import.`,
  };

  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await ai.models.generateContent(request);
      if (!response.text?.trim()) throw new Error("Gemini returned an empty response.");
      return response.text.trim();
    } catch (error) {
      lastError = error;
      const retryable = /\b(429|500|502|503|504|UNAVAILABLE|RESOURCE_EXHAUSTED)\b/i.test(error.message || "");
      if (!retryable || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }
  throw new Error(`Gemini generation failed: ${lastError?.message || "Unknown error"}`);
};