"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardIndex() {
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then((s: any) => {
      const role = s?.data?.user?.role || "customer";
      router.replace(role === "admin" ? "/dashboard/admin" : role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
    });
  }, [router]);
  return <div className="min-h-screen grid place-items-center">Redirecting...</div>;
}
