import { STATUS_COLORS } from "@/lib/utils";

export default function StatusBadge({ status }: { status: string }) {
  return <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[status] || ""}`}>{status}</span>;
}
