"use client";

import { BarChart3, CalendarCheck, CreditCard, Crown, Home, LayoutDashboard, LogOut, Menu, Plus, Receipt, Settings2, ShieldCheck, Users, Wrench, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAuth, useRequireAuth } from "@/hooks/use-auth";
import { DASHBOARD_HOME } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSidebar, toggleSidebar } from "@/store/ui";
import type { Role } from "@/lib/types";
import { Spinner } from "@/components/ui/misc";

const navForRole: Record<Role, Array<{ href: string; label: string; icon: React.ReactNode }>> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: <LayoutDashboard size={17} /> },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: <CalendarCheck size={17} /> },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: <Receipt size={17} /> },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: <LayoutDashboard size={17} /> },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: <Plus size={17} /> },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: <Wrench size={17} /> },
    { href: "/dashboard/technician/requests", label: "Requests", icon: <CalendarCheck size={17} /> },
    { href: "/dashboard/technician/pro", label: "Pro Plan", icon: <Crown size={17} /> },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: <BarChart3 size={17} /> },
    { href: "/dashboard/admin/users", label: "Users", icon: <Users size={17} /> },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: <ShieldCheck size={17} /> },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: <CalendarCheck size={17} /> },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: <CreditCard size={17} /> },
  ],
};

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const { user, isReady } = useRequireAuth(["customer", "technician", "admin"]);
  const { signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    dispatch(closeSidebar());
  }, [pathname, dispatch]);

  // Navigation links are role-specific, but a signed-in user could still type
  // another role's URL directly. Send them back to their own dashboard home.
  const routeRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/technician")
      ? "technician"
      : pathname.startsWith("/dashboard/customer")
        ? "customer"
        : null;
  const wrongRole = Boolean(routeRole && user && routeRole !== user.role);

  useEffect(() => {
    if (!isReady || !user || !wrongRole) return;
    router.replace(DASHBOARD_HOME[user.role]);
  }, [isReady, user, wrongRole, router]);

  if (!isReady || !user || wrongRole) return <Spinner label="Loading dashboard…" />;

  const links = navForRole[user.role];
  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <div className="fm-dash">
      {sidebarOpen ? (
        <button
          aria-label="Close sidebar"
          onClick={() => dispatch(closeSidebar())}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", border: 0, zIndex: 65 }}
        />
      ) : null}
      <aside className={`fm-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <Link href="/" className="fm-logo">
            <span className="fm-logo-mark"><Wrench size={16} /></span>
            <span>FixMate</span>
          </Link>
          <button className="fm-hamburger" style={{ display: "inline-flex" }} onClick={() => dispatch(closeSidebar())} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>
        <span className="fm-stat-label" style={{ paddingLeft: 13, marginBottom: 10 }}>{user.role} workspace</span>
        <nav style={{ display: "grid", gap: 4 }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`fm-sidebar-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.icon}{link.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", display: "grid", gap: 4 }}>
          <Link href="/dashboard/profile" className={`fm-sidebar-link ${pathname === "/dashboard/profile" ? "active" : ""}`}>
            <Settings2 size={17} /> Update Profile
          </Link>
          <button className="fm-sidebar-link" onClick={handleSignOut} style={{ border: 0, background: "none", width: "100%", cursor: "pointer", textAlign: "left" }}>
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="fm-main">
        <header className="fm-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="fm-hamburger" style={{ display: "inline-flex" }} onClick={() => dispatch(toggleSidebar())} aria-label="Open sidebar">
              <Menu size={21} />
            </button>
            <span className="fm-muted" style={{ fontSize: 14 }}>
              {links.find((link) => link.href === pathname)?.label ?? "Dashboard"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" className="fm-btn fm-btn-ghost fm-btn-sm"><Home size={14} /> Home</Link>
            <button
              className="fm-btn fm-btn-ghost fm-btn-sm"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle color theme"
            >
              {resolvedTheme === "dark" ? "☀" : "☾"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 9, paddingLeft: 12, borderLeft: "1px solid var(--fm-line)" }}>
              {user.image ? <img src={user.image} alt="" className="fm-avatar" /> : (
                <span className="fm-avatar" style={{ display: "grid", placeItems: "center", background: "var(--fm-ink)", color: "var(--fm-paper)", fontSize: 12 }}>
                  {user.name.charAt(0)}
                </span>
              )}
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{user.name}</div>
                <div className="fm-muted" style={{ fontSize: 11, textTransform: "capitalize" }}>{user.role}</div>
              </div>
            </div>
          </div>
        </header>
        <div style={{ padding: "30px clamp(16px, 3vw, 34px) 60px" }}>{children}</div>
      </div>
    </div>
  );
};
