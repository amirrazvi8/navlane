import { Annotation } from "@langchain/langgraph";

/**
 * The shared state passed between nodes in our AI fallback graph.
 */
export const AIState = Annotation.Root({
  /** The user / system prompt to send to the LLM */
  prompt: Annotation<string>,
  
  /** Optional system-level instruction (e.g. "respond only with JSON") */
  systemPrompt: Annotation<string | undefined>,
  
  /** The raw text result on success */
  result: Annotation<string | undefined>,
  
  /** Last error encountered (carried between nodes for debugging/reporting) */
  error: Annotation<string | undefined>,
  
  /** 
   * Flag indicating whether all Gemini models were rate-limited.
   * This is used by the conditional edge to trigger the Groq fallback.
   */
  geminiExhausted: Annotation<boolean>,
});

export type AIStateType = typeof AIState.State;
