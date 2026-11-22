import { SkeletonCard } from "@/components/ui/misc";

export default function DashboardLoading() {
  return (
    <div className="fm-dash">
      <div className="fm-main">
        <div className="fm-topbar"><div className="fm-skeleton" style={{ height: 24, width: 200 }} /></div>
        <div style={{ padding: 30 }}>
          <div className="fm-skeleton" style={{ height: 16, width: 160, marginBottom: 18 }} />
          <div className="fm-skeleton" style={{ height: 44, width: "min(320px, 100%)", marginBottom: 30 }} />
          <div className="fm-grid fm-grid-3">
            {[1, 2, 3].map((key) => <SkeletonCard key={key} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
