"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { fetchJwt } from "@/lib/utils";
import { toast } from "sonner";
import AuthShell from "@/components/shared/AuthShell";

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
      await fetchJwt();
      toast.success("Welcome back to FixMate!");
      const s: any = await authClient.getSession();
      const role = s?.data?.user?.role || "customer";
      router.push(callbackUrl || (role === "admin" ? "/dashboard/admin" : role === "technician" ? "/dashboard/technician" : "/dashboard/customer"));
    } catch (err: any) { toast.error(err.message || "Sign in failed"); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track your repairs and manage jobs." footer={<><span className="text-[var(--muted)]">New here? </span><Link href="/sign-up" className="text-[var(--accent)] font-semibold">Create an account →</Link></>}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div><label className="field-label">Email address</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" /></div>
        <div><label className="field-label">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="••••••••" /></div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full"><span>{loading ? "Signing in..." : "Sign In →"}</span></button>
      </form>
    </AuthShell>
  );
}
export default function SignInPage() { return <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}><SignInForm /></Suspense>; }
