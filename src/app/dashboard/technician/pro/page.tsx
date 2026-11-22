"use client";

import { BadgeCheck, Crown, ExternalLink, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { useApiData } from "@/hooks/use-api-data";
import { useAuth } from "@/hooks/use-auth";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { DASHBOARD_HOME } from "@/lib/constants";
import { money, shortDate, truncate } from "@/lib/format";
import type { Payment } from "@/lib/types";
import { loadSession } from "@/store/auth";
import { useAppDispatch } from "@/store/hooks";

export default function TechnicianProPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data, loading } = useApiData<{ payments: Payment[] }>("/api/payments/subscription");
  const [busy, setBusy] = useState(false);
  const isPro = user?.plan === "pro";

  const upgrade = async () => {
    setBusy(true);
    try {
      // The server is the source of truth for role and plan. Refresh first so a
      // stale client session cannot send a technician to a forbidden endpoint.
      const current = await dispatch(loadSession()).unwrap();
      if (!current) {
        toast.error("Your session expired. Please sign in again.");
        router.push(`/sign-in?next=${encodeURIComponent("/dashboard/technician/pro")}`);
        return;
      }
      if (current.role !== "technician") {
        toast.error("Pro is available for technician accounts only. You have been returned to your dashboard.");
        router.replace(DASHBOARD_HOME[current.role]);
        return;
      }
      if (current.plan === "pro") {
        toast.success("You are already on the Pro plan.");
        setBusy(false);
        return;
      }

      const result = await apiFetch<{ url: string }>("/api/payments/pro-checkout", { method: "POST" });
      window.location.href = result.url;
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 403) {
        const refreshed = await dispatch(loadSession()).unwrap();
        toast.error(
          refreshed?.role === "technician"
            ? "Please try again — your technician session has been refreshed."
            : "This account is not a technician account. Sign in with your technician account to upgrade.",
        );
      } else {
        toast.error(error instanceof Error ? error.message : "Could not start Pro checkout");
      }
      setBusy(false);
    }
  };

  const payments = data?.payments ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Technician dashboard"
        title="Pro Technician Plan"
        subtitle="List without limits and show customers a verified Pro badge."
      />

      <div className="fm-panel" style={{ padding: 26, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: "var(--fm-blue)", color: "#fff" }}>
              <Crown size={22} />
            </span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 className="fm-h3" style={{ margin: 0 }}>{isPro ? "You're on Pro" : "Upgrade to Pro"}</h2>
                {isPro ? <span className="fm-pro-badge"><BadgeCheck size={12} aria-hidden="true" /> Verified Pro</span> : null}
              </div>
              <p className="fm-muted" style={{ margin: "10px 0 0", maxWidth: 560, lineHeight: 1.65, fontSize: 14 }}>
                {isPro
                  ? "Your listings now carry the Verified Pro badge and you can publish as many services as you need."
                  : "Free technicians can publish up to 3 services. Pro removes the limit, adds a Verified Pro badge to every listing and includes a payment receipt for your records."}
              </p>
            </div>
          </div>
          {isPro ? (
            <span className="fm-status fm-status-green">Active</span>
          ) : (
            <Button variant="blue" onClick={upgrade} disabled={busy}>
              <ExternalLink size={14} /> {busy ? "Opening checkout…" : `Upgrade for ${money(499)}/month`}
            </Button>
          )}
        </div>
        <div className="fm-grid fm-grid-3" style={{ marginTop: 24 }}>
          <div><div className="fm-stat-label">Listing limit</div><strong>{isPro ? "Unlimited" : "3 services"}</strong></div>
          <div><div className="fm-stat-label">Public badge</div><strong>{isPro ? "Verified Pro" : "Verified technician"}</strong></div>
          <div><div className="fm-stat-label">Billing</div><strong>{money(499)} / month</strong></div>
        </div>
      </div>

      <div className="fm-panel" style={{ padding: 22 }}>
        <div className="fm-panel-head"><h3 style={{ fontSize: 15, margin: 0 }}>Subscription receipts</h3><Layers3 size={16} /></div>
        {loading ? (
          <Spinner label="Loading receipts…" />
        ) : payments.length === 0 ? (
          <EmptyState icon="🧾" title="No Pro payments yet" description="Your Pro subscription receipt will appear here after checkout." />
        ) : (
          <table className="fm-table">
            <thead><tr><th>Payment</th><th>Transaction</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td style={{ fontWeight: 650 }}>{payment.serviceTitle}</td>
                  <td className="fm-muted" title={payment.transactionId}>{truncate(payment.transactionId, 18)}</td>
                  <td>{money(payment.amount)}</td>
                  <td>{shortDate(payment.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
