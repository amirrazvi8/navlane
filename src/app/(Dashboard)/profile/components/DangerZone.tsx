"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, TriangleAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { useState } from "react";

export function DangerZone() {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action is permanent and cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const res = await fetch("/api/user/profile", { method: "DELETE" });
                    
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || "Failed to delete account");
                    }

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your account has been permanently removed.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    // Force the session to expire and kick the user back to the homepage
                    setTimeout(() => {
                        signOut({ callbackUrl: "/" });
                    }, 1500);

                } catch (error: any) {
                    Swal.fire("Error", error.message, "error");
                    setLoading(false);
                }
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <TriangleAlert className="h-5 w-5" />
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="border-t pt-4">
                    <Button variant="destructive" className="w-fit justify-start cursor-pointer" onClick={handleDelete} disabled={loading}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {loading ? "Deleting..." : "Delete Account"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
