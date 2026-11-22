"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/misc";
import { ApprovalBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { patch } from "@/lib/api";
import { money } from "@/lib/format";
import type { Service } from "@/lib/types";

const filters = ["", "pending", "approved", "rejected"];

export default function AdminServicesPage() {
  const [filter, setFilter] = useState("pending");
  const { data, loading, refresh } = useApiData<{ services: Service[] }>(
    `/api/admin/services${filter ? `?status=${filter}` : ""}`,
  );

  const decide = async (service: Service, approvalStatus: string) => {
    try {
      await patch(`/api/admin/services/${service._id}/approval`, { approvalStatus });
      toast.success(approvalStatus === "approved" ? "Service approved" : "Service rejected");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update service");
    }
  };

  return (
    <>
      <PageHeader eyebrow="Admin dashboard" title="Service Approval" subtitle="Only approved services appear on public pages." />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {filters.map((value) => (
          <button
            key={value || "all"}
            onClick={() => setFilter(value)}
            className={`fm-pill ${filter === value ? "active" : ""}`}
            style={filter === value ? { background: "var(--fm-ink)", color: "var(--fm-paper)", borderColor: "var(--fm-ink)", cursor: "pointer" } : { cursor: "pointer" }}
          >
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : "All"}
          </button>
        ))}
      </div>
      {loading ? <Spinner /> : (data?.services.length ?? 0) === 0 ? (
        <div className="fm-panel"><div className="fm-empty"><div className="fm-empty-icon">✅</div><h3 className="fm-h3">Nothing to review</h3><p className="fm-muted">No services match this filter.</p></div></div>
      ) : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>Service</th><th>Technician</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {(data?.services ?? []).map((service) => (
                <tr key={service._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={service.image} alt="" style={{ width: 46, height: 46, borderRadius: 9, objectFit: "cover" }} />
                      <div><strong>{service.title}</strong><div className="fm-muted" style={{ fontSize: 12 }}>{service.category}</div></div>
                    </div>
                  </td>
                  <td>{service.technicianName}</td>
                  <td>{money(service.basePrice)}</td>
                  <td><ApprovalBadge status={service.approvalStatus} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button variant="blue" size="sm" onClick={() => decide(service, "approved")}>Approve</Button>
                      <Button variant="ghost" size="sm" onClick={() => decide(service, "rejected")}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
