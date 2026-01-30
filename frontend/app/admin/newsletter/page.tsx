"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type NewsletterRow = {
  id: number;
  name?: string;
  email: string;
  createdAt: string;
};

export default function AdminNewsletterPage() {
  const router = useRouter();

  const [subs, setSubs] = useState<NewsletterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [sortMode, setSortMode] = useState<"LATEST" | "OLDEST">("LATEST");
  const [selected, setSelected] = useState<NewsletterRow | null>(null);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  // ✅ Portal mount fix (so document.body exists)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoading(true);

        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await fetch(`${baseUrl}/api/admin/subscribers`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const text = await res.text();
        let data: any = null;

        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        if (!res.ok) {
          console.error("Subscribers fetch failed:", res.status, data);
          setSubs(demoSubscribers);
          return;
        }

        const list: NewsletterRow[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.subscribers)
          ? data.subscribers
          : [];

        setSubs(list);
      } catch (err) {
        console.error("Subscribers fetch error:", err);
        setSubs(demoSubscribers);
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
  }, [router]);

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isInMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  };

  const isInYear = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear();
  };

  const stats = useMemo(() => {
    const total = subs.length;
    const todayCount = subs.filter((s) => isToday(s.createdAt)).length;
    const monthly = subs.filter((s) => isInMonth(s.createdAt)).length;
    const yearly = subs.filter((s) => isInYear(s.createdAt)).length;

    return { total, todayCount, monthly, yearly };
  }, [subs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = subs;

    if (q) {
      list = list.filter((s) => {
        return (
          (s.name || "").toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      });
    }

    list = [...list].sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return sortMode === "LATEST" ? bt - at : at - bt;
    });

    return list;
  }, [subs, query, sortMode]);

  useEffect(() => {
    setPage(1);
  }, [query, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filtered.slice(start, end);
  }, [filtered, page]);

  const exportCSV = () => {
    const rows = filtered.map((s) => ({
      id: s.id,
      name: s.name || "",
      email: s.email,
      createdAt: s.createdAt,
    }));

    const headers = Object.keys(
      rows[0] || { id: "", name: "", email: "", createdAt: "" }
    );

    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const val = String((r as any)[h] ?? "");
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,#eef2ff_0%,#ffffff_45%,#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-3 md:px-5 py-4">
        {/* ✅ Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat
            title="Total"
            value={stats.total}
            gradient="from-slate-500 to-slate-700"
            iconBg="bg-slate-100"
            iconColor="text-slate-700"
            icon="📩"
          />
          <MiniStat
            title="Today"
            value={stats.todayCount}
            gradient="from-amber-500 to-orange-600"
            iconBg="bg-amber-50"
            iconColor="text-amber-700"
            icon="☀️"
          />
          <MiniStat
            title="Monthly"
            value={stats.monthly}
            gradient="from-blue-500 to-blue-700"
            iconBg="bg-blue-50"
            iconColor="text-blue-700"
            icon="📅"
          />
          <MiniStat
            title="Yearly"
            value={stats.yearly}
            gradient="from-violet-500 to-purple-700"
            iconBg="bg-violet-50"
            iconColor="text-violet-700"
            icon="📈"
          />
        </div>

        {/* ✅ Table */}
        <div className="mt-3 bg-white/85 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* controls row */}
          <div className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200">
            <div className="text-xs text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filtered.length}
              </span>{" "}
              subscribers • Page{" "}
              <span className="font-semibold text-slate-800">{page}</span>/
              <span className="font-semibold text-slate-800">{totalPages}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search email..."
                className="w-full md:w-[280px] px-3 py-2 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />

              <select
                value={sortMode}
                onChange={(e) =>
                  setSortMode(e.target.value as "LATEST" | "OLDEST")
                }
                className="w-full md:w-auto px-3 py-2 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="LATEST">Latest</option>
                <option value="OLDEST">Oldest</option>
              </select>

              {/* ✅ Export CSV moved here */}
              <button
                onClick={exportCSV}
                className="w-full md:w-auto rounded-2xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white shadow-sm hover:opacity-95 active:scale-[0.99] transition"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-4 text-sm text-slate-600">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">
                No subscribers found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="px-4 py-2 text-[11px] font-semibold tracking-widest uppercase">
                      Email
                    </th>
                    <th className="px-4 py-2 text-[11px] font-semibold tracking-widest uppercase">
                      Joined
                    </th>
                    <th className="px-4 py-2 text-[11px] font-semibold tracking-widest uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="[&>tr:nth-child(even)]:bg-slate-50/40">
                  {paginated.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t hover:bg-indigo-50/30 transition"
                    >
                      <td className="px-4 py-2">
                        <span className="text-sm text-slate-900 break-all">
                          {s.email}
                        </span>
                      </td>

                      <td className="px-4 py-2">
                        <p className="text-sm text-slate-800">
                          {new Date(s.createdAt).toLocaleString()}
                        </p>
                      </td>

                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => setSelected(s)}
                          className="rounded-xl px-3 py-1.5 text-sm font-semibold bg-indigo-600 text-white shadow-sm hover:opacity-95"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl px-3 py-2 text-xs font-semibold border border-slate-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl px-3 py-2 text-xs font-semibold border border-slate-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Modal (Portal - FULL SCREEN BLUR) */}
      {mounted &&
        selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Subscriber Details
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Close ✕
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 font-semibold mb-2">
                    Email
                  </p>
                  <p className="text-sm text-slate-900 break-all">
                    {selected.email}
                  </p>

                  <p className="text-[11px] text-slate-500 mt-2">
                    ID #{selected.id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      window.open(`mailto:${selected.email}`, "_blank")
                    }
                    className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold bg-indigo-600 text-white shadow-sm hover:opacity-95"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function MiniStat({
  title,
  value,
  gradient,
  iconBg,
  iconColor,
  icon,
}: {
  title: string;
  value: number;
  gradient: string;
  iconBg: string;
  iconColor: string;
  icon: string;
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

          <p className="mt-2 text-2xl font-extrabold text-slate-900 leading-none">
            {value}
          </p>
        </div>

        <div
          className={`h-10 w-10 rounded-2xl flex items-center justify-center ${iconBg} border border-slate-200 shadow-sm shrink-0`}
        >
          <span className={`text-lg ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

/* Demo Data */
const demoSubscribers: NewsletterRow[] = [
  {
    id: 1,
    name: "Demo Subscriber",
    email: "demo_subscriber@gmail.com",
    createdAt: new Date().toISOString(),
  },
];
