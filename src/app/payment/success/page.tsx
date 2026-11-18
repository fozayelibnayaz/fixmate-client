"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import StatusShell from "@/components/shared/StatusShell";

function SuccessContent() {
  const sp = useSearchParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const sid = sp.get("session_id");
    if (!sid) { setLoading(false); return; }
    api(`/api/payments/verify?session_id=${sid}`).then((r) => { setResult(r); toast.success("Payment recorded!"); }).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [sp]);
  if (loading) return <div className="min-h-screen grid place-items-center">Verifying your payment...</div>;
  return (
    <StatusShell icon="✅" title="Payment successful" message={result?.payment ? `Amount $${result.payment.amount} paid. Transaction ${result.payment.transactionId}.` : "Your payment has been recorded."} action="/dashboard/customer/bookings" actionLabel="Back to My Bookings" />
  );
}
export default function SuccessPage() { return <Suspense fallback={<div>Loading...</div>}><SuccessContent /></Suspense>; }
