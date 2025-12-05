import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-background md:bg-transparent">
            <div className="md:container px-2 flex h-16 items-center justify-between">
                <Link href="/" className=" flex items-center w-32">
                    <span className="">
                        <Image src="/navlane.png" alt="logo" width={200} height={200} className="w-32 h-10" />
                    </span>
                </Link>

                <nav className="md:flex items-center space-x-6 text-sm font-medium py-2 px-6 rounded-full border border-primary/20 bg-blur bg-background/95 hidden ">
                    <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Features
                    </Link>
                    <Link href="#about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        About
                    </Link>
                    <Link href="#cta" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Get Started
                    </Link>
                </nav>

                <Link
                    href="/dashboard"
                    className="text-sm font-medium transition-colors hover:text-primary w-32 bg-background/95 h-10 md:flex items-center justify-center rounded-full border border-primary/20 hidden "
                >
                    <span className="text-lg">Dashboard</span>
                </Link>
                <Sidebar />
            </div>
        </nav>
    );
}
