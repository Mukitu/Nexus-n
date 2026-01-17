import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/platform/AppSidebar";
import { Topbar } from "@/components/platform/Topbar";
import { AmbientSurface } from "@/components/platform/AmbientSurface";

export function AppShell() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-svh flex w-full">
        <AmbientSurface />
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
