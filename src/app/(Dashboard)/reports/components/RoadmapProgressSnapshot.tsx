import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export function RoadmapProgressSnapshot({ activeRoadmap }: { activeRoadmap?: any }) {
    let currentTask = { title: "No active roadmap", progress: 0, module: "N/A" };

    if (activeRoadmap && activeRoadmap.milestones && activeRoadmap.milestones.length > 0) {
        const pendingOrProgress = activeRoadmap.milestones.filter((m: any) => m.status !== "completed");
        
        let totalSubtasks = 0;
        let completedSubtasks = 0;
        
        activeRoadmap.milestones.forEach((m: any) => {
            m.subtasks?.forEach((st: any) => {
                totalSubtasks++;
                if (st.completed) completedSubtasks++;
            });
        });

        const currentProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

        if (pendingOrProgress.length > 0) {
            currentTask = { 
                title: activeRoadmap.title, 
                module: pendingOrProgress[0].title,
                progress: currentProgress 
            };
        } else {
            currentTask = { title: activeRoadmap.title, module: "All Modules Completed!", progress: 100 };
        }
    }

    return (
        <Card className="border-primary/30 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Roadmap Progress</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm text-muted-foreground">Current Roadmap</div>
                    <div className="text-xl font-bold">{currentTask.title}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Current Module</div>
                    <div className="font-medium">{currentTask.module}</div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span className="font-bold">{currentTask.progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${currentTask.progress}%` }}></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
