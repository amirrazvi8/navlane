import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const skills = [
    { name: "React Server Components", trend: "+15%", status: "Hot", icon: TrendingUp, color: "text-green-500" },
    { name: "TypeScript", trend: "+8%", status: "Growing", icon: TrendingUp, color: "text-green-500" },
    { name: "Kubernetes", trend: "0%", status: "Stable", icon: Minus, color: "text-yellow-500" },
    { name: "jQuery", trend: "-5%", status: "Declining", icon: TrendingDown, color: "text-red-500" },
];

export function TrendingSkills() {
    return (
        <Card className="h-full border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold tracking-tight">Trending Skills</CardTitle>
                <TrendingUp className="h-4 w-4" />
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground pb-3 border-b">
                    <div className="col-span-2">Skill</div>
                    <div>Trend</div>
                    <div className="text-right">Status</div>
                </div>

                <div className="mt-2 space-y-3">
                    {skills.map((skill) => {
                        const Icon = skill.icon;
                        return (
                            <div key={skill.name} className="grid grid-cols-4 items-center text-sm py-1 rounded-lg hover:bg-muted/40 transition-colors">
                                <div className="col-span-2 font-medium">{skill.name}</div>

                                <div className="flex items-center space-x-1 font-semibold">
                                    <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", skill.color, "bg-muted")}>
                                        <Icon className="h-3 w-3" />
                                        <span>{skill.trend}</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <Badge
                                        variant={skill.status === "Hot" ? "default" : skill.status === "Growing" ? "secondary" : "outline"}
                                        className="px-2 py-0.5 text-xs"
                                    >
                                        {skill.status}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
