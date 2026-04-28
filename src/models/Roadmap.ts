import mongoose from 'mongoose';

export interface ISubtask {
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface IMilestone {
  title: string;
  description: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  subtasks: ISubtask[];
}

export interface IRoadmap {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  goal: string;
  milestones: IMilestone[];
  isCompleted: boolean;
}

const SubtaskSchema = new mongoose.Schema<ISubtask>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
});

const MilestoneSchema = new mongoose.Schema<IMilestone>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'in-progress', 'completed'],
    default: 'upcoming',
  },
  subtasks: { type: [SubtaskSchema], default: [] },
});

const RoadmapSchema = new mongoose.Schema<IRoadmap>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: String, required: true },
    milestones: { type: [MilestoneSchema], default: [] },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.Roadmap) {
  delete mongoose.models.Roadmap;
}
export default mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
