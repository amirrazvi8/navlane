import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

const levelClasses: Record<string, string> = {
    "Beginner": "bg-cyan-500/30 border-cyan-500/50",
    "Intermediate": "bg-green-500/30 border-green-500/50",
    "Advanced": "bg-amber-500/30 border-amber-500/50",
    "Expert": "bg-purple-500/30 border-purple-500/50",
};

export function TopSkills({ skillsData = [] }: { skillsData?: any[] }) {
  if (!skillsData || skillsData.length === 0) return null;

  return (
    <Card className="border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Top Skills</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            {skillsData.slice(0, 5).map((skill: any) => (
                <div key={skill.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                    <span className="font-medium ">{skill.name}</span>
                    <Badge className={`text-white border ${levelClasses[skill.level] || "bg-muted"}`}>
                        {skill.level}
                    </Badge>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
