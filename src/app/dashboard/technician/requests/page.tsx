"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import { STATUS_COLORS } from "@/lib/utils";

export default function TechRequests() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [finalModal, setFinalModal] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState("");

  const load = () => {
    const qs = statusFilter !== "all" ? `?status=${statusFilter}` : "";
    api(`/api/bookings/technician${qs}`).then((r) => setBookings(r.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, [statusFilter]);

  async function updateStatus(id: string, status: string, amount?: number) {
    try {
      await api(`/api/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, finalAmount: amount }) });
      toast.success(`Marked ${status}`);
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Requests</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "requested", "accepted", "in-progress", "completed"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`btn text-xs ${statusFilter === s ? "btn-primary" : "btn-ghost"}`}>{s}</button>
        ))}
      </div>
      {bookings.length === 0 ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">📭</div><p className="text-[var(--muted)]">No requests.</p></div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold">{b.serviceTitle}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                    {b.paymentStatus === "paid" && <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Paid</span>}
                  </div>
                  <p className="text-sm text-[var(--muted)]">Customer: {b.customerName} · {b.customerPhone}</p>
                  <p className="text-sm text-[var(--muted)]">Address: {b.address}</p>
                  <p className="text-sm text-[var(--muted)]">Preferred: {new Date(b.preferredDate).toLocaleDateString()}</p>
                  <p className="text-sm text-[var(--muted)]">Problem: {b.problemDescription}</p>
                  <p className="text-sm mt-1">Amount: ${b.finalAmount || b.basePrice}</p>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  {b.status === "requested" && (
                    <>
                      <button onClick={() => updateStatus(b._id, "accepted")} className="btn btn-primary text-sm">Accept</button>
                      <button onClick={() => updateStatus(b._id, "rejected")} className="btn btn-ghost text-sm text-red-400">Reject</button>
                    </>
                  )}
                  {b.status === "accepted" && (
                    <button onClick={() => updateStatus(b._id, "in-progress")} className="btn btn-primary text-sm">Start Work</button>
                  )}
                  {b.status === "in-progress" && (
                    <button onClick={() => { setFinalModal(b); setFinalAmount(String(b.basePrice)); }} className="btn btn-primary text-sm">Mark Completed</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {finalModal && (
        <Modal title="Mark completed" onClose={() => setFinalModal(null)}>
          <label className="text-xs text-[var(--muted)]">Final amount (USD)</label>
          <input type="number" min="1" value={finalAmount} onChange={(e) => setFinalAmount(e.target.value)} className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm mb-4" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setFinalModal(null)} className="btn btn-ghost">Cancel</button>
            <button onClick={() => { updateStatus(finalModal._id, "completed", Number(finalAmount)); setFinalModal(null); }} className="btn btn-primary">Complete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}
