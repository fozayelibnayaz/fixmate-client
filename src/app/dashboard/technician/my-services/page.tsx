"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ServiceForm } from "@/components/dashboard/service-form";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { ApprovalBadge } from "@/components/ui/status-badge";
import { useApiData } from "@/hooks/use-api-data";
import { patch, remove } from "@/lib/api";
import { money } from "@/lib/format";
import type { ServiceValues } from "@/lib/schemas";
import type { Service } from "@/lib/types";

export default function MyServicesPage() {
  const { data, loading, refresh } = useApiData<{ services: Service[] }>("/api/services/mine/list");
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);
  const services = data?.services ?? [];

  const toggle = async (service: Service) => {
    try {
      await patch(`/api/services/${service._id}/availability`);
      toast.success(service.isAvailable ? "Service hidden from public pages" : "Service is now available");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update availability");
    }
  };

  const saveEdit = async (values: ServiceValues) => {
    if (!editing) return;
    await patch(`/api/services/${editing._id}`, values);
    toast.success("Service updated — approval status reset to pending");
    setEditing(null);
    refresh();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await remove(`/api/services/${deleting._id}`);
      toast.success("Service deleted");
      setDeleting(null);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete service");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Technician dashboard"
        title="My Services"
        subtitle="Full control of your listings and their availability."
        action={<Link href="/dashboard/technician/add-service" className="fm-btn fm-btn-blue fm-btn-sm"><Plus size={15} /> Add service</Link>}
      />
      {loading ? <Spinner label="Loading services…" /> : services.length === 0 ? (
        <div className="fm-panel"><EmptyState icon="🧰" title="No services yet" description="Add your first repair service and submit it for approval." action={{ label: "Add a service", href: "/dashboard/technician/add-service" }} /></div>
      ) : (
        <div className="fm-panel">
          <table className="fm-table">
            <thead><tr><th>Service</th><th>Category</th><th>Price</th><th>Approval</th><th>Available</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={service.image} alt="" style={{ width: 46, height: 46, borderRadius: 9, objectFit: "cover" }} />
                      <strong>{service.title}</strong>
                    </div>
                  </td>
                  <td>{service.category}</td>
                  <td>{money(service.basePrice)}</td>
                  <td><ApprovalBadge status={service.approvalStatus} /></td>
                  <td>
                    <button
                      onClick={() => toggle(service)}
                      className={`fm-status ${service.isAvailable ? "fm-status-green" : "fm-status-gray"}`}
                      style={{ border: 0, cursor: "pointer" }}
                    >
                      {service.isAvailable ? "On" : "Off"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(service)} aria-label="Edit service"><Pencil size={14} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleting(service)} aria-label="Delete service"><Trash2 size={14} color="#d92d20" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit service" description="Saving returns this service to pending approval.">
        {editing ? <ServiceForm
          initial={{
            title: editing.title,
            category: editing.category as ServiceValues["category"],
            description: editing.description,
            image: editing.image,
            basePrice: editing.basePrice,
            estimatedDuration: editing.estimatedDuration,
            serviceMode: editing.serviceMode as ServiceValues["serviceMode"],
            serviceArea: editing.serviceArea,
          }}
          onSubmit={saveEdit}
          submitLabel="Save changes"
        /> : null}
      </Modal>

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete this service?" description={deleting ? `${deleting.title} will be permanently removed.` : undefined}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="ghost" onClick={() => setDeleting(null)}>Keep it</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={busy}>{busy ? "Deleting…" : "Delete service"}</Button>
        </div>
      </Modal>
    </>
  );
}
