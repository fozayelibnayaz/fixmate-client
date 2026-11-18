"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import { STATUS_COLORS } from "@/lib/utils";

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const load = () => api("/api/bookings/my").then((r) => setBookings(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function cancel(id: string) {
    try {
      await api(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      setCancelId(null);
      load();
    } catch (e: any) { toast.error(e.message); }
  }

  async function pay(b: any) {
    try {
      const r = await api("/api/payments/create-checkout-session", { method: "POST", body: JSON.stringify({ bookingId: b._id }) });
      window.location.href = r.url;
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <Empty text="No bookings yet." />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <img src={b.serviceImage} alt="" className="w-full md:w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold">{b.serviceTitle}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[b.status] || ""}`}>{b.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[b.paymentStatus] || ""}`}>{b.paymentStatus}</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">Tech: {b.technicianName} · {new Date(b.preferredDate).toLocaleDateString()}</p>
                  <p className="text-sm text-[var(--muted)]">Amount: ${b.finalAmount || b.basePrice}</p>
                  <StatusTimeline status={b.status} paymentStatus={b.paymentStatus} />
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  {b.status === "requested" && (
                    <button onClick={() => setCancelId(b._id)} className="btn btn-ghost text-sm">Cancel</button>
                  )}
                  {b.status === "completed" && b.paymentStatus === "unpaid" && (
                    <button onClick={() => pay(b)} className="btn btn-primary text-sm">Pay Now</button>
                  )}
                  {b.paymentStatus === "paid" && (
                    <>
                      <button onClick={() => window.open(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/invoice/${b._id}`, "_blank")} className="btn btn-ghost text-sm">Download Invoice</button>
                      <button onClick={() => { setReviewBooking(b); setRating(5); setReviewText(""); }} className="btn btn-ghost text-sm">Review</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelId && (
        <Modal title="Cancel booking?" onClose={() => setCancelId(null)}>
          <p className="text-sm text-[var(--muted)] mb-4">This cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setCancelId(null)} className="btn btn-ghost">No</button>
            <button onClick={() => cancel(cancelId)} className="btn btn-primary">Yes, cancel</button>
          </div>
        </Modal>
      )}

      {reviewBooking && (
        <Modal title="Leave a review" onClose={() => setReviewBooking(null)}>
          <div className="space-y-3">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>★</button>
              ))}
            </div>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Short review..." className="w-full bg-[var(--bg2)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm" rows={3} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReviewBooking(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={async () => {
                try {
                  await api(`/api/bookings/${reviewBooking._id}/review`, { method: "PATCH", body: JSON.stringify({ rating, review: reviewText }) });
                  toast.success("Review submitted");
                  setReviewBooking(null);
                } catch (e: any) { toast.error(e.message); }
              }} className="btn btn-primary">Submit</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatusTimeline({ status, paymentStatus }: { status: string; paymentStatus: string }) {
  const steps = ["requested", "accepted", "in-progress", "completed", "paid"];
  const current = paymentStatus === "paid" ? "paid" : status;
  let idx = steps.indexOf(current);
  if (idx < 0) idx = 0;
  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`w-2.5 h-2.5 rounded-full ${i <= idx ? "bg-[var(--accent)]" : "bg-[var(--line2)]"}`} />
          {i < steps.length - 1 && <div className={`w-6 h-0.5 ${i < idx ? "bg-[var(--accent)]" : "bg-[var(--line2)]"}`} />}
        </div>
      ))}
      <span className="text-xs text-[var(--muted)] ml-2 capitalize">{current}</span>
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

function Empty({ text }: { text: string }) {
  return <div className="text-center py-20"><div className="text-5xl mb-4">📭</div><p className="text-[var(--muted)]">{text}</p></div>;
}
