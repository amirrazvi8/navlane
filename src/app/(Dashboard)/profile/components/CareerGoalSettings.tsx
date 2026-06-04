"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Loader2, Check } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { updateCareerGoal } from "@/store/userProfileSlice";
import axios from "axios";
import { handleApiError } from "@/lib/axios";

const CAREER_ROLES = [
    { value: "Full Stack Development", emoji: "🌐", label: "Full Stack Developer" },
    { value: "Frontend Development", emoji: "🎨", label: "Frontend Developer" },
    { value: "Backend Development", emoji: "⚙️", label: "Backend Developer" },
    { value: "AI Engineer", emoji: "🤖", label: "AI / ML Engineer" },
    { value: "Cloud Engineer", emoji: "☁️", label: "Cloud Engineer" },
    { value: "DevOps Engineer", emoji: "🔧", label: "DevOps Engineer" },
    { value: "Data Science", emoji: "📊", label: "Data Scientist" },
    { value: "Mobile Development", emoji: "📱", label: "Mobile Developer" },
    { value: "Cybersecurity", emoji: "🔒", label: "Cybersecurity" },
    { value: "UI/UX Design", emoji: "✨", label: "UI/UX Designer" },
];

export function CareerGoalSettings({ initialRole = "" }: { initialRole?: string }) {
    const [selected, setSelected] = useState(initialRole);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSave = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            await axios.put("/api/user/profile", { careerGoal: { role: selected } });

            // Sync to Redux global state
            dispatch(updateCareerGoal({ role: selected }));

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            router.refresh();
        } catch (err: any) {
            Swal.fire("Error", handleApiError(err), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/15 to-rose-500/5 border border-rose-500/10">
                        <Target className="h-4 w-4 text-rose-500" />
                    </div>
                    Career Goal
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {CAREER_ROLES.map((role) => (
                        <button
                            key={role.value}
                            onClick={() => setSelected(role.value)}
                            disabled={loading}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer ${
                                selected === role.value
                                    ? "bg-primary/10 border-primary/40 text-primary shadow-md shadow-primary/5 scale-[1.02]"
                                    : "bg-muted/15 border-border/30 text-muted-foreground hover:border-border/50 hover:bg-muted/30 hover:scale-[1.01]"
                            }`}
                        >
                            <span className="text-xl">{role.emoji}</span>
                            <span className="text-xs font-medium text-center leading-tight">{role.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        onClick={handleSave}
                        disabled={loading || !selected}
                        size="sm"
                        className="min-w-[140px] gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200"
                    >
                        {loading ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving...</>
                        ) : saved ? (
                            <><Check className="h-3.5 w-3.5" />Updated!</>
                        ) : (
                            "Update Goal"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
