"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../app/admin/TopNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ✅ Hide sidebar + navbar on AUTH pages
  const hideSidebarRoutes = [
    "/admin/login",
    "/admin/register",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin/verify-email",
  ];

  if (hideSidebarRoutes.includes(pathname)) {
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,#f8fafc_0%,#ffffff_35%,#eef2ff_100%)]">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e7ff_0%,#f1f5f9_40%,#ffffff_85%)]">
      {/* ✅ Outer spacing (MORE REDUCED) */}
      <div className="mx-auto max-w-[1600px] px-3 md:px-6 py-1">
        {/* ✅ FULL HEIGHT LAYOUT (MORE TIGHT) */}
        <div className="flex gap-2 h-[calc(100vh-8px)]">
          {/* ✅ Sidebar FIXED */}
          <div className="sticky top-1 h-[calc(100vh-8px)]">
            <Sidebar />
          </div>

          {/* ✅ MAIN AREA */}
          <main className="flex-1 min-w-0">
            <div className="rounded-[28px] border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] overflow-hidden h-[calc(100vh-8px)] flex flex-col min-h-0">
              {/* ✅ ONLY THIS SCROLLS */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {/* ✅ STICKY NAVBAR */}
                <div className="sticky top-0 z-40 p-2 md:p-3 border-b border-slate-200/60 bg-white/50 backdrop-blur-xl">
                  <TopNavbar />
                </div>

                {/* ✅ PAGE CONTENT */}
                <div className="p-2 md:p-3">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
