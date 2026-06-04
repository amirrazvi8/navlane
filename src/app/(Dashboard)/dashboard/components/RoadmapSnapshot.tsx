import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Map, Compass, Target } from "lucide-react";
import Link from "next/link";

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
        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
            {/* Background glowing orb */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-primary/5 relative z-10">
                <CardTitle className="text-lg font-bold tracking-tight line-clamp-1 pr-4">
                    {roadmap ? roadmap.title : "Current Roadmap"}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <Map className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="mt-1 p-2 bg-blue-500/10 rounded-lg h-fit">
                            <Target className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Module</div>
                            <div className="text-lg font-bold leading-tight mt-1">{currentTask.title}</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="mt-1 p-2 bg-purple-500/10 rounded-lg h-fit">
                            <Compass className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Next Milestone</div>
                            <div className="font-medium mt-1">{nextTask.title}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-muted-foreground">Overall Progress</span>
                        <span className="font-bold text-primary">{currentTask.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary/30 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${currentTask.progress}%` }}
                        />
                    </div>
                </div>

                <Button asChild className="w-full gap-2 group shadow-sm transition-all hover:shadow-md" variant="default">
                    <Link href="/roadmap">
                        Continue Roadmap 
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
