'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, TrendingUp } from 'lucide-react';

export function ReadinessScore({ score = 85 }: { score?: number }) {
  return (
    <Card className="border-0 shadow-sm bg-card p-4 hover:shadow-md transition-shadow duration-300 relative overflow-hidden h-full grid grid-col-1 md:grid-cols-2 w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="grid grid-col-1">
        {/* <div className="flex flex-row items-center justify-between space-y- pb- border-b border-primary/5 relative z-10">
                <div className="text-lg font-bold tracking-tight">Job Readiness</div>
                <div className="p-2 bg-emerald-500/10 rounded-full shrink-0">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
            </div> */}
        <div className=" relative z-10 flex flex-row justify-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 w-32 h-32 animate-pulse" />

              {/* Circular representation */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  className="text-muted/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-emerald-500 drop-shadow-md transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={351.85} // 2 * PI * 56
                  strokeDashoffset={351.85 - (351.85 * score) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-foreground tracking-tighter">
                  {score}
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Score
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-col-1">
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Technical Skills</span>
            <span className="font-semibold">Good</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-semibold text-emerald-500">Excellent</span>
          </div>
        </div>

        <div className="border-t border-primary/5 flex items-center gap-x-2 text-xs font-medium text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          You are in the top{' '}
          <span className="text-emerald-500 font-bold">15%</span> of candidates!
        </div>
      </div>
    </Card>
  );
}
