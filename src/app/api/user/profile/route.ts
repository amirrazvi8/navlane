import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnected from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET user profile
export async function GET(req: Request) {
    await dbConnected();
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await User.findById((session.user as any).id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// PUT update user profile
export async function PUT(req: Request) {
    await dbConnected();
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            name, skills, careerGoal, bio, education, profileImage,
            educationHistory, projects, experience, socialLinks,
            location, phone, locationPreference,
        } = body;

        const updateFields: any = {};
        if (name) updateFields.name = name;
        if (skills) updateFields.skills = skills;
        if (careerGoal) updateFields.careerGoal = careerGoal;
        if (bio !== undefined) updateFields.bio = bio;
        if (education !== undefined) updateFields.education = education;
        if (profileImage !== undefined) updateFields.profileImage = profileImage;
        if (educationHistory !== undefined) updateFields.educationHistory = educationHistory;
        if (projects !== undefined) updateFields.projects = projects;
        if (experience !== undefined) updateFields.experience = experience;
        if (socialLinks !== undefined) updateFields.socialLinks = socialLinks;
        if (location !== undefined) updateFields.location = location;
        if (phone !== undefined) updateFields.phone = phone;
        if (locationPreference !== undefined) updateFields.locationPreference = locationPreference;

        const user = await User.findByIdAndUpdate(
            (session.user as any).id,
            { $set: updateFields },
            { new: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// DELETE user account and all associated data permanently
export async function DELETE(req: Request) {
    await dbConnected();
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;
        
        // 1. Permanent User Deletion
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 2. Cascade deletions (Delete their roadmaps, insights, etc)
        const Roadmap = (await import("@/models/Roadmap")).default;
        await Roadmap.deleteMany({ userId: userId });

        const Insight = (await import("@/models/Insight")).default;
        await Insight.deleteMany({ userId: userId });

        const JobCache = (await import("@/models/JobCache")).default;
        await JobCache.deleteMany({ userId: userId });

        return NextResponse.json({ message: "Account and all associated data permanently deleted" }, { status: 200 });
    } catch (error) {
        console.error("Account deletion error:", error);
        return NextResponse.json({ message: "Failed to delete account" }, { status: 500 });
    }
}
