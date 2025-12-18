import { AiInsights } from "./components/AiInsights";
import { ProductivityChart } from "./components/ProductivityChart";
import { RoadmapProgressSnapshot } from "./components/RoadmapProgressSnapshot";
import { SkillGrowthHighlights } from "./components/SkillGrowthHighlights";
import { TaskCompletionOverview } from "./components/TaskCompletionOverview";
import { WeeklyStatsChart } from "./components/WeeklyStatsChart";
import { WeeklySummary } from "./components/WeeklySummary";

export default function ReportsPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Weekly Report</h2>
            </div>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <WeeklySummary />
                </div>
                <div className="lg:col-span-2">
                    <AiInsights />
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <RoadmapProgressSnapshot />
                <SkillGrowthHighlights />
                <TaskCompletionOverview />
            </div>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-2">
                    <WeeklyStatsChart />
                </div>
                <div className="lg:col-span-2">
                    <ProductivityChart />
                </div>
            </div>
        </div>
    );
}
