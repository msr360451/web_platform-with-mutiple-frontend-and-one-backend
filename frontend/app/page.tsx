"use client";

import Link from "next/link";
import { Mail, MessageSquare, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-28 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900">
          Modern Contact & Newsletter Platform
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Collect customer messages, manage newsletter subscribers, and monitor
          everything from a powerful admin dashboard.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact-a"
            className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:opacity-90 transition"
          >
            Contact Us
          </Link>

          <Link
            href="/subscribe"
            className="px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold shadow hover:bg-slate-50 transition"
          >
            Subscribe Newsletter
          </Link>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon={<MessageSquare />}
            title="Multiple Contact Forms"
            description="Receive messages from different pages and track their source automatically."
          />

          <Feature
            icon={<Mail />}
            title="Newsletter Management"
            description="Collect and manage newsletter subscribers securely in one place."
          />

          <Feature
            icon={<BarChart3 />}
            title="Admin Dashboard"
            description="Analyze contacts, subscribers, and traffic using charts and tables."
          />
        </div>
      </section>
    </div>
  );
}

/* ---------------- Feature Card ---------------- */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-slate-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
