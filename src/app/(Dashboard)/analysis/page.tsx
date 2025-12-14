import { ResumeUpload } from './components/ResumeUpload'
import { SkillInputForm } from './components/SkillInputForm'
import { RecommendationsCard } from './components/RecommendationsCard'
import { CompetencyScoreChart } from './components/CompetencyScoreChart'
import { MissingSkillsList } from './components/MissingSkillsList'

export default function AnalysisPage() {
   return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h2>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <CompetencyScoreChart />
          <MissingSkillsList />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <ResumeUpload />
          <SkillInputForm />
          <RecommendationsCard />
        </div>
      </div>
    </div>
  )
}
