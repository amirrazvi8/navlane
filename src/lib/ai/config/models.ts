import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

// ---------------------------------------------------------------------------
// Model Configurations
// We define fallback chains here. We try models in order from most capable 
// to lightest, falling back if they fail or hit rate limits.
// ---------------------------------------------------------------------------

/** Primary models (Google Gemini) */
export const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
] as const;

/** Fallback models (Groq Llama) */
export const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
] as const;

// ---------------------------------------------------------------------------
// Factory Helpers
// These create ready-to-use instances of the LangChain wrappers.
// ---------------------------------------------------------------------------

/**
 * Creates a LangChain wrapper for Google Gemini models.
 * @param modelName The specific Gemini model to use
 */
export const getGeminiModel = (
  modelName: string = GEMINI_MODELS[0],
): ChatGoogleGenerativeAI =>
  new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: process.env.GEMINI_API_KEY || "",
    temperature: 0.7,
    maxOutputTokens: 4096,
  });

/**
 * Creates a LangChain wrapper for Groq models.
 * @param modelName The specific Groq Llama model to use
 */
export const getGroqModel = (
  modelName: string = GROQ_MODELS[0],
): ChatGroq =>
  new ChatGroq({
    model: modelName,
    apiKey: process.env.GROQ_API_KEY || "",
    temperature: 0.7,
    maxTokens: 4096,
  });

// ---------------------------------------------------------------------------
// Error Classification
// ---------------------------------------------------------------------------

/** 
 * Helper to determine if an error is due to rate limits or overloaded servers.
 * If true, the system knows it should trigger a fallback to Groq.
 */
export const isRateLimitError = (err: unknown): boolean => {
  const e = err as any;
  return (
    e?.status === 429 ||
    e?.status === 503 ||
    e?.message?.includes("429") ||
    e?.message?.includes("503") ||
    e?.message?.includes("overloaded") ||
    e?.message?.includes("high demand") ||
    e?.message?.includes("RESOURCE_EXHAUSTED")
  );
};
