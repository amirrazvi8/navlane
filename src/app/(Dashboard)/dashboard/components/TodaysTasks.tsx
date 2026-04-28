"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckCircle, Clock, Loader2 } from "lucide-react";
import { IoHourglass } from "react-icons/io5";
import Swal from "sweetalert2";

const statusClasses: Record<string, string> = {
    Completed: "bg-green-500/10 text-green-500 border-green-500/50",
    "In Progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
    Pending: "bg-pink-500/10 text-pink-500 border-pink-500/50",
};

const statusIcons: Record<string, React.ReactNode> = {
    Completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    "In Progress": <IoHourglass className="w-4 h-4 text-yellow-500" />,
    Pending: <Clock className="w-4 h-4 text-pink-500" />,
};

export function TodaysTasks({ tasksData = [], roadmapId, milestoneId }: { tasksData?: any[], roadmapId?: string, milestoneId?: string }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const handleComplete = async (subtaskId: string) => {
        if (!roadmapId || !milestoneId) return;
        
        setLoadingId(subtaskId);
        try {
            const res = await fetch("/api/roadmap/subtask", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roadmapId, milestoneId, subtaskId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to complete task");
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
        <Card className="h-full border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Today&apos;s Tasks</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {tasksData.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No pending tasks for today.</p>}
                
                {tasksData.map((task: any) => {
                    const isInProgress = task.status === "In Progress";
                    const isCompleting = loadingId === task.id;

                    return (
                    <div 
                        key={task.id} 
                        className={`flex flex-col gap-2 md:flex-row md:items-center justify-between p-3 border rounded-lg transition-colors ${
                            isInProgress ? "bg-primary/5 border-primary/30 shadow-sm" : "bg-muted/20"
                        }`}
                    >
                        <div className="space-y-1">
                            <p className={`font-medium leading-none ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full border flex items-center gap-1.5 ${statusClasses[task.status]}`}>
                                {statusIcons[task.status]}
                                {task.status}
                            </span>
                            
                            {isInProgress && (
                                <button 
                                    onClick={() => handleComplete(task.id)}
                                    disabled={isCompleting}
                                    className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50 transition-colors disabled:opacity-50 cursor-pointer"
                                    title="Mark as Complete"
                                >
                                    {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                )})}
            </CardContent>
        </Card>
    );
}
