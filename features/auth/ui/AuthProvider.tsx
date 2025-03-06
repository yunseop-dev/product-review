"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
interface AuthProviderProps {
  children: ReactNode;
  session?: Session;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
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

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {/* 기존 컴포넌트 */}
        {children}
        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default AuthProvider;
