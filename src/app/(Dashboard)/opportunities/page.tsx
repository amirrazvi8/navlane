"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  Briefcase,
  MapPin,
  DollarSign,
  Building,
  Search,
  Filter,
  Zap,
  RefreshCw,
  Loader2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Compass,
  X,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
  selectLocationPreference,
  selectSkills,
  selectIsHydrated,
} from "@/store/userProfileSlice";

interface MatchedJob {
  externalId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  url: string;
  source: string;
  tags: string[];
  description: string;
  postedAt: string;
  matchPercentage: number;
  matchReasons: string[];
}

export default function OpportunitiesPage() {
  const [jobs, setJobs] = useState<MatchedJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  // Redux profile state for filtering
  const locationPreference = useAppSelector(selectLocationPreference);
  const skills = useAppSelector(selectSkills);
  const isHydrated = useAppSelector(selectIsHydrated);

  const fetchOpportunities = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params = new URLSearchParams();
      if (refresh) params.set("refresh", "true");
      if (locationPreference) params.set("location", locationPreference);

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch opportunities");
      }

      setJobs(data.jobs || []);
      setFromCache(data.fromCache || false);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [locationPreference]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90)
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (percentage >= 75)
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    if (percentage >= 60)
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-emerald-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getSourceColor = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes("linkedin")) return "bg-blue-600/10 text-blue-600 border-blue-600/20";
    if (s.includes("indeed")) return "bg-purple-600/10 text-purple-600 border-purple-600/20";
    if (s.includes("glassdoor")) return "bg-green-600/10 text-green-600 border-green-600/20";
    if (s.includes("naukri")) return "bg-cyan-600/10 text-cyan-600 border-cyan-600/20";
    if (s.includes("remotive")) return "bg-indigo-600/10 text-indigo-600 border-indigo-600/20";
    if (s.includes("arbeitnow")) return "bg-rose-600/10 text-rose-600 border-rose-600/20";
    if (s.includes("wellfound")) return "bg-amber-600/10 text-amber-600 border-amber-600/20";
    return "bg-secondary text-secondary-foreground border-secondary";
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-5 w-96 bg-muted/60 rounded-md animate-pulse" />
        </div>

        {/* Search skeleton */}
        <div className="h-16 bg-card rounded-xl border animate-pulse" />

        {/* Cards skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border p-6 space-y-4 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex justify-between">
                <div className="h-6 w-24 bg-muted rounded-full" />
                <div className="h-6 w-20 bg-muted rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted/70 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted/50 rounded" />
                <div className="h-4 w-1/2 bg-muted/50 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted/40 rounded-md" />
                <div className="h-6 w-20 bg-muted/40 rounded-md" />
                <div className="h-6 w-14 bg-muted/40 rounded-md" />
              </div>
              <div className="pt-4 border-t flex justify-between">
                <div className="h-4 w-24 bg-muted/40 rounded" />
                <div className="h-9 w-28 bg-muted rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Opportunities
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time job matches tailored to your profile skills and experience.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {fromCache && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-md">
              <Clock className="h-3 w-3" />
              Cached results
            </span>
          )}
          <button
            onClick={() => fetchOpportunities(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Active Profile Filters */}
      {isHydrated && (locationPreference || skills.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Profile filters:
          </span>
          {locationPreference && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
              <Compass className="h-3 w-3" />
              {locationPreference}
            </span>
          )}
          {skills.slice(0, 5).map((skill) => (
            <span
              key={skill.name}
              className="inline-flex items-center gap-1 text-xs font-medium bg-secondary/50 text-secondary-foreground border border-secondary px-2.5 py-1 rounded-full"
            >
              {skill.name}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="text-xs text-muted-foreground">+{skills.length - 5} more</span>
          )}
        </div>
      )}

      {/* Prompt to set location preference */}
      {isHydrated && !locationPreference && (
        <div className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
          <Compass className="h-4 w-4 shrink-0 opacity-70" />
          <p className="text-xs">
            Set a <span className="font-medium">location preference</span> in your profile for better job matches.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Failed to load opportunities</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
          <button
            onClick={() => fetchOpportunities()}
            className="px-3 py-1.5 bg-destructive/20 rounded-lg text-sm font-medium hover:bg-destructive/30 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles, companies, skills, or sources..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background hover:bg-accent/10 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <Briefcase className="h-4 w-4" />
          <span>{filteredJobs.length} jobs found</span>
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.externalId}
            className="group relative flex flex-col justify-between bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 overflow-hidden"
          >
            {/* Background subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 space-y-5">
              {/* Top row: Match & Source */}
              <div className="flex justify-between items-start">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getMatchColor(
                    job.matchPercentage
                  )}`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {job.matchPercentage}% Match
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getSourceColor(job.source)}`}
                >
                  via {job.source}
                </span>
              </div>

              {/* Match progress bar */}
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(
                    job.matchPercentage
                  )}`}
                  style={{ width: `${job.matchPercentage}%` }}
                />
              </div>

              {/* Job Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
              </div>

              {/* Details (Location, Salary) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 opacity-70" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 opacity-70" />
                  <span>{job.salary}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {job.tags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {job.tags.length > 5 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{job.tags.length - 5} more
                  </span>
                )}
              </div>

              {/* Match Reasons (expandable) */}
              {job.matchReasons && job.matchReasons.length > 0 && (
                <div>
                  <button
                    onClick={() =>
                      setExpandedJob(
                        expandedJob === job.externalId ? null : job.externalId
                      )
                    }
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedJob === job.externalId ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                    Why this match?
                  </button>
                  {expandedJob === job.externalId && (
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">
                      {job.matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Row / Action */}
            <div className="relative z-10 mt-6 pt-5 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Posted {job.postedAt}
              </span>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-95 group-hover:shadow-sm"
              >
                Apply Now
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed flex flex-col items-center justify-center space-y-3">
            <Search className="h-10 w-10 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium">No opportunities found</h3>
            <p className="text-muted-foreground max-w-sm">
              {jobs.length === 0
                ? "Make sure your profile has skills and a career goal set, then click Refresh."
                : "We couldn't find any matches for your search. Try adjusting your search terms."}
            </p>
            {jobs.length === 0 && (
              <button
                onClick={() => fetchOpportunities(true)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Fetch Opportunities
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
