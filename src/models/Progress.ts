import mongoose from 'mongoose';

export interface IProgress {
    userId: mongoose.Types.ObjectId;
    roadmapId: mongoose.Types.ObjectId;
    completedMilestones: mongoose.Types.ObjectId[];
    weeklyReports: { week: number; feedback: string; date: Date }[];
}

const ProgressSchema = new mongoose.Schema<IProgress>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true },
        completedMilestones: { type: [mongoose.Schema.Types.ObjectId], default: [] },
        weeklyReports: [
            {
                week: { type: Number, required: true },
                feedback: { type: String, required: true },
                date: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
