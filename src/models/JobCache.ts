import mongoose from 'mongoose';

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
  searchQuery: string;
  location: string;
  profileHash: string;
  jobs: IMatchedJobDoc[];
  lastFetched: Date;
}

const MatchedJobSchema = new mongoose.Schema(
  {
    externalId: String,
    title: String,
    company: String,
    location: String,
    salary: String,
    url: String,
    source: String,
    tags: [String],
    description: String,
    postedAt: String,
    matchPercentage: Number,
    matchReasons: [String],
  },
  { _id: false },
);

const JobCacheSchema = new mongoose.Schema<IJobCache>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    searchQuery: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: '',
    },

    profileHash: {
      type: String,
      default: '',
    },

    jobs: {
      type: [MatchedJobSchema],
      default: [],
    },

    lastFetched: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

JobCacheSchema.index({
  userId: 1,
  searchQuery: 1,
  location: 1,
  profileHash: 1,
});

export default mongoose.models.JobCache ||
  mongoose.model<IJobCache>('JobCache', JobCacheSchema);
