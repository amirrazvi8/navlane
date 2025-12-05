import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, FileText, Globe, Map, Zap } from "lucide-react";

export const Features = () => {
    return (
        <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold text-white">
                    Everything you need to <span className="text-primary">accelerate</span>
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Powerful tools designed to help you land your dream job faster.
                </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 grid-cols-1 md:grid-cols-2 md:max-w-5xl lg:grid-cols-3 pt-8">
                <Card className="glass border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                        <div className="p-2 w-fit rounded-lg bg-primary/10 mb-2">
                            <Map className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-white">Personalized Roadmap</CardTitle>
                        <CardDescription className="text-slate-400">Step-by-step guides tailored to your career goals.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="glass border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                        <div className="p-2 w-fit rounded-lg bg-secondary/10 mb-2">
                            <Zap className="h-6 w-6 text-secondary" />
                        </div>
                        <CardTitle className="text-white">Market Insights</CardTitle>
                        <CardDescription className="text-slate-400">Real-time data on trending skills and hiring demand.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="glass border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                        <div className="p-2 w-fit rounded-lg bg-primary/10 mb-2">
                            <BarChart2 className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-white">Skill Gap Analysis</CardTitle>
                        <CardDescription className="text-slate-400">Identify missing skills and get recommendations.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="glass border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                        <div className="p-2 w-fit rounded-lg bg-secondary/10 mb-2">
                            <Calendar className="h-6 w-6 text-secondary" />
                        </div>
                        <CardTitle className="text-white">Smart Planner</CardTitle>
                        <CardDescription className="text-slate-400">Optimize your learning schedule with AI.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="glass border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                        <div className="p-2 w-fit rounded-lg bg-primary/10 mb-2">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-white">Weekly Reports</CardTitle>
                        <CardDescription className="text-slate-400">Track your progress and stay consistent.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="glass border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader>
                        <div className="p-2 w-fit rounded-lg bg-secondary/10 mb-2">
                            <Globe className="h-6 w-6 text-secondary" />
                        </div>
                        <CardTitle className="text-white">Community</CardTitle>
                        <CardDescription className="text-slate-400">Connect with other learners and mentors.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </section>
    );
};
