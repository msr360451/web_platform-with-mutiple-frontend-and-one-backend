"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AddUserPage() {
  const [loading, setLoading] = useState(false);
  const [adminOrg, setAdminOrg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    organisation_name: "",
  });

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/admin/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAdminOrg(d?.user?.organisation_name || ""));
  }, []);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Name, email and password are required");
      return;
    }

    if (!adminOrg && !form.organisation_name) {
      alert("Organisation name is required");
      return;
    }

    setLoading(true);

    const payload: any = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    if (form.phone) payload.phone = form.phone;
    if (!adminOrg) payload.organisation_name = form.organisation_name;

    const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    setLoading(false);
    res.ok ? alert("User created") : alert("Failed");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center bg-[#F5F7FB] px-6 py-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-6 pt-4 pb-6 space-y-5">
        {/* HEADER */}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold text-black">Add User</h1>
          <p className="text-sm text-slate-600">
            Add user to access the admin dashboard.
          </p>
        </div>

        {/* FORM */}
        <Input
          label="FULL NAME"
          placeholder="John Doe"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <Input
          label="EMAIL ADDRESS"
          type="email"
          placeholder="admin@gmail.com"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />

        <Input
          label="PHONE (OPTIONAL)"
          placeholder="+91 XXXXX XXXXX"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />

        <Input
          label="PASSWORD"
          type="password"
          placeholder="••••••••"
          helper="Use 8+ characters for strong security."
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />

        {/* ROLE */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-widest text-slate-500">
            ROLE
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["user", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={
                  form.role === r
                    ? "rounded-full py-2.5 text-sm font-medium border bg-black text-white border-black"
                    : "rounded-full py-2.5 text-sm font-medium border bg-white text-black border-slate-300 hover:bg-slate-100"
                }
              >
                {r === "admin" ? "Admin" : "User"}
              </button>
            ))}
          </div>
        </div>

        {/* ORGANISATION */}
        {adminOrg ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-black">
            Organisation: <b>{adminOrg}</b>
          </div>
        ) : (
          <Input
            label="ORGANISATION NAME"
            placeholder="Your organisation"
            value={form.organisation_name}
            onChange={(v) =>
              setForm({ ...form, organisation_name: v })
            }
          />
        )}

        {/* SUBMIT */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-full bg-black text-white py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
    </div>
  );
}

/* ---------- INPUT ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold tracking-widest text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-slate-300 px-5 py-2.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10"
      />

      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
