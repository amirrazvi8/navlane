import { WelcomeHeader } from './components/WelcomeHeader';
import { TodaysTasks } from './components/TodaysTasks';
import { RoadmapSnapshot } from './components/RoadmapSnapshot';
import { QuickActions } from './components/QuickActions';
import { WeeklyStatsChart } from './components/WeeklyStatsChart';
import { TopSkills } from './components/TopSkills';
import { StatCards } from './components/StatCards';
import { ReadinessScore } from './components/ReadinessScore';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnected from '@/lib/db';
import User from '@/models/User';
import Roadmap from '@/models/Roadmap';

export default async function DashboardPage() {
  await dbConnected();
  const session = await getServerSession(authOptions);
  let name = 'Guest';
  let activeRoadmap: any = null;
  let userSkills: any[] = [];
  let todaysTasks: any[] = [];
  let activeRoadmapId: string | undefined = undefined;
  let activeMilestoneId: string | undefined = undefined;
  let weeklyChartData: { name: string; tasks: number }[] = [];
  let tasksCompleted = 0;

  if (session && session.user) {
    const user = await User.findById((session.user as any).id);
    if (user) {
      name = user.name;
      userSkills = JSON.parse(JSON.stringify(user.skills || []));
      const rm = await Roadmap.findOne({
        userId: user._id,
        isCompleted: false,
      }).sort({ updatedAt: -1 });
      if (rm) {
        activeRoadmap = JSON.parse(JSON.stringify(rm));
        activeRoadmapId = activeRoadmap._id;

        const currentMilestone =
          activeRoadmap.milestones.find((m: any) => m.status !== 'completed') ||
          activeRoadmap.milestones[0];
        if (currentMilestone) {
          activeMilestoneId = currentMilestone._id;
          let foundFirstPending = false;

          todaysTasks = currentMilestone.subtasks.map((st: any) => {
            let status = 'Pending';
            if (st.completed) {
              status = 'Completed';
            } else if (!foundFirstPending) {
              status = 'In Progress';
              foundFirstPending = true;
            }
            return {
              id: st._id,
              title: st.title,
              status,
              completed: st.completed,
            };
          });
        }
      }

      const allRoadmaps = await Roadmap.find({ userId: user._id });
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const now = new Date();
      const counts = new Array(7).fill(0);

      const last7Days: { name: string; dateStr: string }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        last7Days.push({
          name: dayNames[d.getDay()],
          dateStr: d.toDateString(),
        });
      }

      allRoadmaps.forEach((rm) => {
        rm.milestones.forEach((m: any) => {
          m.subtasks.forEach((st: any) => {
            if (st.completed && st.completedAt) {
              const completedDate = new Date(st.completedAt).toDateString();
              const index = last7Days.findIndex(
                (day) => day.dateStr === completedDate,
              );
              if (index !== -1) {
                counts[index]++;
              }
            }
          });
        });
      });

      tasksCompleted = counts.reduce((a, b) => a + b, 0);
      weeklyChartData = last7Days.map((day, i) => ({
        name: day.name,
        tasks: counts[i],
      }));
    }
  }

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <WelcomeHeader name={name} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StatCards tasksCompleted={tasksCompleted} currentStreak={7} />

        <div>
          <ReadinessScore score={85} />
        </div>
      </div>

      {/* Stat Cards Row */}

      <RoadmapSnapshot roadmap={activeRoadmap} />
      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {/* Left Column (Wider on large screens) */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <TodaysTasks
            tasksData={todaysTasks}
            roadmapId={activeRoadmapId}
            milestoneId={activeMilestoneId}
          />
          <WeeklyStatsChart chartData={weeklyChartData} />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <TopSkills skillsData={userSkills} />
        </div>
      </div>
    </div>
  );
}
