"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { day: "Mon", score: 80 },
    { day: "Tue", score: 90 },
    { day: "Wed", score: 70 },
    { day: "Thu", score: 85 },
    { day: "Fri", score: 95 },
    { day: "Sat", score: 60 },
    { day: "Sun", score: 50 },
];

export function ProductivityChart() {
    return (
        <Card className="h-full border-primary/30">
            <CardHeader>
                <CardTitle>Productivity Score</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
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
