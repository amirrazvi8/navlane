import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateWithGroq } from "./groq";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/** Helper: check if an error is a rate-limit / unavailable error */
const isGeminiExhausted = (err: any): boolean =>
  err?.status === 429 ||
  err?.status === 503 ||
  err?.message?.includes("429") ||
  err?.message?.includes("503") ||
  err?.message?.includes("overloaded") ||
  err?.message?.includes("high demand") ||
  err?.message?.includes("RESOURCE_EXHAUSTED");

export const generateRoadmapWithAI = async (goal: string, skills: string) => {
  const MODEL_CHAIN = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

  const prompt = `
  You are an expert career and technical mentor. 
  The user wants to achieve this career goal: "${goal}". 
  Their current skills are: "${skills}".
  
  Generate a step-by-step learning roadmap. Return strictly a JSON array of milestones matching this EXACT structure:
  [
    {
      "title": "Milestone Title (e.g. Backend with Node.js)",
      "description": "Short description of what they will learn",
      "status": "upcoming",
      "subtasks": [
        { "title": "Subtask 1 (e.g. Node.js Basics)", "completed": false },
        { "title": "Subtask 2 (e.g. Express.js Routing)", "completed": false }
      ]
    }
  ]
  Set exactly one milestone to have "status": "in-progress" if applicable, otherwise all "upcoming".
  Provide around 4 to 6 milestones with 3-5 subtasks each.
  Respond ONLY with the raw JSON array. No markdown, no backticks.
  `;

  let lastError: any = null;
  let geminiExhausted = false;

  // --- Try Gemini models first ---
  for (const modelName of MODEL_CHAIN) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[Roadmap] Trying Gemini model: ${modelName} (attempt ${attempt + 1})`);
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
      } catch (err: any) {
        lastError = err;
        if (isGeminiExhausted(err)) {
          geminiExhausted = true;
        }
        const isRetryable = isGeminiExhausted(err);
        if (isRetryable && attempt < 1) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        break;
      }
    }
  }

  // --- Fallback to Groq if Gemini is exhausted ---
  if (geminiExhausted) {
    try {
      console.log("[Roadmap] Gemini exhausted — falling back to Groq");
      const groqResponse = await generateWithGroq(prompt);
      const jsonStr = groqResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (groqErr: any) {
      console.error("[Roadmap] Groq fallback also failed:", groqErr);
      throw groqErr;
    }
  }

  throw lastError || new Error("Failed to generate roadmap with AI.");
};

export const generateInsightsWithAI = async (goal: string) => {
  const MODEL_CHAIN = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

  const prompt = `
  You are an expert tech industry analyst. Focus specifically on the career goal: "${goal}".
  Provide dynamic, realistic market insights. Return strictly a single JSON object with these 4 sections matching this exact schema:
  {
    "realities": [ { "myth": "...", "reality": "..." } ],
    "updates": [ { "title": "...", "source": "...", "description": "...", "link": "https://actual-working-url.com/article" } ],
    "skillROIs": [ { "skill": "...", "time": "6-8 weeks", "growth": "+20%", "salary": "+15%", "score": 8.5 } ],
    "techLifeMap": [ 
       { "stage": "Emerging", "tech": ["...", "..."] },
       { "stage": "Growing", "tech": ["...", "..."] },
       { "stage": "Peak", "tech": ["...", "..."] },
       { "stage": "Declining", "tech": ["...", "..."] }
    ]
  }
  Ensure there are exactly 4 realities, exactly 5 updates, exactly 4 skillROIs, and exactly those 4 stages in techLifeMap. Make them highly specific to the "${goal}" role. No markdown wrappers.
  `;

  let lastError: any = null;
  let geminiExhausted = false;

  for (const modelName of MODEL_CHAIN) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[Insights] Trying Gemini model: ${modelName} (attempt ${attempt + 1})`);
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
      } catch (err: any) {
        lastError = err;
        if (isGeminiExhausted(err)) {
          geminiExhausted = true;
        }
        const isRetryable = isGeminiExhausted(err);
        if (isRetryable && attempt < 1) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        break;
      }
    }
  }

  // --- Fallback to Groq ---
  if (geminiExhausted) {
    try {
      console.log("[Insights] Gemini exhausted — falling back to Groq");
      const groqResponse = await generateWithGroq(prompt);
      const jsonStr = groqResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (groqErr: any) {
      console.error("[Insights] Groq fallback also failed:", groqErr);
      throw groqErr;
    }
  }

  throw lastError || new Error("Failed to parse AI insights generation.");
};

export const generateQuizWithAI = async (
  milestoneTitle: string,
  milestoneDescription: string,
  subtaskTitles: string[]
) => {
  const MODEL_CHAIN = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

  const prompt = `
  You are an expert technical quiz creator. Generate a quiz to test knowledge on the following module:

  Module: "${milestoneTitle}"
  Description: "${milestoneDescription}"
  Subtopics covered:
  ${subtaskTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

  Generate exactly 5 multiple-choice questions that:
  - Are CONCEPTUAL and APPLICATION-BASED (NOT trivial recall or definitions)
  - Are MEDIUM to HARD difficulty
  - Test deep understanding of the subtopics
  - Each has exactly 4 options labeled A, B, C, D
  - Have exactly one correct answer
  - Include a brief explanation for the correct answer

  Return strictly a JSON array matching this EXACT structure:
  [
    {
      "id": 1,
      "question": "What happens when...",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "B",
      "explanation": "Brief explanation of why B is correct"
    }
  ]

  Respond ONLY with the raw JSON array. No markdown, no backticks.
  `;

  let lastError: any = null;
  let geminiExhausted = false;

  for (const modelName of MODEL_CHAIN) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[Quiz] Trying Gemini model: ${modelName} (attempt ${attempt + 1})`);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonStr = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
      } catch (err: any) {
        lastError = err;
        if (isGeminiExhausted(err)) {
          geminiExhausted = true;
        }
        const isRetryable = isGeminiExhausted(err);
        if (isRetryable && attempt < 1) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        break;
      }
    }
  }

  // --- Fallback to Groq ---
  if (geminiExhausted) {
    try {
      console.log("[Quiz] Gemini exhausted — falling back to Groq");
      const groqResponse = await generateWithGroq(prompt);
      const jsonStr = groqResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (groqErr: any) {
      console.error("[Quiz] Groq fallback also failed:", groqErr);
      throw groqErr;
    }
  }

  throw lastError || new Error("Failed to generate quiz with AI.");
};
