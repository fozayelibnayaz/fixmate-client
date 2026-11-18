"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { fetchJwt } from "@/lib/utils";
import { toast } from "sonner";

function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await authClient.signIn.email({ email, password });
      if (res?.error) throw new Error(res.error.message || "Invalid credentials");
      toast.success("Welcome back!");
      await fetchJwt();
      const s: any = await authClient.getSession();
      const role = s?.data?.user?.role || "customer";
      if (callbackUrl) router.push(callbackUrl);
      else router.push(role === "admin" ? "/dashboard/admin" : role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-8">
      <h1 className="text-2xl font-bold mb-1">Sign in</h1>
      <p className="text-[var(--muted)] text-sm mb-6">Welcome back to FixMate.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-[var(--muted)]">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full"><span>{loading ? "Signing in..." : "Sign In"}</span></button>
      </form>
      <p className="text-sm text-[var(--muted)] mt-4 text-center">No account? <Link href="/sign-up" className="text-[var(--accent)]">Sign up</Link></p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
