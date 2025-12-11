"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { VscTools } from "react-icons/vsc";


interface Skill {
    name: string;
    level: string;
}

export function SkillManager() {
    const [skills, setSkills] = useState<Skill[]>([
        { name: "React", level: "Advanced" },
        { name: "TypeScript", level: "Intermediate" },
        { name: "Node.js", level: "Beginner" },
    ]);
    const [newSkill, setNewSkill] = useState("");
    const [newLevel, setNewLevel] = useState("Beginner");

    const addSkill = () => {
        if (newSkill && !skills.find((s) => s.name === newSkill)) {
            setSkills([...skills, { name: newSkill, level: newLevel }]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillName: string) => {
        setSkills(skills.filter((s) => s.name !== skillName));
    };

    return (
        <Card>
            <CardHeader>
              
                <CardTitle className="flex items-center gap-2">
                    <VscTools className="h-5 w-5 text-primary" />
                  Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2 lg:gap-8">
                    <Input placeholder="Add a new skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-1" />
                    <Select value={newLevel} onValueChange={setNewLevel}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={addSkill}>
                        <Plus className="h-4 w-4" />Add
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <Badge key={skill.name} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-2">
                            <span>{skill.name}</span>
                            <span className="text-xs text-muted-foreground font-normal border-l pl-2 border-muted-foreground/20">{skill.level}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 hover:bg-transparent hover:text-destructive"
                                onClick={() => removeSkill(skill.name)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
