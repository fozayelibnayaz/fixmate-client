"use client";

import { ArrowLeft, Clock3, MapPin, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { money } from "@/lib/format";
import type { Service } from "@/lib/types";
import { RequestModal } from "./request-modal";

export const ServiceDetail = ({ service }: { service: Service }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const canRequest = user?.role === "customer";

  const handleRequest = () => {
    if (!user) {
      router.push(`/sign-in?next=${encodeURIComponent(`/services/${service._id}`)}`);
      return;
    }
    if (!canRequest) return;
    setModalOpen(true);
  };

  const specs = [
    { icon: <Clock3 size={17} />, label: "Estimated duration", value: service.estimatedDuration },
    { icon: <Wrench size={17} />, label: "Service mode", value: service.serviceMode },
    { icon: <MapPin size={17} />, label: "Service area", value: service.serviceArea },
    { icon: <ShieldCheck size={17} />, label: "Approval", value: "Admin approved" },
  ];

  return (
    <section className="fm-section-sm">
      <div className="fm-container">
        <Link href="/services" className="fm-muted" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 30 }}>
          <ArrowLeft size={15} /> Back to services
        </Link>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 52, alignItems: "start" }}>
          <div>
            <div className="fm-card" style={{ aspectRatio: "4 / 3" }}>
              <img src={service.image} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="fm-panel" style={{ marginTop: 18, padding: 22 }}>
              <span className="fm-eyebrow">Technician</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
                <div className="fm-avatar" style={{ width: 48, height: 48, display: "grid", placeItems: "center", background: "var(--fm-ink)", color: "var(--fm-paper)", fontSize: 18 }}>
                  {service.technicianName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 750, fontSize: 17 }}>{service.technicianName}</div>
                  <div className="fm-muted" style={{ fontSize: 13 }}>{service.serviceArea} · Verified technician</div>
                </div>
              </div>
              <p className="fm-muted" style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
                Skilled specialist with hands-on experience across {service.category} repairs. Clear communication and a service warranty on every job.
              </p>
            </div>
          </div>

          <div>
            <span className="fm-pill">{service.category}</span>
            <h1 className="fm-h2" style={{ marginTop: 18 }}>{service.title}</h1>
            <p className="fm-lead">{service.description}</p>
            <div className="fm-grid fm-grid-2" style={{ marginTop: 30 }}>
              {specs.map((spec) => (
                <div key={spec.label} style={{ padding: 18, borderRadius: 14, border: "1px solid var(--fm-line)" }}>
                  <span style={{ color: "var(--fm-blue)" }}>{spec.icon}</span>
                  <div className="fm-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 12 }}>{spec.label}</div>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>{spec.value}</div>
                </div>
              ))}
            </div>
            <div className="fm-panel" style={{ marginTop: 26, padding: 24 }}>
              <div className="fm-muted" style={{ fontSize: 12 }}>Starting price</div>
              <div className="fm-price" style={{ fontSize: 40, margin: "6px 0 18px" }}>{money(service.basePrice)}</div>
              <button
                className="fm-btn fm-btn-blue fm-btn-block"
                onClick={handleRequest}
                disabled={Boolean(user && !canRequest)}
              >
                {!user ? "Sign in to request a repair" : canRequest ? "Request Repair" : "Only customers can request a repair"}
              </button>
              {user && !canRequest ? (
                <p className="fm-muted" style={{ fontSize: 12, margin: "12px 0 0", textAlign: "center" }}>
                  Switch to a customer account to send repair requests.
                </p>
              ) : null}
              <p className="fm-muted" style={{ fontSize: 12, margin: "12px 0 0", textAlign: "center" }}>
                You only pay after the technician marks the job complete.
              </p>
            </div>
          </div>
        </div>
      </div>
      {user && canRequest ? (
        <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} service={service} user={user} />
      ) : null}
    </section>
  );
};
