"use client";

import { useState } from 'react';
import { ResumeUpload } from './components/ResumeUpload';
import { TargetGoalInput } from './components/TargetGoalInput';
import { RecommendationsCard } from './components/RecommendationsCard';
import { MissingSkillsList } from './components/MissingSkillsList';
import { ResumeStandingChart } from './components/ResumeStandingChart';

export default function AnalysisPage() {
    const [targetGoal, setTargetGoal] = useState("");
    const [analysisResult, setAnalysisResult] = useState<{
        missingSkills: any[];
        recommendations: any[];
        currentStanding?: {
            overallScore: number;
            level: string;
            categories: { name: string; score: number; maxScore: number }[];
        };
    } | null>(null);

   return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h2>
      </div>
      {/* Row 1: Target Goal + Resume Upload side by side */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <TargetGoalInput goal={targetGoal} setGoal={setTargetGoal} />
        <ResumeUpload targetGoal={targetGoal} setAnalysisResult={setAnalysisResult} />
      </div>

      {/* Row 2: Resume Standing (full width) */}
      <div className="mt-4">
        <ResumeStandingChart currentStanding={analysisResult?.currentStanding || null} />
      </div>

      {/* Row 3: Missing Skills + AI Recommendations side by side */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-4">
        <MissingSkillsList missingSkills={analysisResult?.missingSkills || []} />
        <RecommendationsCard recommendations={analysisResult?.recommendations || []} />
      </div>
    </div>
  )
}
