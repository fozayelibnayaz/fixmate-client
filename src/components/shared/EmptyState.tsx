import { LucideIcon } from "lucide-react";

export default function EmptyState({ icon: Icon, title, description, action }: { icon?: LucideIcon; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">{Icon ? <Icon size={48} className="mx-auto text-[var(--muted)]" /> : "📭"}</div>
      <p className="font-semibold mb-1">{title}</p>
      {description && <p className="text-[var(--muted)] text-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
