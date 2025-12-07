import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";
import { IoHourglass } from "react-icons/io5";

const tasks = [
    { id: 1, title: "Complete React Hooks Module", status: "Completed" },
    { id: 2, title: "Practice TypeScript Generics", status: "In Progress" },
    { id: 3, title: "Review System Design Notes", status: "Pending" },
    { id: 4, title: "Complete System Design Notes", status: "Pending" },
];

const statusClasses: Record<string, string> = {
    Completed: "bg-green-500/10 text-green-500 border-green-500/50",
    "In Progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
    Pending: "bg-pink-500/10 text-pink-500 border-pink-500/50",
};

const statusIcons: Record<string, React.ReactNode> = {
    Completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    "In Progress": <IoHourglass className="w-4 h-4 text-yellow-500" />,
    Pending: <Clock className="w-4 h-4 text-pink-500" />,
};

export function TodaysTasks() {
    return (
        <Card className="h-full border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Today&apos;s Tasks</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {tasks.map((task) => (
                    <div key={task.id} className="flex flex-col gap-2 md:flex-row md:items-center justify-between p-3 border rounded-lg bg-muted/20">
                        <div className="space-y-1">
                            <p className="font-medium leading-none">{task.title}</p>
                        </div>
                        <span className={`px-2 py-0.5 w-fit mt-1 rounded-full border flex items-center gap-2 ${statusClasses[task.status]}`}>
                            {statusIcons[task.status]}
                            {task.status}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
