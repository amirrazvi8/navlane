import { auth } from "@/auth";

import dbConnected from "@/lib/db";
import User from "@/models/User";
import { ProfilePageClient } from "./ProfilePageClient";

export default async function ProfilePage() {
    await dbConnected();
    const session = await auth();
    let userObj: any = {};

    if (session && session.user) {
        const user = await User.findById((session.user as any).id);
        if (user) {
            userObj = JSON.parse(JSON.stringify({
                name: user.name || "",
                email: user.email || "",
                bio: user.bio || "",
                education: user.education || "",
                profileImage: user.profileImage || "",
                location: user.location || "",
                phone: user.phone || "",
                skills: user.skills || [],
                careerGoal: user.careerGoal || {},
                educationHistory: user.educationHistory || [],
                projects: user.projects || [],
                experience: user.experience || [],
                socialLinks: user.socialLinks || { linkedin: "", github: "", portfolio: "", twitter: "" },
                locationPreference: user.locationPreference || "",
            }));
        }
    }

    return <ProfilePageClient user={userObj} />;

    
}
