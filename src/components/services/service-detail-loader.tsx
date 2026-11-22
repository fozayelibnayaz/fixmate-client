"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/lib/types";
import { EmptyState, Spinner } from "@/components/ui/misc";
import { ServiceDetail } from "./service-detail";

/**
 * Keeps the detail page server-rendered when the API is reachable, but still
 * allows the browser to load it when the server render has no API access.
 * That also keeps public catalogue pages resilient during API blips.
 */
export const ServiceDetailLoader = ({
  id,
  initialService,
}: {
  id: string;
  initialService?: Service;
}) => {
  const [service, setService] = useState<Service | null>(initialService ?? null);
  const [loading, setLoading] = useState(!initialService);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    apiFetch<{ service: Service }>(`/api/services/${id}`)
      .then((result) => {
        if (active) setService(result.service);
      })
      .catch(() => {
        if (active) setError("This service is unavailable or no longer listed.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, initialService]);

  if (loading) return <Spinner label="Loading service details…" />;
  if (error || !service) {
    return (
      <EmptyState
        icon="🔍"
        title="Service not found"
        description={error ?? "This service is unavailable or no longer listed."}
        action={{ label: "Browse services", href: "/services" }}
      />
    );
  }
  return <ServiceDetail service={service} />;
};
