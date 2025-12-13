import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";

const history = [
    {
        id: 1,
        title: "Full Stack Web Development",
        date: "Oct 15, 2023",
        status: "Completed",
        progress: 100,
    },
    {
        id: 2,
        title: "Python for Data Science",
        date: "Aug 01, 2023",
        status: "Archived",
        progress: 45,
    },
    {
        id: 3,
        title: "UI/UX Design Basics",
        date: "Jun 20, 2023",
        status: "Archived",
        progress: 30,
    },
];

export function PreviousRoadmapsList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Previous Roadmaps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                        <div className="space-y-1">
                            <h4 className="font-medium leading-none group-hover:text-primary transition-colors">{item.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground gap-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {item.date}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] border ${
                                        item.status === "Completed"
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                >
                                    {item.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-medium">{item.progress}%</div>
                                <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-primary" style={{ width: `${item.progress}%` }}></div>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                ))}
                <Button variant="outline" className="w-full">
                    View All History
                </Button>
            </CardContent>
        </Card>
    );
}
