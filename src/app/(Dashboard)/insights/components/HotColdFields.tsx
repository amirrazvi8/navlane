import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Snowflake, CloudSun } from "lucide-react";

const fields = [
    { role: "Generative AI", status: "HOT", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", desc: "Explosive growth, high demand." },
    { role: "Cybersecurity", status: "WARM", icon: CloudSun, color: "text-yellow-500", bg: "bg-yellow-500/10", desc: "Steady demand, essential role." },
    { role: "Manual QA", status: "COLD", icon: Snowflake, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Declining due to automation." },
];

export function HotColdFields() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Hot & Cold Fields</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
                {fields.map((field) => (
                    <div key={field.role} className="flex items-start space-x-4 p-2 rounded-lg border bg-card justify-between">
                        <div className="flex gap-4 items-center">
                            <div className={`p-2 rounded-full ${field.bg} flex items-center justify-center w-10 h-10`}>
                                <field.icon className={`h-5 w-5 ${field.color}`} />
                            </div>
                            <div className="">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{field.role}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{field.desc}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${field.bg} ${field.color}`}>
                            {field.status}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
