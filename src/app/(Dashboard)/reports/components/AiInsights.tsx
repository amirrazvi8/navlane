import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export function AiInsights() {
    return (
        <Card className="h-full border-primary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Insight
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg border border-primary/10">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        You&apos;ve maintained excellent consistency this week, hitting your daily goals 6 out of 7 days. Your focus on{" "}
                        <span className="text-primary">React Patterns</span> resulted in a 15% increase in quiz scores. Consider dedicating more time to{" "}
                        <span className="text-primary">TypeScript Generics</span> next week to balance your skill growth.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
