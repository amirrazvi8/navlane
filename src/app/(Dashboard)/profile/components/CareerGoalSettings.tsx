import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

export function CareerGoalSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Target Goal
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex gap-4 lg:gap-8">
                <div className="space-y-2">
                    <Select defaultValue="fullstack">
                        <SelectTrigger>
                            <SelectValue placeholder="Select your target role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                            <SelectItem value="frontend">Frontend Developer</SelectItem>
                            <SelectItem value="backend">Backend Developer</SelectItem>
                            <SelectItem value="ml">Machine Learning Engineer</SelectItem>
                            <SelectItem value="ai">AI Researcher</SelectItem>
                            <SelectItem value="devops">DevOps Engineer</SelectItem>
                            <SelectItem value="cloud">Cloud Architect</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-fit cursor-pointer">Update Goal</Button>
            </CardContent>
        </Card>
    );
}
