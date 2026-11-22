"use client";

import { ArrowLeft, BadgeCheck, Clock3, MapPin, ShieldCheck, Star, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApiData } from "@/hooks/use-api-data";
import { useAuth } from "@/hooks/use-auth";
import { ACTIVE_BOOKING_STATUSES } from "@/lib/constants";
import { money } from "@/lib/format";
import type { Booking, Service, ServiceReview } from "@/lib/types";
import { RequestModal } from "./request-modal";

export const ServiceDetail = ({ service }: { service: Service }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const accountUser = mounted ? user : null;
  const { data: bookingData } = useApiData<{ bookings: Booking[] }>(
    accountUser?.role === "customer" ? "/api/bookings/my" : null,
  );
  const { data: reviewData, loading: reviewsLoading } = useApiData<{ reviews: ServiceReview[] }>(
    service.reviewCount > 0 ? `/api/services/${service._id}/reviews` : null,
  );

  // A duplicate active request is blocked on the server; surface it here so the
  // customer sees it before filling in the form.
  const activeRequest = bookingData?.bookings.find(
    (booking) =>
      booking.serviceId === service._id && ACTIVE_BOOKING_STATUSES.includes(booking.status),
  );

  // The session arrives after hydration; keep the initial client render
  // signed-out so it matches the server HTML.
  useEffect(() => setMounted(true), []);

  const canRequest = accountUser?.role === "customer";

  const handleRequest = () => {
    if (!accountUser) {
      router.push(`/sign-in?next=${encodeURIComponent(`/services/${service._id}`)}`);
      return;
    }
    if (!canRequest || activeRequest) return;
    setModalOpen(true);
  };

  const specs = [
    { icon: <Clock3 size={17} />, label: "Estimated duration", value: service.estimatedDuration },
    { icon: <Wrench size={17} />, label: "Service mode", value: service.serviceMode },
    { icon: <MapPin size={17} />, label: "Service area", value: service.serviceArea },
    { icon: <ShieldCheck size={17} />, label: "Technician", value: "Verified" },
  ];

  return (
    <section className="fm-section-sm">
      <div className="fm-container">
        <Link href="/services" className="fm-muted" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 30 }}>
          <ArrowLeft size={15} /> Back to services
        </Link>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 52, alignItems: "start" }}>
          <div>
            <div className="fm-card" style={{ aspectRatio: "4 / 3" }}>
              <img
                src={service.image || "/services/generic.svg"}
                alt={service.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/services/generic.svg";
                }}
              />
            </div>
            <div className="fm-panel" style={{ marginTop: 18, padding: 22 }}>
              <span className="fm-eyebrow">Technician</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
                <div className="fm-avatar" style={{ width: 48, height: 48, display: "grid", placeItems: "center", background: "var(--fm-ink)", color: "var(--fm-paper)", fontSize: 18 }}>
                  {service.technicianName.charAt(0)}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 750, fontSize: 17 }}>{service.technicianName}</span>
                    {service.technicianPlan === "pro" ? (
                      <span className="fm-pro-badge"><BadgeCheck size={12} aria-hidden="true" /> Verified Pro</span>
                    ) : null}
                  </div>
                  <div className="fm-muted" style={{ fontSize: 13 }}>{service.serviceArea} · Verified technician</div>
                </div>
              </div>
              <p className="fm-muted" style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
                Skilled specialist with hands-on experience across {service.category} repairs. Clear communication and a service warranty on every job.
              </p>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="fm-pill">{service.category}</span>
              {service.reviewCount > 0 ? (
                <span className="fm-rating"><Star size={14} fill="currentColor" aria-hidden="true" /> {service.averageRating.toFixed(1)} · {service.reviewCount} review{service.reviewCount === 1 ? "" : "s"}</span>
              ) : null}
            </div>
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
                disabled={Boolean(accountUser && !canRequest) || Boolean(activeRequest)}
              >
                {!accountUser
                  ? "Sign in to request a repair"
                  : activeRequest
                    ? "Request already sent"
                    : canRequest
                      ? "Request Repair"
                      : "Customer account needed"}
              </button>
              {activeRequest ? (
                <p className="fm-muted" style={{ fontSize: 12, margin: "12px 0 0", textAlign: "center" }}>
                  You already have an active request for this service.{" "}
                  <Link href="/dashboard/customer/bookings" style={{ color: "var(--fm-blue)", textDecoration: "underline" }}>View it in My Bookings</Link>.
                </p>
              ) : null}
              {accountUser && !canRequest ? (
                <p className="fm-muted" style={{ fontSize: 12, margin: "12px 0 0", textAlign: "center" }}>
                  Create a customer account to book a repair.
                </p>
              ) : null}
              <p className="fm-muted" style={{ fontSize: 12, margin: "12px 0 0", textAlign: "center" }}>
                You only pay once your repair is complete.
              </p>
            </div>
          </div>
        </div>

        {service.reviewCount > 0 ? (
          <section style={{ marginTop: 64 }} aria-labelledby="customer-reviews">
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <h2 id="customer-reviews" className="fm-h3">Customer reviews</h2>
              <span className="fm-rating">
                <Star size={14} fill="currentColor" aria-hidden="true" />
                {service.averageRating.toFixed(1)} · {service.reviewCount} review{service.reviewCount === 1 ? "" : "s"}
              </span>
            </div>
            {reviewsLoading ? (
              <p className="fm-muted" style={{ marginTop: 18, fontSize: 14 }}>Loading customer reviews…</p>
            ) : (reviewData?.reviews ?? []).length === 0 ? (
              <p className="fm-muted" style={{ marginTop: 18, fontSize: 14 }}>
                Reviews for this service will appear here once they are published.
              </p>
            ) : (
              <div className="fm-grid fm-grid-3" style={{ marginTop: 22 }}>
                {(reviewData?.reviews ?? []).map((review, index) => (
                  <article key={`${review.customerName}-${index}`} className="fm-panel" style={{ padding: 22 }}>
                    <div className="fm-rating" style={{ display: "flex", gap: 3 }} aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} aria-hidden="true" />
                      ))}
                    </div>
                    <p style={{ margin: "14px 0", lineHeight: 1.65, fontSize: 14 }}>“{review.review}”</p>
                    <div className="fm-muted" style={{ fontSize: 12 }}>{review.customerName} · Verified customer</div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
      {accountUser && canRequest ? (
        <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} service={service} user={accountUser} />
      ) : null}
    </section>
  );
};
