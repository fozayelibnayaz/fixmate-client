import type { BookingStatus, Role } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export const STATUS_LABEL: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<BookingStatus, string> = {
  requested: "blue",
  accepted: "indigo",
  "in-progress": "amber",
  completed: "green",
  rejected: "red",
  cancelled: "gray",
};

export const DASHBOARD_HOME: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

export const CATEGORY_ICONS: Record<string, string> = {
  Smartphone: "📱",
  "Laptop & PC": "💻",
  AC: "❄️",
  Refrigerator: "🧊",
  TV: "📺",
  "Washing Machine": "🌀",
  Electrical: "⚡",
};
