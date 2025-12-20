import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Flame } from "lucide-react";

const roiData = [
    {
        skill: "DevOps",
        time: "6–8 weeks",
        growth: "+28%",
        salary: "+22%",
        score: 9.1,
    },
    {
        skill: "Backend System Design",
        time: "4–6 weeks",
        growth: "+25%",
        salary: "+20%",
        score: 8.8,
    },
    {
        skill: "Cloud Security",
        time: "5–7 weeks",
        growth: "+30%",
        salary: "+26%",
        score: 9.3,
    },
    {
        skill: "Manual QA",
        time: "2–3 weeks",
        growth: "-8%",
        salary: "-5%",
        score: 3.2,
    },
];

export function SkillROI() {
    return (
        <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Skill ROI</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="space-y-4">
                {roiData.map((item) => (
                    <div key={item.skill} className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20 border-cyan-500/30">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">{item.skill}</p>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {item.time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {item.growth}
                                </span>
                            </div>
                        </div>

                        <Badge
                            variant="outline"
                            className={`text-xs font-semibold ${
                                item.score >= 8
                                    ? "text-green-500 border-green-500/20"
                                    : item.score >= 5
                                    ? "text-yellow-500 border-yellow-500/20"
                                    : "text-red-500 border-red-500/20"
                            }`}
                        >
                            ROI {item.score}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
