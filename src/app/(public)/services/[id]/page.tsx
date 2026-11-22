import type { Metadata } from "next";
import { ServiceDetailLoader } from "@/components/services/service-detail-loader";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Service Details",
  description: "Full details and repair request flow for a verified FixMate service.",
};

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let service: Service | undefined;
  try {
    ({ service } = await apiFetch<{ service: Service }>(`/api/services/${id}`));
  } catch {
    // The client loader will retry in the browser and render a friendly
    // not-found state instead of failing the entire page request.
  }
  return <ServiceDetailLoader id={id} initialService={service} />;
}
