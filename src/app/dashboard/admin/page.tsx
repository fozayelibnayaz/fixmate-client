"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>({});
  useEffect(() => { api("/api/admin/stats").then(setStats).catch(() => {}); }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers ?? 0} />
        <StatCard label="Technicians" value={stats.totalTechnicians ?? 0} />
        <StatCard label="Pending Services" value={stats.pendingServices ?? 0} />
        <StatCard label="Total Revenue" value={`$${stats.totalRevenue ?? 0}`} />
      </div>
    </div>
  );
}
function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5">
      <p className="text-xs font-mono text-[var(--muted)] uppercase">{label}</p>
      <p className="text-3xl font-bold mt-2 text-[var(--accent)]">{value}</p>
    </div>
  );
}
