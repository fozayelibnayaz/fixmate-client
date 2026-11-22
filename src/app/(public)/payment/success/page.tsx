import { PaymentSuccess } from "@/components/payment/payment-result";

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id = "" } = await searchParams;
  return <PaymentSuccess sessionId={session_id} />;
}
