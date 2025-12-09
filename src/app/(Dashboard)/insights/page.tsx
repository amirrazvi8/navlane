import { TrendingSkills } from "./components/TrendingSkills";
import { HotColdFields } from "./components/HotColdFields";
import { MarketDemandLevels } from "./components/MarketDemandLevels";
import { CrowdedVsNonCrowded } from "./components/CrowdedVsNonCrowded";
import { LatestTechUpdates } from "./components/LatestTechUpdates";

export default function InsightsPage() {
    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tech & Career Insights</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-7 space-y-6 grid gap-6 lg:grid-cols-2">
                    <TrendingSkills/>
                    <HotColdFields />
                </div>

                <div className="col-span-7 space-y-6 grid gap-6 lg:grid-cols-2">
                    <MarketDemandLevels />
                    <CrowdedVsNonCrowded />
                </div>
                <div className="col-span-7">
                    <LatestTechUpdates/>
                </div>
            </div>
        </div>
    );
}
