import type { ReactNode } from "react";

export const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
    <div>
      <span className="fm-eyebrow">{eyebrow}</span>
      <h1 className="fm-h2" style={{ fontSize: "clamp(30px, 4vw, 46px)", marginTop: 12 }}>{title}</h1>
      {subtitle ? <p className="fm-muted" style={{ margin: "10px 0 0", fontSize: 14 }}>{subtitle}</p> : null}
    </div>
    {action}
  </div>
);

export const MiniBarChart = ({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number }>;
}) => {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <div className="fm-panel" style={{ padding: 22 }}>
      <h3 style={{ fontSize: 15, margin: "0 0 24px" }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 150 }}>
        {data.map((item) => (
          <div key={item.label} style={{ flex: 1, display: "grid", gap: 8, justifyItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{item.value}</span>
            <div className="fm-chart-bar" style={{ width: "100%", height: `${Math.max(6, (item.value / max) * 105)}px` }} />
            <span className="fm-muted" style={{ fontSize: 10, textAlign: "center" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StatusLegend = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {[
      ["fm-status-blue", "Requested"],
      ["fm-status-indigo", "Accepted"],
      ["fm-status-amber", "In Progress"],
      ["fm-status-green", "Completed"],
      ["fm-status-red", "Rejected"],
      ["fm-status-gray", "Cancelled"],
    ].map(([tone, label]) => (
      <span key={label} className={`fm-status ${tone}`}>{label}</span>
    ))}
  </div>
);
