import { WelcomeHeader } from "./components/WelcomeHeader";
import { TodaysTasks } from "./components/TodaysTasks";
import { RoadmapSnapshot } from "./components/RoadmapSnapshot";
import { QuickActions } from "./components/QuickActions";
import { WeeklyStatsChart } from "./components/WeeklyStatsChart";
import { TopSkills } from "./components/TopSkills";

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4">
            <WelcomeHeader />

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                <div className="grid gap-6 lg:grid-cols-2">
                    <TodaysTasks />
                    <WeeklyStatsChart/>
                </div>

                <div className="col-span2 gap-6 grid lg:grid-cols-2">
                    <RoadmapSnapshot />
                    <TopSkills/>
                </div>
                <div className="col-span-">
                    <QuickActions />
                    
                </div>
                
            </div>
        </div>
    );
}
