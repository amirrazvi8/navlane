import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, BookOpen, PlayCircle, CheckCircle } from "lucide-react"

export function RecommendationsCard({ recommendations = [] }: { recommendations?: { title: string, description: string, type: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations && recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                  {rec.type?.toLowerCase() === 'course' ? <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" /> : 
                   rec.type?.toLowerCase() === 'project' ? <PlayCircle className="h-5 w-5 text-green-500 mt-0.5" /> :
                   <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />}
                  <div>
                    <div className="font-medium">{rec.title}</div>
                    <div className="text-sm text-muted-foreground">{rec.description}</div>
                  </div>
                </div>
              ))}
            </div>
        ) : (
            <p className="text-sm text-muted-foreground mb-4 text-center py-4">
                Upload your resume to get AI actionable recommendations based on your goal.
            </p>
        )}
      </CardContent>
    </Card>
  )
}
