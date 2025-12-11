"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, GraduationCap, Edit } from "lucide-react";

export function ProfileInfo() {
    return (
        <Card>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 relative rounded-none">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                        <AvatarFallback className="text-lg">JD</AvatarFallback>
                        <span
                            className="absolute top-0 right-0 cursor-pointer rounded-full bg-gray-900 hover:bg-gray-800 transition-all duration-300 w-6 h-6 flex items-center justify-center "
                            onClick={() => alert("Change Avatar Clicked")}
                        >
                            <Edit className="w-4 h-4" />
                        </span>
                    </Avatar>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:gap-20">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="name" placeholder="Full Name" className="pl-8" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="email@example.com" className="pl-8" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">About</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." className="min-h-30" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="education">Education / Role</Label>
                    <div className="relative">
                        <GraduationCap className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="education" placeholder="e.g. Computer Science Student" className="pl-8" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}
