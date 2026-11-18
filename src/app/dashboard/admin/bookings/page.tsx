"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const load = () => {
    const qs = filter !== "all" ? `?status=${filter}` : "";
    api(`/api/admin/bookings${qs}`).then((r) => setBookings(r.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, [filter]);
  return (
    <div>
      <h1 className="page-heading" style={{marginBottom:28}}>All Bookings</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "requested", "accepted", "in-progress", "completed", "cancelled", "rejected"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`btn text-xs ${filter === s ? "btn-primary" : "btn-ghost"}`}>{s}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[var(--muted)] font-mono text-xs uppercase"><th className="py-2">Service</th><th>Customer</th><th>Technician</th><th>Date</th><th>Status</th><th>Payment</th><th>Amount</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-[var(--line)]">
                <td className="py-2">{b.serviceTitle}</td>
                <td className="py-2">{b.customerName}</td>
                <td className="py-2">{b.technicianName}</td>
                <td className="py-2">{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td className="py-2">{b.status}</td>
                <td className="py-2">{b.paymentStatus}</td>
                <td className="py-2">${b.finalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
