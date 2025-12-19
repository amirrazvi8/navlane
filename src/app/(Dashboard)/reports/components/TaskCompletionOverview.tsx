"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
    { name: "Done", value: 18, color: "#22c55e" },
    { name: "Pending", value: 4, color: "#eab308" },
    { name: "Skipped", value: 2, color: "#ef4444" },
];

export function TaskCompletionOverview() {
    return (
        <Card className="border-primary/30">
            <CardHeader>
                <CardTitle>Task Completion Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={5} dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                cursor={{ fill: "transparent" }}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "4px",
                                    border: "none",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    fontSize: "12px",
                                }}
                            />

                            <Legend
                                iconSize={10}
                                verticalAlign="bottom"
                                align="center"
                                layout="horizontal"
                                iconType="circle"
                                wrapperStyle={{ paddingTop: 5 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
