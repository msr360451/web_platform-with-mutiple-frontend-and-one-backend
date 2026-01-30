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
    { href: "/contact-a", label: "Contact A" },
    { href: "/subscribe", label: "Subscribe" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-slate-50/95 via-blue-50/90 to-amber-50/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg shadow-blue-100/20"
          : "bg-gradient-to-r from-slate-50 via-blue-50/70 to-amber-50/80 border-b border-slate-200/50"
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400/80 to-indigo-400/80 flex items-center justify-center shadow-md shadow-blue-200/40 group-hover:shadow-blue-300/60 transition-all">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>

              <div className="leading-tight">
                <p className="font-bold text-[15px] text-slate-800">
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
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-blue-400/90 to-indigo-400/90 text-white shadow-md shadow-blue-200/50"
                    : "text-slate-700 hover:bg-white/60 hover:shadow-sm"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Button */}
            <Link
              href="/admin"
              className="ml-2 px-5 py-2 rounded-xl font-semibold text-blue-700 bg-white/70 border border-blue-200/60 hover:bg-blue-50/80 hover:border-blue-300/60 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Admin
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/60 text-slate-700 transition-all"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 space-y-2 bg-gradient-to-b from-transparent to-blue-50/30 rounded-b-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-blue-400/90 to-indigo-400/90 text-white shadow-md"
                    : "text-slate-700 hover:bg-white/60"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-semibold text-blue-700 bg-white/70 border border-blue-200/60 hover:bg-blue-50/80 transition-all"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}