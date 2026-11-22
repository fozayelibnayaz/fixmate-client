"use client";

import { DollarSign, ShieldAlert, Users, Wrench } from "lucide-react";
import { MiniBarChart, PageHeader } from "@/components/dashboard/shared";
import { StatCard, SkeletonCard } from "@/components/ui/misc";
import { useApiData } from "@/hooks/use-api-data";
import { money } from "@/lib/format";
import type { Payment } from "@/lib/types";

interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalBookings: number;
  totalPayments: number;
}

export default function AdminOverview() {
  const { data, loading } = useApiData<AdminStats>("/api/admin/stats");
  const { data: paymentData } = useApiData<{ payments: Payment[]; revenue: number }>("/api/admin/payments");

  return (
    <>
      <PageHeader eyebrow="Admin dashboard" title="Platform overview." subtitle="Moderation, users, jobs and revenue at a glance." />
      {loading ? (
        <div className="fm-grid fm-grid-3">{[1, 2, 3].map((key) => <SkeletonCard key={key} />)}</div>
      ) : (
        <>
          <div className="fm-grid fm-grid-3">
            <StatCard label="Total Users" value={data?.totalUsers ?? 0} icon={<Users size={18} color="var(--fm-blue)" />} />
            <StatCard label="Total Technicians" value={data?.totalTechnicians ?? 0} icon={<Wrench size={18} color="#8b5cf6" />} />
            <StatCard label="Pending Services" value={data?.pendingServices ?? 0} icon={<ShieldAlert size={18} color="#a9680a" />} />
          </div>
          <div className="fm-grid fm-grid-2" style={{ marginTop: 22 }}>
            <StatCard label="Total Revenue" value={money(paymentData?.revenue ?? 0)} icon={<DollarSign size={18} color="#16824a" />} />
            <StatCard label="Total Bookings" value={data?.totalBookings ?? 0} />
          </div>
          <div style={{ marginTop: 22 }}>
            <MiniBarChart
              title="Platform activity"
              data={[
                { label: "Users", value: data?.totalUsers ?? 0 },
                { label: "Techs", value: data?.totalTechnicians ?? 0 },
                { label: "Bookings", value: data?.totalBookings ?? 0 },
                { label: "Payments", value: data?.totalPayments ?? 0 },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
}
