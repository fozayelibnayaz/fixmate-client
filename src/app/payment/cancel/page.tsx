import StatusShell from "@/components/shared/StatusShell";
export default function CancelPage() {
  return <StatusShell icon="🚫" title="Payment cancelled" message="No charges were made. Your job is still waiting — you can try again anytime." action="/dashboard/customer/bookings" actionLabel="Back to My Bookings" />;
}
