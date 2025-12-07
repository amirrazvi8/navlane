import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Map } from "lucide-react";

const roadmapTasks = {
    Current: { title: "Advanced React Patterns", progress: 65 },
    Next: { title: "Server Side Rendering", progress: 0 },
};

export function RoadmapSnapshot() {
    return (
        <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Current Roadmap</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm text-muted-foreground">Current Module</div>
                    <div className="text-xl font-bold">{roadmapTasks["Current"].title}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Next Milestone</div>
                    <div className="font-medium">{roadmapTasks["Next"].title}</div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-bold">{roadmapTasks["Current"].progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${roadmapTasks["Current"].progress}%` }}></div>
                    </div>
                </div>
                <Button className="w-full gap-2 cursor-pointer" variant="secondary">
                    Continue Roadmap <ArrowRight className="h-4 w-4 " />
                </Button>
            </CardContent>
        </Card>
    );
}
