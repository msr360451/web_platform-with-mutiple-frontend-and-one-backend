"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  compact?: boolean;
  hideLogo?: boolean;
}

export default function Navbar({
  compact = false,
  hideLogo = false,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact-b", label: "Contact B" },
    { href: "/subscribe", label: "Subscribe" },
  ];

  // ✅ Frontend1 Admin URL
  const ADMIN_URL = "http://localhost:3000/admin/login";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-gradient-to-r from-slate-50 via-indigo-50/40 to-white border-b border-slate-200/70"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto ${
          compact ? "px-4" : "px-4 sm:px-6 lg:px-8"
        }`}
      >
        <div
          className={`flex items-center justify-between ${
            compact ? "h-14" : "h-16"
          }`}
        >
          {/* LOGO */}
          {!hideLogo && (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/60">
                <span className="text-white font-bold">⚡</span>
              </div>

              <div className="leading-tight">
                <p className="font-bold text-[15px] text-slate-900">
                  Web Platform
                </p>
                <p className="text-[11px] text-slate-500 -mt-0.5">
                  Modern Contact System
                </p>
              </div>
            </Link>
          )}

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200/70"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ Admin Button (Redirect to Frontend1 Admin) */}
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-2 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-200/70 hover:opacity-95 transition"
            >
              Admin
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-800 transition"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  isActive(link.href)
                    ? "bg-indigo-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ Mobile Admin Redirect */}
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Admin
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
