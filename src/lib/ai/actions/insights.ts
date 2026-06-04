import { runWithFallback } from "../graph";
import { getInsightsPrompt } from "../prompts";

/**
 * Generates tech industry insights using the AI fallback graph.
 * 
 * @param goal The user's target career goal
 * @returns Parsed JSON object containing realities, updates, ROI, and tech lifemap
 */
export const generateInsightsWithAI = async (goal: string) => {
  const prompt = getInsightsPrompt(goal);
  
  const response = await runWithFallback(prompt);
  const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();
  
  return JSON.parse(jsonStr);
};
