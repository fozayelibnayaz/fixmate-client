import { SkeletonCard } from "@/components/ui/misc";

export default function Loading() {
  return (
    <div className="fm-container" style={{ padding: "90px 20px" }}>
      <div className="fm-skeleton" style={{ height: 18, width: 180, marginBottom: 22 }} />
      <div className="fm-skeleton" style={{ height: 60, width: "60%", marginBottom: 30 }} />
      <div className="fm-grid fm-grid-3">
        {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    </div>
  );
}
