"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, TriangleAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";
import { handleApiError } from "@/lib/axios";

export function DangerZone() {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action is permanent and cannot be undone. All your data will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete my account",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await axios.delete("/api/user/profile");
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your account has been permanently removed.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    setTimeout(() => {
                        signOut({ callbackUrl: "/" });
                    }, 1500);
                } catch (error: any) {
                    Swal.fire("Error", handleApiError(error), "error");
                    setLoading(false);
                }
            }
        });
    };

    return (
        <Card className="border-destructive/15 bg-card/80 backdrop-blur-sm hover:border-destructive/25 transition-colors duration-300">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg text-destructive">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-destructive/15 to-destructive/5 border border-destructive/10">
                        <TriangleAlert className="h-4 w-4" />
                    </div>
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Delete Account</p>
                        <p className="text-xs text-muted-foreground">Permanently remove your account and all associated data.</p>
                    </div>
                    <Button variant="destructive" size="sm" className="cursor-pointer shrink-0 shadow-lg shadow-destructive/10" onClick={handleDelete} disabled={loading}>
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
