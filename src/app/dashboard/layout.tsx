import { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { SidebarNav } from "@/components/sidebar-nav";
import { BrandLogo } from "@/components/common/BrandLogo";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 border-r bg-card glass-card flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <BrandLogo showText size="small" animated glow />
        </div>
        
        <SidebarNav />
        
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session.user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{session.user?.role?.toLowerCase()}</span>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="outline" className="w-full justify-start" type="submit">
              Log out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-0">
        <header className="h-16 border-b border-white/5 bg-card/50 backdrop-blur-xl flex items-center px-4 md:px-6 justify-between shrink-0">
          <div className="md:hidden">
            <BrandLogo size="medium" showText animated glow />
          </div>
          <div className="hidden md:block">
            {/* Desktop header can be used for breadcrumbs or search */}
          </div>
        </header>
        {/* pb-20 on mobile ensures content isn't hidden behind the bottom nav */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
