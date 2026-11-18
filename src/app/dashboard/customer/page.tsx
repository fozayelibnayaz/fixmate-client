"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";

export default function CustomerOverview() {
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    api("/api/bookings/my").then((r) => setBookings(r.data || [])).catch(() => {});
  }, []);
  const total = bookings.length;
  const active = bookings.filter((b) => ["requested", "accepted", "in-progress"].includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  return (
    <div>
      <h1 className="page-heading" style={{marginBottom:28}}>Customer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Requests" value={total} />
        <StatCard label="Active Jobs" value={active} />
        <StatCard label="Completed Jobs" value={completed} />
      </div>
      <p className="text-[var(--muted)] text-sm">Use the sidebar to view bookings and payments.</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel">
      <p className="text-xs font-mono text-[var(--muted)] uppercase">{label}</p>
      <p className="text-3xl font-bold mt-2 text-[var(--accent)]">{value}</p>
    </div>
  );
}
