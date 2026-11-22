"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/shared";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { PaymentBadge, StatusBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { money, shortDate } from "@/lib/format";
import type { Booking } from "@/lib/types";

const filters = ["", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState("");
  const { data, loading } = useApiData<{ bookings: Booking[] }>(
    `/api/admin/bookings${filter ? `?status=${filter}` : ""}`,
  );

  return (
    <>
      <PageHeader eyebrow="Admin dashboard" title="All Bookings" subtitle="Read-only view of every repair job on the platform." />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {filters.map((value) => (
          <button
            key={value || "all"}
            onClick={() => setFilter(value)}
            className="fm-pill"
            style={filter === value ? { background: "var(--fm-ink)", color: "var(--fm-paper)", borderColor: "var(--fm-ink)", cursor: "pointer" } : { cursor: "pointer" }}
          >
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : "All"}
          </button>
        ))}
      </div>
      {loading ? <Spinner /> : (data?.bookings.length ?? 0) === 0 ? (
        <div className="fm-panel"><EmptyState icon="📋" title="No bookings here" description="No repair jobs match this status filter." /></div>
      ) : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>Service</th><th>Customer</th><th>Technician</th><th>Date</th><th>Amount</th><th>Status</th><th>Payment</th></tr></thead>
            <tbody>
              {(data?.bookings ?? []).map((booking) => (
                <tr key={booking._id}>
                  <td style={{ fontWeight: 650 }}>{booking.serviceTitle}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.technicianName}</td>
                  <td>{shortDate(booking.preferredDate)}</td>
                  <td>{money(booking.finalAmount)}</td>
                  <td><StatusBadge status={booking.status} /></td>
                  <td><PaymentBadge paid={booking.paymentStatus === "paid"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
