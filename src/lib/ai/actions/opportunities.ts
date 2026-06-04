import { runWithFallback } from "../graph";
import { getJobMatchingPrompt } from "../prompts/opportunities";

/**
 * Uses AI (Gemini → Groq fallback) to score job listings against a user profile.
 * 
 * @param userProfile The user's skills, career goal, and education
 * @param jobs Array of job listings to score
 * @returns Array of { index, matchPercentage, matchReasons } for each job
 */
export const matchJobsWithAI = async (
  userProfile: {
    skills: { name: string; level: string }[];
    careerGoal: string;
    education: string;
  },
  jobs: {
    index: number;
    title: string;
    company: string;
    tags: string[];
    description: string;
    location: string;
  }[]
): Promise<{ index: number; matchPercentage: number; matchReasons: string[] }[]> => {
  if (jobs.length === 0) return [];

  const prompt = getJobMatchingPrompt(userProfile, jobs);

  const response = await runWithFallback(prompt);
  const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(jsonStr);
    
    // Validate the response structure
    if (!Array.isArray(parsed)) {
      console.error("[JobMatcher] AI response is not an array, using fallback scoring");
      return jobs.map((j) => ({
        index: j.index,
        matchPercentage: 50,
        matchReasons: ["AI scoring unavailable — showing default match"],
      }));
    }

    return parsed.map((item: any) => ({
      index: typeof item.index === "number" ? item.index : 0,
      matchPercentage: Math.min(100, Math.max(0, Number(item.matchPercentage) || 50)),
      matchReasons: Array.isArray(item.matchReasons) 
        ? item.matchReasons.map(String) 
        : ["Match calculated"],
    }));
  } catch (parseError) {
    console.error("[JobMatcher] Failed to parse AI response:", parseError);
    // Return default scores if AI fails
    return jobs.map((j) => ({
      index: j.index,
      matchPercentage: 50,
      matchReasons: ["AI scoring unavailable — showing default match"],
    }));
  }
};
