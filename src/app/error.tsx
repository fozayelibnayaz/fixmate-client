"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import "@/app/public.css";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[fixmate] page error:", error);
  }, [error]);

  return (
    <div className="cl-root">
      <PublicHeader />
      <main style={{ minHeight: "calc(100vh - 66px)", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          <AlertTriangle size={54} color="#a9680a" style={{ margin: "0 auto 20px" }} />
          <span className="fm-eyebrow">Something broke</span>
          <h1 className="fm-h2" style={{ fontSize: 42, marginTop: 12 }}>We couldn&apos;t load this page.</h1>
          <p className="fm-lead" style={{ margin: "14px auto 28px" }}>
            An unexpected error occurred. Try again — your session and data are safe.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="fm-btn fm-btn-primary" onClick={reset}>Try again</button>
            <Link href="/" className="fm-btn fm-btn-ghost">Back to Home</Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
