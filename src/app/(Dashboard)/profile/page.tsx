import { ChangePassowrd } from "./components/PasswordSetting";
import { DangerZone } from "./components/DangerZone";
import { ProfileInfo } from "./components/ProfileInfo";
import { SkillManager } from "./components/SkillManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnected from "@/lib/db";
import User from "@/models/User";
import { LogoutButton } from "./components/LogoutButton";

export default async function ProfilePage() {
    await dbConnected();
    const session = await getServerSession(authOptions);
    let userObj = {};
    if (session && session.user) {
        const user = await User.findById((session.user as any).id);
        if (user) {
            userObj = { 
                name: user.name, 
                email: user.email, 
                bio: user.bio, 
                education: user.education,
                profileImage: user.profileImage,
                skills: JSON.parse(JSON.stringify(user.skills || []))
            };
        }
    }

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
                <LogoutButton />
            </div>
            <ProfileInfo initialData={userObj} />
            <SkillManager initialSkills={(userObj as any).skills || []} />
            <ChangePassowrd />
            <DangerZone />
        </div>
    );
}
