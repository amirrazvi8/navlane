import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

const missingSkills = [
  { name: "Kubernetes", category: "DevOps", importance: "High" },
  { name: "GraphQL", category: "Backend", importance: "Medium" },
  { name: "System Design", category: "Architecture", importance: "High" },
]

export function MissingSkillsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missingSkills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                 <AlertCircle className="h-4 w-4 text-red-500" />
                 <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">{skill.category}</div>
                 </div>
              </div>
              <div className="text-xs font-medium text-red-500">{skill.importance} Priority</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
