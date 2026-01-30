"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/app/lib/api";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    organisation_name: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Enter full name"), false;
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return setError("Invalid email address"), false;
    if (formData.password.length < 8)
      return setError("Password must be 8+ characters"), false;
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match"), false;
    return true;
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await apiPost("/api/admin/register", formData);
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const initials = useMemo(() => {
    const parts = formData.name.trim().split(" ");
    return ((parts[0]?.[0] || "A") + (parts[1]?.[0] || "")).toUpperCase();
  }, [formData.name]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,#f8fafc_0%,#ffffff_55%,#f1f5f9_100%)]">
      <div className="w-full max-w-[440px] rounded-[26px] border border-slate-200 bg-white shadow-[0_25px_65px_rgba(2,6,23,0.16)] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-black via-zinc-800 to-slate-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-full px-3 py-1">
                <span className="h-2 w-2 bg-black rounded-full" />
                Admin Onboarding
              </span>
              <h1 className="mt-3 text-[28px] font-black text-slate-900">
                Create Account
              </h1>
              <p className="text-sm text-slate-500">
                Access your admin dashboard
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-black" />
              Secure
            </div>
          </div>

          {/* Mini profile */}
          <div className="mt-4 flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center font-black text-slate-900">
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {formData.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500">
                {formData.email || "admin@example.com"}
              </p>
            </div>
          </div>

          {success ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-3 text-sm text-slate-600">
                Redirecting to login…
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="mt-5 grid gap-4">
              {error && (
                <div className="flex gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              {/* Input field component pattern */}
              {[
                {
                  label: "Organisation Name (Optional)",
                  name: "organisation_name",
                  icon: <Building2 />,
                  placeholder: "Your organisation name",
                },
                {
                  label: "Full Name",
                  name: "name",
                  icon: <User />,
                  placeholder: "John Doe",
                },
                {
                  label: "Email Address",
                  name: "email",
                  icon: <Mail />,
                  placeholder: "admin@gmail.com",
                  type: "email",
                },
              ].map((f) => (
                <div key={f.name}>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                    {f.label}
                  </p>
                  <div className="flex items-center gap-2 rounded-[18px] border border-slate-300 bg-slate-50 px-4 py-2">
                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700">
                      {f.icon}
                    </div>
                    <input
                      name={f.name}
                      type={f.type || "text"}
                      value={(formData as any)[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 outline-none caret-zinc-900"
                      required={f.name !== "organisation_name"}
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              {[
                {
                  label: "Password",
                  value: formData.password,
                  setter: setShowPassword,
                  show: showPassword,
                  name: "password",
                },
                {
                  label: "Confirm Password",
                  value: formData.confirmPassword,
                  setter: setShowConfirmPassword,
                  show: showConfirmPassword,
                  name: "confirmPassword",
                },
              ].map((p) => (
                <div key={p.name}>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                    {p.label}
                  </p>
                  <div className="flex items-center gap-2 rounded-[18px] border border-slate-300 bg-slate-50 px-4 py-2">
                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-slate-700" />
                    </div>
                    <input
                      type={p.show ? "text" : "password"}
                      name={p.name}
                      value={p.value}
                      onChange={handleChange}
                      className="w-full bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 outline-none caret-zinc-900"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => p.setter((s: boolean) => !s)}
                      className="h-9 w-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                    >
                      {p.show ? (
                        <EyeOff className="h-4 w-4 text-zinc-900" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between text-sm font-semibold pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/admin/login")}
                  className="text-zinc-900"
                >
                  Already have account?
                </button>
                <span className="flex items-center gap-1 text-slate-600">
                  Go to Login <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              <button
                disabled={loading}
                className="mt-2 rounded-[18px] py-3 font-extrabold text-white bg-gradient-to-r from-black via-zinc-800 to-slate-600 shadow-xl"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
