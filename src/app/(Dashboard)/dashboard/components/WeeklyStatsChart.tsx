'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export function WeeklyStatsChart({
  chartData,
}: {
  chartData?: { name: string; tasks: number }[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) return null;

  const dataToUse =
    chartData && chartData.length > 0
      ? chartData
      : [
          { name: 'Mon', tasks: 0 },
          { name: 'Tue', tasks: 0 },
          { name: 'Wed', tasks: 0 },
          { name: 'Thu', tasks: 0 },
          { name: 'Fri', tasks: 0 },
          { name: 'Sat', tasks: 0 },
          { name: 'Sun', tasks: 0 },
        ];

  const totalTasks = dataToUse.reduce((acc, curr) => acc + curr.tasks, 0);

  return (
    <Card className="h-full border-0 shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-primary/5">
        <CardTitle className="text-lg font-bold tracking-tight">
          Weekly Activity
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Total: <span className="font-bold text-primary">{totalTasks}</span>{' '}
            Tasks
          </span>
          <div className="p-2 bg-primary/10 rounded-full">
            <Activity className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pl-0">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={dataToUse}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--muted-foreground)"
              opacity={0.2}
            />
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                color: 'var(--card-foreground)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                padding: '8px 12px',
              }}
              itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
              cursor={{
                stroke: 'var(--primary)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTasks)"
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
