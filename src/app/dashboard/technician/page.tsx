"use client";

import { BadgeCheck, CheckCircle2, Clock3, Crown, Layers3 } from "lucide-react";
import Link from "next/link";
import { MiniBarChart, PageHeader } from "@/components/dashboard/shared";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, StatCard, SkeletonCard } from "@/components/ui/misc";
import { useAuth } from "@/hooks/use-auth";
import { StatusBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { shortDate } from "@/lib/format";
import type { Booking, Service } from "@/lib/types";

export default function TechnicianOverview() {
  const { user } = useAuth();
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
      <div className="fm-panel" style={{ padding: 18, marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center", background: "var(--fm-blue)", color: "#fff" }}><Crown size={18} /></span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <strong style={{ fontSize: 14 }}>{user?.plan === "pro" ? "Pro Technician Plan active" : "Need unlimited listings?"}</strong>
              {user?.plan === "pro" ? <span className="fm-pro-badge"><BadgeCheck size={12} aria-hidden="true" /> Verified Pro</span> : null}
            </div>
            <div className="fm-muted" style={{ fontSize: 12, marginTop: 3 }}>
              {user?.plan === "pro" ? "Your services carry the Verified Pro badge." : `Free plans include 3 services. Upgrade for ৳499/month.`}
            </div>
          </div>
        </div>
        <ButtonLink href="/dashboard/technician/pro" variant={user?.plan === "pro" ? "ghost" : "blue"} size="sm">
          {user?.plan === "pro" ? "Manage plan" : "View Pro Plan"}
        </ButtonLink>
      </div>
      {servicesLoading || bookingsLoading ? (
        <div className="fm-grid fm-grid-3">{[1, 2, 3].map((key) => <SkeletonCard key={key} />)}</div>
      ) : (
        <>
          <div className="fm-grid fm-grid-3">
            <StatCard label="Total Services" value={services.length} icon={<Layers3 size={18} color="var(--fm-blue)" />} />
            <StatCard label="Approved Services" value={services.filter((s) => s.approvalStatus === "approved").length} icon={<CheckCircle2 size={18} color="#16824a" />} />
            <StatCard label="Pending Requests" value={pending} icon={<Clock3 size={18} color="#a9680a" />} />
          </div>
          <div className="fm-grid fm-grid-2" style={{ marginTop: 22 }}>
            <div className="fm-panel">
              <div className="fm-panel-head"><h3 style={{ fontSize: 15, margin: 0 }}>Incoming requests</h3><Link href="/dashboard/technician/requests" className="fm-muted" style={{ fontSize: 13 }}>Manage →</Link></div>
              {requests.length === 0 ? (
                <EmptyState icon="📥" title="No requests yet" description="New customer repair requests will appear here." />
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
