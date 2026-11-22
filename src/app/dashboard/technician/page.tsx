"use client";

import { CheckCircle2, Clock3, Layers3 } from "lucide-react";
import Link from "next/link";
import { MiniBarChart, PageHeader } from "@/components/dashboard/shared";
import { StatCard, SkeletonCard } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { shortDate } from "@/lib/format";
import type { Booking, Service } from "@/lib/types";

export default function TechnicianOverview() {
  const { data: serviceData, loading: servicesLoading } = useApiData<{ services: Service[] }>("/api/services/mine/list");
  const { data: bookingData, loading: bookingsLoading } = useApiData<{ bookings: Booking[] }>("/api/bookings/technician");
  const services = serviceData?.services ?? [];
  const requests = bookingData?.bookings ?? [];
  const pending = requests.filter((booking) => booking.status === "requested").length;

  const chart = [
    { label: "Services", value: services.length },
    { label: "Approved", value: services.filter((service) => service.approvalStatus === "approved").length },
    { label: "Pending", value: services.filter((service) => service.approvalStatus === "pending").length },
    { label: "Requests", value: requests.length },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Technician dashboard"
        title="Your workshop."
        subtitle="Manage listings, accept jobs and keep work moving."
        action={<Link href="/dashboard/technician/add-service" className="fm-btn fm-btn-blue fm-btn-sm">Add a service</Link>}
      />
      {servicesLoading || bookingsLoading ? (
        <div className="fm-grid fm-grid-3">{[1, 2, 3].map((key) => <SkeletonCard key={key} />)}</div>
      ) : (
        <>
          <div className="fm-grid fm-grid-3">
            <StatCard label="Total Services" value={services.length} icon={<Layers3 size={18} color="var(--fm-blue)" />} />
            <StatCard label="Approved Services" value={services.filter((s) => s.approvalStatus === "approved").length} icon={<CheckCircle2 size={18} color="#16824a" />} />
            <StatCard label="Pending Requests" value={pending} icon={<Clock3 size={18} color="#a9680a" />} />
          </div>
          <div className="fm-grid fm-grid-2" style={{ marginTop: 22, gridTemplateColumns: "1.2fr .8fr" }}>
            <div className="fm-panel">
              <div className="fm-panel-head"><h3 style={{ fontSize: 15, margin: 0 }}>Incoming requests</h3><Link href="/dashboard/technician/requests" className="fm-muted" style={{ fontSize: 13 }}>Manage →</Link></div>
              {requests.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--fm-muted)" }}>No requests yet.</div>
              ) : (
                <table className="fm-table">
                  <thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {requests.slice(0, 5).map((booking) => (
                      <tr key={booking._id}>
                        <td style={{ fontWeight: 650 }}>{booking.customerName}</td>
                        <td>{booking.serviceTitle}</td>
                        <td>{shortDate(booking.preferredDate)}</td>
                        <td><StatusBadge status={booking.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <MiniBarChart title="Your activity" data={chart} />
          </div>
        </>
      )}
    </>
  );
};
