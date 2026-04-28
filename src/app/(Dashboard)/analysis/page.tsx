"use client";

import { useState } from 'react';
import { ResumeUpload } from './components/ResumeUpload';
import { TargetGoalInput } from './components/TargetGoalInput';
import { RecommendationsCard } from './components/RecommendationsCard';
import { MissingSkillsList } from './components/MissingSkillsList';

export default function AnalysisPage() {
    const [targetGoal, setTargetGoal] = useState("");
    const [analysisResult, setAnalysisResult] = useState<{
        missingSkills: any[];
        recommendations: any[];
    } | null>(null);

   return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h2>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <TargetGoalInput goal={targetGoal} setGoal={setTargetGoal} />
          <ResumeUpload targetGoal={targetGoal} setAnalysisResult={setAnalysisResult} />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <MissingSkillsList missingSkills={analysisResult?.missingSkills || []} />
          <RecommendationsCard recommendations={analysisResult?.recommendations || []} />
        </div>
      </div>
    </div>
  )
}
