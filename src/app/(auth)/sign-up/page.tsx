"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { fetchJwt } from "@/lib/utils";
import { toast } from "sonner";
import AuthShell from "@/components/shared/AuthShell";

function passwordErrors(p: string) {
  const e: string[] = [];
  if (p.length < 6) e.push("At least 6 characters");
  if (!/[A-Z]/.test(p)) e.push("One uppercase letter");
  if (!/[a-z]/.test(p)) e.push("One lowercase letter");
  return e;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const errs = passwordErrors(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!name || !email || errs.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    try {
      const res: any = await authClient.signUp.email({ email, password, name, role } as any);
      if (res?.error) throw new Error(res.error.message || "Sign up failed");
      await fetchJwt();
      toast.success("Account created! Welcome to FixMate.");
      router.push(role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
    } catch (err: any) { toast.error(err.message || "Sign up failed"); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell title="Join FixMate" subtitle="Create your account as a customer or technician." footer={<><span className="text-[var(--muted)]">Already registered? </span><Link href="/sign-in" className="text-[var(--accent)] font-semibold">Sign in →</Link></>}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div><label className="field-label">Full name</label><input required value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Your name" /></div>
        <div><label className="field-label">Email address</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" /></div>
        <div><label className="field-label">Password</label><input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setTouched(true); }} className="field" placeholder="••••••••" />
          {touched && errs.length > 0 && <ul className="text-xs text-[var(--accent2)] mt-2 space-y-1">{errs.map((x) => <li key={x}>• {x}</li>)}</ul>}
        </div>
        <div><label className="field-label">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            {["customer", "technician"].map((r) => (
              <label key={r} className={`cursor-pointer text-center py-3 rounded-xl border text-sm capitalize transition-all ${role === r ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--line2)] hover:border-[var(--muted)]"}`}>
                <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} className="sr-only" />{r}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full"><span>{loading ? "Creating..." : "Create Account →"}</span></button>
      </form>
    </AuthShell>
  );
}
