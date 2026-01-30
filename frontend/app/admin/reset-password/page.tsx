"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost } from "@/app/lib/api";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");
  const email = params.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ added
  const [showPass, setShowPass] = useState(false);

  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => {
    const p = newPassword || "";
    let score = 0;

    if (p.length >= 8) score += 25;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[a-z]/.test(p)) score += 15;
    if (/[0-9]/.test(p)) score += 20;
    if (/[^A-Za-z0-9]/.test(p)) score += 20;

    const label =
      score >= 85 ? "Strong" : score >= 55 ? "Good" : score >= 30 ? "Weak" : "Very Weak";

    return { score: Math.min(score, 100), label };
  }, [newPassword]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setStatus("idle");

    if (!token || !email) {
      setMsg("Invalid reset link");
      setStatus("error");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setMsg("Password must be at least 6 characters");
      setStatus("error");
      return;
    }

    // ✅ confirm password validation
    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match");
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const data = await apiPost("/api/admin/reset-password", {
        email,
        token,
        newPassword,
      });

      setMsg(data.message || "Password reset successful");
      setStatus("success");

      setTimeout(() => router.push("/admin/login"), 1400);
    } catch (err: any) {
      setMsg(err.message || "Something went wrong");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* ✅ Background (same as login) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f8fafc_0%,#ffffff_55%,#f1f5f9_100%)]" />

      {/* ✅ Luxury glow (same as login) */}
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-slate-400/20 blur-3xl" />
      <div className="absolute top-10 -right-40 h-[480px] w-[480px] rounded-full bg-zinc-400/15 blur-3xl" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-neutral-300/15 blur-3xl" />

      {/* ✅ same compact width as login */}
      <div className="relative w-full max-w-[440px]">
        <div className="rounded-[26px] border border-slate-200 bg-white/92 backdrop-blur-xl shadow-[0_25px_65px_rgba(2,6,23,0.16)] overflow-hidden">
          {/* ✅ same top strip as login */}
          <div className="h-1 bg-gradient-to-r from-black via-zinc-800 to-slate-400" />

          <div className="p-5 md:p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-zinc-900" />
                  Password Reset
                </div>

                <h1 className="mt-3 text-2xl md:text-[28px] font-black tracking-tight text-slate-900 leading-tight">
                  Reset Password
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new password for your admin account.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-zinc-900" />
                Secure
              </div>
            </div>

            {/* Message */}
            {msg && (
              <div
                className={[
                  "mt-4 rounded-2xl border px-4 py-3 flex gap-3",
                  status === "success"
                    ? "border-emerald-200 bg-emerald-50"
                    : status === "error"
                    ? "border-rose-200 bg-rose-50"
                    : "border-slate-200 bg-slate-50",
                ].join(" ")}
              >
                <div
                  className={[
                    "h-9 w-9 rounded-2xl border flex items-center justify-center shrink-0 bg-white",
                    status === "success"
                      ? "border-emerald-200"
                      : status === "error"
                      ? "border-rose-200"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  <AlertCircle
                    className={[
                      "h-5 w-5",
                      status === "success"
                        ? "text-emerald-600"
                        : status === "error"
                        ? "text-rose-600"
                        : "text-slate-600",
                    ].join(" ")}
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className={[
                      "text-sm font-extrabold",
                      status === "success"
                        ? "text-emerald-700"
                        : status === "error"
                        ? "text-rose-700"
                        : "text-slate-700",
                    ].join(" ")}
                  >
                    {status === "success"
                      ? "Success"
                      : status === "error"
                      ? "Reset failed"
                      : "Notice"}
                  </p>
                  <p
                    className={[
                      "text-sm break-words",
                      status === "success"
                        ? "text-emerald-700/90"
                        : status === "error"
                        ? "text-rose-700/90"
                        : "text-slate-700/90",
                    ].join(" ")}
                  >
                    {msg}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleReset} className="mt-5 grid gap-3.5">
              {/* ✅ label OUTSIDE */}
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">
                  New Password
                </p>

                <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                      <Lock className="h-4.5 w-4.5 text-slate-600" />
                    </div>

                    <input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm"
                      placeholder="••••••••••"
                      required
                    />

                    {/* ✅ only icon (no show text) */}
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="shrink-0 h-9 w-9 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition flex items-center justify-center"
                      aria-label={showPass ? "Hide password" : "Show password"}
                      title={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        <EyeOff className="h-4.5 w-4.5 text-slate-700" />
                      ) : (
                        <Eye className="h-4.5 w-4.5 text-slate-700" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Strength (minimal + premium) */}
                {newPassword.length > 0 && (
                  <div className="mt-2">
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-zinc-900 via-slate-700 to-slate-400 transition-all duration-300"
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Strength</span>
                      <span className="font-semibold text-slate-800">
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ Confirm Password (added - same UI) */}
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">
                  Confirm Password
                </p>

                <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                      <Lock className="h-4.5 w-4.5 text-slate-600" />
                    </div>

                    <input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm"
                      placeholder="••••••••••"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="shrink-0 h-9 w-9 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition flex items-center justify-center"
                      aria-label={showPass ? "Hide password" : "Show password"}
                      title={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        <EyeOff className="h-4.5 w-4.5 text-slate-700" />
                      ) : (
                        <Eye className="h-4.5 w-4.5 text-slate-700" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ✅ small helper (only if user typed confirm) */}
                {confirmPassword.length > 0 && (
                  <p
                    className={[
                      "mt-2 text-[11px] font-semibold",
                      newPassword === confirmPassword
                        ? "text-emerald-700"
                        : "text-rose-700",
                    ].join(" ")}
                  >
                    {newPassword === confirmPassword
                      ? "Passwords match ✅"
                      : "Passwords do not match ❌"}
                  </p>
                )}
              </div>

              {/* Submit (same as login button) */}
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden rounded-[18px] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_45px_rgba(2,6,23,0.28)] transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-black via-zinc-800 to-slate-500" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top,#ffffff20_0%,transparent_60%)]" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </span>
              </button>

              {/* Back to login */}
              <button
                type="button"
                onClick={() => router.push("/admin/login")}
                className="rounded-[18px] px-5 py-3 text-sm font-extrabold border border-slate-200 bg-white text-zinc-900 shadow-sm hover:bg-slate-50 active:scale-[0.99] transition"
              >
                Back to Login
              </button>

              <p className="text-[11px] text-slate-500 text-center mt-1">
                Protected Admin Panel • Powered by your backend API
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
