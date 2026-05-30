"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, Plus, Trash2, Loader2, ChevronUp, Building2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { updateExperience } from "@/store/userProfileSlice";

interface Experience {
    title: string;
    company: string;
    duration: string;
    description: string;
}

export function ExperienceManager({ initialExperience = [] }: { initialExperience?: Experience[] }) {
    const [entries, setEntries] = useState<Experience[]>(initialExperience);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Experience>({ title: "", company: "", duration: "", description: "" });
    const router = useRouter();
    const dispatch = useAppDispatch();

    const saveToDb = async (updated: Experience[]) => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ experience: updated }),
            });
            if (!res.ok) throw new Error("Failed to save experience");
            setEntries(updated);

            // Sync to Redux global state
            dispatch(updateExperience(updated));

            router.refresh();
        } catch (err: any) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const addEntry = () => {
        if (!form.title || !form.company) return;
        saveToDb([...entries, { ...form }]);
        setForm({ title: "", company: "", duration: "", description: "" });
        setShowForm(false);
    };

    const removeEntry = (idx: number) => {
        saveToDb(entries.filter((_, i) => i !== idx));
    };

    return (
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-lg">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/10">
                            <Briefcase className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="flex items-center gap-3">
                            Experience
                            {entries.length > 0 && (
                                <span className="text-xs font-normal text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                                    {entries.length}
                                </span>
                            )}
                        </div>
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 text-xs border-border/40 hover:border-border/60" disabled={loading}>
                        {showForm ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {showForm ? "Cancel" : "Add"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {showForm && (
                    <div className="p-4 rounded-xl bg-muted/15 border border-border/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Job Title *</Label>
                                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Frontend Developer Intern" className="bg-background h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Company *</Label>
                                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Google" className="bg-background h-10" />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Duration</Label>
                                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Jun 2025 — Present" className="bg-background h-10" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Description</Label>
                            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe your responsibilities and achievements..." className="bg-background min-h-20 resize-none" />
                        </div>
                        <Button onClick={addEntry} disabled={!form.title || !form.company || loading} size="sm" className="gap-1.5 shadow-lg shadow-primary/10">
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                            Add Experience
                        </Button>
                    </div>
                )}

                {entries.length > 0 ? (
                    <div className="space-y-3">
                        {entries.map((entry, idx) => (
                            <div key={idx} className="group flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/10 border border-border/30 hover:border-amber-500/20 hover:bg-muted/15 transition-all duration-200">
                                <div className="shrink-0 mt-0.5 hidden sm:block">
                                    <div className="p-2 rounded-lg bg-amber-500/10">
                                        <Building2 className="h-4 w-4 text-amber-500" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h4 className="font-semibold text-sm">{entry.title}</h4>
                                    <p className="text-sm text-muted-foreground">{entry.company}</p>
                                    {entry.duration && <p className="text-xs text-muted-foreground/70">{entry.duration}</p>}
                                    {entry.description && <p className="text-xs text-muted-foreground/60 mt-1.5 line-clamp-2">{entry.description}</p>}
                                </div>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeEntry(idx)} disabled={loading}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : !showForm && (
                    <div className="text-center py-8 space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-muted/20 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm text-muted-foreground/50">No experience added yet. Click &quot;Add&quot; to get started.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
