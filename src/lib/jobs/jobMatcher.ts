// ---------------------------------------------------------------------------
// Job Matching Service
// ---------------------------------------------------------------------------
// Orchestrates the full flow: takes raw job listings + user profile,
// sends them to AI for scoring, and returns matched results sorted by score.
// Processes jobs in batches to stay within AI token limits.
// ---------------------------------------------------------------------------

import { IJobListing } from "./jobFetcher";
import { matchJobsWithAI } from "../ai/actions/opportunities";

export interface IMatchedJob extends IJobListing {
  matchPercentage: number;
  matchReasons: string[];
}

interface UserProfile {
  skills: { name: string; level: string }[];
  careerGoal: string;
  education: string;
  locationPreference?: string;
}

const BATCH_SIZE = 10; // Process 10 jobs per AI call to manage token limits

/**
 * Scores and ranks job listings against a user profile using AI.
 * Processes in batches and returns results sorted by match percentage.
 */
export async function scoreAndRankJobs(
  jobs: IJobListing[],
  userProfile: UserProfile
): Promise<IMatchedJob[]> {
  if (jobs.length === 0) return [];

  console.log(`[JobMatcher] Scoring ${jobs.length} jobs against user profile...`);

  const matchedJobs: IMatchedJob[] = [];

  // Process in batches
  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);
    const batchForAI = batch.map((job, idx) => ({
      index: i + idx,
      title: job.title,
      company: job.company,
      tags: job.tags,
      description: job.description,
      location: job.location,
    }));

    try {
      const scores = await matchJobsWithAI(userProfile, batchForAI);

      // Merge scores back into job listings
      batch.forEach((job, batchIdx) => {
        const globalIdx = i + batchIdx;
        const score = scores.find((s) => s.index === globalIdx);

        matchedJobs.push({
          ...job,
          matchPercentage: score?.matchPercentage ?? 50,
          matchReasons: score?.matchReasons ?? ["Default match score"],
        });
      });
    } catch (error) {
      console.error(`[JobMatcher] AI scoring failed for batch ${i}-${i + batch.length}:`, error);
      // Add jobs with default scores if AI fails for this batch
      batch.forEach((job) => {
        matchedJobs.push({
          ...job,
          matchPercentage: 50,
          matchReasons: ["AI scoring temporarily unavailable"],
        });
      });
    }
  }

  // Sort by match percentage descending
  matchedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

  console.log(`[JobMatcher] Scoring complete. Top match: ${matchedJobs[0]?.matchPercentage}%`);
  return matchedJobs;
}
