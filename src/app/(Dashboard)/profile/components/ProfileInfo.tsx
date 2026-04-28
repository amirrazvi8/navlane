"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, GraduationCap, Edit, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export function ProfileInfo({ initialData = {} }: { initialData?: any }) {
    const [name, setName] = useState(initialData.name || "");
    const [bio, setBio] = useState(initialData.bio || "");
    const [education, setEducation] = useState(initialData.education || "");
    const [profileImage, setProfileImage] = useState(initialData.profileImage || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, bio, education, profileImage }),
            });

            if (!res.ok) throw new Error("Failed to update profile");
            
            Swal.fire("Success", "Profile updated successfully!", "success");
            router.refresh(); // Refresh page to reflect new data everywhere
        } catch (error: any) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 relative">
                        <AvatarImage src={profileImage || "/placeholder-avatar.jpg"} alt="Profile" className="object-cover" />
                        <AvatarFallback className="text-lg">{(name || "U")[0].toUpperCase()}</AvatarFallback>
                        <span
                            className="absolute top-0 right-0 cursor-pointer rounded-full bg-gray-900 hover:bg-gray-800 transition-all duration-300 w-6 h-6 flex items-center justify-center "
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Edit className="w-4 h-4 text-white" />
                        </span>
                    </Avatar>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:gap-20">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="pl-8" disabled={loading} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" value={initialData.email || ""} placeholder="email@example.com" className="pl-8" disabled />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">About</Label>
                    <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="min-h-30" disabled={loading} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="education">Education / Role</Label>
                    <div className="relative">
                        <GraduationCap className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="education" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. Computer Science Student" className="pl-8" disabled={loading} />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
