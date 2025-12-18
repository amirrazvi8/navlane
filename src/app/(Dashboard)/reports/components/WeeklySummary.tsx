import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle2, Flame } from "lucide-react";

export function WeeklySummary() {
    return (
        <Card className="h-full border-primary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Weekly Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-around">
                    <div className="space-y-1 ">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                            <CheckCircle2 className="h-3 w-3" /> Tasks
                        </div>
                        <div className="text-2xl font-bold">18</div>
                    </div>
                    <div className="border-r border-primary/50"></div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                            <Flame className="h-3 w-3 text-orange-500" /> Streak
                        </div>
                        <div className="text-2xl font-bold">12 Days</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
