import "@/app/public.css";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { SkeletonCard } from "@/components/ui/misc";

export default function Loading() {
  return (
    <div className="cl-root">
      <PublicHeader />
      <main className="fm-container" style={{ padding: "90px 0" }}>
        <div className="fm-skeleton" style={{ height: 18, width: 180, marginBottom: 22 }} />
        <div className="fm-skeleton" style={{ height: 60, width: "60%", marginBottom: 30 }} />
        <div className="fm-grid fm-grid-3">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
