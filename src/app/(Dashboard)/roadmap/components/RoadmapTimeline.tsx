"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export function RoadmapTimeline({ roadmapData }: { roadmapData?: any }) {
    const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();
    
    if (!roadmapData) return null;
    const milestones = roadmapData.milestones || [];
    const roadmapId = roadmapData._id;

    const toggleMilestone = (id: string) => {
        setExpandedMilestones((prev) => (prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]));
    };

    const handleCompleteTask = async (milestoneId: string, subtaskId: string) => {
        setLoadingId(subtaskId);
        try {
            const res = await fetch("/api/roadmap/subtask", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roadmapId, milestoneId, subtaskId }),
            });

            if (!res.ok) {
                throw new Error("Failed to complete task");
            }

            Swal.fire({
                title: "Task Completed!",
                icon: "success",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000
            });

            router.refresh();
        } catch (error: any) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <Card className=" border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    Active Roadmap: {roadmapData.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-8 before:h-full before:w-0.5 before:bg-linear-to-b before:from-primary before:via-muted before:to-transparent">
                {milestones.map((milestone: any, index: number) => {
                    const totalSubs = milestone.subtasks?.length || 1;
                    const compSubs = milestone.subtasks?.filter((s: any) => s.completed).length || 0;
                    const progress = Math.round((compSubs / totalSubs) * 100);
                    const isExpanded = expandedMilestones.includes(milestone._id || String(index));

                    return (
                    <div key={milestone._id || index} className="relative pl-8">
                        <div
                            className={`absolute left-[-5px] top-1 h-3 w-3 rounded-full border-2 ${
                                milestone.status === "completed"
                                    ? "bg-primary border-primary"
                                    : milestone.status === "in-progress"
                                    ? "bg-background border-primary ring-4 ring-primary/20"
                                    : "bg-background border-muted"
                            }`}
                        ></div>
                        <div
                            className={`p-4 rounded-xl border transition-all ${
                                milestone.status === "in-progress"
                                    ? "bg-primary/5 border-primary/50 shadow-md"
                                    : "bg-card border-border hover:border-primary/30"
                            }`}
                        >
                            <div
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 cursor-pointer group"
                                onClick={() => toggleMilestone(milestone._id || String(index))}
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-semibold text-lg ${milestone.status === "in-progress" ? "text-primary" : ""}`}>
                                        {milestone.title}
                                    </h3>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted">
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                    <Clock className="h-3 w-3" /> Step {index + 1}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>

                            {milestone.status === "in-progress" && (
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-primary font-medium">In Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full animate-pulse transition-all" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {isExpanded && (
                                <div className="mt-4 space-y-2 border-t pt-3">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subtasks</h4>
                                    {milestone.subtasks?.map((subtask: any, subIndex: number) => {
                                        const isCompleting = loadingId === subtask._id;
                                        return (
                                        <div key={subtask._id || subIndex} className="flex items-center gap-2 text-sm">
                                            {subtask.completed ? (
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                            ) : (
                                                <button 
                                                    onClick={() => handleCompleteTask(milestone._id, subtask._id)}
                                                    disabled={isCompleting || milestone.status !== "in-progress"}
                                                    className={`hover:bg-primary/20 rounded-full p-0.5 transition-colors ${milestone.status !== "in-progress" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                                    title={milestone.status === "in-progress" ? "Mark as complete" : "Complete previous milestones first"}
                                                >
                                                    {isCompleting ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground hover:text-primary" />}
                                                </button>
                                            )}
                                            <span className={subtask.completed ? "text-muted-foreground line-through" : ""}>{subtask.title}</span>
                                        </div>
                                    )})}
                                </div>
                            )}

                            <div className="mt-3 flex items-center gap-2">
                                {milestone.status === "completed" && (
                                    <div className="flex items-center text-xs text-green-500 font-medium">
                                        <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
                                    </div>
                                )}
                                {milestone.status === "upcoming" && (
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Circle className="h-4 w-4 mr-1" /> Upcoming
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )})}
            </CardContent>
        </Card>
    );
}
