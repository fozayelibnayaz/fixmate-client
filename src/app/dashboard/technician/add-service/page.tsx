"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ServiceForm } from "@/components/dashboard/service-form";
import { PageHeader } from "@/components/dashboard/shared";
import { Field } from "@/components/ui/field";
import { useAuth } from "@/hooks/use-auth";
import { post } from "@/lib/api";
import type { ServiceValues } from "@/lib/schemas";
import type { Service } from "@/lib/types";

export default function AddServicePage() {
  const { user } = useAuth();
  const router = useRouter();

  const submit = async (values: ServiceValues) => {
    await post<{ service: Service }>("/api/services", values);
    toast.success("Service submitted for review");
    router.push("/dashboard/technician/my-services");
  };

  return (
    <>
      <PageHeader eyebrow="Technician dashboard" title="Add a service" subtitle="New listings are reviewed before they appear in the catalogue." />
      <div className="fm-panel" style={{ padding: 28, maxWidth: 820 }}>
        <div className="fm-grid fm-grid-2" style={{ gap: 0, columnGap: 16, marginBottom: 18 }}>
          <Field label="Technician name" value={user?.name ?? ""} readOnly />
          <Field label="Technician email" value={user?.email ?? ""} readOnly />
        </div>
        <hr className="fm-divider" style={{ margin: "6px 0 24px" }} />
        <ServiceForm onSubmit={submit} submitLabel="Submit service for approval" />
      </div>
    </>
  );
}
