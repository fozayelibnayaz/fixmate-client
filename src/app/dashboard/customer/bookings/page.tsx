"use client";

import { ExternalLink, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusStepper } from "@/components/dashboard/status-stepper";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { PaymentBadge, StatusBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { apiFetch, patch } from "@/lib/api";
import { money, shortDate } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function CustomerBookingsPage() {
  const { data, loading, refresh } = useApiData<{ bookings: Booking[] }>("/api/bookings/my");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    if (!cancelTarget) return;
    setBusy(true);
    try {
      await patch(`/api/bookings/${cancelTarget._id}/cancel`);
      toast.success("Booking cancelled");
      setCancelTarget(null);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel booking");
    } finally {
      setBusy(false);
    }
  };

  const pay = async (booking: Booking) => {
    try {
      const result = await apiFetch<{ url: string }>("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking._id }),
      });
      window.location.href = result.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start payment");
    }
  };

  const bookings = data?.bookings ?? [];

  return (
    <>
      <PageHeader eyebrow="Customer dashboard" title="My Bookings" subtitle="Track every repair from request to payment." />
      {loading ? <Spinner label="Loading your bookings…" /> : bookings.length === 0 ? (
        <div className="fm-panel"><EmptyState icon="🧾" title="No bookings yet" description="Once you request a repair it will appear here with a live status tracker." action={{ label: "Browse services", href: "/services" }} /></div>
      ) : (
        <div className="fm-panel">
          {bookings.map((booking) => (
            <article key={booking._id} style={{ padding: 22, borderBottom: "1px solid var(--fm-line)" }}>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                <img src={booking.serviceImage} alt="" style={{ width: 92, height: 92, borderRadius: 12, objectFit: "cover" }} />
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 17, margin: 0 }}>{booking.serviceTitle}</h3>
                    <StatusBadge status={booking.status} />
                    <PaymentBadge paid={booking.paymentStatus === "paid"} />
                  </div>
                  <div className="fm-muted" style={{ fontSize: 13, marginTop: 8 }}>
                    {booking.technicianName} · Preferred {shortDate(booking.preferredDate)} · {money(booking.finalAmount)}
                  </div>
                  <p className="fm-muted" style={{ fontSize: 13, margin: "10px 0 0", lineHeight: 1.6 }}>{booking.problemDescription}</p>
                  <StatusStepper booking={booking} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 130 }}>
                  {booking.status === "requested" ? (
                    <Button variant="ghost" size="sm" onClick={() => setCancelTarget(booking)}><XCircle size={14} /> Cancel</Button>
                  ) : null}
                  {booking.status === "completed" && booking.paymentStatus === "unpaid" ? (
                    <Button variant="blue" size="sm" onClick={() => pay(booking)}><ExternalLink size={14} /> Pay Now</Button>
                  ) : null}
                  {booking.paymentStatus === "paid" ? <span className="fm-status fm-status-green">Paid ✓</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Cancel this request?"
        description={cancelTarget ? `${cancelTarget.serviceTitle} with ${cancelTarget.technicianName}. This cannot be undone.` : undefined}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="ghost" onClick={() => setCancelTarget(null)}>Keep request</Button>
          <Button variant="danger" onClick={cancel} disabled={busy}>{busy ? "Cancelling…" : "Yes, cancel"}</Button>
        </div>
      </Modal>
    </>
  );
};
