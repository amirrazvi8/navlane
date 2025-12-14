"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export function SkillInputForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Skills Manually</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex gap-2">
          <div className="grid w-full gap-2">
            <Label htmlFor="skill" className="sr-only">Skill</Label>
            <Input id="skill" placeholder="e.g. Docker" />
          </div>
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add</span>
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">React</div>
            <div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">TypeScript</div>
        </div>
      </CardContent>
    </Card>
  )
}
