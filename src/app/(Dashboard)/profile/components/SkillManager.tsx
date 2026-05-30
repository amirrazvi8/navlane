"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Loader2, Wrench } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { updateSkills } from "@/store/userProfileSlice";
import axios from "axios";
import { handleApiError } from "@/lib/axios";

interface Skill {
    name: string;
    level: string;
}

const LEVEL_COLORS: Record<string, string> = {
    Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15",
    Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/15",
    Advanced: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/15",
    Expert: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15",
};

const LEVEL_DOTS: Record<string, string> = {
    Beginner: "bg-emerald-400",
    Intermediate: "bg-blue-400",
    Advanced: "bg-violet-400",
    Expert: "bg-amber-400",
};

export function SkillManager({ initialSkills = [] }: { initialSkills?: Skill[] }) {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [newSkill, setNewSkill] = useState("");
    const [newLevel, setNewLevel] = useState("Beginner");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const updateSkillsInDB = async (updatedSkills: Skill[]) => {
        setLoading(true);
        try {
            await axios.put("/api/user/profile", { skills: updatedSkills });
            setSkills(updatedSkills);

            // Sync to Redux global state
            dispatch(updateSkills(updatedSkills));

            router.refresh();
        } catch (error: any) {
            Swal.fire("Error", handleApiError(error), "error");
        } finally {
            setLoading(false);
        }
    };

    const addSkill = () => {
        if (newSkill && !skills.find((s) => s.name.toLowerCase() === newSkill.toLowerCase())) {
            updateSkillsInDB([...skills, { name: newSkill, level: newLevel }]);
            setNewSkill("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { e.preventDefault(); addSkill(); }
    };

    const removeSkill = (skillName: string) => {
        updateSkillsInDB(skills.filter((s) => s.name !== skillName));
    };

    return (
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/10">
                        <Wrench className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3">
                        Skills & Expertise
                        {skills.length > 0 && (
                            <span className="text-xs font-normal text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                                {skills.length}
                            </span>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/40 transition-all duration-200 h-10"
                        disabled={loading}
                    />
                    <div className="flex gap-2">
                        <Select value={newLevel} onValueChange={setNewLevel} disabled={loading}>
                            <SelectTrigger className="w-full sm:w-[140px] bg-muted/20 border-border/40 h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={addSkill} disabled={loading || !newSkill} size="sm" className="gap-1.5 px-4 h-10 shrink-0 shadow-lg shadow-primary/10">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Add</>}
                        </Button>
                    </div>
                </div>

                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <Badge
                                key={skill.name}
                                variant="outline"
                                className={`pl-3 pr-1.5 py-1.5 flex items-center gap-2 text-sm border transition-all duration-200 ${LEVEL_COLORS[skill.level] || "bg-muted"}`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_DOTS[skill.level] || "bg-muted-foreground"}`} />
                                <span className="font-medium">{skill.name}</span>
                                <span className="text-[10px] opacity-60 border-l border-current/15 pl-2">{skill.level}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 hover:bg-transparent hover:text-destructive ml-0.5 transition-colors"
                                    onClick={() => removeSkill(skill.name)}
                                    disabled={loading}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-muted/20 flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm text-muted-foreground/50">No skills added yet. Start typing above to add your skills.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
