import { LatestTechUpdates } from "./components/LatestTechUpdates";
import { TechnologyLifeMap } from "./components/TechnologyLifeMap";
import { SkillROI } from "./components/SkillROI";
import { IndustryReality } from "./components/IndustryReality";

export default function InsightsPage() {
    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tech & Career Insights</h2>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <TechnologyLifeMap />
                <SkillROI />
            </div>
            <IndustryReality />
            <LatestTechUpdates />
        </div>
    );
}
