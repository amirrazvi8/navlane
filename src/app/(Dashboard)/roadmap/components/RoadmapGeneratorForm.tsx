"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RoadmapGeneratorForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Target Role</Label>
            <Input id="role" placeholder="e.g. Senior Frontend Engineer" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skills">Current Skills</Label>
            <Input id="skills" placeholder="e.g. React, TypeScript, Tailwind" />
          </div>
          <Button className="w-full">Generate Roadmap</Button>
        </form>
      </CardContent>
    </Card>
  )
}
