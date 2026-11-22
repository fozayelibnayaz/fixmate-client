import Link from "next/link";
import type { ReactNode } from "react";

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: { label: string; href: string };
}) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>
    <div>
      <span className="fm-eyebrow">{eyebrow}</span>
      <h2 className="fm-h2" style={{ marginTop: 16 }}>{title}</h2>
      {description ? <p className="fm-lead">{description}</p> : null}
    </div>
    {action ? (
      <Link href={action.href} className="fm-btn fm-btn-ghost fm-btn-sm">
        {action.label} →
      </Link>
    ) : null}
  </div>
);

export const EmptyState = ({
  icon = "🔧",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) => (
  <div className="fm-empty">
    <div className="fm-empty-icon">{icon}</div>
    <h3 className="fm-h3" style={{ marginTop: 14 }}>{title}</h3>
    <p className="fm-muted" style={{ margin: "10px auto 22px", maxWidth: 420 }}>{description}</p>
    {action ? (
      <Link href={action.href} className="fm-btn fm-btn-primary">{action.label}</Link>
    ) : null}
  </div>
);

export const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) => (
  <div className="fm-stat">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span className="fm-stat-label">{label}</span>
      {icon}
    </div>
    <div className="fm-stat-value">{value}</div>
  </div>
);

export const SkeletonCard = () => (
  <div className="fm-card" style={{ padding: 0 }}>
    <div className="fm-skeleton" style={{ aspectRatio: "4 / 3", borderRadius: 0 }} />
    <div style={{ padding: 18 }}>
      <div className="fm-skeleton" style={{ height: 16, width: "70%", marginBottom: 12 }} />
      <div className="fm-skeleton" style={{ height: 12, width: "45%", marginBottom: 18 }} />
      <div className="fm-skeleton" style={{ height: 38, width: "100%" }} />
    </div>
  </div>
);

export const Spinner = ({ label = "Loading…" }: { label?: string }) => (
  <div style={{ display: "grid", placeItems: "center", minHeight: 320, gap: 14 }}>
    <div className="fm-skeleton" style={{ width: 44, height: 44, borderRadius: "50%" }} />
    <span className="fm-muted" style={{ fontSize: 14 }}>{label}</span>
  </div>
);
