"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost } from "@/app/lib/api";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");
  const email = params.get("email");

  const [status, setStatus] = useState<Status>("loading");
  const [msg, setMsg] = useState("Verifying your email...");

  useEffect(() => {
    async function verify() {
      if (!token || !email) {
        setStatus("error");
        setMsg("Invalid or broken verification link.");
        return;
      }

      try {
        const data = await apiPost("/api/admin/verify-email", {
          token,
          email,
        });

        setStatus("success");
        setMsg(data.message || "Email verified successfully");

        setTimeout(() => {
          router.replace("/admin/login");
        }, 1800);
      } catch (err: any) {
        setStatus("error");
        setMsg(err.message || "Verification failed");
      }
    }

    verify();
  }, [token, email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0f1629] p-6 text-center shadow-xl">
        {status === "loading" && (
          <>
            <h1 className="text-lg font-semibold text-white">
              Verifying Email
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Please wait a moment…
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-lg font-semibold text-green-400">
              Email Verified ✅
            </h1>
            <p className="mt-2 text-sm text-gray-400">{msg}</p>
            <p className="mt-1 text-xs text-gray-500">
              Redirecting to login…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-lg font-semibold text-red-400">
              Verification Failed
            </h1>
            <p className="mt-2 text-sm text-gray-400">{msg}</p>

            <button
              onClick={() => router.push("/admin/login")}
              className="mt-5 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
