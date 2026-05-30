import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

const levelClasses: Record<string, string> = {
    "Beginner": "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
    "Intermediate": "bg-green-500/20 text-green-500 border-green-500/30",
    "Advanced": "bg-amber-500/20 text-amber-500 border-amber-500/30",
    "Expert": "bg-purple-500/20 text-purple-500 border-purple-500/30",
};

export function TopSkills({ skillsData = [] }: { skillsData?: any[] }) {
  if (!skillsData || skillsData.length === 0) return null;

  return (
    <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-primary/5">
        <CardTitle className="text-lg font-bold tracking-tight">Top Skills</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">
            <Trophy className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-3">
            {skillsData.slice(0, 5).map((skill: any) => (
                <div key={skill.name} className="group flex items-center justify-between p-3 rounded-xl bg-muted/10 border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-300">
                    <span className="font-medium group-hover:text-primary transition-colors">{skill.name}</span>
                    <Badge variant="outline" className={`font-semibold ${levelClasses[skill.level] || "bg-muted"}`}>
                        {skill.level}
                    </Badge>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
