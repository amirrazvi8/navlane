import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnected from "@/lib/db";
import Roadmap from "@/models/Roadmap";


export async function PUT(req: Request, context: any) {
    await dbConnected();
    const session = await auth();

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const params = await context.params;
        const roadmapId = params.id;

        if (!roadmapId) {
            return NextResponse.json({ message: "Roadmap ID is required" }, { status: 400 });
        }

        const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: (session.user as any).id });
        
        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        if (roadmap.isCompleted) {
             return NextResponse.json({ message: "Cannot resume a fully completed roadmap" }, { status: 400 });
        }

        roadmap.updatedAt = new Date();
        await roadmap.save();

        return NextResponse.json({ message: "Roadmap resumed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Roadmap resume error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
