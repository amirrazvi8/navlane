import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export function RecommendationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
            Based on your goal &quot;Full Stack Developer&quot;, here are recommended actions.
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
            <li>Complete &quot;System Design for Beginners&quot;</li>
            <li>Build a full-stack project with Next.js</li>
            <li>Contribute to open source</li>
        </ul>
      </CardContent>
    </Card>
  )
}
