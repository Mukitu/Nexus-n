import { BarChart3, BookOpen, Droplet, FileText, Home, LineChart, MapPinned, Stethoscope, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useI18n } from "@/lib/i18n";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const getItems = (t: (k: any) => string) => [
  { title: t("dashboard"), url: "/", icon: Home },
  { title: t("modules"), url: "/#modules", icon: BarChart3 },
  { title: t("stocks"), url: "/stocks", icon: LineChart },
  { title: t("cvBuilder"), url: "/cv", icon: FileText },
  { title: t("team"), url: "/team", icon: Users },
  { title: t("guide"), url: "/guide", icon: BookOpen },
];

const getServiceItems = (t: (k: any) => string) => [
  { title: t("serviceTravel"), url: "/services/travel", icon: MapPinned },
  { title: t("serviceMedical"), url: "/services/medical", icon: Stethoscope },
  { title: t("serviceBlood"), url: "/services/blood-bank", icon: Droplet },
];

export function AppSidebar() {
  const location = useLocation();
  const { t } = useI18n();
  const items = getItems(t);
  const serviceItems = getServiceItems(t);

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="gap-2">
        <div className="rounded-xl border border-glass-border bg-glass px-3 py-3 shadow-soft">
          <div className="text-sm font-semibold leading-tight">Nexus-N</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} className="rounded-md" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("services")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {serviceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} className="rounded-md" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
