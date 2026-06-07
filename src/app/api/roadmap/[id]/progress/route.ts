import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnected from "@/lib/db";
import Roadmap from "@/models/Roadmap";
import Progress from "@/models/Progress";


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnected();
    const session = await auth();

    // Awaiting params is required in Next.js 15+ App Router
    const { id } = await params;

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;
        const body = await req.json();
        const { milestoneId, status } = body;

        // 1. Update the Roadmap Milestone Status
        const roadmap = await Roadmap.findOne({ _id: id, userId });

        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        // Find the milestone and update its status
        const milestone = (roadmap.milestones as any).id(milestoneId);
        if (!milestone) {
            return NextResponse.json({ message: "Milestone not found" }, { status: 404 });
        }

        milestone.status = status;

        // Check if the overall roadmap is completed
        const allCompleted = roadmap.milestones.every((m: any) => m.status === 'Completed');
        if (allCompleted) roadmap.isCompleted = true;

        await roadmap.save();

        // 2. Track in Progress Model
        let progress = await Progress.findOne({ roadmapId: id, userId });

        if (!progress) {
            progress = await Progress.create({
                roadmapId: id,
                userId,
                completedMilestones: []
            });
        }

        if (status === 'Completed' && !progress.completedMilestones.includes(milestoneId)) {
            progress.completedMilestones.push(milestoneId);
        } else if (status !== 'Completed') {
            progress.completedMilestones = progress.completedMilestones.filter(
                (m: any) => m.toString() !== milestoneId.toString()
            );
        }

        await progress.save();

        return NextResponse.json({ message: "Progress updated", milestone }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update progress" }, { status: 500 });
    }
}
