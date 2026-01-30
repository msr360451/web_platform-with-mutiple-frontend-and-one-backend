"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`min-h-screen transition-all duration-300 border-r
      bg-gradient-to-b from-slate-50 via-indigo-50/40 to-white
      border-slate-200/70
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-slate-200/70">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Admin Panel
            </h2>
            <p className="text-xs text-slate-500">Management</p>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-slate-100 transition"
        >
          <svg
            className="w-5 h-5 text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {collapsed ? (
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            ) : (
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-5 flex flex-col gap-2 px-3">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200
              ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200/60"
                  : "text-slate-700 hover:bg-white/70 hover:shadow-sm"
              }`}
            >
              <span
                className={`shrink-0 transition-colors ${
                  active ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                }`}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <span className="font-medium tracking-wide">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom small info */}
      {!collapsed && (
        <div className="mt-auto px-4 pb-6 pt-10">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
            
          </div>
        </div>
      )}
    </aside>
  );
}
