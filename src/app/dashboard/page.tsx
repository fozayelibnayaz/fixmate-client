"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/misc";
import { useAuth } from "@/hooks/use-auth";
import { DASHBOARD_HOME } from "@/lib/constants";

const DashboardIndexPage = () => {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    router.replace(user ? DASHBOARD_HOME[user.role] : "/sign-in");
  }, [isReady, user, router]);

  return <Spinner label="Opening your dashboard…" />;
};

export default DashboardIndexPage;
