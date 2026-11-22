"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/lib/types";
import { ServiceCard } from "@/components/services/service-card";
import { EmptyState, SectionHeading, SkeletonCard } from "@/components/ui/misc";

export const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{ services: Service[] }>("/api/services/featured")
      .then((result) => {
        if (active) setServices(result.services);
      })
      .catch(() => {
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="fm-section-sm">
      <div className="fm-container">
        <SectionHeading
          eyebrow="04 / Featured"
          title="Latest verified services"
          description="Fresh from the workshop — approved and available right now."
          action={{ label: "See all services", href: "/services" }}
        />
        {loading ? (
          <div className="fm-grid fm-grid-3">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon="🧰"
            title="No services yet"
            description="Technicians are adding their services. Check back shortly."
            action={{ label: "Browse services", href: "/services" }}
          />
        ) : (
          <div className="fm-grid fm-grid-3">
            {services.map((service) => <ServiceCard key={service._id} service={service} />)}
          </div>
        )}
      </div>
    </section>
  );
};
