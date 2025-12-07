import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Calendar, TrendingUp, ListTodo } from "lucide-react";

export function QuickActions() {
    return (
        <Card className="border-primary/30">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-purple-500/5 hover:border-purple-500/50">
                    <Zap className="h-6 w-6 text-purple-500" />
                    <span>Generate Roadmap</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-secondary/5 hover:border-secondary/50">
                    <Calendar className="h-6 w-6 text-secondary" />
                    <span>Create Routine</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-blue-500/5 hover:border-blue-500/50">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                    <span>Market Trends</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-yellow-500/5 hover:border-yellow-500/50">
                    <ListTodo className="h-6 w-6 text-yellow-500" />
                    <span>View All Tasks</span>
                </Button>
            </CardContent>
        </Card>
    );
}
