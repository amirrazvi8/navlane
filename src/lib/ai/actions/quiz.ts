import { runWithFallback } from "../graph";
import { getQuizPrompt } from "../prompts";

/**
 * Generates a multiple-choice quiz for a completed milestone.
 * 
 * @param milestoneTitle The title of the module/milestone
 * @param milestoneDescription A brief description of the module
 * @param subtaskTitles The specific topics covered
 * @returns Parsed JSON array of quiz questions
 */
export const generateQuizWithAI = async (
  milestoneTitle: string,
  milestoneDescription: string,
  subtaskTitles: string[],
) => {
  const prompt = getQuizPrompt(milestoneTitle, milestoneDescription, subtaskTitles);
  
  const response = await runWithFallback(prompt);
  const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();
  
  return JSON.parse(jsonStr);
};
