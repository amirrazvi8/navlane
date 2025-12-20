import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const realities = [
    {
        myth: "Learning Python alone is enough for AI jobs",
        reality: "Most AI roles require strong math, data handling, and backend fundamentals.",
    },
    {
        myth: "Full Stack developers must know everything",
        reality: "Strong depth in one area beats shallow knowledge of many tools.",
    },
    {
        myth: "More projects guarantee a job",
        reality: "Project quality, problem depth, and explanations matter more than count.",
    },
    {
        myth: "DevOps is just tools and scripting",
        reality: "DevOps roles demand system thinking, reliability, and infra knowledge.",
    },
];

export function IndustryReality() {
    return (
        <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Industry Reality Check</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="gap-6 grid lg:grid-cols-2">
                {realities.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg border space-y-1 bg-muted/20 border-cyan-500/30">
                        <p className="text-sm font-semibold text-red-500">Myth: {item.myth}</p>
                        <p className="text-sm text-muted-foreground">Reality: {item.reality}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
