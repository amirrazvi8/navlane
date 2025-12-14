"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const data = [
    { name: "Frontend", score: 80, fill: "#ff007f" },
    { name: "Backend", score: 85, fill: "#800080" },
    { name: "DevOps", score: 75, fill: "#1677ad" },
    { name: "Design", score: 70, fill: "#ee0943" },
    { name: "Soft Skills", score: 90, fill: "#00b496" },
];

export function CompetencyScoreChart() {
    const isMobile = useIsMobile();

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Competency Score</CardTitle>
            </CardHeader>

            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="5%" outerRadius="90%" barSize={30} data={data}>
                        <RadialBar label={{ position: "insideStart", fill: "#000" }} background dataKey="score" />

                        <Legend
                            iconSize={12}
                            layout={isMobile ? "horizontal" : "vertical"}
                            verticalAlign={isMobile ? "bottom" : "middle"}
                            align={isMobile ? "center" : "right"}
                            wrapperStyle={isMobile ? { paddingTop: 25 } : { right: -30 }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
