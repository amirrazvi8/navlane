// ---------------------------------------------------------------------------
// AI Prompt for Job-Profile Matching
// ---------------------------------------------------------------------------
// Instructs the AI to score each job listing against the user's profile
// and return structured JSON with match percentages and reasons.
// ---------------------------------------------------------------------------

export function getJobMatchingPrompt(
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
): string {
  const skillsList = userProfile.skills
    .map((s) => `${s.name} (${s.level})`)
    .join(", ");

  const jobsBlock = jobs
    .map(
      (j) =>
        `[Job ${j.index}] Title: "${j.title}" | Company: "${j.company}" | Tags: [${j.tags.join(", ")}] | Location: "${j.location}" | Description: "${j.description.slice(0, 300)}"`
    )
    .join("\n");

  return `You are a career matching AI. Score how well each job listing matches a candidate's profile.

## Candidate Profile
- **Skills**: ${skillsList || "Not specified"}
- **Career Goal**: ${userProfile.careerGoal || "Not specified"}
- **Education**: ${userProfile.education || "Not specified"}

## Job Listings
${jobsBlock}

## Instructions
For EACH job, return a JSON array of objects with:
- "index": the job index number
- "matchPercentage": integer 0-100 based on how well the job fits the candidate
- "matchReasons": array of 2-3 short strings explaining why it's a good/bad match

## Scoring Guidelines
- 90-100: Perfect fit — skills, role, and experience align exactly
- 75-89: Strong fit — most skills match, role is closely related
- 60-74: Moderate fit — some skill overlap, career path is adjacent
- 40-59: Weak fit — few skills match, different career direction
- 0-39: Poor fit — unrelated role or skillset

If the candidate has no skills listed, score based only on career goal alignment with job title.

Respond ONLY with valid JSON array, no markdown wrappers or explanations.

Example response:
[
  { "index": 0, "matchPercentage": 85, "matchReasons": ["Strong React skills match", "Frontend role aligns with career goal", "Remote work flexibility"] },
  { "index": 1, "matchPercentage": 45, "matchReasons": ["Backend focus doesn't match frontend goal", "Python required but not in skillset"] }
]`;
}
