import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

const fields = [
  { role: "Frontend (React)", status: "Crowded", ratio: "150:1", color: "text-red-500" },
  { role: "Full Stack (MERN)", status: "Competitive", ratio: "80:1", color: "text-orange-500" },
  { role: "Backend (Go/Rust)", status: "Balanced", ratio: "30:1", color: "text-green-500" },
  { role: "AI/ML Engineer", status: "Undercrowded", ratio: "10:1", color: "text-blue-500" },
]

export function CrowdedVsNonCrowded() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Competition Analysis</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-1">Field</div>
                <div className="text-center">Status</div>
                <div className="text-right">Applicants/Job</div>
            </div>
            {fields.map((field) => (
                <div key={field.role} className="grid grid-cols-3 items-center text-sm py-2 border-b last:border-0">
                    <div className="col-span-1 font-medium truncate" title={field.role}>{field.role}</div>
                    <div className={`text-center font-medium ${field.color}`}>{field.status}</div>
                    <div className="text-right text-muted-foreground">{field.ratio}</div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
