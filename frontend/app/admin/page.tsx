"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Users, Mail, Activity, MessageSquare } from "lucide-react";

type ContactRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source_page?: string;
  createdAt: string;
};

type NewsletterRow = {
  id: number;
  name?: string;
  email: string;
  createdAt: string;
};

export default function AdminDashboardHomePage() {
  const router = useRouter();

  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const contactsRes = await fetch(`${baseUrl}/api/admin/contacts`, {
          method: "GET",
          credentials: "include",
        });

        const subsRes = await fetch(`${baseUrl}/api/admin/subscribers`, {
          method: "GET",
          credentials: "include",
        });

        if (contactsRes.status === 401 || subsRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        const contactsText = await contactsRes.text();
        const subsText = await subsRes.text();

        let contactsData: any = null;
        let subsData: any = null;

        try {
          contactsData = JSON.parse(contactsText);
        } catch {
          contactsData = contactsText;
        }

        try {
          subsData = JSON.parse(subsText);
        } catch {
          subsData = subsText;
        }

        const contactsList: ContactRow[] = Array.isArray(contactsData)
          ? contactsData
          : Array.isArray(contactsData?.contacts)
          ? contactsData.contacts
          : demoContacts;

        const subsList: NewsletterRow[] = Array.isArray(subsData)
          ? subsData
          : Array.isArray(subsData?.subscribers)
          ? subsData.subscribers
          : demoSubscribers;

        setContacts(contactsList);
        setSubscribers(subsList);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setContacts(demoContacts);
        setSubscribers(demoSubscribers);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  const totalContacts = contacts.length;
  const totalSubscribers = subscribers.length;

  const topSource = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach((c) => {
      const key = (c.source_page || "UNKNOWN").toUpperCase();
      map.set(key, (map.get(key) || 0) + 1);
    });

    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "N/A";
  }, [contacts]);

  const last7Days = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    const contactsByDay = new Map<string, number>();
    const subsByDay = new Map<string, number>();

    contacts.forEach((x) => {
      const day = new Date(x.createdAt).toDateString();
      contactsByDay.set(day, (contactsByDay.get(day) || 0) + 1);
    });

    subscribers.forEach((x) => {
      const day = new Date(x.createdAt).toDateString();
      subsByDay.set(day, (subsByDay.get(day) || 0) + 1);
    });

    return days.map((d) => {
      const key = d.toDateString();
      return {
        day: fmt(d),
        contacts: contactsByDay.get(key) || 0,
        subscribers: subsByDay.get(key) || 0,
      };
    });
  }, [contacts, subscribers]);

  return (
    <div className="w-full">
      {/* ✅ Widgets (MATCH CONTACT PAGE SIZE) */}
      <div className="mt-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat
          title="Total Contacts"
          value={totalContacts}
          gradient="from-indigo-500 to-violet-600"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-700"
          icon="👥"
        />

        <MiniStat
          title="Subscribers"
          value={totalSubscribers}
          gradient="from-purple-500 to-fuchsia-600"
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
          icon="📩"
        />

        <MiniStat
          title="Active Messages"
          value={contacts.filter((c) => c.message.length > 0).length}
          gradient="from-rose-500 to-pink-600"
          iconBg="bg-rose-50"
          iconColor="text-rose-700"
          icon="💬"
        />

        <MiniStat
          title="Top Source"
          value={topSource}
          gradient="from-amber-500 to-orange-600"
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          icon="📈"
          textBig
        />
      </div>

      {/* ✅ Charts (compact spacing) */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-3">
        <CardShell
          className="xl:col-span-2"
          title="Growth Analytics"
          subtitle="7-day performance overview"
          icon={<TrendingUp className="w-4 h-4 text-slate-900" />}
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="contactsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="subsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  opacity={0.5}
                />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.96)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="contacts"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#contactsG)"
                />
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  fill="url(#subsG)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell
          title="Daily Trend (Line)"
          subtitle="Contacts vs Subscribers"
          icon={<TrendingUp className="w-4 h-4 text-slate-900" />}
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  opacity={0.5}
                />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.96)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="contacts"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardShell>
      </div>

      {/* ✅ TABLES BACK (Recent Contacts + New Subscribers) */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-3 pb-6">
        <ModernTable
          title="Recent Contacts"
          subtitle="Latest customer inquiries"
          icon={<MessageSquare className="w-4 h-4 text-indigo-600" />}
          columns={["Name", "Email", "Source", "Time"]}
          rows={contacts.slice(0, 5).map((c) => [
            c.name,
            c.email,
            (c.source_page || "UNKNOWN").toUpperCase(),
            new Date(c.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          ])}
          loading={loading}
          emptyText="No contacts available"
        />

        <ModernTable
          title="New Subscribers"
          subtitle="Newsletter sign-ups"
          icon={<Mail className="w-4 h-4 text-purple-600" />}
          columns={["Name", "Email", "Joined"]}
          rows={subscribers.slice(0, 5).map((s) => [
            s.name || "Guest User",
            s.email,
            new Date(s.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          ])}
          loading={loading}
          emptyText="No subscribers available"
        />
      </div>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function MiniStat({
  title,
  value,
  gradient,
  iconBg,
  iconColor,
  icon,
  textBig,
}: {
  title: string;
  value: string | number;
  gradient: string;
  iconBg: string;
  iconColor: string;
  icon: string;
  textBig?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/85 backdrop-blur-xl shadow-sm px-4 py-3 hover:shadow-md transition">
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide leading-none">
            {title}
          </p>

          <p
            className={[
              "mt-2 font-extrabold text-slate-900 leading-none",
              textBig ? "text-xl" : "text-2xl",
            ].join(" ")}
          >
            {value}
          </p>
        </div>

        <div
          className={[
            "h-10 w-10 rounded-2xl flex items-center justify-center",
            iconBg,
            "border border-slate-200 shadow-sm shrink-0",
          ].join(" ")}
        >
          <span className={`text-lg ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function CardShell({
  title,
  subtitle,
  icon,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200 bg-white/85 backdrop-blur-xl shadow-sm p-4",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

function ModernTable({
  title,
  subtitle,
  icon,
  columns,
  rows,
  loading,
  emptyText,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  columns: string[];
  rows: (string | number)[][];
  loading: boolean;
  emptyText: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/85 backdrop-blur-xl shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-2 border-b border-slate-200">
        {icon}
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-slate-500">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">{emptyText}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                {columns.map((c, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-[11px] font-semibold uppercase tracking-widest"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="[&>tr:nth-child(even)]:bg-slate-50/50">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-slate-200/60 hover:bg-slate-100/60 transition"
                >
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-3 text-sm text-slate-800">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- Demo Data ---------------- */

const demoContacts: ContactRow[] = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@gmail.com",
    phone: "9999999999",
    message: "Backend API not running. Showing demo contacts.",
    source_page: "CONTACT_A",
    createdAt: new Date().toISOString(),
  },
];

const demoSubscribers: NewsletterRow[] = [
  {
    id: 1,
    name: "Demo Subscriber",
    email: "demo_subscriber@gmail.com",
    createdAt: new Date().toISOString(),
  },
];
