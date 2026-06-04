import { runWithFallback } from "../graph";
import { getRoadmapPrompt } from "../prompts";

/**
 * Generates a step-by-step learning roadmap using the AI fallback graph.
 * 
 * @param goal The user's target career goal
 * @param skills The user's current skills
 * @returns Parsed JSON array of milestones
 */
export const generateRoadmapWithAI = async (goal: string, skills: string) => {
  const prompt = getRoadmapPrompt(goal, skills);
  
  // The graph automatically handles routing between Gemini and Groq
  const response = await runWithFallback(prompt);
  
  // Clean up any markdown wrappers the model might return
  const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();
  
  return JSON.parse(jsonStr);
};
