"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, BarChart2, Map, Calendar, FileText, User, Zap } from "lucide-react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Zap, label: "Insights", href: "/insights" },
    { icon: Map, label: "Roadmap", href: "/roadmap" },
    { icon: BarChart2, label: "Analysis", href: "/analysis" },
    { icon: Calendar, label: "Planner", href: "/planner" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: User, label: "Profile", href: "/profile" },
];

export function AppSidebar() {
    const path = usePathname();
    const { setOpenMobile } = useSidebar();

    return (
        <Sidebar className="z-100">
            <SidebarHeader>
                <Link href={"/"} className="flex justify-center">
                    <Image src="/navlane.png" alt="logo" width={200} height={200} className="w-32 h-10" />
                </Link>
            </SidebarHeader>
            <SidebarContent className="border-t">
                <SidebarGroup />
                <SidebarMenu>
                    {sidebarItems.map((option, index) => (
                        <SidebarMenuItem key={index} className="p-1">
                            <SidebarMenuButton asChild className={`p-3 ${path === option.href && ""}`} onClick={() => setOpenMobile(false)}>
                                <Link href={option.href} className="flex items-center gap-3">
                                    <option.icon className={`w-5 h-5 ${path == option.href && "text-primary"}`} />
                                    <span className={`text-base font-medium ${path == option.href && "text-primary"}`}>{option.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
