"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  UserCircle,
} from "lucide-react";

type AdminMe = {
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
};

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ✅ Real admin data
  const [admin, setAdmin] = useState<AdminMe>({
    name: "Admin",
    username: "",
    email: "",
    role: "",
  });

  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoadingMe(true);

        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await fetch(`${baseUrl}/api/admin/me`, {
          method: "GET",
          credentials: "include",
        });

        console.log("✅ /api/admin/me status:", res.status);

        const data = await res.json().catch(() => null);
        console.log("✅ /api/admin/me response:", data);

        if (!res.ok || !data) return;

        // ✅ backend can return: { admin: {...} } OR { user: {...} } OR directly {...}
        const user = data?.admin || data?.user || data;

        const name =
          user?.name || user?.fullName || user?.username || "Admin";
        const username = user?.username || "";
        const email = user?.email || "";
        const role = user?.role || "";

        setAdmin({
          name,
          username,
          email,
          role,
        });
      } catch (err) {
        console.log("❌ /api/admin/me error:", err);
      } finally {
        setLoadingMe(false);
      }
    };

    fetchMe();
  }, []);

  const adminName = admin?.name || "Admin";

  // ✅ BELOW text should be username/email (NOT admin/admin)
  const adminSubTitle = useMemo(() => {
    if (loadingMe) return "Loading...";
    if (admin?.username) return admin.username;
    if (admin?.email) return admin.email;
    return adminName; // fallback
  }, [admin?.username, admin?.email, adminName, loadingMe]);

  const initials = useMemo(() => {
    const parts = adminName.trim().split(" ");
    const a = parts[0]?.[0] || "A";
    const b = parts.length > 1 ? parts[1]?.[0] : "";
    return (a + b).toUpperCase();
  }, [adminName]);

  const routeConfig = useMemo(() => {
    return [
      {
        path: "/admin",
        title: "Dashboard",
        breadcrumb: "Admin / Dashboard",
        icon: LayoutDashboard,
      },
      {
        path: "/admin/contacts",
        title: "Contacts Inbox",
        breadcrumb: "Admin / Contacts",
        icon: Mail,
      },
      {
        path: "/admin/newsletter",
        title: "Newsletter",
        breadcrumb: "Admin / Newsletter",
        icon: Mail,
      },
      {
        path: "/admin/profile",
        title: "Profile",
        breadcrumb: "Admin / Profile",
        icon: UserCircle,
      },
      {
        path: "/admin/settings",
        title: "Settings",
        breadcrumb: "Admin / Settings",
        icon: Settings,
      },
    ];
  }, []);

  const currentPage = useMemo(() => {
    const exact = routeConfig.find((r) => r.path === pathname);
    if (exact) return exact;

    if (pathname?.startsWith("/admin")) {
      return {
        path: pathname,
        title: "Admin",
        breadcrumb: "Admin",
        icon: LayoutDashboard,
      };
    }

    return {
      path: pathname,
      title: "Admin",
      breadcrumb: "Admin",
      icon: LayoutDashboard,
    };
  }, [pathname, routeConfig]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoutHandler = async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      await fetch(`${baseUrl}/api/admin/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
    } catch (err) {
      console.log("logout api error:", err);
    } finally {
      router.push("/admin/login");
    }
  };

  const PageIcon = currentPage.icon;

  return (
    <div className="w-full flex items-center justify-between gap-3 rounded-[28px] border border-slate-200 bg-white/70 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.08)] px-4 py-3">
      {/* LEFT */}
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-slate-900" />
          {currentPage.breadcrumb}
        </div>

        <div className="mt-2 flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-2xl border border-slate-200 bg-white/80 shadow-sm flex items-center justify-center">
            <PageIcon className="h-4 w-4 text-slate-700" />
          </div>

          <p className="text-lg font-extrabold text-slate-900 leading-none truncate">
            {currentPage.title}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((s) => !s)}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm hover:bg-white transition"
        >
          {/* Avatar */}
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
            <span className="text-sm font-extrabold text-slate-900">
              {initials}
            </span>
          </div>

          {/* Name + Username/Email */}
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-sm font-bold text-slate-900">{adminName}</p>
            <p className="text-[11px] text-slate-500">{adminSubTitle}</p>
          </div>

          <ChevronDown
            className={`h-4 w-4 text-slate-600 transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <p className="text-sm font-extrabold text-slate-900 truncate">
                {adminName}
              </p>
              <p className="text-[12px] text-slate-500 truncate">
                {adminSubTitle}
              </p>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/admin/profile");
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </button>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/admin/settings");
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <div className="h-px bg-slate-200" />

            <button
              onClick={logoutHandler}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-extrabold text-white bg-gradient-to-r from-black to-slate-700 hover:opacity-95 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
