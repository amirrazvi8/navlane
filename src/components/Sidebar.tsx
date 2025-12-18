"use client";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Insights", href: "/insights" },
    { label: "Roadmaps", href: "/roadmap" },
    { label: "Analysis", href: "/analysis" },
    { label: "Reports", href: "/reports" },
    { label: "Profile", href: "/profile" },
];

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-background px-2 flex h-16 items-center justify-between sm:hidden border-b">
            <Link href="/" className=" flex items-center w-32" onClick={() => setIsOpen(false)}>
                <span className="">
                    <Image src="/navlane.png" alt="logo" width={200} height={200} className="w-32 h-10" />
                </span>
            </Link>

            <div className="sm:hidden bg-transparent z-50">
                <div className="mx-auto px-4 py-3 flex justify-between items-center">
                    {isOpen ? (
                        <button className="text-white p-2 rounded-lg cursor-pointer" onClick={() => setIsOpen(false)}>
                            <FaTimes className="text-xl" />
                        </button>
                    ) : (
                        <button className="text-white p-2 rounded-lg cursor-pointer" onClick={() => setIsOpen(true)}>
                            <FaBars className="text-xl" />
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ x: "100%", scale: 0.95 }}
                            animate={{ x: "0%", scale: 1 }}
                            exit={{ x: "100%", scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 23,
                                bounce: 0.4,
                            }}
                            className="fixed inset-0 bg-background h-fit mt-16 z-50 flex flex-col items-center justify-center"
                        >
                            <div className="flex flex-col text-center font-semibold text-xl w-full">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-100 text-2xl py-4 font-semibold hover:text-primary transition border-b"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};
