"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from "lucide-react";

const milestones = [
    {
        id: 1,
        title: "HTML & CSS Mastery",
        status: "completed",
        date: "Oct 2023",
        description: "Semantic HTML, Flexbox, Grid, Responsive Design",
        subtasks: [
            {
                id: 101,
                title: "Learn Semantic HTML tags",
                completed: true,
            },
            {
                id: 102,
                title: "Master Flexbox Layouts",
                completed: true,
            },
            {
                id: 103,
                title: "Understand CSS Grid",
                completed: true,
            },
            {
                id: 104,
                title: "Build a Responsive Portfolio",
                completed: true,
            },
        ],
    },
    {
        id: 2,
        title: "JavaScript Fundamentals",
        status: "completed",
        date: "Nov 2023",
        description: "ES6+, Async/Await, DOM Manipulation, Event Loop",
        subtasks: [
            {
                id: 201,
                title: "Variables & Data Types",
                completed: true,
            },
            {
                id: 202,
                title: "Functions & Scope",
                completed: true,
            },
            {
                id: 203,
                title: "DOM Manipulation",
                completed: true,
            },
            {
                id: 204,
                title: "Async/Await & Promises",
                completed: true,
            },
        ],
    },
    {
        id: 3,
        title: "React Ecosystem",
        status: "in-progress",
        date: "Dec 2023",
        description: "Hooks, Context API, Redux, Next.js Basics",

        subtasks: [
            {
                id: 301,
                title: "React Components & Props",
                completed: true,
            },
            {
                id: 302,
                title: "useState & useEffect Hooks",
                completed: true,
            },
            {
                id: 303,
                title: "Context API for State Management",
                completed: false,
            },
            {
                id: 304,
                title: "Introduction to Next.js",
                completed: false,
            },
        ],
    },
    {
        id: 4,
        title: "Backend with Node.js",
        status: "upcoming",
        date: "Jan 2024",
        description: "Express, REST APIs, MongoDB, Authentication",
        subtasks: [
            {
                id: 401,
                title: "Node.js Basics",
                completed: false,
            },
            {
                id: 402,
                title: "Express.js Routing",
                completed: false,
            },
            {
                id: 403,
                title: "MongoDB & Mongoose",
                completed: false,
            },
            {
                id: 404,
                title: "JWT Authentication",
                completed: false,
            },
        ],
    },
];

export function RoadmapTimeline() {
    const [expandedMilestones, setExpandedMilestones] = useState<number[]>([3]);

    const toggleMilestone = (id: number) => {
        setExpandedMilestones((prev) => (prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]));
    };

    return (
        <Card className=" border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    Active Roadmap: Frontend to Full Stack
                </CardTitle>
            </CardHeader>
            <CardContent className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-8 before:h-full before:w-0.5 before:bg-linear-to-b before:from-primary before:via-muted before:to-transparent">
                {milestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-8">
                        <div
                            className={`absolute left-[-5px] top-1 h-3 w-3 rounded-full border-2 ${
                                milestone.status === "completed"
                                    ? "bg-primary border-primary"
                                    : milestone.status === "in-progress"
                                    ? "bg-background border-primary ring-4 ring-primary/20"
                                    : "bg-background border-muted"
                            }`}
                        ></div>
                        <div
                            className={`p-4 rounded-xl border transition-all ${
                                milestone.status === "in-progress"
                                    ? "bg-primary/5 border-primary/50 shadow-md"
                                    : "bg-card border-border hover:border-primary/30"
                            }`}
                        >
                            <div
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 cursor-pointer group"
                                onClick={() => toggleMilestone(milestone.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-semibold text-lg ${milestone.status === "in-progress" ? "text-primary" : ""}`}>
                                        {milestone.title}
                                    </h3>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted">
                                        {expandedMilestones.includes(milestone.id) ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                    <Clock className="h-3 w-3" /> {milestone.date}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>

                            {milestone.status === "in-progress" && (
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-primary font-medium">In Progress</span>
                                        <span>65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[65%] rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            )}

                            {expandedMilestones.includes(milestone.id) && (
                                <div className="mt-4 space-y-2 border-t pt-3">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subtasks</h4>
                                    {milestone.subtasks.map((subtask) => (
                                        <div key={subtask.id} className="flex items-center gap-2 text-sm">
                                            {subtask.completed ? (
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                            ) : (
                                                <Circle className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className={subtask.completed ? "text-muted-foreground line-through" : ""}>{subtask.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-3 flex items-center gap-2">
                                {milestone.status === "completed" && (
                                    <div className="flex items-center text-xs text-green-500 font-medium">
                                        <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
                                    </div>
                                )}
                                {milestone.status === "upcoming" && (
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Circle className="h-4 w-4 mr-1" /> Upcoming
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
