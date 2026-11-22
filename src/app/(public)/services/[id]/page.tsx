import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/service-detail";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Service Details",
  description: "Full details and repair request flow for a verified FixMate service.",
};

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { service } = await apiFetch<{ service: Service }>(`/api/services/${id}`);
    return <ServiceDetail service={service} />;
  } catch {
    notFound();
  }
}
