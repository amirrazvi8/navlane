import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
                <div className="sticky top-0 h-[57px] w-full border-b bg-background z-50 hidden sm:block"></div>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">

                    {children}</main>
            </SidebarProvider>
        </div>
    );
}
