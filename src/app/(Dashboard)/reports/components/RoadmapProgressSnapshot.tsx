import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roadmap = {
    title: "Advanced React Patterns",
    module: "Server Side Rendering",
    progress: 65,
};

export function RoadmapProgressSnapshot() {
    return (
        <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Roadmap Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm text-muted-foreground">Roadmap</div>
                    <div className="text-xl font-bold">{roadmap.title}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Module</div>
                    <div className="font-medium">{roadmap.module}</div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-bold">{roadmap.progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${roadmap.progress}%` }}></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
