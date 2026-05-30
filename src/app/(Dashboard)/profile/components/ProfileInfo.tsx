"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Phone, Loader2, Check, Compass, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/store/hooks";
import { updatePersonalInfo } from "@/store/userProfileSlice";

interface ProfileInfoProps {
    initialData: {
        name: string;
        email: string;
        bio: string;
        location: string;
        phone: string;
        profileImage: string;
        locationPreference: string;
    };
}

export function ProfileInfo({ initialData }: ProfileInfoProps) {
    const [name, setName] = useState(initialData.name || "");
    const [bio, setBio] = useState(initialData.bio || "");
    const [location, setLocation] = useState(initialData.location || "");
    const [phone, setPhone] = useState(initialData.phone || "");
    const [locationPreference, setLocationPreference] = useState(initialData.locationPreference || "");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, bio, location, phone, locationPreference }),
            });
            if (!res.ok) throw new Error("Failed to update profile");

            // Sync to Redux global state
            dispatch(updatePersonalInfo({ name, bio, location, phone, locationPreference }));

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            router.refresh();
        } catch (error: any) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "bg-muted/20 border-border/40 focus:bg-background focus:border-primary/40 transition-all duration-200 h-10";
    const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40";

    return (
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Full Name</Label>
                        <div className="relative">
                            <User className={iconClasses} />
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={`pl-9 ${inputClasses}`} disabled={loading} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Email</Label>
                        <div className="relative">
                            <Mail className={iconClasses} />
                            <Input id="email" type="email" value={initialData.email || ""} className={`pl-9 ${inputClasses} opacity-50 cursor-not-allowed`} disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Phone</Label>
                        <div className="relative">
                            <Phone className={iconClasses} />
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={`pl-9 ${inputClasses}`} disabled={loading} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Location</Label>
                        <div className="relative">
                            <MapPin className={iconClasses} />
                            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Mumbai, India" className={`pl-9 ${inputClasses}`} disabled={loading} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="locationPreference" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                        Location Preference
                    </Label>
                    <div className="relative">
                        <Compass className={iconClasses} />
                        <Input id="locationPreference" value={locationPreference} onChange={(e) => setLocationPreference(e.target.value)} placeholder="e.g. Remote, Bangalore, New York" className={`pl-9 ${inputClasses}`} disabled={loading} />
                    </div>
                    <p className="text-[11px] text-muted-foreground/50 pl-1">Where you'd prefer to work — used to filter job opportunities</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">About</Label>
                    <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write a brief introduction about yourself, your interests, and career aspirations..."
                        className="min-h-[100px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/40 transition-all duration-200 resize-none leading-relaxed"
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-end pt-1">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="min-w-[150px] gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200"
                    >
                        {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                        ) : saved ? (
                            <><Check className="h-4 w-4" />Saved!</>
                        ) : (
                            <><Save className="h-4 w-4" />Save Changes</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
