"use client";

import { CalendarCheck, CheckCircle2, Clock3 } from "lucide-react";
import Link from "next/link";
import { useApiData } from "@/hooks/use-api-data";
import { PageHeader, MiniBarChart, StatusLegend } from "@/components/dashboard/shared";
import { EmptyState, SkeletonCard, StatCard } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/status-badge";
import { shortDate } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

const ACTIVE: BookingStatus[] = ["requested", "accepted", "in-progress"];

export default function CustomerOverview() {
  const { data, loading } = useApiData<{ bookings: Booking[] }>("/api/bookings/my");
  const bookings = data?.bookings ?? [];
  const active = bookings.filter((booking) => ACTIVE.includes(booking.status)).length;
  const completed = bookings.filter((booking) => booking.status === "completed").length;

  const chartData = [
    { label: "Request", value: bookings.filter((b) => b.status === "requested").length },
    { label: "Accepted", value: bookings.filter((b) => b.status === "accepted").length },
    { label: "Progress", value: bookings.filter((b) => b.status === "in-progress").length },
    { label: "Done", value: completed },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Customer dashboard"
        title="Your repair hub."
        subtitle="Everything you've requested, in one place."
        action={<Link href="/services" className="fm-btn fm-btn-blue fm-btn-sm">Find a service</Link>}
      />
      {loading ? (
        <div className="fm-grid fm-grid-3">{[1, 2, 3].map((key) => <SkeletonCard key={key} />)}</div>
      ) : (
        <>
          <div className="fm-grid fm-grid-3">
            <StatCard label="Total Requests" value={bookings.length} icon={<CalendarCheck size={18} color="var(--fm-blue)" />} />
            <StatCard label="Active Jobs" value={active} icon={<Clock3 size={18} color="#a9680a" />} />
            <StatCard label="Completed Jobs" value={completed} icon={<CheckCircle2 size={18} color="#16824a" />} />
          </div>
          <div className="fm-grid fm-grid-2" style={{ marginTop: 22, gridTemplateColumns: "1.2fr .8fr" }}>
            <div className="fm-panel">
              <div className="fm-panel-head"><h3 style={{ fontSize: 15, margin: 0 }}>Recent bookings</h3><Link href="/dashboard/customer/bookings" className="fm-muted" style={{ fontSize: 13 }}>View all →</Link></div>
              {bookings.length === 0 ? (
                <EmptyState icon="🧾" title="No requests yet" description="Browse services and send your first repair request." action={{ label: "Browse services", href: "/services" }} />
              ) : (
                <table className="fm-table">
                  <thead><tr><th>Service</th><th>Technician</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id}>
                        <td style={{ fontWeight: 650 }}>{booking.serviceTitle}</td>
                        <td>{booking.technicianName}</td>
                        <td>{shortDate(booking.preferredDate)}</td>
                        <td><StatusBadge status={booking.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <MiniBarChart title="Jobs by stage" data={chartData} />
          </div>
          <div style={{ marginTop: 22 }}><StatusLegend /></div>
        </>
      )}
    </>
  );
};
