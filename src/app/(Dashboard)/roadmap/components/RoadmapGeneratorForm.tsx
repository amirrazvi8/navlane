"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RoadmapGeneratorForm() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return Swal.fire("Missing Role", "Please provide a target role.", "warning");
    
    setLoading(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerGoal: role, currentSkills: skills }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate roadmap");
      }

      Swal.fire({
        title: "Success",
        text: "Your AI Roadmap has been generated!",
        icon: "success",
        background: "#1e1b4b",
        color: "#fff",
      });
      setRole("");
      setSkills("");
      router.refresh();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
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
          <div className="grid gap-2">
            <Label htmlFor="role">Target Role</Label>
            <Input id="role" placeholder="e.g. Senior Frontend Engineer" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skills">Current Skills</Label>
            <Input id="skills" placeholder="e.g. React, TypeScript, Tailwind" value={skills} onChange={(e) => setSkills(e.target.value)} disabled={loading} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate Roadmap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
