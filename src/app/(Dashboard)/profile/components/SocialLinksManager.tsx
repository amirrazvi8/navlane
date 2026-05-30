"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, Link, Save } from "lucide-react";
import { FaLinkedin, FaGithub, FaGlobe, FaXTwitter } from "react-icons/fa6";
import { useAppDispatch } from "@/store/hooks";
import { updateSocialLinks } from "@/store/userProfileSlice";

interface SocialLinks {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
}

export function SocialLinksManager({ initialLinks }: { initialLinks?: SocialLinks }) {
    const [links, setLinks] = useState<SocialLinks>(initialLinks || { linkedin: "", github: "", portfolio: "", twitter: "" });
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
                body: JSON.stringify({ socialLinks: links }),
            });
            if (!res.ok) throw new Error("Failed to save links");

            // Sync to Redux global state
            dispatch(updateSocialLinks(links));

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            router.refresh();
        } catch (err: any) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: "linkedin" as const, icon: FaLinkedin, label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile", color: "text-blue-500", bgHover: "focus-within:border-blue-500/30" },
        { key: "github" as const, icon: FaGithub, label: "GitHub", placeholder: "https://github.com/yourusername", color: "text-foreground", bgHover: "focus-within:border-foreground/20" },
        { key: "portfolio" as const, icon: FaGlobe, label: "Portfolio", placeholder: "https://yourportfolio.com", color: "text-emerald-500", bgHover: "focus-within:border-emerald-500/30" },
        { key: "twitter" as const, icon: FaXTwitter, label: "Twitter / X", placeholder: "https://x.com/yourhandle", color: "text-sky-500", bgHover: "focus-within:border-sky-500/30" },
    ];

    return (
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 border border-cyan-500/10">
                        <Link className="h-4 w-4 text-cyan-500" />
                    </div>
                    Social Links
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {fields.map((field) => (
                    <div key={field.key} className={`flex items-center gap-3 p-2 rounded-xl border border-transparent ${field.bgHover} transition-all duration-200`}>
                        <div className={`shrink-0 p-2 rounded-lg bg-muted/20 ${field.color}`}>
                            <field.icon className="h-4 w-4" />
                        </div>
                        <Input
                            value={links[field.key]}
                            onChange={(e) => setLinks({ ...links, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className="bg-muted/15 border-border/30 focus:bg-background focus:border-primary/40 transition-all duration-200 h-10"
                            disabled={loading}
                        />
                    </div>
                ))}
                <div className="flex justify-end pt-2">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        size="sm"
                        className="min-w-[130px] gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200"
                    >
                        {loading ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving...</>
                        ) : saved ? (
                            <><Check className="h-3.5 w-3.5" />Saved!</>
                        ) : (
                            <><Save className="h-3.5 w-3.5" />Save Links</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
