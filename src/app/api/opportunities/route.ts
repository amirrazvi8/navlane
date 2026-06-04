import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnected from '@/lib/db';
import User from '@/models/User';
import JobCache from '@/models/JobCache';
import { fetchAllJobs } from '@/lib/jobs';
import { scoreAndRankJobs } from '@/lib/jobs';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

const CACHE_TTL_MS = 60 * 60 * 1000;

const CAREER_GOAL_SEARCH_MAP: Record<string, string> = {
  'Frontend Development': 'frontend developer react nextjs',
  'Backend Development': 'backend developer nodejs express',
  'Full Stack Development': 'full stack developer',
  'AI Engineer': 'AI engineer machine learning',
  'Cloud Engineer': 'cloud engineer aws devops',
  'DevOps Engineer': 'devops engineer kubernetes docker',
  'Data Science': 'data scientist python',
  'Mobile Development': 'android ios react native',
  Cybersecurity: 'cyber security engineer',
  'UI/UX Design': 'ui ux designer',
};

function keywordScore(job: any, query: string) {
  const words = query.toLowerCase().split(' ');

  const text = `
    ${job.title}
    ${job.description}
    ${job.tags?.join(' ') || ''}
  `.toLowerCase();

  return words.reduce(
    (score, word) => (text.includes(word) ? score + 1 : score),
    0,
  );
}

function generateProfileHash(user: any): string {
  const profileData = {
    skills: (user.skills || []).map((s: any) => `${s.name}:${s.level}`).sort(),
    careerGoal: user.careerGoal?.role || '',
    locationPreference: user.locationPreference || '',
    location: user.location || '',
  };
  return crypto
    .createHash('md5')
    .update(JSON.stringify(profileData))
    .digest('hex')
    .slice(0, 16);
}

export async function GET(req: Request) {
  await dbConnected();
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    const additionalSearch = url.searchParams.get('search') || '';
    const locationParam = url.searchParams.get('location') || '';

    const careerRole = user.careerGoal?.role || 'software developer';
    const baseQuery = CAREER_GOAL_SEARCH_MAP[careerRole] || careerRole;
    const searchQuery = additionalSearch
      ? `${baseQuery} ${additionalSearch}`
      : baseQuery;


    const userLocation =
      locationParam || user.locationPreference || user.location || '';

    const skillKeywords = (user.skills || [])
      .slice(0, 5)
      .map((s: any) => s.name)
      .join(' ');

    const profileHash = generateProfileHash(user);

    if (!forceRefresh) {
      const cached = await JobCache.findOne({
        userId,
        searchQuery,
        profileHash,
      });
      if (cached && cached.lastFetched) {
        const age = Date.now() - new Date(cached.lastFetched).getTime();
        if (age < CACHE_TTL_MS) {
          console.log(
            `[Opportunities] Serving cached results (age: ${Math.round(age / 60000)}min)`,
          );
          return NextResponse.json({
            jobs: cached.jobs,
            fromCache: true,
            cachedAt: cached.lastFetched,
            searchQuery,
          });
        }
      }
    }

    console.log(
      `[Opportunities] Fetching fresh jobs for: "${searchQuery}" in "${userLocation}" (skills for scoring: ${skillKeywords || 'none'})`,
    );
    const rawJobs = await fetchAllJobs(searchQuery, userLocation);

    if (rawJobs.length === 0) {
      return NextResponse.json({
        jobs: [],
        fromCache: false,
        message:
          'No jobs found. Try updating your career goal in your profile.',
        searchQuery,
      });
    }

    const filteredJobs = rawJobs
      .map((job) => ({
        ...job,
        keywordScore: keywordScore(job, searchQuery),
      }))
      .sort((a, b) => b.keywordScore - a.keywordScore)
      .slice(0, 30);

    const userProfile = {
      skills: (user.skills || []).map((s: any) => ({
        name: s.name,
        level: s.level,
      })),
      careerGoal: careerRole,
      education: user.education || '',
      locationPreference: userLocation,
    };

    const matchedJobs = await scoreAndRankJobs(filteredJobs, userProfile);


    await JobCache.findOneAndUpdate(
      { userId },
      {
        userId,
        jobs: matchedJobs,
        searchQuery,
        location: userLocation,
        profileHash,
        lastFetched: new Date(),
      },
      { upsert: true, new: true },
    );

    console.log(`[Opportunities] Returning ${matchedJobs.length} scored jobs`);

    return NextResponse.json({
      jobs: matchedJobs,
      fromCache: false,
      searchQuery,
    });
  } catch (error) {
    console.error('[Opportunities] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch opportunities. Please try again.' },
      { status: 500 },
    );
  }
}
