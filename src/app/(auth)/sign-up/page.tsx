"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { fetchJwt } from "@/lib/utils";
import { toast } from "sonner";

function passwordErrors(p: string): string[] {
  const errs: string[] = [];
  if (p.length < 6) errs.push("At least 6 characters");
  if (!/[A-Z]/.test(p)) errs.push("At least one uppercase letter");
  if (!/[a-z]/.test(p)) errs.push("At least one lowercase letter");
  return errs;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const errs = passwordErrors(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!name || !email || errs.length) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Invalid email"); return; }
    setLoading(true);
    try {
      const res: any = await authClient.signUp.email({ email, password, name, role } as any);
      if (res?.error) throw new Error(res.error.message || "Sign up failed");
      toast.success("Account created! Redirecting...");
      await fetchJwt();
      router.push(`/dashboard/${role === "technician" ? "technician" : "customer"}`);
    } catch (err: any) {
      toast.error(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-8">
      <h1 className="text-2xl font-bold mb-1">Create account</h1>
      <p className="text-[var(--muted)] text-sm mb-6">Join FixMate as a customer or technician.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-[var(--muted)]">Full Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Password</label>
          <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setTouched(true); }} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" />
          {touched && errs.length > 0 && (
            <ul className="text-xs text-red-400 mt-1 list-disc pl-4">
              {errs.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>
        <div>
          <label className="text-xs text-[var(--muted)] mb-2 block">Role</label>
          <div className="flex gap-3">
            {["customer", "technician"].map((r) => (
              <label key={r} className={`flex-1 text-center py-2 rounded-lg border cursor-pointer text-sm capitalize ${role === r ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--line)]"}`}>
                <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                {r}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full"><span>{loading ? "Creating..." : "Sign Up"}</span></button>
      </form>
      <p className="text-sm text-[var(--muted)] mt-4 text-center">Already have an account? <Link href="/sign-in" className="text-[var(--accent)]">Sign in</Link></p>
    </div>
  );
}
