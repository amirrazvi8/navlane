"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { User, Mail, Lock, BookOpen, FileText, ArrowRight } from "lucide-react";
import axios from "axios";
import { handleApiError } from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        education: "",
        bio: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("/api/user/register", formData);
            
            Swal.fire({
                title: "Registration Successful!",
                text: "Welcome to NavLane. You can now login.",
                icon: "success",
                background: "#1e1b4b",
                color: "#fff",
                confirmButtonColor: "#4f46e5",
            }).then(() => {
                router.push("/login");
            });
        } catch (error) {
            console.log("fronterror-register", error);
            Swal.fire({
                title: "Registration Failed",
                text: handleApiError(error),
                icon: "error",
                background: "#1e1b4b",
                color: "#fff",
                confirmButtonColor: "#e11d48",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#1e1b4b] relative overflow-hidden">
            {/* Decorative Blur Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-75"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-3xl">
                    <CardHeader className="space-y-1 text-center pb-8 border-b border-white/5">
                        <CardTitle className="text-3xl font-bold tracking-tight text-white mt-4">Join NavLane</CardTitle>
                        <CardDescription className="text-gray-400 font-medium pt-1">
                            Start your personalized learning journey today.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-2 relative group">
                                <Label className="text-gray-300 ml-1">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        name="name"
                                        required
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500 h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative group">
                                <Label className="text-gray-300 ml-1">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        name="email"
                                        type="email"
                                        required
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500 h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative group">
                                <Label className="text-gray-300 ml-1">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        name="password"
                                        type="password"
                                        required
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500 h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative group">
                                <Label className="text-gray-300 ml-1">Education</Label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        name="education"
                                        onChange={handleChange}
                                        placeholder="e.g. B.Tech Computer Science"
                                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500 h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative group">
                                <Label className="text-gray-300 ml-1">Bio</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        name="bio"
                                        onChange={handleChange}
                                        placeholder="Aspiring developer..."
                                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500 h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group/btn"
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-8 pt-2">
                        <p className="text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
