"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/utils";
import { toast } from "sonner";

export default function TechOverview() {
  const sp = useSearchParams();
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    api("/api/services/mine").then((r) => setServices(r.data || [])).catch(() => {});
    api("/api/bookings/technician").then((r) => setRequests(r.data || [])).catch(() => {});
    // handle upgrade return
    const sid = sp.get("session_id");
    if (sid && sp.get("upgraded")) {
      api(`/api/users/upgrade-verify?session_id=${sid}`).then((r) => {
        if (r.upgraded) toast.success("Upgraded to Pro!");
      }).catch(() => {});
    }
  }, [sp]);

  async function upgrade() {
    try {
      const r = await api("/api/users/upgrade-pro", { method: "POST" });
      window.location.href = r.url;
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Technician Dashboard</h1>
      <div className="flex items-center justify-between mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <StatCard label="Total Services" value={services.length} />
          <StatCard label="Approved Services" value={services.filter((s) => s.approvalStatus === "approved").length} />
          <StatCard label="Pending Requests" value={requests.filter((b) => b.status === "requested").length} />
        </div>
        <button onClick={upgrade} className="btn btn-primary ml-4">Upgrade to Pro</button>
      </div>
    </div>
  );
}
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5">
      <p className="text-xs font-mono text-[var(--muted)] uppercase">{label}</p>
      <p className="text-3xl font-bold mt-2 text-[var(--accent)]">{value}</p>
    </div>
  );
}
