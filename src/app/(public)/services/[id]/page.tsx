"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { api, SERVER_URL, setToken } from "@/lib/utils";
import { FALLBACK_SERVICES } from "@/lib/fallback";
import { Calendar, MapPin, User, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [rating, setRating] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerPhone: "", address: "", preferredDate: "", problemDescription: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    authClient.getSession().then((s: any) => setSession(s?.data ?? null));
    (async () => {
      try {
        const s = await api(`/api/services/${id}`);
        setService(s);
        try { const r = await api(`/api/bookings/service/${id}/rating`); setRating(r); } catch {}
      } catch {
        const fb = FALLBACK_SERVICES.find((s) => s._id === id);
        if (fb) setService(fb);
        else setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const user = session?.user;
  const role = user?.role || "customer";

  async function ensureToken() {
    if (!getTokenLocal()) {
      const r: any = await authClient.token?.();
      const t = r?.data?.token || r?.token;
      if (t) setToken(t);
    }
  }
  function getTokenLocal() { return typeof window !== "undefined" ? localStorage.getItem("fixmate_token") : null; }

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ensureToken();
      await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId: id, ...form }),
      });
      toast.success("Request submitted! Redirecting to My Bookings...");
      router.push("/dashboard/customer/bookings");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="container py-20">Loading...</div>;
  if (notFound || !service) return (
    <div className="container py-20 text-center">
      <div className="text-6xl mb-4">🔧</div>
      <h1 className="text-2xl font-bold mb-2">Service not found</h1>
      <Link href="/services" className="btn btn-primary"><span>Back to services</span></Link>
    </div>
  );

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="page-wrap">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="rounded-2xl overflow-hidden border border-[var(--line)] h-80 bg-[var(--panel2)]">
            {service.image ? <img src={service.image} alt={service.title} className="w-full h-full object-cover" /> : <div className="grid place-items-center h-full text-6xl">🔧</div>}
          </div>
        </div>
        <div>
          <span className="service-cat" style={{ position: "static", display: "inline-block", marginBottom: 12 }}>{service.category}</span>
          <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            {service.technicianPlan === "pro" && <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] font-mono">Verified Pro</span>}
            {rating.count > 0 && <span className="text-sm text-[var(--muted)]">⭐ {rating.avg.toFixed(1)} ({rating.count} reviews)</span>}
          </div>
          <p className="text-[var(--muted)] mb-6">{service.description}</p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3"><DollarSign size={16} className="text-[var(--accent)]" /><span className="font-bold text-xl">${service.basePrice}</span><span className="text-[var(--muted)] text-sm">starting</span></div>
            <div className="flex items-center gap-3"><Clock size={16} className="text-[var(--muted)]" /><span className="text-sm">{service.estimatedDuration}</span></div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-[var(--muted)]" /><span className="text-sm">{service.serviceMode} · {service.serviceArea}</span></div>
          </div>
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-4 mb-6">
            <p className="text-xs font-mono text-[var(--muted)] uppercase mb-2">Technician</p>
            <div className="flex items-center gap-3">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(service.technicianName)}&background=181c19&color=00e0c6`} className="w-12 h-12 rounded-xl" alt="" />
              <div>
                <p className="font-semibold">{service.technicianName}</p>
                <p className="text-xs text-[var(--muted)]">{service.serviceArea}</p>
              </div>
            </div>
          </div>

          {!user ? (
            <Link href={`/sign-in?callbackUrl=/services/${id}`} className="btn btn-primary w-full"><span>Sign in to request repair</span></Link>
          ) : role !== "customer" ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-400 text-sm">Only customers can request a repair.</div>
          ) : (
            <>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-primary w-full"><span>{showForm ? "Hide form" : "Request Repair"}</span></button>
              {showForm && (
                <form onSubmit={submitRequest} className="mt-6 space-y-4 bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5">
                  <div>
                    <label className="text-xs text-[var(--muted)]">Name</label>
                    <input value={user.name} readOnly className="field" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Email</label>
                    <input value={user.email} readOnly className="field" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Phone</label>
                    <input required value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="field" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Address</label>
                    <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="field" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Preferred Date</label>
                    <input type="date" required min={minDate} value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} className="field" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)]">Problem Description (min 20 chars)</label>
                    <textarea required minLength={20} value={form.problemDescription} onChange={(e) => setForm({ ...form, problemDescription: e.target.value })} className="field" rows={4} />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-full"><span>{submitting ? "Submitting..." : "Submit Request"}</span></button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
