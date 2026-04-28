import mongoose from 'mongoose';

export interface IReality {
    myth: string;
    reality: string;
}

export interface IUpdate {
    title: string;
    source: string;
    description: string;
    link: string;
}

export interface ISkillROI {
    skill: string;
    time: string;
    growth: string;
    salary: string;
    score: number;
}

export interface ITechLifeMap {
    stage: string;
    tech: string[];
}

export interface IInsight {
    userId: mongoose.Types.ObjectId;
    realities: IReality[];
    updates: IUpdate[];
    skillROIs: ISkillROI[];
    techLifeMap: ITechLifeMap[];
    lastGenerated: Date;
}

const InsightSchema = new mongoose.Schema<IInsight>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        realities: [{ myth: String, reality: String }],
        updates: [{ title: String, source: String, description: String, link: String }],
        skillROIs: [{ skill: String, time: String, growth: String, salary: String, score: Number }],
        techLifeMap: [{ stage: String, tech: [String] }],
        lastGenerated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Insight || mongoose.model<IInsight>('Insight', InsightSchema);
