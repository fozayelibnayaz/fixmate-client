import Link from "next/link";
import { Wrench } from "lucide-react";
import "@/app/public.css";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function NotFound() {
  return (
    <div className="cl-root">
      <PublicHeader />
      <main style={{ minHeight: "calc(100vh - 66px)", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 30px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px dashed var(--fm-line)", transform: "rotate(12deg)" }} />
            <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: "var(--fm-surface)", border: "1px solid var(--fm-line)", display: "grid", placeItems: "center" }}>
              <Wrench size={56} color="var(--fm-blue)" style={{ transform: "rotate(-35deg)" }} />
            </div>
          </div>
          <span className="fm-eyebrow">Page not found</span>
          <h1 className="fm-display" style={{ fontSize: "clamp(60px, 12vw, 120px)", margin: "10px 0" }}>404</h1>
          <h2 className="fm-h3">This page needs a fix.</h2>
          <p className="fm-lead" style={{ margin: "14px auto 28px" }}>
            The page you&apos;re looking for was moved, removed, or never existed. Let&apos;s get you back to the workshop.
          </p>
          <Link href="/" className="fm-btn fm-btn-primary">Back to Home</Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
