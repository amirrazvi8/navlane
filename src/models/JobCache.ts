import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// JobCache Model
// ---------------------------------------------------------------------------
// Caches fetched + AI-scored job listings per user to conserve API rate limits.
// TTL is managed at the application level (checked in the API route).
// ---------------------------------------------------------------------------

export interface IMatchedJobDoc {
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

export interface IJobCache {
  userId: mongoose.Types.ObjectId;
  jobs: IMatchedJobDoc[];
  searchQuery: string;
  lastFetched: Date;
}

const MatchedJobSchema = new mongoose.Schema<IMatchedJobDoc>({
  externalId: { type: String },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: "Not specified" },
  salary: { type: String, default: "Not disclosed" },
  url: { type: String, required: true },
  source: { type: String, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, default: "" },
  postedAt: { type: String, default: "Recently" },
  matchPercentage: { type: Number, default: 50 },
  matchReasons: { type: [String], default: [] },
}, { _id: false });

const JobCacheSchema = new mongoose.Schema<IJobCache>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    jobs: { type: [MatchedJobSchema], default: [] },
    searchQuery: { type: String, default: "" },
    lastFetched: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.JobCache || mongoose.model<IJobCache>('JobCache', JobCacheSchema);
