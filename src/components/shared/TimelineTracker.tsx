const STEPS = ["requested", "accepted", "in-progress", "completed", "paid"];
export default function TimelineTracker({ status, paymentStatus }: { status: string; paymentStatus: string }) {
  const current = paymentStatus === "paid" ? "paid" : status;
  let idx = STEPS.indexOf(current);
  if (idx < 0) idx = 0;
  return (
    <div className="flex items-center gap-1 mt-3">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`w-2.5 h-2.5 rounded-full ${i <= idx ? "bg-[var(--accent)]" : "bg-[var(--line2)]"}`} />
          {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < idx ? "bg-[var(--accent)]" : "bg-[var(--line2)]"}`} />}
        </div>
      ))}
      <span className="text-xs text-[var(--muted)] ml-2 capitalize">{current}</span>
    </div>
  );
}
