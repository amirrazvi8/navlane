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
        <Card className="h-full border-0 shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-primary/5">
                <CardTitle className="text-lg font-bold tracking-tight">Today&apos;s Tasks</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                    <CalendarDays className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {tasksData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="p-4 bg-muted/30 rounded-full">
                            <CheckCircle className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">You&apos;re all caught up for today!</p>
                    </div>
                )}
                
                {tasksData.map((task: any) => {
                    const isInProgress = task.status === "In Progress";
                    const isCompleting = loadingId === task.id;

                    return (
                    <div 
                        key={task.id} 
                        className={`group flex flex-col gap-3 md:flex-row md:items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                            isInProgress 
                                ? "bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 shadow-sm" 
                                : "bg-muted/10 border border-transparent hover:border-border"
                        }`}
                    >
                        <div className="space-y-1">
                            <p className={`font-medium transition-colors ${task.completed ? "line-through text-muted-foreground" : "group-hover:text-primary"}`}>
                                {task.title}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${statusClasses[task.status]}`}>
                                {statusIcons[task.status]}
                                {task.status}
                            </span>
                            
                            {isInProgress && (
                                <button 
                                    onClick={() => handleComplete(task.id)}
                                    disabled={isCompleting}
                                    className="h-9 w-9 rounded-full bg-background border flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-sm group-hover:scale-110"
                                    title="Mark as Complete"
                                >
                                    {isCompleting ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                )})}
            </CardContent>
        </Card>
    );
}
