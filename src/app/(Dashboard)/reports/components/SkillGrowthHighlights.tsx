import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Check } from "lucide-react";

export function SkillGrowthHighlights() {
    return (
        <Card className="border-primary/30">
            <CardHeader>
                <CardTitle>Skill Growth Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" /> Practiced This Week
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">React Hooks</Badge>
                        <Badge variant="secondary">CSS Grid</Badge>
                        <Badge variant="secondary">TypeScript Interfaces</Badge>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Plus className="h-4 w-4 text-green-500" /> New Skills Added
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/5">
                            Zustand
                        </Badge>
                        <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/5">
                            Radix UI
                        </Badge>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" /> Improved
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                            Performance Optimization
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
