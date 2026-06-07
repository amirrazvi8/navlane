import { NextResponse } from "next/server";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import dbConnected from "@/lib/db";
import User from "@/models/User";


export async function PUT(req: Request) {
    await dbConnected();
    const session = await auth();

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Both current and new passwords are required" }, { status: 400 });
        }

        const user = await User.findById((session.user as any).id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
