"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/model";
import { cookieUtils } from "@/shared/utils/cookies";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    // Quick pre-check - if we have a token in cookie, initialize
    // auth state to loading=true until the full check completes
    const hasToken = !!cookieUtils.accessToken.get();

    // Always perform full auth check, but this pre-check helps
    // reduce flashing by ensuring we start with proper loading state
    const checkAuthentication = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        // Ensure loading is set to false even if there was an error
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [checkAuth, setLoading]);

  return children;
}
