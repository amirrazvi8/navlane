"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Loader2, Check, Lock } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { handleApiError } from "@/lib/axios";

export function ChangePassowrd() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            Swal.fire("Error", "New passwords do not match", "error");
            return;
        }
        if (newPassword.length < 6) {
            Swal.fire("Error", "New password must be at least 6 characters", "error");
            return;
        }

        setLoading(true);
        try {
            await axios.put("/api/user/password", { currentPassword, newPassword });

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            Swal.fire("Error", handleApiError(error), "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "bg-muted/20 border-border/40 focus:bg-background focus:border-primary/40 transition-all duration-200 h-10";

    return (
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:border-border/60 transition-colors duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/30">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    Change Password
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="current-password" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Current Password</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClasses} disabled={loading} />
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="new-password" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClasses} disabled={loading} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="confirm-password" className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Confirm Password</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} disabled={loading} />
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    className="min-w-[160px] gap-2 border-border/40 hover:border-border/60"
                >
                    {loading ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" />Updating...</>
                    ) : saved ? (
                        <><Check className="h-3.5 w-3.5" />Updated!</>
                    ) : (
                        "Update Password"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
