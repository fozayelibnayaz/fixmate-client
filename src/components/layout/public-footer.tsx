import { Mail, MapPin, Phone, Wrench } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const XLogo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const PublicFooter = () => (
  <footer className="cl-footer">
    <div className="cl-container">
      <div className="cl-footer-grid">
        <div>
          <Link className="cl-logo" href="/" style={{ marginBottom: 14 }}>
            <span className="cl-logo-mark" style={{ width: 30, height: 30 }} aria-hidden="true"><Wrench size={17} strokeWidth={2.4} /></span>
            <span style={{ fontWeight: 600 }}>FixMate</span>
          </Link>
          <p style={{ color: "var(--smoke)", fontSize: 13, maxWidth: 250, marginTop: 12 }}>
            Find a verified technician, follow every repair step, and pay only after the work is done.
          </p>
          <div className="cl-footer-socials">
            <a href="https://x.com" aria-label="FixMate on X" target="_blank" rel="noreferrer"><XLogo /></a>
            <a href="mailto:hello@fixmate.com" aria-label="Email FixMate"><Mail size={15} /></a>
          </div>
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--smoke)", marginTop: 18 }}>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}><Mail size={14} /> hello@fixmate.com</span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}><Phone size={14} /> +880 1711 234 567</span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}><MapPin size={14} /> Dhaka, Bangladesh</span>
          </div>
        </div>

        <div>
          <h6>Quick links</h6>
          <Link href="/">Home</Link>
          <Link href="/services">Browse services</Link>
          <Link href="/about">How it works</Link>
          <Link href="/sign-up">Create account</Link>
          <Link href="/dashboard/profile">Your profile</Link>
        </div>
        <div>
          <h6>Popular categories</h6>
          {CATEGORIES.map((category) => (
            <Link key={category} href={`/services?category=${encodeURIComponent(category)}`}>{category}</Link>
          ))}
        </div>
        <div>
          <h6>For customers</h6>
          <Link href="/services">Find a technician</Link>
          <Link href="/dashboard/customer/bookings">Track my repair</Link>
          <Link href="/dashboard/customer/payments">Payment history</Link>
          <Link href="/about">Repair questions</Link>
        </div>
        <div>
          <h6>For technicians</h6>
          <Link href="/sign-up?role=technician">Join as technician</Link>
          <Link href="/dashboard/technician/add-service">List a service</Link>
          <Link href="/dashboard/technician/requests">Manage requests</Link>
          <Link href="/about#trust">Why FixMate</Link>
        </div>
      </div>
      <div className="cl-footer-bottom">
        <span>© 2026 FixMate. All rights reserved.</span>
        <span>Built for safer repairs in Dhaka and beyond.</span>
      </div>
      <div className="cl-foot-word" aria-hidden="true">FIXMATE</div>
    </div>
  </footer>
);
