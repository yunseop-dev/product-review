"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return children;
}
