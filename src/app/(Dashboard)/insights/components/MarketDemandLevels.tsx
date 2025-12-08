import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase } from "lucide-react"

const demands = [
  { role: "AI Engineer", level: "High", volume: 90, color: "bg-green-500" },
  { role: "DevOps Engineer", level: "High", volume: 85, color: "bg-green-500" },
  { role: "React Developer", level: "Medium", volume: 60, color: "bg-yellow-500" },
  { role: "PHP Developer", level: "Low", volume: 30, color: "bg-red-500" },
]

export function MarketDemandLevels() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Market Demand</CardTitle>
        <Briefcase className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        {demands.map((item) => (
            <div key={item.role} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.role}</span>
                    <Badge variant="outline" className={`${item.level === 'High' ? 'text-green-500 border-green-500/20' : item.level === 'Medium' ? 'text-yellow-500 border-yellow-500/20' : 'text-red-500 border-red-500/20'}`}>
                        {item.level} Demand
                    </Badge>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.volume}%` }}></div>
                </div>
            </div>
        ))}
      </CardContent>
    </Card>
  )
}
