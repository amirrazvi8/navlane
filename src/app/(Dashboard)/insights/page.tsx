import { LatestTechUpdates } from "./components/LatestTechUpdates";
import { TechnologyLifeMap } from "./components/TechnologyLifeMap";
import { SkillROI } from "./components/SkillROI";
import { IndustryReality } from "./components/IndustryReality";
import { auth } from "@/auth";

import dbConnected from "@/lib/db";
import User from "@/models/User";
import Insight from "@/models/Insight";
import { generateInsightsWithAI } from "@/lib/ai";

export default async function InsightsPage() {
    await dbConnected();
    const session = await auth();
    let insightData: any = null;

    if (session && session.user) {
        const user = await User.findById((session.user as any).id);
        const careerRole = user?.careerGoal?.role || "Software Engineer";

        let insight = await Insight.findOne({ userId: user._id });
        const fifteenDays = 15 * 24 * 60 * 60 * 1000;

        const isStale = insight ? (Date.now() - new Date(insight.lastGenerated).getTime() > fifteenDays) : false;

        if (!insight || isStale) {
            console.log("Generating fresh AI insights...");
            const aiData = await generateInsightsWithAI(careerRole);
            if (!insight) {
                insight = new Insight({ userId: user._id, ...aiData });
            } else {
                insight.realities = aiData.realities;
                insight.updates = aiData.updates;
                insight.skillROIs = aiData.skillROIs;
                insight.techLifeMap = aiData.techLifeMap;
                insight.lastGenerated = Date.now();
            }
            await insight.save();
        }
        insightData = JSON.parse(JSON.stringify(insight));
    }
    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tech & Career Insights</h2>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <TechnologyLifeMap mapData={insightData?.techLifeMap} />
                <SkillROI roiData={insightData?.skillROIs} />
            </div>
            <IndustryReality realitiesData={insightData?.realities} />
            <LatestTechUpdates updatesData={insightData?.updates} />
        </div>
    );
}
