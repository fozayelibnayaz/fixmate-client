export default function StatsCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5">
      <p className="text-xs font-mono text-[var(--muted)] uppercase">{label}</p>
      <p className="text-3xl font-bold mt-2 text-[var(--accent)]">{value}</p>
    </div>
  );
}
