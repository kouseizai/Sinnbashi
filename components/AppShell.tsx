"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Header } from "./Header";
import { FullSidebar, MiniSidebar, MobileSidebarDrawer } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWatch = pathname?.startsWith("/watch");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Watch page is always mini-sidebar; hamburger toggles drawer overlay
  // Home page: hamburger toggles between mini and full
  const showFull = !isWatch && !collapsed;

  return (
    <div className="min-h-screen bg-yt-bg text-yt-text">
      <Header
        onMenuClick={() => {
          if (window.innerWidth < 1024) {
            setMobileOpen(true);
          } else if (isWatch) {
            setMobileOpen(true);
          } else {
            setCollapsed((v) => !v);
          }
        }}
      />
      <MobileSidebarDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex">
        {showFull ? <FullSidebar /> : <MiniSidebar />}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
