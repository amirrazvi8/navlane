"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Rocket, Plus, Trash2, Loader2, ChevronUp, ExternalLink, X } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useAppDispatch } from "@/store/hooks";
import { updateProjects } from "@/store/userProfileSlice";

interface Project {
    title: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
}

export function ProjectManager({ initialProjects = [] }: { initialProjects?: Project[] }) {
    const [entries, setEntries] = useState<Project[]>(initialProjects);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Project>({ title: "", description: "", techStack: [], liveUrl: "", githubUrl: "" });
    const [techInput, setTechInput] = useState("");
    const router = useRouter();
    const dispatch = useAppDispatch();

    const saveToDb = async (updated: Project[]) => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projects: updated }),
            });
            if (!res.ok) throw new Error("Failed to save projects");
            setEntries(updated);

            // Sync to Redux global state
            dispatch(updateProjects(updated));

            router.refresh();
        } catch (err: any) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const addTech = () => {
        if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
            setForm({ ...form, techStack: [...form.techStack, techInput.trim()] });
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        setForm({ ...form, techStack: form.techStack.filter(t => t !== tech) });
    };

    const handleTechKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { e.preventDefault(); addTech(); }
    };

    const addEntry = () => {
        if (!form.title) return;
        saveToDb([...entries, { ...form }]);
        setForm({ title: "", description: "", techStack: [], liveUrl: "", githubUrl: "" });
        setTechInput("");
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
                        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/15 to-violet-500/5 border border-violet-500/10">
                            <Rocket className="h-4 w-4 text-violet-500" />
                        </div>
                        <div className="flex items-center gap-3">
                            Projects
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
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Project Title *</Label>
                                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="NavLane — Career Platform" className="bg-background h-10" />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A brief description of what the project does..." className="bg-background min-h-20 resize-none" />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Tech Stack (press Enter to add)</Label>
                                <div className="flex gap-2">
                                    <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleTechKeyDown} placeholder="React, Next.js, MongoDB..." className="bg-background h-10" />
                                    <Button type="button" variant="outline" size="sm" onClick={addTech} disabled={!techInput.trim()} className="h-10 shrink-0">
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                {form.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {form.techStack.map((tech) => (
                                            <Badge key={tech} variant="secondary" className="pl-2 pr-1 py-0.5 gap-1 text-xs">
                                                {tech}
                                                <button onClick={() => removeTech(tech)} className="hover:text-destructive transition-colors">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Live URL</Label>
                                <Input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://myproject.com" className="bg-background h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">GitHub URL</Label>
                                <Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/user/repo" className="bg-background h-10" />
                            </div>
                        </div>
                        <Button onClick={addEntry} disabled={!form.title || loading} size="sm" className="gap-1.5 shadow-lg shadow-primary/10">
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                            Add Project
                        </Button>
                    </div>
                )}

                {entries.length > 0 ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {entries.map((entry, idx) => (
                            <div key={idx} className="group relative p-4 rounded-xl bg-muted/10 border border-border/30 hover:border-violet-500/20 hover:bg-muted/15 transition-all duration-200 space-y-3">
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeEntry(idx)} disabled={loading}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                                <h4 className="font-semibold text-sm pr-8">{entry.title}</h4>
                                {entry.description && <p className="text-xs text-muted-foreground/70 line-clamp-2">{entry.description}</p>}
                                {entry.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {entry.techStack.map((tech) => (
                                            <span key={tech} className="text-[10px] font-medium bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded">{tech}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-3 pt-1">
                                    {entry.liveUrl && (
                                        <a href={entry.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                            <ExternalLink className="h-3 w-3" />Live
                                        </a>
                                    )}
                                    {entry.githubUrl && (
                                        <a href={entry.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                            <FaGithub className="h-3 w-3" />Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !showForm && (
                    <div className="text-center py-8 space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-muted/20 flex items-center justify-center">
                            <Rocket className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm text-muted-foreground/50">No projects added yet. Click &quot;Add&quot; to showcase your work.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
