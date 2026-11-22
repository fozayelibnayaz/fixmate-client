import { STATUS_LABEL, STATUS_TONE } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types";

export const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <span className={`fm-status fm-status-${STATUS_TONE[status] ?? "gray"}`}>
    {STATUS_LABEL[status] ?? status}
  </span>
);

export const PaymentBadge = ({ paid }: { paid: boolean }) => (
  <span className={`fm-status ${paid ? "fm-status-green" : "fm-status-gray"}`}>
    {paid ? "Paid" : "Unpaid"}
  </span>
);

export const ApprovalBadge = ({ status }: { status: string }) => (
  <span
    className={`fm-status ${
      status === "approved"
        ? "fm-status-green"
        : status === "rejected"
          ? "fm-status-red"
          : "fm-status-amber"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);
