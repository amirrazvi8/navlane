import { ProductivityChart } from "./components/ProductivityChart";
import { RoadmapProgressSnapshot } from "./components/RoadmapProgressSnapshot";
import { SkillGrowthHighlights } from "./components/SkillGrowthHighlights";
import { WeeklyStatsChart } from "./components/WeeklyStatsChart";
import { WeeklySummary } from "./components/WeeklySummary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnected from "@/lib/db";
import Roadmap from "@/models/Roadmap";

export default async function ReportsPage() {
    await dbConnected();
    const session = await getServerSession(authOptions);
    let activeRoadmap = null;
    let totalTasksThisWeek = 0;
    let streak = 0;
    let practicedSkills: string[] = [];
    let weeklyChartData: { name: string, tasks: number }[] = [];
    let productivityData: { day: string, score: number }[] = [];

    if (session && session.user) {
        const user = session.user as any;
        const allRoadmaps = await Roadmap.find({ userId: user.id });
        
        const rm = allRoadmaps.filter(r => !r.isCompleted).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
        if (rm) {
            activeRoadmap = JSON.parse(JSON.stringify(rm));
        }

        // Calculate Weekly Chart Data and Total Tasks
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const now = new Date();
        const counts = new Array(7).fill(0);
        
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            last7Days.push({ name: dayNames[d.getDay()], dateStr: d.toDateString() });
        }

        // Streak Calculation
        const completedDates = new Set<string>();
        const practicedSkillsSet = new Set<string>();

        allRoadmaps.forEach(r => {
            r.milestones.forEach((m: any) => {
                m.subtasks.forEach((st: any) => {
                    if (st.completed && st.completedAt) {
                        const dateStr = new Date(st.completedAt).toDateString();
                        completedDates.add(dateStr);
                        
                        // For Weekly Chart
                        const index = last7Days.findIndex(day => day.dateStr === dateStr);
                        if (index !== -1) {
                            counts[index]++;
                            totalTasksThisWeek++;
                            practicedSkillsSet.add(m.title);
                        }
                    }
                });
            });
        });

        practicedSkills = Array.from(practicedSkillsSet);
        weeklyChartData = last7Days.map((day, i) => ({ name: day.name, tasks: counts[i] }));
        
        // Calculate Productivity Score (Arbitrary logic: 4 tasks per day = 100% productivity)
        productivityData = weeklyChartData.map(d => ({
            day: d.name,
            score: Math.min(d.tasks * 25, 100)
        }));

        // Calculate Streak
        const sortedDates = Array.from(completedDates)
            .map(d => new Date(d))
            .sort((a, b) => b.getTime() - a.getTime());

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (sortedDates.length > 0) {
            const mostRecent = sortedDates[0];
            mostRecent.setHours(0, 0, 0, 0);

            if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
                let currentStreak = 1;
                let expectedDate = new Date(mostRecent);

                for (let i = 1; i < sortedDates.length; i++) {
                    expectedDate.setDate(expectedDate.getDate() - 1);
                    sortedDates[i].setHours(0, 0, 0, 0);
                    if (sortedDates[i].getTime() === expectedDate.getTime()) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
                streak = currentStreak;
            }
        }
    }

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Weekly Report</h2>
            </div>
            <div className="grid gap-6 grid-cols-1">
                <WeeklySummary totalTasks={totalTasksThisWeek} streak={streak} />
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <RoadmapProgressSnapshot activeRoadmap={activeRoadmap} />
                <SkillGrowthHighlights practicedSkills={practicedSkills} />
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <WeeklyStatsChart chartData={weeklyChartData} />
                <ProductivityChart chartData={productivityData} />
            </div>
        </div>
    );
}
