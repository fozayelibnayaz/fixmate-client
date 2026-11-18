"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { setToken } from "@/lib/utils";
import { Menu, X, Home } from "lucide-react";

const MENUS: Record<string, { label: string; href: string }[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer" },
    { label: "My Bookings", href: "/dashboard/customer/bookings" },
    { label: "Payments", href: "/dashboard/customer/payments" },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician" },
    { label: "Add Service", href: "/dashboard/technician/add-service" },
    { label: "My Services", href: "/dashboard/technician/my-services" },
    { label: "Requests", href: "/dashboard/technician/requests" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Services", href: "/dashboard/admin/services" },
    { label: "Bookings", href: "/dashboard/admin/bookings" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    authClient.getSession().then((s: any) => {
      const sess = s?.data ?? null;
      setSession(sess);
      if (!sess?.user) { router.push("/sign-in"); return; }
      const role = sess.user.role || "customer";
      const allowed = pathname.startsWith(`/dashboard/${role}`) || pathname === "/dashboard/profile";
      if (!allowed) router.push(role === "admin" ? "/dashboard/admin" : role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
      setLoading(false);
      // fetch token
      authClient.token?.().then((t: any) => { const tok = t?.data?.token || t?.token; if (tok) setToken(tok); }).catch(() => {});
    });
  }, [pathname, router]);

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  const user = session?.user;
  const role = user?.role || "customer";
  const menu = MENUS[role] || [];

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* sidebar */}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-[var(--panel)] border-r border-[var(--line)] p-4 flex flex-col transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <Link href="/" className="brand mb-6"><span className="brand-mark">🔧</span>FixMate</Link>
        <nav className="flex-1 space-y-1">
          {menu.map((m) => (
            <Link key={m.href} href={m.href} className={`block px-3 py-2 rounded-lg text-sm ${pathname === m.href ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--panel2)] hover:text-[var(--ink)]"}`}>
              {m.label}
            </Link>
          ))}
          <Link href="/dashboard/profile" className={`block px-3 py-2 rounded-lg text-sm ${pathname === "/dashboard/profile" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--panel2)] hover:text-[var(--ink)]"}`}>Profile</Link>
        </nav>
        <div className="border-t border-[var(--line)] pt-4 mt-4">
          <div className="flex items-center gap-3">
            <img src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||"U")}&background=181c19&color=00e0c6`} className="w-9 h-9 rounded-full" alt="" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-[var(--muted)] capitalize">{role}</p>
            </div>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      {/* main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--line)] bg-[var(--panel)]/60 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20} /></button>
          <Link href="/" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ink)]"><Home size={14} /> Home</Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[var(--muted)] capitalize hidden md:block">{role}</span>
            <img src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||"U")}&background=181c19&color=00e0c6`} className="w-8 h-8 rounded-full" alt="" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
