"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { setToken } from "@/lib/utils";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

const PUBLIC_LINKS = [
  { href: "/", label: "home" },
  { href: "/services", label: "services" },
  { href: "/#pipeline", label: "pipeline" },
  { href: "/#tracker", label: "tracker" },
  { href: "/about", label: "about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    authClient.getSession().then((s: any) => setSession(s?.data ?? null));
  }, [pathname]);

  const user = session?.user;
  const role = (user?.role as string) || "customer";
  const dashPath = role === "admin" ? "/dashboard/admin" : role === "technician" ? "/dashboard/technician" : "/dashboard/customer";

  async function signOut() {
    await authClient.signOut();
    setToken(null);
    setSession(null);
    router.push("/");
  }

  // fetch JWT when logged in
  useEffect(() => {
    if (user) {
      authClient.token?.().then((r: any) => {
        const t = r?.data?.token || r?.token;
        if (t) setToken(t);
      }).catch(() => {});
    }
  }, [user]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">🔧</span>FixMate
        </Link>
        <div className="nav-links" style={open ? { display: "flex", position: "absolute", top: 68, left: 0, right: 0, flexDirection: "column", background: "var(--bg2)", padding: "18px 40px", borderBottom: "1px solid var(--line)", gap: 14 } : {}}>
          {PUBLIC_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`nav-link ${pathname === l.href ? "active" : ""}`}>{l.label}</Link>
          ))}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                <img src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||"U")}&background=00e0c6&color=0a0c0b`} alt="" className="w-9 h-9 rounded-full border border-[var(--line2)]" />
              </button>
              <div className="absolute right-0 top-12 w-56 bg-[var(--panel)] border border-[var(--line)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                <div className="px-3 py-2 border-b border-[var(--line)] mb-1">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <span className="text-xs font-mono text-[var(--accent)] uppercase">{role}</span>
                </div>
                <Link href={dashPath} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--panel2)] rounded-lg"><LayoutDashboard size={14} /> Dashboard</Link>
                <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--panel2)] rounded-lg"><User size={14} /> Update Profile</Link>
                <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--panel2)] rounded-lg w-full text-left text-red-400"><LogOut size={14} /> Sign Out</button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="btn btn-ghost"><span>Sign In</span></Link>
              <Link href="/sign-up" className="btn btn-primary"><span>Sign Up</span></Link>
            </>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
    </nav>
  );
}
