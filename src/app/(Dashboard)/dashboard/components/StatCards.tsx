import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Flame, Map, Clock } from 'lucide-react';

interface StatCardsProps {
  tasksCompleted: number;
  currentStreak: number;
  activeRoadmaps: number;
  hoursLearned: number;
}

export function StatCards({ tasksCompleted, currentStreak }: StatCardsProps) {
  const stats = [
    {
      title: 'Tasks Completed',
      value: tasksCompleted,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Current Streak',
      value: `${currentStreak} Days`,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardContent className="p-6 relative z-10 flex items-center gap-4">
            <div
              className={`p-3 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold tracking-tight">
                {stat.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
