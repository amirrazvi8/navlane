"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export function PreviousRoadmapsList({ historyData = [] }: { historyData?: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    if (!historyData || historyData.length === 0) return null;

    const handleResume = async (id: string) => {
        setLoadingId(id);
        try {
            const res = await fetch(`/api/roadmap/${id}/resume`, {
                method: "PUT",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to resume roadmap");
            }

            Swal.fire({
                title: "Roadmap Resumed!",
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
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Previous Roadmaps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {historyData.map((item) => {
                    const totalMilestones = item.milestones?.length || 1;
                    const completedMilestones = item.milestones?.filter((m: any) => m.status === "completed").length || 0;
                    const progress = Math.round((completedMilestones / totalMilestones) * 100);
                    const formattedDate = new Date(item.createdAt || Date.now()).toLocaleDateString();

                    return (
                    <div
                        key={item._id}
                        onClick={() => !item.isCompleted && handleResume(item._id)}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors group ${
                            item.isCompleted ? "bg-muted/10 opacity-70" : "bg-muted/20 hover:bg-muted/30 cursor-pointer"
                        }`}
                    >
                        <div className="space-y-1">
                            <h4 className="font-medium leading-none group-hover:text-primary transition-colors">{item.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground gap-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {formattedDate}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] border ${
                                        item.isCompleted
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    }`}
                                >
                                    {item.isCompleted ? "Completed" : "Archived"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-medium">{progress}%</div>
                                <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                            {loadingId === item._id ? (
                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            ) : (
                                <ChevronRight className={`h-4 w-4 transition-colors ${item.isCompleted ? "text-muted" : "text-muted-foreground group-hover:text-primary"}`} />
                            )}
                        </div>
                    </div>
                )})}
                <Button variant="outline" className="w-full">
                    View All History
                </Button>
            </CardContent>
        </Card>
    );
}
