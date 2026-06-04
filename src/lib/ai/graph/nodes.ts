import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AIStateType } from "./state";
import {
  GEMINI_MODELS,
  GROQ_MODELS,
  getGeminiModel,
  getGroqModel,
  isRateLimitError,
} from "../config/models";

/**
 * Node: Tries to generate content using the Gemini model chain.
 * Iterates through primary models, retrying on rate limits.
 */
export async function geminiNode(state: AIStateType): Promise<Partial<AIStateType>> {
  const messages = [
    ...(state.systemPrompt ? [new SystemMessage(state.systemPrompt)] : []),
    new HumanMessage(state.prompt),
  ];

  let lastError: any = null;

  for (const modelName of GEMINI_MODELS) {
    const model = getGeminiModel(modelName);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[LangGraph·Gemini] Trying ${modelName} (attempt ${attempt + 1})`);
        const response = await model.invoke(messages);
        
        // Extract string response from the LangChain message object
        const text =
          typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

        return { result: text, error: undefined, geminiExhausted: false };
      } catch (err: any) {
        lastError = err;
        
        // If it's a rate limit on the first attempt, wait and retry the same model
        if (isRateLimitError(err) && attempt < 1) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        
        // Otherwise, break and move to the next Gemini model in the chain
        break; 
      }
    }
  }

  // If we reach here, all Gemini models failed.
  // We set geminiExhausted to true if the final error was a rate limit,
  // which will trigger the conditional edge to route to Groq.
  return {
    result: undefined,
    error: lastError?.message || "All Gemini models failed",
    geminiExhausted: isRateLimitError(lastError),
  };
}

/**
 * Node: Fallback using the Groq Llama model chain.
 * Only runs if the geminiNode sets geminiExhausted to true.
 */
export async function groqFallbackNode(state: AIStateType): Promise<Partial<AIStateType>> {
  const messages = [
    new SystemMessage(
      state.systemPrompt ||
        "You are a helpful AI assistant. Always respond with valid JSON only. No markdown wrappers, no backticks, no extra text.",
    ),
    new HumanMessage(state.prompt),
  ];

  let lastError: any = null;

  for (const modelName of GROQ_MODELS) {
    const model = getGroqModel(modelName);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[LangGraph·Groq] Trying ${modelName} (attempt ${attempt + 1})`);
        const response = await model.invoke(messages);
        
        const text =
          typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

        return { result: text, error: undefined };
      } catch (err: any) {
        lastError = err;
        const isRetryable =
          err?.status === 429 ||
          err?.status === 503 ||
          err?.message?.includes("429") ||
          err?.message?.includes("503");

        if (isRetryable && attempt < 1) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        break;
      }
    }
  }

  return {
    result: undefined,
    error: lastError?.message || "All Groq models failed",
  };
}
