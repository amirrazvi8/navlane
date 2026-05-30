"use client";

import { useState, useMemo, useEffect } from "react";
import { ProfileHero } from "./components/ProfileHero";
import { ProfileInfo } from "./components/ProfileInfo";
import { CareerGoalSettings } from "./components/CareerGoalSettings";
import { SkillManager } from "./components/SkillManager";
import { EducationManager } from "./components/EducationManager";
import { ExperienceManager } from "./components/ExperienceManager";
import { ProjectManager } from "./components/ProjectManager";
import { SocialLinksManager } from "./components/SocialLinksManager";
import { ChangePassowrd } from "./components/PasswordSetting";
import { DangerZone } from "./components/DangerZone";
import { LogoutButton } from "./components/LogoutButton";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/store/hooks";
import { setUserProfile } from "@/store/userProfileSlice";

interface UserData {
    name: string;
    email: string;
    bio: string;
    education: string;
    profileImage: string;
    location: string;
    phone: string;
    locationPreference: string;
    skills: { name: string; level: string }[];
    careerGoal: { role?: string };
    educationHistory: { degree: string; institution: string; startYear: string; endYear: string; grade: string }[];
    projects: { title: string; description: string; techStack: string[]; liveUrl: string; githubUrl: string }[];
    experience: { title: string; company: string; duration: string; description: string }[];
    socialLinks: { linkedin: string; github: string; portfolio: string; twitter: string };
}

function computeCompleteness(user: UserData): number {
    let score = 0;
    const total = 10;

    if (user.name) score++;
    if (user.bio) score++;
    if (user.profileImage) score++;
    if (user.location) score++;
    if (user.phone) score++;
    if (user.skills?.length > 0) score++;
    if (user.careerGoal?.role) score++;
    if (user.educationHistory?.length > 0) score++;
    if (user.projects?.length > 0) score++;
    if (user.socialLinks?.linkedin || user.socialLinks?.github) score++;

    return Math.round((score / total) * 100);
}

export function ProfilePageClient({ user }: { user: UserData }) {
    const [profileImage, setProfileImage] = useState(user.profileImage || "");
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Hydrate Redux store with server-fetched profile data
    useEffect(() => {
        dispatch(
            setUserProfile({
                name: user.name || "",
                email: user.email || "",
                bio: user.bio || "",
                location: user.location || "",
                locationPreference: user.locationPreference || "",
                phone: user.phone || "",
                profileImage: user.profileImage || "",
                skills: user.skills || [],
                careerGoal: { role: user.careerGoal?.role || "" },
                educationHistory: user.educationHistory || [],
                projects: user.projects || [],
                experience: user.experience || [],
                socialLinks: user.socialLinks || { linkedin: "", github: "", portfolio: "", twitter: "" },
            })
        );
    }, [dispatch, user]);

    const completeness = useMemo(() => computeCompleteness({ ...user, profileImage }), [user, profileImage]);

    const handleImageChange = async (base64: string) => {
        setProfileImage(base64);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileImage: base64 }),
            });
            if (!res.ok) throw new Error("Failed to upload image");
            router.refresh();
        } catch (err: any) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                        Profile & Settings
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your profile, skills, and preferences</p>
                </div>
                <LogoutButton />
            </div>

            <div className="space-y-6">
                {/* Hero */}
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-600" style={{ animationDelay: "50ms" }}>
                    <ProfileHero
                        name={user.name}
                        email={user.email}
                        bio={user.bio}
                        profileImage={profileImage}
                        location={user.location}
                        locationPreference={user.locationPreference}
                        socialLinks={user.socialLinks}
                        completeness={completeness}
                        onImageChange={handleImageChange}
                    />
                </div>

                {/* Personal Info + Career Goal + Social Links row */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-3 duration-600" style={{ animationDelay: "100ms" }}>
                    <ProfileInfo
                        initialData={{
                            name: user.name,
                            email: user.email,
                            bio: user.bio,
                            location: user.location,
                            phone: user.phone,
                            profileImage: user.profileImage,
                            locationPreference: user.locationPreference,
                        }}
                    />
                    <div className="space-y-6">
                        <CareerGoalSettings initialRole={user.careerGoal?.role || ""} />
                        <SocialLinksManager initialLinks={user.socialLinks} />
                    </div>
                </div>

                {/* Skills */}
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-600" style={{ animationDelay: "150ms" }}>
                    <SkillManager initialSkills={user.skills || []} />
                </div>

                {/* Education + Experience row */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-3 duration-600" style={{ animationDelay: "200ms" }}>
                    <EducationManager initialEducation={user.educationHistory || []} />
                    <ExperienceManager initialExperience={user.experience || []} />
                </div>

                {/* Projects */}
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-600" style={{ animationDelay: "250ms" }}>
                    <ProjectManager initialProjects={user.projects || []} />
                </div>

                {/* Account section */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-3 duration-600" style={{ animationDelay: "300ms" }}>
                    <ChangePassowrd />
                    <DangerZone />
                </div>
            </div>
        </div>
    );
}
