import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

/**
 * Generate text content using Groq (Llama model).
 * Used as a fallback when Gemini API limits are exceeded.
 */
export const generateWithGroq = async (prompt: string): Promise<string> => {
  const MODEL_CHAIN = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

  let lastError: any = null;

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[Groq] Trying model: ${modelName} (attempt ${attempt + 1})`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant. Always respond with valid JSON only. No markdown wrappers, no backticks, no extra text.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: modelName,
          temperature: 0.7,
          max_tokens: 4096,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";
        return responseText;
      } catch (err: any) {
        lastError = err;
        const isRetryable =
          err?.status === 429 ||
          err?.status === 503 ||
          err?.message?.includes("429") ||
          err?.message?.includes("503") ||
          err?.message?.includes("overloaded");

        if (isRetryable && attempt < 1) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        break;
      }
    }
  }

  throw lastError || new Error("All Groq models failed.");
};

/**
 * Generate content with vision/file support using Groq.
 * Note: Groq vision models accept base64 images via data URIs.
 * For PDF files, we extract text description instead.
 */
export const generateWithGroqVision = async (
  prompt: string,
  base64Data: string,
  mimeType: string
): Promise<string> => {
  const MODEL_CHAIN = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

  let lastError: any = null;

  // Build messages — for image types we can use vision, for PDFs we pass the data as text context
  const isImage = mimeType.startsWith("image/");

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[Groq Vision] Trying model: ${modelName} (attempt ${attempt + 1})`);

        let messages: any[];

        if (isImage) {
          messages = [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`,
                  },
                },
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ];
        } else {
          // For PDF/document files, decode base64 and pass as text context
          const textContent = Buffer.from(base64Data, "base64").toString("utf-8");
          messages = [
            {
              role: "system",
              content: "You are a helpful AI assistant. Always respond with valid JSON only. No markdown wrappers, no backticks, no extra text.",
            },
            {
              role: "user",
              content: `Here is the content of the uploaded document:\n\n---\n${textContent}\n---\n\n${prompt}`,
            },
          ];
        }

        const chatCompletion = await groq.chat.completions.create({
          messages,
          model: modelName,
          temperature: 0.7,
          max_tokens: 4096,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";
        return responseText;
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

  throw lastError || new Error("All Groq vision models failed.");
};
