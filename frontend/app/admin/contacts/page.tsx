"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type ContactRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source_page?: string;
  createdAt: string;
};

type SourceFilter = "ALL" | "A" | "B" | "C";
type SortMode = "LATEST" | "OLDEST" | "NAME_AZ" | "NAME_ZA";

export default function AdminContactsPage() {
  const router = useRouter();

  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("ALL");
  const [sortMode, setSortMode] = useState<SortMode>("LATEST");

  const [selected, setSelected] = useState<ContactRow | null>(null);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  // ✅ Portal mount fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);

        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const res = await fetch(`${baseUrl}/api/admin/contacts`, {
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
          console.error("Contacts fetch failed:", res.status, data);
          setContacts(demoContacts);
          return;
        }

        const list: ContactRow[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.contacts)
          ? data.contacts
          : [];

        setContacts(list);
      } catch (err) {
        console.error("Contacts fetch error:", err);
        setContacts(demoContacts);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [router]);

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

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const stats = useMemo(() => {
    const total = contacts.length;
    const today = contacts.filter((c) => isToday(c.createdAt)).length;
    const monthly = contacts.filter((c) => isInMonth(c.createdAt)).length;
    const yearly = contacts.filter((c) => isInYear(c.createdAt)).length;

    const fromA = contacts.filter((c) =>
      (c.source_page || "").toUpperCase().includes("A")
    ).length;
    const fromB = contacts.filter((c) =>
      (c.source_page || "").toUpperCase().includes("B")
    ).length;
    const fromC = contacts.filter((c) =>
      (c.source_page || "").toUpperCase().includes("C")
    ).length;

    return { total, today, monthly, yearly, fromA, fromB, fromC };
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = contacts;

    if (sourceFilter !== "ALL") {
      list = list.filter((c) =>
        (c.source_page || "").toUpperCase().includes(sourceFilter)
      );
    }

    if (q) {
      list = list.filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone || "").toLowerCase().includes(q) ||
          (c.source_page || "").toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
        );
      });
    }

    list = [...list].sort((a, b) => {
      if (sortMode === "LATEST" || sortMode === "OLDEST") {
        const at = new Date(a.createdAt).getTime();
        const bt = new Date(b.createdAt).getTime();
        return sortMode === "LATEST" ? bt - at : at - bt;
      }

      const an = (a.name || "").toLowerCase();
      const bn = (b.name || "").toLowerCase();
      return sortMode === "NAME_AZ"
        ? an.localeCompare(bn)
        : bn.localeCompare(an);
    });

    return list;
  }, [contacts, query, sourceFilter, sortMode]);

  useEffect(() => {
    setPage(1);
  }, [query, sourceFilter, sortMode]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filtered.slice(start, end);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const exportCSV = () => {
    const rows = filtered.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      message: c.message,
      source_page: c.source_page || "",
      createdAt: c.createdAt,
    }));

    const headers = Object.keys(
      rows[0] || {
        id: "",
        name: "",
        email: "",
        phone: "",
        message: "",
        source_page: "",
        createdAt: "",
      }
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
    a.download = `contacts_export_${new Date().toISOString()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,#eef2ff_0%,#ffffff_45%,#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-3 md:px-6 py-4">
        {/* ✅ Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
          <MiniStat
            title="Total"
            value={stats.total}
            gradient="from-slate-500 to-slate-700"
            iconBg="bg-slate-100"
            iconColor="text-slate-700"
            icon="📊"
          />
          <MiniStat
            title="Today"
            value={stats.today}
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
          <MiniStat
            title="Contact A"
            value={stats.fromA}
            gradient="from-emerald-500 to-teal-600"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-700"
            icon="🅰️"
          />
          <MiniStat
            title="Contact B"
            value={stats.fromB}
            gradient="from-sky-500 to-blue-600"
            iconBg="bg-sky-50"
            iconColor="text-sky-700"
            icon="🅱️"
          />
          <MiniStat
            title="Contact C"
            value={stats.fromC}
            gradient="from-fuchsia-500 to-purple-600"
            iconBg="bg-fuchsia-50"
            iconColor="text-fuchsia-700"
            icon="©️"
          />
        </div>

        {/* Controls + Table */}
        <div className="mt-3 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="px-3 py-3 md:px-4 md:py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 border-b border-slate-200">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filtered.length}
                </span>{" "}
                contacts
              </p>
              <p className="text-[11px] text-slate-400">
                Page {page}/{totalPages}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, phone, source, message..."
                className="w-full md:w-[320px] px-3 py-2 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm text-sm"
              />

              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="w-full md:w-auto px-3 py-2 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
              >
                <option value="LATEST">Sort: Latest</option>
                <option value="OLDEST">Sort: Oldest</option>
                <option value="NAME_AZ">Sort: Name A-Z</option>
                <option value="NAME_ZA">Sort: Name Z-A</option>
              </select>

              <button
                onClick={exportCSV}
                className="w-full md:w-auto rounded-2xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white shadow-sm hover:opacity-95 active:scale-[0.99] transition"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200">
            {loading ? (
              <div className="p-3 space-y-2">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto max-w-md">
                  <div className="text-3xl">📭</div>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    No contacts found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try a different search keyword or filter.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="p-3 text-xs font-semibold">User</th>
                        <th className="p-3 text-xs font-semibold">Email</th>
                        <th className="p-3 text-xs font-semibold">
                          Message (click)
                        </th>
                        <th className="p-3 text-xs font-semibold">Source</th>
                        <th className="p-3 text-xs font-semibold">
                          Date / Time
                        </th>
                        <th className="p-3 text-xs font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginated.map((c) => (
                        <tr
                          key={c.id}
                          className="border-t hover:bg-slate-50/60 transition cursor-pointer"
                          onClick={() => setSelected(c)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <AvatarSeed name={c.name} />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {c.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <p className="text-sm text-slate-700 truncate max-w-[240px]">
                              {c.email}
                            </p>
                          </td>

                          <td className="p-3 max-w-[520px]">
                            <p className="text-sm text-slate-800 line-clamp-2">
                              {c.message}
                            </p>
                          </td>

                          <td className="p-3">
                            <SourceBadge source={c.source_page} />
                          </td>

                          <td className="p-3">
                            <p className="text-sm text-slate-700">
                              {new Date(c.createdAt).toLocaleString()}
                            </p>
                          </td>

                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelected(c);
                                }}
                                className="rounded-xl px-3 py-2 text-sm font-semibold border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 active:scale-[0.99] transition"
                              >
                                View
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${c.email}`, "_blank");
                                }}
                                className="rounded-xl px-3 py-2 text-sm font-semibold bg-indigo-600 text-white shadow-sm hover:opacity-95 active:scale-[0.99] transition"
                              >
                                Reply
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden p-3 space-y-2">
                  {paginated.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="rounded-3xl border border-slate-200 bg-white shadow-sm p-3 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <AvatarSeed name={c.name} />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {new Date(c.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <SourceBadge source={c.source_page} />
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="text-sm text-slate-700 truncate">
                          <span className="font-semibold">Email:</span> {c.email}
                        </div>

                        <div className="text-sm text-slate-800 line-clamp-2">
                          <span className="font-semibold">Message:</span>{" "}
                          {c.message}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(c);
                            }}
                            className="flex-1 rounded-2xl px-3 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50"
                          >
                            View
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${c.email}`, "_blank");
                            }}
                            className="flex-1 rounded-2xl px-3 py-2 text-sm font-semibold bg-indigo-600 text-white hover:opacity-95"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 px-3 py-3 flex items-center justify-between gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Prev
                  </button>

                  <p className="text-xs text-slate-500">
                    Page <span className="font-semibold">{page}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </p>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
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
              className="w-full max-w-2xl rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <AvatarSeed name={selected.name} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {selected.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-2xl px-3 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Close ✕
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] text-slate-500">Email</p>
                    <p className="text-sm font-semibold text-slate-900 truncate mt-1">
                      {selected.email}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] text-slate-500">Phone</p>
                    <p className="text-sm font-semibold text-slate-900 truncate mt-1">
                      {selected.phone}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] text-slate-500">Source</p>
                    <div className="mt-1">
                      <SourceBadge source={selected.source_page} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 font-semibold mb-2">
                    Full Message
                  </p>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() =>
                      window.open(`mailto:${selected.email}`, "_blank")
                    }
                    className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold bg-indigo-600 text-white shadow-sm hover:opacity-95"
                  >
                    Reply via Email
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

/* ---------------- UI Components ---------------- */

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

function Pill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-2xl text-sm font-semibold transition",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function SourceBadge({ source }: { source?: string }) {
  const s = (source || "UNKNOWN").toUpperCase();

  const isA = s.includes("A");
  const isB = s.includes("B");
  const isC = s.includes("C");

  const cls = isA
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : isB
    ? "bg-blue-50 text-blue-700 border-blue-100"
    : isC
    ? "bg-purple-50 text-purple-700 border-purple-100"
    : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-60"></span>
      {s}
    </span>
  );
}

function AvatarSeed({ name }: { name: string }) {
  const initials = useMemo(() => {
    const parts = (name || "U").trim().split(" ");
    const a = parts[0]?.[0] || "U";
    const b = parts.length > 1 ? parts[1]?.[0] : "";
    return (a + b).toUpperCase();
  }, [name]);

  return (
    <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-200 via-purple-200 to-cyan-200 border border-slate-200 flex items-center justify-center shadow-sm">
      <span className="text-sm font-bold text-slate-900">{initials}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-16 rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
        <div className="h-3 w-[80%] rounded bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}

/* Demo Data */
const demoContacts: ContactRow[] = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@gmail.com",
    phone: "9999999999",
    message: "Backend not running. Demo contact row shown.",
    source_page: "CONTACT_A",
    createdAt: new Date().toISOString(),
  },
];
