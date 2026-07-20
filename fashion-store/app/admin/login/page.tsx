"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginAdmin } from "../../../lib/admin-api";
import { loadAdminSession } from "../../../lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = loadAdminSession();

    if (session?.token) {
      router.replace("/admin");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
      toast.success("Logged in successfully");
      router.replace("/admin");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to log in";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="section-shell flex min-h-[calc(100vh-8rem)] items-center py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-[2rem] border border-[color:var(--border)] bg-[rgba(9,17,33,0.84)] p-6 shadow-[0_30px_80px_rgba(4,10,24,0.34)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:p-10">
        <div className="space-y-5">
          <span className="section-badge">Admin access</span>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Sign in to manage the store</h1>
          <p className="max-w-xl text-muted">
            Access product editing, order management, and Cloudinary uploads from a single authenticated dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-surface rounded-[1.75rem] p-6 md:p-8">
          <div className="space-y-4">
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input className="input-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Password
              <input className="input-field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>

            {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

            <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}