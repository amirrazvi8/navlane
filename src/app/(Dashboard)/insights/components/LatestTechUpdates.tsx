import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Newspaper } from "lucide-react";
import Link from "next/link";

const updates = [
    {
        id: 1,
        title: "Next.js 15 Released: Everything You Need to Know",
        source: "Vercel Blog",
        description: "Major performance improvements, new caching strategies, and enhanced developer experience.",
        link: "#",
    },
    {
        id: 2,
        title: "The State of AI in Software Engineering 2024",
        source: "GitHub",
        description: "How AI tools are reshaping the coding landscape and what it means for developers.",
        link: "#",
    },
    {
        id: 3,
        title: "Rust vs Go: Which One Should You Learn in 2025?",
        source: "Dev.to",
        description: "A deep dive into the pros and cons of two of the most popular modern systems languages.",
        link: "#",
    },
];

export function LatestTechUpdates() {
    return (
        <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Latest Tech Updates</CardTitle>
                <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
                {updates.map((update) => (
                    <div
                        key={update.id}
                        className="flex flex-col lg:flex-row justify-between items-center space-y-2 p-3 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{update.source}</span>
                            </div>
                            <h3 className="font-semibold leading-tight">{update.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{update.description}</p>
                        </div>
                        <Link
                            href={update.link}
                            className="text-xs text-secondary flex items-center hover:underline mt-1 border px-6 rounded-full border-primary/20 h-10"
                        >
                            Read More <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                ))}
                <Button variant="outline" className="w-full mt-auto cursor-pointer">
                    View More Updates
                </Button>
            </CardContent>
        </Card>
    );
}
