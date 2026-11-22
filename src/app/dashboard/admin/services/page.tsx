"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { ApprovalBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { patch } from "@/lib/api";
import { money } from "@/lib/format";
import type { ApprovalStatus, Service } from "@/lib/types";

const filters = ["", "pending", "approved", "rejected"];

type Decision = { service: Service; approvalStatus: Extract<ApprovalStatus, "approved" | "rejected"> };

export default function AdminServicesPage() {
  const [filter, setFilter] = useState("pending");
  const { data, loading, refresh } = useApiData<{ services: Service[] }>(
    `/api/admin/services${filter ? `?status=${filter}` : ""}`,
  );
  const [decision, setDecision] = useState<Decision | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmDecision = async () => {
    if (!decision) return;
    setBusy(true);
    try {
      await patch(`/api/admin/services/${decision.service._id}/approval`, { approvalStatus: decision.approvalStatus });
      toast.success(decision.approvalStatus === "approved" ? "Service approved" : "Service rejected");
      setDecision(null);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update service");
    } finally {
      setBusy(false);
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
        <div className="fm-panel"><EmptyState icon="✅" title="Nothing to review" description="No services match this filter." /></div>
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
                      <Button variant="blue" size="sm" onClick={() => setDecision({ service, approvalStatus: "approved" })}>Approve</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDecision({ service, approvalStatus: "rejected" })}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        title={decision?.approvalStatus === "approved" ? "Approve this service?" : "Reject this service?"}
        description={
          decision
            ? `${decision.service.title} by ${decision.service.technicianName} will be ${
                decision.approvalStatus === "approved"
                  ? "published on the public catalogue."
                  : "hidden from customers until resubmitted."
              }`
            : undefined
        }
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="ghost" onClick={() => setDecision(null)}>Cancel</Button>
          <Button variant={decision?.approvalStatus === "approved" ? "blue" : "danger"} onClick={confirmDecision} disabled={busy}>
            {busy ? "Saving…" : decision?.approvalStatus === "approved" ? "Approve service" : "Reject service"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
