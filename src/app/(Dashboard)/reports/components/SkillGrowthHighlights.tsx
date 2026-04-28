import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Check } from "lucide-react";

export function SkillGrowthHighlights({ practicedSkills = [] }: { practicedSkills?: string[] }) {
    return (
        <Card className="border-primary/30 h-full">
            <CardHeader>
                <CardTitle>Skill Growth Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" /> Practiced This Week
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {practicedSkills.length > 0 ? (
                            practicedSkills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground">Complete tasks to see skills practiced!</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
