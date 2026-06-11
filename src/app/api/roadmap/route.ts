import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnected from "@/lib/db";
import Roadmap from "@/models/Roadmap";
import User from "@/models/User";
import { generateRoadmapWithAI } from "@/lib/ai";


// GET user's roadmaps
export async function GET(req: Request) {
    await dbConnected();
    const session = await auth();

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const roadmaps = await Roadmap.find({ userId: (session.user as any).id });
        return NextResponse.json({ roadmaps }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// POST create a new roadmap via AI
export async function POST(req: Request) {
    await dbConnected();
    const session = await auth();

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { careerGoal, currentSkills } = await req.json();

        if (!careerGoal) {
            return NextResponse.json({ message: "careerGoal is required" }, { status: 400 });
        }

        const milestones = await generateRoadmapWithAI(careerGoal, currentSkills || "");

        const newRoadmap = new Roadmap({
            userId: (session.user as any).id,
            title: careerGoal,
            description: `Generated Roadmap for ${careerGoal}`,
            goal: careerGoal,
            milestones: milestones,
            isCompleted: false,
        });

        await newRoadmap.save();
        return NextResponse.json({ roadmap: newRoadmap }, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Failed to generate roadmap" }, { status: 500 });
    }
}
