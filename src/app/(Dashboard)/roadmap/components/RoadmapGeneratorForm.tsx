"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppSelector } from "@/store/hooks";
import { selectCareerGoal, selectSkills, selectIsHydrated } from "@/store/userProfileSlice";
import axios from "axios";
import { handleApiError } from "@/lib/axios";

export function RoadmapGeneratorForm() {
  const careerGoal = useAppSelector(selectCareerGoal);
  const skills = useAppSelector(selectSkills);
  const isHydrated = useAppSelector(selectIsHydrated);

  const [role, setRole] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const router = useRouter();

  // Auto-fill from Redux when profile data becomes available
  useEffect(() => {
    if (isHydrated) {
      let didFill = false;
      if (careerGoal && !role) {
        setRole(careerGoal);
        didFill = true;
      }
      if (skills.length > 0 && !skillsInput) {
        setSkillsInput(skills.map((s) => s.name).join(", "));
        didFill = true;
      }
      if (didFill) setAutoFilled(true);
    }
  }, [isHydrated, careerGoal, skills]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return Swal.fire("Missing Role", "Please provide a target role.", "warning");
    
    setLoading(true);
    try {
      await axios.post("/api/roadmap", { careerGoal: role, currentSkills: skillsInput });

      Swal.fire({
        title: "Success",
        text: "Your AI Roadmap has been generated!",
        icon: "success",
        background: "#1e1b4b",
        color: "#fff",
      });
      setRole("");
      setSkillsInput("");
      setAutoFilled(false);
      router.refresh();
    } catch (err: any) {
      Swal.fire("Error", handleApiError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleGenerate}>
          {autoFilled && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Auto-filled from your profile. Feel free to edit.
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="role">Target Role</Label>
            <Input id="role" placeholder="e.g. Senior Frontend Engineer" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skills">Current Skills</Label>
            <Input id="skills" placeholder="e.g. React, TypeScript, Tailwind" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} disabled={loading} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate Roadmap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
