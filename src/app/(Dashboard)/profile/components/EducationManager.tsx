"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, Trash2, Loader2, ChevronUp, Building } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { updateEducation } from "@/store/userProfileSlice";

interface Education {
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    grade: string;
}

export function EducationManager({ initialEducation = [] }: { initialEducation?: Education[] }) {
    const [entries, setEntries] = useState<Education[]>(initialEducation);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Education>({ degree: "", institution: "", startYear: "", endYear: "", grade: "" });
    const router = useRouter();
    const dispatch = useAppDispatch();

    const saveToDb = async (updated: Education[]) => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ educationHistory: updated }),
            });
            if (!res.ok) throw new Error("Failed to save education");
            setEntries(updated);

            // Sync to Redux global state
            dispatch(updateEducation(updated));

            router.refresh();
        } catch (err: any) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const addEntry = () => {
        if (!form.degree || !form.institution) return;
        saveToDb([...entries, { ...form }]);
        setForm({ degree: "", institution: "", startYear: "", endYear: "", grade: "" });
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
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/10">
                            <GraduationCap className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-3">
                            Education
                            {entries.length > 0 && (
                                <span className="text-xs font-normal text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                                    {entries.length}
                                </span>
                            )}
                        </div>
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowForm(!showForm)}
                        className="gap-1.5 text-xs border-border/40 hover:border-border/60"
                        disabled={loading}
                    >
                        {showForm ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {showForm ? "Cancel" : "Add"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add form */}
                {showForm && (
                    <div className="p-4 rounded-xl bg-muted/15 border border-border/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Degree / Course *</Label>
                                <Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="B.Tech Computer Science" className="bg-background h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Institution *</Label>
                                <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="IIT Delhi" className="bg-background h-10" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Start Year</Label>
                                    <Input value={form.startYear} onChange={(e) => setForm({ ...form, startYear: e.target.value })} placeholder="2022" className="bg-background h-10" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">End Year</Label>
                                    <Input value={form.endYear} onChange={(e) => setForm({ ...form, endYear: e.target.value })} placeholder="2026" className="bg-background h-10" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Grade / CGPA</Label>
                                <Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="8.5 CGPA" className="bg-background h-10" />
                            </div>
                        </div>
                        <Button onClick={addEntry} disabled={!form.degree || !form.institution || loading} size="sm" className="gap-1.5 shadow-lg shadow-primary/10">
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                            Add Education
                        </Button>
                    </div>
                )}

                {/* Entries */}
                {entries.length > 0 ? (
                    <div className="space-y-3">
                        {entries.map((entry, idx) => (
                            <div key={idx} className="group flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/10 border border-border/30 hover:border-blue-500/20 hover:bg-muted/15 transition-all duration-200">
                                <div className="shrink-0 mt-0.5 hidden sm:block">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Building className="h-4 w-4 text-blue-500" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h4 className="font-semibold text-sm">{entry.degree}</h4>
                                    <p className="text-sm text-muted-foreground">{entry.institution}</p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground/70">
                                        {(entry.startYear || entry.endYear) && (
                                            <span>{entry.startYear}{entry.startYear && entry.endYear && " — "}{entry.endYear}</span>
                                        )}
                                        {entry.grade && <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{entry.grade}</span>}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                    onClick={() => removeEntry(idx)}
                                    disabled={loading}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : !showForm && (
                    <div className="text-center py-8 space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-muted/20 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm text-muted-foreground/50">No education added yet. Click &quot;Add&quot; to get started.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
