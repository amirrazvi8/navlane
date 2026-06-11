import { StateGraph, START, END } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AIState } from "./state";
import { geminiNode, groqFallbackNode } from "./nodes";
import { shouldFallback } from "./edges";
import { GEMINI_MODELS, GROQ_MODELS, getGeminiModel, getGroqModel, isRateLimitError } from "../config/models";

// ---------------------------------------------------------------------------
// Graph Compilation
// ---------------------------------------------------------------------------

/**
 * Builds and compiles the LangGraph StateGraph.
 * Structure: START -> gemini -> (shouldFallback?) -> groq_fallback -> END
 */
function buildFallbackGraph() {
  return new StateGraph(AIState)
    .addNode("gemini", geminiNode)
    .addNode("groq_fallback", groqFallbackNode)
    .addEdge(START, "gemini")
    .addConditionalEdges("gemini", shouldFallback, {
      groq_fallback: "groq_fallback",
      end: END,
    })
    .addEdge("groq_fallback", END)
    .compile();
}

// Compile the graph once to reuse across requests
const compiledGraph = buildFallbackGraph();

// ---------------------------------------------------------------------------
// Public Graph Runners
// ---------------------------------------------------------------------------

/**
 * Run a standard text prompt through the fallback graph.
 * 
 * @param prompt The main user prompt
 * @param systemPrompt Optional system instruction
 * @returns The raw text response from the succeeding LLM
 * @throws Error if all models fail
 */
export async function runWithFallback(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  const result = await compiledGraph.invoke({
    prompt,
    systemPrompt,
    result: undefined,
    error: undefined,
    geminiExhausted: false,
  });

  if (result.result) return result.result;

  throw new Error(result.error || "All AI models failed.");
}

/**
 * Run a multimodal prompt (text + base64 file) through the fallback chain.
 * Gemini receives the file as inline data; Groq receives extracted text.
 * 
 * Note: Since LangGraph StateGraph requires structured state, and multimodal
 * handling is complex (converting base64 for vision vs pdf), we run this 
 * procedurally mimicking the graph's fallback flow.
 */
export async function runWithFallbackMultimodal(
  prompt: string,
  base64Data: string,
  mimeType: string,
): Promise<string> {
  const isImage = mimeType.startsWith("image/");
  let lastError: any = null;
  let geminiExhausted = false;

  // --- Step 1: Try Gemini ---
  for (const modelName of GEMINI_MODELS) {
    const model = getGeminiModel(modelName);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {

        const message = new HumanMessage({
          content: [
            { type: "image_url", image_url: `data:${mimeType};base64,${base64Data}` },
            { type: "text", text: prompt },
          ],
        });

        const response = await model.invoke([message]);
        return typeof response.content === "string" 
            ? response.content 
            : JSON.stringify(response.content);
      } catch (err: any) {
        lastError = err;
        if (isRateLimitError(err)) geminiExhausted = true;
        if (isRateLimitError(err) && attempt < 1) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        break;
      }
    }
  }

  // --- Step 2: Fallback to Groq ---
  if (geminiExhausted) {


    for (const modelName of GROQ_MODELS) {
      const model = getGroqModel(modelName);

      for (let attempt = 0; attempt < 2; attempt++) {
        try {


          let messages;
          if (isImage) {
            messages = [
              new HumanMessage({
                content: [
                  { type: "image_url", image_url: `data:${mimeType};base64,${base64Data}` },
                  { type: "text", text: prompt },
                ],
              }),
            ];
          } else {
            // For PDFs, we assume text extraction was needed, or pass as context
            const textContent = Buffer.from(base64Data, "base64").toString("utf-8");
            messages = [
              new SystemMessage("You are a helpful AI assistant. Always respond with valid JSON only. No markdown wrappers."),
              new HumanMessage(`Document Content:\n\n---\n${textContent}\n---\n\n${prompt}`),
            ];
          }

          const response = await model.invoke(messages);
          return typeof response.content === "string" 
            ? response.content 
            : JSON.stringify(response.content);
        } catch (err: any) {
          lastError = err;
          const isRetryable = err?.status === 429 || err?.status === 503;
          if (isRetryable && attempt < 1) {
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          break;
        }
      }
    }
  }

  throw lastError || new Error("All AI models failed for multimodal request.");
}
