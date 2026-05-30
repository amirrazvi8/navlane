/**
 * Prompts for generating the user's learning roadmap.
 */
export const getRoadmapPrompt = (goal: string, skills: string) => `
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

/**
 * Prompts for generating tech industry insights.
 */
export const getInsightsPrompt = (goal: string) => `
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

/**
 * Prompts for generating a technical quiz.
 */
export const getQuizPrompt = (
  milestoneTitle: string,
  milestoneDescription: string,
  subtaskTitles: string[]
) => `
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

/**
 * Prompts for analyzing an uploaded resume against a career goal.
 */
export const getResumePrompt = (targetGoal: string) => `
You are an expert technical recruiter and career coach.
The user has uploaded their resume and wants to achieve this career goal: "${targetGoal}".
Analyze the provided resume against this target role. Identify the missing skills required to achieve this goal, provide actionable recommendations to bridge the gap, and evaluate the resume's current standing across key skill categories.

Return strictly a JSON object matching this EXACT structure:
{
  "missingSkills": [
    { "name": "Skill Name", "category": "Frontend | Backend | DevOps | Architecture | Other", "importance": "High" | "Medium" | "Low" }
  ],
  "recommendations": [
    { "title": "Recommendation Title", "description": "Short specific details", "type": "course" | "project" | "practice" }
  ],
  "currentStanding": {
    "overallScore": 65,
    "level": "Intermediate",
    "categories": [
      { "name": "Frontend", "score": 75, "maxScore": 100 },
      { "name": "Backend", "score": 50, "maxScore": 100 },
      { "name": "DevOps", "score": 30, "maxScore": 100 },
      { "name": "Soft Skills", "score": 70, "maxScore": 100 },
      { "name": "Tools & Ecosystem", "score": 60, "maxScore": 100 },
      { "name": "Architecture", "score": 40, "maxScore": 100 }
    ]
  }
}

For "currentStanding":
- Evaluate the resume's demonstrated proficiency in each category on a 0-100 scale based on experience, projects, and skills listed.
- "overallScore" should be a weighted average reflecting how well the resume matches the target goal (0-100).
- "level" should be one of: "Beginner", "Intermediate", "Advanced", "Expert".
- Always include all 6 categories even if the score is 0.

Provide 3-5 missing skills and 3-5 recommendations.
Respond ONLY with the raw JSON object. No markdown wrappers, no backticks.
`;
