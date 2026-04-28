"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (res?.error) {
                Swal.fire({
                    title: "Login Failed",
                    text: res.error,
                    icon: "error",
                    background: "#1e1b4b",
                    color: "#fff",
                    confirmButtonColor: "#e11d48",
                });
            } else {
                router.push("/");
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Network or server error",
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
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-3xl">
                    <CardHeader className="space-y-1 text-center pb-8 border-b border-white/5">
                        <CardTitle className="text-3xl font-bold tracking-tight text-white mt-4">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-400 font-medium pt-1">
                            Sign in to continue your learning journey.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleLogin} className="space-y-5">
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
                                <div className="flex justify-between items-center ml-1">
                                    <Label className="text-gray-300">Password</Label>
                                    <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
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

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group/btn"
                            >
                                {loading ? "Signing in..." : "Login"}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-8 pt-2">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
