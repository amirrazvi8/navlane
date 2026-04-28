import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateRoadmapWithAI = async (goal: string, skills: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse Gemini response:", response);
    throw new Error("Failed to parse AI roadmap generation.");
  }
};

export const generateInsightsWithAI = async (goal: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse Gemini insights:", response);
    throw new Error("Failed to parse AI insights generation.");
  }
};
