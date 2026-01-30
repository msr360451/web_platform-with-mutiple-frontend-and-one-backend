"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {/* ✅ Navbar ONLY for public pages */}
      {!isAdminRoute && <Navbar />}

      <main
        className={
          isAdminRoute ? "min-h-screen" : "max-w-7xl mx-auto px-4 py-8"
        }
      >
        {children}
      </main>

      {/* Footer ONLY for public pages */}
      {!isAdminRoute && (
        <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center text-sm text-gray-300">
            © 2026 Web Platform
          </div>
        </footer>
      )}
    </>
  );
}
