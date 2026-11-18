export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";
export const CATEGORIES = ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"] as const;
export const STATUS_COLORS: Record<string, string> = {
  requested: "bg-blue-500/20 text-blue-400",
  accepted: "bg-violet-500/20 text-violet-400",
  "in-progress": "bg-amber-500/20 text-amber-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-gray-500/20 text-gray-400",
  rejected: "bg-red-500/20 text-red-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  unpaid: "bg-gray-500/20 text-gray-400",
};
