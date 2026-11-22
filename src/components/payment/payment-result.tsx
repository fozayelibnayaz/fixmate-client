"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { money } from "@/lib/format";
import type { Payment } from "@/lib/types";
import { useRequireAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/misc";

export const PaymentSuccess = ({ sessionId }: { sessionId: string }) => {
  const { isReady } = useRequireAuth(["customer"]);
  const [state, setState] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!isReady || !sessionId) return;
    let active = true;
    apiFetch<{ paid: boolean; payment?: Payment }>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((result) => {
        if (!active) return;
        if (result.paid && result.payment) {
          setPayment(result.payment);
          setState("paid");
        } else {
          setState("pending");
        }
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [isReady, sessionId]);

  return (
    <section className="fm-section-sm">
      <div className="fm-narrow" style={{ textAlign: "center", maxWidth: 560 }}>
        {state === "loading" ? <Spinner label="Confirming your payment…" /> : null}
        {state === "error" ? (
          <>
            <AlertTriangle size={52} color="#d92d20" style={{ margin: "0 auto 18px" }} />
            <h1 className="fm-h2" style={{ fontSize: "clamp(28px, 8vw, 40px)" }}>Couldn&apos;t verify payment</h1>
            <p className="fm-lead" style={{ marginInline: "auto" }}>We couldn’t confirm your payment right now. Check My Bookings — your payment may still have gone through.</p>
          </>
        ) : null}
        {state === "pending" ? (
          <>
            <Loader2 size={52} color="var(--fm-blue)" style={{ margin: "0 auto 18px" }} />
            <h1 className="fm-h2" style={{ fontSize: "clamp(28px, 8vw, 40px)" }}>Payment not completed</h1>
            <p className="fm-lead" style={{ marginInline: "auto" }}>Your payment hasn’t been confirmed yet. Please try again from My Bookings.</p>
          </>
        ) : null}
        {state === "paid" && payment ? (
          <>
            <CheckCircle2 size={58} color="#16824a" style={{ margin: "0 auto 18px" }} />
            <h1 className="fm-h2" style={{ fontSize: "clamp(28px, 8vw, 42px)" }}>Paid. Done. <span className="fm-gradient-text">Fixed.</span></h1>
            <p className="fm-lead" style={{ marginInline: "auto" }}>
              {payment.serviceTitle} with {payment.technicianName} is fully paid.
            </p>
            <div className="fm-panel" style={{ marginTop: 28, padding: 24, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 12 }}><span className="fm-muted">Amount</span><strong>{money(payment.amount)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 12 }}><span className="fm-muted">Status</span><strong>Paid in full</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}><span className="fm-muted">Date</span><strong>{new Date(payment.paidAt).toLocaleDateString()}</strong></div>
            </div>
          </>
        ) : null}
        <div style={{ marginTop: 28 }}>
          <Link href="/dashboard/customer/bookings" className="fm-btn fm-btn-primary">Back to My Bookings</Link>
        </div>
      </div>
    </section>
  );
};

export const PaymentCancel = () => {
  const { isReady } = useRequireAuth(["customer"]);
  if (!isReady) return <Spinner />;
  return (
    <section className="fm-section-sm">
      <div className="fm-narrow" style={{ textAlign: "center", maxWidth: 520 }}>
        <AlertTriangle size={52} color="#a9680a" style={{ margin: "0 auto 18px" }} />
        <h1 className="fm-h2" style={{ fontSize: "clamp(28px, 8vw, 42px)" }}>Payment cancelled</h1>
        <p className="fm-lead" style={{ marginInline: "auto" }}>
          Nothing was charged, and your repair is still shown as complete. You can try again whenever you’re ready.
        </p>
        <Link href="/dashboard/customer/bookings" className="fm-btn fm-btn-primary" style={{ marginTop: 28 }}>Try Again</Link>
      </div>
    </section>
  );
};
