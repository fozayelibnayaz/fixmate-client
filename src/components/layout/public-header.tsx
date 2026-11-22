"use client";

import { ChevronDown, LayoutDashboard, LogOut, Menu, UserRound, Wrench, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { DASHBOARD_HOME } from "@/lib/constants";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

const FixMateMark = ({ size = 20 }: { size?: number }) => (
  <span className="cl-logo-mark" style={{ width: size + 12, height: size + 12 }} aria-hidden="true">
    <Wrench size={size} strokeWidth={2.4} />
  </span>
);

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export const PublicHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <>
      <header className={`cl-nav${scrolled ? " scrolled" : ""}`}>
        <div className="cl-nav-inner">
          <Link href="/" className="cl-logo" aria-label="FixMate home">
            <FixMateMark />
            <span style={{ fontWeight: 600, letterSpacing: "-.03em", fontSize: 17 }}>FixMate</span>
          </Link>

          <nav className="cl-nav-links" aria-label="Main navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(pathname, link.href) ? "active" : undefined}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="cl-nav-actions">
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="cl-btn cl-btn-ghost"
                  aria-expanded={dropdownOpen}
                  aria-label="Account menu"
                  style={{ padding: "7px 14px" }}
                >
                  {user.image ? (
                    <img src={user.image} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#8ecae6", color: "#000", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>
                      {user.name.charAt(0)}
                    </span>
                  )}
                  <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>{user.name.split(" ")[0]}</span>
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                {dropdownOpen ? (
                  <div className="cl-account-menu">
                    <div style={{ padding: "8px 10px 12px", borderBottom: "1px solid var(--ring)" }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                      <span className="cl-status" style={{ display: "inline-block", marginTop: 8, textTransform: "capitalize" }}>{user.role}</span>
                    </div>
                    <Link href={DASHBOARD_HOME[user.role]} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 8, fontSize: 14 }}>
                      <LayoutDashboard size={15} aria-hidden="true" /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 8, fontSize: 14 }}>
                      <UserRound size={15} aria-hidden="true" /> Update Profile
                    </Link>
                    <button onClick={handleSignOut} className="cl-account-signout">
                      <LogOut size={15} aria-hidden="true" /> Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="cl-btn cl-btn-ghost">Sign In</Link>
                <Link href="/sign-up" className="cl-btn cl-btn-white">Sign Up</Link>
              </>
            )}
            <button
              className="cl-hamburger"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <div className="cl-scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      </header>

      <nav className={`cl-mobile-menu${menuOpen ? " open" : ""}`} aria-label="Mobile navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>{link.label}</Link>
        ))}
        {!user ? (
          <>
            <Link href="/sign-in">Sign In</Link>
            <Link href="/sign-up">Sign Up →</Link>
          </>
        ) : (
          <>
            <Link href={DASHBOARD_HOME[user.role]}>Dashboard</Link>
            <Link href="/dashboard/profile">Update Profile</Link>
          </>
        )}
      </nav>
    </>
  );
};
