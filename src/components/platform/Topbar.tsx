import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageToggle } from "@/components/platform/LanguageToggle";
import { ThemeToggle } from "@/components/platform/ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-glass border-glass-border backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="shadow-soft" variant="glass" />
          <div className="hidden sm:block">
            <div className="text-sm font-semibold">Nexus-N</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
