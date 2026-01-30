"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Backend URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    // ✅ OLD localStorage token method removed (cookie auth now)
    // ✅ If you want auto-redirect when already logged in, we can check cookie by calling a protected route.
    // But you don't have a /me route yet, so we skip it.
    // User will stay here unless they go to /admin directly.
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // ✅ IMPORTANT: receive cookies from backend
        credentials: "include",

        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          rememberMe,
        }),
      });

      const text = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        throw new Error(data?.message || "Invalid email or password");
      }

      // ✅ Success: backend stored accessToken in cookie automatically
      localStorage.setItem("admin_email", form.email);
      localStorage.removeItem("admin_token"); // keep your old cleanup

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f8fafc_0%,#ffffff_55%,#f1f5f9_100%)]" />

      {/* Luxury glow */}
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-slate-400/20 blur-3xl" />
      <div className="absolute top-10 -right-40 h-[480px] w-[480px] rounded-full bg-zinc-400/15 blur-3xl" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-neutral-300/15 blur-3xl" />

      {/* ✅ Smaller card width */}
      <div className="relative w-full max-w-[440px]">
        <div className="rounded-[26px] border border-slate-200 bg-white/92 backdrop-blur-xl shadow-[0_25px_65px_rgba(2,6,23,0.16)] overflow-hidden">
          {/* Top strip */}
          <div className="h-1 bg-gradient-to-r from-black via-zinc-800 to-slate-400" />

          {/* ✅ smaller padding */}
          <div className="p-5 md:p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-zinc-900" />
                  Admin Access
                </div>

                {/* ✅ smaller title */}
                <h1 className="mt-3 text-2xl md:text-[28px] font-black tracking-tight text-slate-900 leading-tight">
                  Admin Login
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Sign in to access the admin dashboard.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-zinc-900" />
                Secure
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 flex gap-3">
                <div className="h-9 w-9 rounded-2xl bg-white border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-rose-700">
                    Login failed
                  </p>
                  <p className="text-sm text-rose-700/90 break-words">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 grid gap-3.5">
              {/* Email */}
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
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm"
                      placeholder="admin@gmail.com"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">
                  Password
                </p>

                <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                      <Lock className="h-4.5 w-4.5 text-slate-600" />
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm"
                      placeholder="••••••••••"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="shrink-0 h-9 w-9 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition flex items-center justify-center"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5 text-slate-700" />
                      ) : (
                        <Eye className="h-4.5 w-4.5 text-slate-700" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember + links */}
              <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-zinc-900"
                  />
                  Remember me
                </label>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/forgot-password")}
                    className="text-sm font-semibold text-zinc-900 hover:text-black transition"
                  >
                    Forgot password?
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/admin/register")}
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
                  >
                    Create account
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden rounded-[18px] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_45px_rgba(2,6,23,0.28)] transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-black via-zinc-800 to-slate-500" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top,#ffffff20_0%,transparent_60%)]" />

                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </span>
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
