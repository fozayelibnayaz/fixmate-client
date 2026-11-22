import type { Booking } from "@/lib/types";

const steps = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

export const StatusStepper = ({ booking }: { booking: Booking }) => {
  if (booking.status === "rejected" || booking.status === "cancelled") return null;
  const current =
    booking.paymentStatus === "paid"
      ? 4
      : Math.max(0, steps.findIndex((step) => step.key === booking.status));

  return (
    <div className="fm-steps" style={{ marginTop: 14 }}>
      {steps.map((step, index) => (
        <div key={step.key} style={{ display: "flex", alignItems: "center", gap: 7, flex: 1 }}>
          <div className={`fm-step-dot ${index <= current ? "done" : ""}`} title={step.label}>
            {index <= current ? "✓" : index + 1}
          </div>
          {index < steps.length - 1 ? <div className={`fm-step-line ${index < current ? "done" : ""}`} /> : null}
        </div>
      ))}
    </div>
  );
};
