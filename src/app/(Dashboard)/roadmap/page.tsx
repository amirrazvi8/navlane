import { PreviousRoadmapsList } from "./components/PreviousRoadmapsList";
import { ResourceList } from "./components/ResourceList";
import { RoadmapGeneratorForm } from "./components/RoadmapGeneratorForm";
import { RoadmapTimeline } from "./components/RoadmapTimeline";

export default function RoadmapPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Personalized Roadmap</h2>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-6">
                    <RoadmapTimeline />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <PreviousRoadmapsList />
                    <RoadmapGeneratorForm />
                    <ResourceList />
                </div>
            </div>
        </div>
    );
}
