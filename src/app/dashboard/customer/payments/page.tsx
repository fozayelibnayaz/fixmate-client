"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";

export default function CustomerPayments() {
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    api("/api/bookings/my").then((r) => setBookings((r.data || []).filter((b: any) => b.paymentStatus === "paid"))).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">💳</div><p className="text-[var(--muted)]">No payments yet.</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--muted)] font-mono text-xs uppercase"><th className="py-2">Service</th><th>Tech</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map((p) => (
                <tr key={p._id} className="border-t border-[var(--line)]">
                  <td className="py-3">{p.serviceTitle}</td>
                  <td className="py-3">{p.technicianName}</td>
                  <td className="py-3">${p.finalAmount}</td>
                  <td className="py-3"><span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
