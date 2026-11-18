import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fixmate_token");
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem("fixmate_token", t);
  else localStorage.removeItem("fixmate_token");
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { ...(init.headers as any) };
  if (!(init.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${SERVER_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.message || "Request failed");
  }
  return res.json();
}

export function formatMoney(n: number) {
  return `$${n.toFixed(0)}`;
}
export const CATEGORIES = ["Smartphone","Laptop & PC","AC","Refrigerator","TV","Washing Machine","Electrical"] as const;
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
