"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export function WeeklyStatsChart({ chartData }: { chartData?: { name: string, tasks: number }[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    if (!mounted) return null;

    const dataToUse = chartData && chartData.length > 0 ? chartData : [
        { name: "Mon", tasks: 0 },
        { name: "Tue", tasks: 0 },
        { name: "Wed", tasks: 0 },
        { name: "Thu", tasks: 0 },
        { name: "Fri", tasks: 0 },
        { name: "Sat", tasks: 0 },
        { name: "Sun", tasks: 0 },
    ];

    const totalTasks = dataToUse.reduce((acc, curr) => acc + curr.tasks, 0);

    return (
        <Card className="h-full border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Weekly Activity</CardTitle>
                <div className="text-sm text-muted-foreground">
                    Total: <span className="font-bold text-primary">{totalTasks}</span> Tasks
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataToUse}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
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
                        <Bar dataKey="tasks" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
