"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DASHBOARD_HOME } from "@/lib/constants";
import type { Role } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut as signOutThunk } from "@/store/auth";

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();
  return { user, status, isReady: status === "ready", signOut: () => dispatch(signOutThunk()) };
};

export const useRequireAuth = (allowedRoles?: readonly Role[]) => {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/sign-in?next=${next}`);
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(DASHBOARD_HOME[user.role]);
    }
  }, [isReady, user, allowedRoles, router]);

  return { user, isReady };
};
