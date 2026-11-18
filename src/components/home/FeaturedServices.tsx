"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/utils";
import { FALLBACK_SERVICES } from "@/lib/fallback";

export default function FeaturedServices() {
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    api("/api/services?limit=6&sort=newest").then((r) => setServices(r.data?.length ? r.data : FALLBACK_SERVICES)).catch(() => setServices(FALLBACK_SERVICES));
  }, []);
  if (!services.length) {
    return <div className="text-[var(--muted)] text-center py-10">Loading services...</div>;
  }
  return (
    <div className="grid-services">
      {services.map((s, i) => (
        <article key={s._id} className="service-card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
          <div className="service-img">
            {s.image ? <img src={s.image} alt={s.title} className="w-full h-full object-cover" /> : "🔧"}
            <span className="service-cat">{s.category}</span>
          </div>
          <div className="service-body">
            <h3>{s.title}</h3>
            <div className="service-meta">
              <span className="badge">{s.serviceMode}</span>
              <span className="badge">{s.serviceArea}</span>
              <span className="badge">{s.technicianName}</span>
            </div>
            <div className="service-foot">
              <span className="service-price">${s.basePrice}<small> starting</small></span>
              <Link href={`/services/${s._id}`} className="service-go">view →</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
