import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TargetGoalInput({ goal, setGoal }: { goal: string, setGoal: (v: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Career Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-2">
          <Label htmlFor="goal" className="sr-only">Target Goal</Label>
          <Input 
             id="goal" 
             placeholder="e.g. Senior React Developer" 
             value={goal}
             onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
            Enter your desired role before uploading your resume.
        </p>
      </CardContent>
    </Card>
  )
}
