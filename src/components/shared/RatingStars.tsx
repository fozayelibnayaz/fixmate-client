export default function RatingStars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange?.(n)} className={`text-2xl ${n <= value ? "text-[var(--accent)]" : "text-[var(--muted)]"} ${onChange ? "cursor-pointer" : "cursor-default"}`}>
          ★
        </button>
      ))}
    </div>
  );
}
