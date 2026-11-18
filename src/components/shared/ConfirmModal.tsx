export default function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message?: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={onCancel}>
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {message && <p className="text-sm text-[var(--muted)] mb-4">{message}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button onClick={onConfirm} className="btn btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  );
}
