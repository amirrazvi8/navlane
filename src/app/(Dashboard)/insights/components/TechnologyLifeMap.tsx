import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, TrendingUp, Flame, TrendingDown, Map } from "lucide-react"

const lifecycle = [
  {
    stage: "Emerging",
    icon: Rocket,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    tech: ["AI Agents", "WebAssembly", "Edge AI"],
  },
  {
    stage: "Growing",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10",
    tech: ["Rust", "Cloud Security", "Platform Engineering"],
  },
  {
    stage: "Peak",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    tech: ["React", "Node.js", "Docker"],
  },
  {
    stage: "Declining",
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-500/10",
    tech: ["jQuery", "Manual QA", "Legacy PHP"],
  },
]

export function TechnologyLifeMap() {
  return (
    <Card className="border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Technology Lifecycle
        </CardTitle>
        <Map className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-4">
        {lifecycle.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.stage}
              className="flex items-start gap-4 p-3 rounded-lg border bg-muted/20 border-cyan-500/30"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${item.bg}`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold">{item.stage}</p>
                <p className="text-xs text-muted-foreground">
                  {item.tech.join(" • ")}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
