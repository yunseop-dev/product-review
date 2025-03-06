"use client";

import { authKeys } from "@/features/auth/model";
import api from "@/shared/api/base";
import { cookieUtils } from "@/shared/utils/cookies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // QueryClient를 상태로 관리하여 서버 사이드 렌더링 문제 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // 앱이 시작될 때 인증 상태 초기화
  useEffect(() => {
    // 토큰이 있으면 사용자 정보 프리페치
    const initializeAuth = async () => {
      const token = cookieUtils.accessToken.get(null);

      if (token) {
        try {
          const userResponse = await api.get("/auth/me");
          queryClient.setQueryData(authKeys.current(), userResponse.data);
        } catch (error) {
          console.error("Auth initialization failed:", error);
          cookieUtils.clearAuthCookies(null);
        }
      }
    };

    initializeAuth();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* 기존 컴포넌트 */}
      {children}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default AuthProvider;
