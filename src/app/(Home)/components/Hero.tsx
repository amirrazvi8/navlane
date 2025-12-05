import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
    return (
        <section className="space-y-6 pb-8 pt-28 md:pb-12 md:pt-20 lg:py-32">
            <div className="container flex max-w-5xl flex-col items-center gap-4 text-center space-y-2">
                <div className="rounded-full bg-muted/50 px-4 py-1.5 text-sm font-medium text-primary hover:bg-muted transition-colors">
                    ✨ Launching NavLane 1.0
                </div>
                <h1 className="font-heading text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white">
                    Your AI Career GPS for <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Students & Developers</span>
                </h1>
                <p className="max-w-2xl leading-normal text-muted-foreground text-xs md:text-lg sm:leading-8">
                    NavLane helps you navigate your tech career with personalized roadmaps, real-time market insights, and skill gap analysis.
                </p>
                <div className=" pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/dashboard">
                        <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
                            Get Started <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
