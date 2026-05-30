import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnected from "@/lib/db";
import Roadmap from "@/models/Roadmap";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request) {
    await dbConnected();
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { roadmapId, milestoneId, subtaskId } = await req.json();

        if (!roadmapId || !milestoneId || !subtaskId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: (session.user as any).id });
        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        // Find the milestone
        const milestone = roadmap.milestones.find((m: any) => m._id.toString() === milestoneId);
        if (!milestone) {
            return NextResponse.json({ message: "Milestone not found" }, { status: 404 });
        }

        // Find the subtask
        const subtask = milestone.subtasks.find((s: any) => s._id.toString() === subtaskId);
        if (!subtask) {
            return NextResponse.json({ message: "Subtask not found" }, { status: 404 });
        }

        // Mark subtask as complete
        subtask.completed = true;
        subtask.completedAt = new Date();

        // Check if all subtasks in this milestone are completed
        const allCompleted = milestone.subtasks.every((st: any) => st.completed);
        if (allCompleted) {
            milestone.status = "completed";

            // Find the next upcoming milestone and mark it in-progress
            const nextMilestone = roadmap.milestones.find((m: any) => m.status === "upcoming");
            if (nextMilestone) {
                nextMilestone.status = "in-progress";
            } else {
                // If no next milestone, the whole roadmap might be complete
                const anyUncompleted = roadmap.milestones.some((m: any) => m.status !== "completed");
                if (!anyUncompleted) {
                    roadmap.isCompleted = true;
                }
            }
        } else if (milestone.status === "upcoming") {
             milestone.status = "in-progress";
        }

        await roadmap.save();

        return NextResponse.json({ 
            message: "Task completed successfully",
            milestoneCompleted: allCompleted,
            milestoneId: allCompleted ? milestoneId : null
        }, { status: 200 });
    } catch (error) {
        console.error("Task completion error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
