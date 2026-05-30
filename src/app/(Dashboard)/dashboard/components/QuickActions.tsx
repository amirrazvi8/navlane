import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Calendar, TrendingUp, ListTodo } from "lucide-react";

export function QuickActions() {
    return (
        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold tracking-tight">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto flex-col gap-3 p-4 bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 rounded-xl group">
                    <div className="p-2 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform">
                        <Zap className="h-6 w-6 text-purple-500" />
                    </div>
                    <span className="font-medium">Generate</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-3 p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 rounded-xl group">
                    <div className="p-2 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform">
                        <Calendar className="h-6 w-6 text-emerald-500" />
                    </div>
                    <span className="font-medium">Routine</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-3 p-4 bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 rounded-xl group">
                    <div className="p-2 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="font-medium">Trends</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-3 p-4 bg-orange-500/5 hover:bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 rounded-xl group">
                    <div className="p-2 bg-orange-500/10 rounded-full group-hover:scale-110 transition-transform">
                        <ListTodo className="h-6 w-6 text-orange-500" />
                    </div>
                    <span className="font-medium">All Tasks</span>
                </Button>
            </CardContent>
        </Card>
    );
}
