"use client";

import { ArrowUpRight, BadgeCheck, Clock3, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Service } from "@/lib/types";

const fallbackImage = "/services/generic.svg";

export const ServiceCard = ({ service }: { service: Service }) => (
  <article className="fm-card fm-service-card">
    <Link href={`/services/${service._id}`} className="fm-media" aria-label={`View ${service.title}`}>
      <img
        src={service.image || fallbackImage}
        alt={service.title}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />
    </Link>
    <div className="fm-service-body">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span className="fm-pill">{service.category}</span>
        {service.technicianPlan === "pro" ? (
          <span className="fm-pro-badge"><BadgeCheck size={12} aria-hidden="true" /> Verified Pro</span>
        ) : null}
        {service.reviewCount > 0 ? (
          <span className="fm-rating"><Star size={12} fill="currentColor" aria-hidden="true" /> {service.averageRating.toFixed(1)} ({service.reviewCount})</span>
        ) : null}
      </div>
      <h3>{service.title}</h3>
      <div className="fm-service-meta">
        <span className="fm-pill"><Clock3 size={12} /> {service.estimatedDuration}</span>
        <span className="fm-pill">{service.serviceMode}</span>
        <span className="fm-pill"><MapPin size={12} /> {service.serviceArea}</span>
      </div>
      <div className="fm-service-foot">
        <div>
          <div className="fm-muted" style={{ fontSize: 11 }}>Starting at</div>
          <div className="fm-price">{money(service.basePrice)}</div>
        </div>
        <Link href={`/services/${service._id}`} className="fm-btn fm-btn-primary fm-btn-sm">
          View Details <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="fm-muted" style={{ fontSize: 12 }}>By {service.technicianName}</div>
    </div>
  </article>
);
