"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductivityChart({ chartData }: { chartData?: { day: string, score: number }[] }) {
    const dataToUse = chartData && chartData.length > 0 ? chartData : [
        { day: "Mon", score: 0 },
        { day: "Tue", score: 0 },
        { day: "Wed", score: 0 },
        { day: "Thu", score: 0 },
        { day: "Fri", score: 0 },
        { day: "Sat", score: 0 },
        { day: "Sun", score: 0 },
    ];
    return (
        <Card className="h-full border-primary/30">
            <CardHeader>
                <CardTitle>Productivity Score</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataToUse}>
                        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                color: "white",
                                borderRadius: "4px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                fontSize: "12px",
                            }}
                        />

                        <Line type="monotone" dataKey="score" strokeWidth={2} activeDot={{ r: 6 }} className="stroke-primary" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
