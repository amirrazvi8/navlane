import { PreviousRoadmapsList } from "./components/PreviousRoadmapsList";
import { RoadmapGeneratorForm } from "./components/RoadmapGeneratorForm";
import { RoadmapTimeline } from "./components/RoadmapTimeline";
import { auth } from "@/auth";

import dbConnected from "@/lib/db";
import User from "@/models/User";
import Roadmap from "@/models/Roadmap";

export default async function RoadmapPage() {
    await dbConnected();
    const session = await auth();
    let activeRoadmap: any = null;
    let pastRoadmaps: any[] = [];

    if (session && session.user) {
        const userId = (session.user as any).id;
        const roadmaps = await Roadmap.find({ userId }).sort({ updatedAt: -1 }).lean();
        
        activeRoadmap = roadmaps.find((r) => !r.isCompleted);
        pastRoadmaps = roadmaps.filter((r) => r.isCompleted || r._id.toString() !== activeRoadmap?._id.toString());
    }
    
    // We parse them cleanly to pass as JSON to client components
    if (activeRoadmap) activeRoadmap = JSON.parse(JSON.stringify(activeRoadmap));
    if (pastRoadmaps.length) pastRoadmaps = JSON.parse(JSON.stringify(pastRoadmaps));

    const hasAnyRoadmaps = activeRoadmap || pastRoadmaps.length > 0;
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Personalized Roadmap</h2>
            </div>

            <div className={`grid gap-6 ${hasAnyRoadmaps ? "grid-cols-1 lg:grid-cols-5" : "max-w-xl mx-auto"}`}>
                
                {hasAnyRoadmaps && (
                    <div className="lg:col-span-3 space-y-6">
                        {activeRoadmap ? (
                            <RoadmapTimeline roadmapData={activeRoadmap} />
                        ) : (
                            <div className="flex items-center justify-center p-10 border rounded-xl border-dashed bg-muted/20">
                                <p className="text-muted-foreground text-center">You don't have an active roadmap right now.<br/> Generate a new one to get started!</p>
                            </div>
                        )}
                    </div>
                )}

                <div className={`${hasAnyRoadmaps ? "lg:col-span-2" : "w-full"} space-y-6`}>
                    {pastRoadmaps.length > 0 && <PreviousRoadmapsList historyData={pastRoadmaps} />}
                    <RoadmapGeneratorForm />
                </div>
            </div>
        </div>
    );
}
