import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-[var(--muted)] text-sm mb-6">No charges were made. You can try again.</p>
        <Link href="/dashboard/customer/bookings" className="btn btn-primary"><span>Try Again</span></Link>
      </div>
    </div>
  );
}
