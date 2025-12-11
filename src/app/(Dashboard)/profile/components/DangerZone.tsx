"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, TriangleAlert } from "lucide-react";
import Swal from "sweetalert2";

export function DangerZone() {
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
        }).then((result) => {
            if (result.isConfirmed) {
                // Call API here to delete the account

                Swal.fire({
                    title: "Deleted!",
                    text: "Your account has been removed.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
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
                    <Button variant="destructive" className="w-fit justify-start cursor-pointer" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
