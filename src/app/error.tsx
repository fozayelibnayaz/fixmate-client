"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-[var(--muted)] mb-6">{error.message || "Unexpected error."}</p>
        <button onClick={reset} className="btn btn-primary"><span>Try again</span></button>
      </div>
    </div>
  );
}
