import { AIStateType } from "./state";

/**
 * Conditional edge function.
 * Determines what node to run next after the Gemini node finishes.
 * 
 * @param state Current graph state
 * @returns The name of the next node ("groq_fallback") or "end"
 */
export function shouldFallback(state: AIStateType): "groq_fallback" | "end" {
  // If Gemini succeeded and produced a result, we are done.
  if (state.result) return "end";
  
  // If Gemini failed specifically due to rate limits/exhaustion, try Groq.
  if (state.geminiExhausted) return "groq_fallback";
  
  // If it failed for a non-rate-limit reason (e.g. invalid prompt structure), 
  // we end here and let the caller handle the throw.
  return "end";
}
