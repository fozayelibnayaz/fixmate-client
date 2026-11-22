"use client";

import { CheckCircle2, Play, XCircle } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { PaymentBadge, StatusBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { patch } from "@/lib/api";
import { money, shortDate } from "@/lib/format";
import { finalAmountSchema } from "@/lib/schemas";
import type { Booking } from "@/lib/types";

type FinalAmountValues = { finalAmount: number };

const filters = ["", "requested", "accepted", "in-progress", "completed"];

export default function TechnicianRequestsPage() {
  const [filter, setFilter] = useState("");
  const { data, loading, refresh } = useApiData<{ bookings: Booking[] }>(
    `/api/bookings/technician${filter ? `?status=${filter}` : ""}`,
  );
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinalAmountValues>({ resolver: zodResolver(finalAmountSchema) });

  const update = async (booking: Booking, status: string, body?: Record<string, unknown>) => {
    try {
      await patch(`/api/bookings/${booking._id}/status`, { status, ...body });
      toast.success(`Job marked ${status}`);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the job");
    }
  };

  const complete = handleSubmit(async (values) => {
    if (!completing) return;
    setBusy(true);
    await update(completing, "completed", values);
    setBusy(false);
    setCompleting(null);
    reset();
  });

  const bookings = data?.bookings ?? [];

  return (
    <>
      <PageHeader eyebrow="Technician dashboard" title="Manage Requests" subtitle="Accept, reject and move jobs through the pipeline." />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {filters.map((value) => (
          <button
            key={value || "all"}
            className={`fm-pill ${filter === value ? "" : ""}`}
            onClick={() => setFilter(value)}
            style={filter === value ? { background: "var(--fm-ink)", color: "var(--fm-paper)", borderColor: "var(--fm-ink)" } : { cursor: "pointer" }}
          >
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : "All"}
          </button>
        ))}
      </div>
      {loading ? <Spinner label="Loading requests…" /> : bookings.length === 0 ? (
        <div className="fm-panel"><EmptyState icon="📥" title="No requests here" description="When a customer sends a repair request it will show up in this queue." /></div>
      ) : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Status</th><th>Details</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <strong>{booking.customerName}</strong>
                    <div className="fm-muted" style={{ fontSize: 12 }}>{booking.customerPhone}</div>
                  </td>
                  <td>
                    <strong>{booking.serviceTitle}</strong>
                    <div className="fm-muted" style={{ fontSize: 12 }}>{money(booking.finalAmount)}</div>
                  </td>
                  <td>{shortDate(booking.preferredDate)}</td>
                  <td><StatusBadge status={booking.status} /> {booking.paymentStatus === "paid" ? <div style={{ marginTop: 6 }}><PaymentBadge paid /></div> : null}</td>
                  <td className="fm-muted" style={{ maxWidth: 240 }} title={booking.problemDescription}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{booking.problemDescription}</div>
                    <div style={{ fontSize: 12 }}>{booking.address}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {booking.status === "requested" ? (
                        <>
                          <Button variant="blue" size="sm" onClick={() => update(booking, "accepted")}>Accept</Button>
                          <Button variant="ghost" size="sm" onClick={() => update(booking, "rejected")}><XCircle size={13} /> Reject</Button>
                        </>
                      ) : null}
                      {booking.status === "accepted" ? (
                        <Button variant="blue" size="sm" onClick={() => update(booking, "in-progress")}><Play size={13} /> Start Work</Button>
                      ) : null}
                      {booking.status === "in-progress" ? (
                        <Button variant="blue" size="sm" onClick={() => {
                          reset({ finalAmount: booking.finalAmount });
                          setCompleting(booking);
                        }}><CheckCircle2 size={13} /> Mark Completed</Button>
                      ) : null}
                      {["completed", "rejected", "cancelled"].includes(booking.status) ? <span className="fm-muted" style={{ fontSize: 12 }}>No action</span> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(completing)} onClose={() => setCompleting(null)} title="Mark job complete" description="Set the final amount the customer will pay.">
        <form onSubmit={complete}>
          <Field
            label="Final amount (USD)"
            type="number"
            step="0.01"
            min="0.01"
            error={errors.finalAmount?.message}
            {...register("finalAmount", { valueAsNumber: true })}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <Button type="button" variant="ghost" onClick={() => setCompleting(null)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Complete job"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
