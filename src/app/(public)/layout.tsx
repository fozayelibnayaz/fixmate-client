import "@/app/public.css";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cl-root">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
