"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/utils";
import { toast } from "sonner";

function SuccessContent() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    api(`/api/payments/verify?session_id=${sessionId}`)
      .then((r) => { setResult(r); toast.success("Payment successful!"); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="min-h-screen grid place-items-center">Verifying payment...</div>;
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
        {result?.payment && (
          <div className="text-sm text-[var(--muted)] space-y-1 mb-6">
            <p>Amount: ${result.payment.amount}</p>
            <p>Transaction: {result.payment.transactionId}</p>
          </div>
        )}
        <Link href="/dashboard/customer/bookings" className="btn btn-primary"><span>Back to My Bookings</span></Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
