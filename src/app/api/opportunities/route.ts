import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnected from "@/lib/db";
import User from "@/models/User";
import JobCache from "@/models/JobCache";
import { fetchAllJobs } from "@/lib/jobs";
import { scoreAndRankJobs } from "@/lib/jobs";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ---------------------------------------------------------------------------
// GET /api/opportunities
// ---------------------------------------------------------------------------
// Fetches real-time job listings from multiple platforms (via JSearch/Google 
// for Jobs, Remotive, Arbeitnow), scores them against the user's profile 
// using AI, and returns ranked results.
//
// Query params:
//   ?refresh=true  — Force re-fetch, bypassing cache
//   ?search=keyword — Additional search term
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Map career goal roles to effective search queries
const CAREER_GOAL_SEARCH_MAP: Record<string, string> = {
  "Frontend Development": "frontend developer react",
  "Backend Development": "backend developer node.js",
  " Ai Enginner": "AI engineer machine learning",  // Note: keeping typo from User model
  "Cloud Enginner": "cloud engineer devops AWS",     // Note: keeping typo from User model
};

export async function GET(req: Request) {
  await dbConnected();
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const additionalSearch = url.searchParams.get("search") || "";

    // Build search query from user's career goal
    const careerRole = user.careerGoal?.role || "software developer";
    const baseQuery = CAREER_GOAL_SEARCH_MAP[careerRole] || careerRole;
    const locationParam = url.searchParams.get("location") || "";
    let searchQuery = additionalSearch
      ? `${baseQuery} ${additionalSearch}`
      : baseQuery;

    // Append location preference to improve search relevance
    if (locationParam) {
      searchQuery = `${searchQuery} ${locationParam}`;
    }

    // Check cache (unless force refresh)
    if (!forceRefresh) {
      const cached = await JobCache.findOne({ userId });
      if (cached && cached.lastFetched) {
        const age = Date.now() - new Date(cached.lastFetched).getTime();
        if (age < CACHE_TTL_MS) {
          console.log(`[Opportunities] Serving cached results (age: ${Math.round(age / 60000)}min)`);
          return NextResponse.json({
            jobs: cached.jobs,
            fromCache: true,
            cachedAt: cached.lastFetched,
            searchQuery,
          });
        }
      }
    }

    // Fetch fresh jobs from all sources
    console.log(`[Opportunities] Fetching fresh jobs for: "${searchQuery}"`);
    const rawJobs = await fetchAllJobs(searchQuery);

    if (rawJobs.length === 0) {
      return NextResponse.json({
        jobs: [],
        fromCache: false,
        message: "No jobs found. Try updating your career goal in your profile.",
        searchQuery,
      });
    }

    // Build user profile for AI matching
    const userProfile = {
      skills: (user.skills || []).map((s: any) => ({
        name: s.name,
        level: s.level,
      })),
      careerGoal: careerRole,
      education: user.education || "",
      locationPreference: user.locationPreference || locationParam || "",
    };

    // Score jobs with AI
    const matchedJobs = await scoreAndRankJobs(rawJobs, userProfile);

    // Cache the results (upsert)
    await JobCache.findOneAndUpdate(
      { userId },
      {
        userId,
        jobs: matchedJobs,
        searchQuery,
        lastFetched: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log(`[Opportunities] Returning ${matchedJobs.length} scored jobs`);

    return NextResponse.json({
      jobs: matchedJobs,
      fromCache: false,
      searchQuery,
    });
  } catch (error) {
    console.error("[Opportunities] Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch opportunities. Please try again." },
      { status: 500 }
    );
  }
}
