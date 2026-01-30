"use client";

import { useMemo, useState } from "react";
import { apiPost } from "@/app/lib/api";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    return value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await apiPost("/api/admin/forgot-password", { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const emailHint = useMemo(() => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    const masked =
      name.length <= 2 ? name[0] + "*" : name.slice(0, 2) + "****" + name.slice(-1);
    return `${masked}@${domain}`;
  }, [email]);

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
                  Admin Recovery
                </div>

                <h1 className="mt-3 text-2xl md:text-[28px] font-black tracking-tight text-slate-900 leading-tight">
                  Forgot Password
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your email and we’ll send a reset link.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-zinc-900" />
                Secure
              </div>
            </div>

            {/* Success */}
            {success ? (
              <div className="text-center py-7">
                <div className="mx-auto h-14 w-14 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                  Reset link sent ✅
                </h3>

                <p className="mt-1 text-sm text-slate-500">We sent it to:</p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <Mail className="h-4 w-4 text-zinc-900" />
                  <span className="text-sm font-extrabold text-slate-900">
                    {emailHint || email}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500 max-w-md mx-auto">
                  If you don’t see it, check your spam/junk folder.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="/admin/login"
                    className="rounded-[18px] px-4 py-3 text-sm font-extrabold border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setError("");
                      setEmail("");
                    }}
                    className="group relative overflow-hidden rounded-[18px] px-4 py-3 text-sm font-extrabold text-white shadow-[0_16px_45px_rgba(2,6,23,0.28)] transition active:scale-[0.99]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-black via-zinc-800 to-slate-500" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top,#ffffff20_0%,transparent_60%)]" />
                    <span className="relative">Send Again</span>
                  </button>
                </div>

                <div className="mt-6 h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-slate-700 via-zinc-700 to-slate-500 animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                {/* Error */}
                {error && (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 flex gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-white border border-rose-200 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-rose-700">
                        Could not send email
                      </p>
                      <p className="text-sm text-rose-700/90 break-words">{error}</p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleForgot} className="mt-5 grid gap-3.5">
                  {/* ✅ label OUTSIDE */}
                  <div>
                    <p className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">
                      Email Address
                    </p>

                    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-200">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                          <Mail className="h-4.5 w-4.5 text-slate-600" />
                        </div>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm"
                          placeholder="admin@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <p className="mt-2 text-[11px] text-slate-500">
                      A secure reset link will be sent to this email.
                    </p>
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Reset Link
                        </>
                      )}
                    </span>
                  </button>

                  {/* Footer */}
                  <div className="pt-1 flex items-center justify-between gap-3 flex-wrap">
                    <a
                      href="/admin/login"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-black transition"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </a>

                    <p className="text-[11px] text-slate-500">
                      Remember password?{" "}
                      <a
                        href="/admin/login"
                        className="font-extrabold text-zinc-900 hover:text-black"
                      >
                        Sign in
                      </a>
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center mt-1">
                    Protected Admin Panel • Powered by your backend API
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
