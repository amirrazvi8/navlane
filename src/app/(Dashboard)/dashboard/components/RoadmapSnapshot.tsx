import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Map } from "lucide-react";

export function RoadmapSnapshot({ roadmap }: { roadmap?: any }) {
    const defaultTasks = { Current: { title: "No active roadmap", progress: 0 }, Next: { title: "N/A" } };

    let currentTask = defaultTasks.Current;
    let nextTask = defaultTasks.Next;

    if (roadmap && roadmap.milestones && roadmap.milestones.length > 0) {
        const pendingOrProgress = roadmap.milestones.filter((m: any) => m.status !== "completed");
        
        let totalSubtasks = 0;
        let completedSubtasks = 0;
        
        roadmap.milestones.forEach((m: any) => {
            m.subtasks?.forEach((st: any) => {
                totalSubtasks++;
                if (st.completed) completedSubtasks++;
            });
        });

        const currentProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

        if (pendingOrProgress.length > 0) {
            currentTask = { title: pendingOrProgress[0].title, progress: currentProgress };
            if (pendingOrProgress.length > 1) {
                nextTask = { title: pendingOrProgress[1].title };
            }
        } else {
            currentTask = { title: "Roadmap Finished!", progress: 100 };
        }
    }

    return (
        <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{roadmap ? roadmap.title : "Current Roadmap"}</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm text-muted-foreground">Current Module</div>
                    <div className="text-xl font-bold">{currentTask.title}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Next Milestone</div>
                    <div className="font-medium">{nextTask.title}</div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-bold">{currentTask.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${currentTask.progress}%` }}></div>
                    </div>
                </div>
                <Button className="w-full gap-2 cursor-pointer" variant="secondary">
                    Continue Roadmap <ArrowRight className="h-4 w-4 " />
                </Button>
            </CardContent>
        </Card>
    );
}
