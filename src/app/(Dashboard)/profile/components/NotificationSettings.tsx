import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell } from "lucide-react"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="daily-reminder" className="flex flex-col space-y-1">
            <span>Daily Reminder</span>
            <span className="font-normal text-xs text-muted-foreground">Get reminded to study every day.</span>
          </Label>
          <Switch id="daily-reminder" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="weekly-report" className="flex flex-col space-y-1">
            <span>Weekly Report</span>
            <span className="font-normal text-xs text-muted-foreground">Receive a summary of your progress.</span>
          </Label>
          <Switch id="weekly-report" defaultChecked />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="roadmap-suggestions" className="flex flex-col space-y-1">
            <span>Roadmap Suggestions</span>
            <span className="font-normal text-xs text-muted-foreground">New roadmap ideas based on your skills.</span>
          </Label>
          <Switch id="roadmap-suggestions" />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="skill-gap" className="flex flex-col space-y-1">
            <span>Skill Gap Alerts</span>
            <span className="font-normal text-xs text-muted-foreground">Alerts when you miss key skills.</span>
          </Label>
          <Switch id="skill-gap" defaultChecked />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="trending-skills" className="flex flex-col space-y-1">
            <span>Trending Skill Updates</span>
            <span className="font-normal text-xs text-muted-foreground">Stay updated with market trends.</span>
          </Label>
          <Switch id="trending-skills" />
        </div>
      </CardContent>
    </Card>
  )
}
