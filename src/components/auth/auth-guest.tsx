"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DASHBOARD_HOME } from "@/lib/constants";

export const AuthGuest = ({ children }: { children: React.ReactNode }) => {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && user) router.replace(DASHBOARD_HOME[user.role]);
  }, [isReady, user, router]);

  return <>{children}</>;
};
