"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Mail,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [usersOpen, setUsersOpen] = useState(
    pathname.startsWith("/admin/users")
  );

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/contacts", label: "Contacts", icon: Users },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  ];

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/admin" && pathname.startsWith(href));

  return (
    <aside
      className={[
        "sticky top-0 h-screen shrink-0 transition-all duration-300",
        collapsed ? "w-[96px]" : "w-[300px]",
      ].join(" ")}
    >
      <div className="h-full bg-white border-r border-slate-200 shadow-[8px_0_30px_rgba(0,0,0,0.04)] flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200">
          {!collapsed && (
            <span className="text-xl font-bold text-slate-900">
              Admin Panel
            </span>
          )}

          <button
            onClick={() => setCollapsed((p) => !p)}
            className="h-9 w-9 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center"
          >
            <ChevronLeft
              className={[
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180",
              ].join(" ")}
            />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {/* MAIN LINKS */}
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative flex items-center gap-3 rounded-lg px-4 py-2.5 transition",
                  collapsed && "justify-center px-3",
                  active
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                {/* ACTIVE BAR */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-black" />
                )}

                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}

          {/* USERS DROPDOWN */}
          <div>
            <button
              onClick={() => setUsersOpen((p) => !p)}
              className={[
                "relative w-full flex items-center gap-3 rounded-lg px-4 py-2.5 transition",
                collapsed && "justify-center px-3",
                pathname.startsWith("/admin/users")
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {pathname.startsWith("/admin/users") && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-black" />
              )}

              <Users className="h-5 w-5 shrink-0" />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">
                    Users
                  </span>
                  <ChevronDown
                    className={[
                      "h-4 w-4 transition-transform",
                      usersOpen && "rotate-180",
                    ].join(" ")}
                  />
                </>
              )}
            </button>

            {/* DROPDOWN ITEMS */}
            {!collapsed && usersOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <Link
                  href="/admin/users"
                  className={[
                    "block rounded-md px-3 py-2 text-sm",
                    pathname === "/admin/users"
                      ? "bg-black text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")}
                >
                  Users List
                </Link>

                <Link
                  href="/admin/users/add"
                  className={[
                    "block rounded-md px-3 py-2 text-sm",
                    pathname === "/admin/users/add"
                      ? "bg-black text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")}
                >
                  Add User
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}
