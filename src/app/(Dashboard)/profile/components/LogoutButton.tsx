"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <Button
            variant="outline"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/30 transition-all duration-200 gap-2"
            onClick={() => signOut({ callbackUrl: "/login" })}
        >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
        </Button>
    );
}
