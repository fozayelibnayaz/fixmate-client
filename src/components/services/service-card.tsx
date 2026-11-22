import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Service } from "@/lib/types";

export const ServiceCard = ({ service }: { service: Service }) => (
  <article className="fm-card fm-service-card">
    <Link href={`/services/${service._id}`} className="fm-media" aria-label={`View ${service.title}`}>
      <img src={service.image} alt={service.title} loading="lazy" />
    </Link>
    <div className="fm-service-body">
      <span className="fm-pill" style={{ alignSelf: "flex-start" }}>{service.category}</span>
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
