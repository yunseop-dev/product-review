import api from "@/shared/api/base";
import { cookieUtils } from "@/shared/utils/cookies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys } from "./model";

// 현재 인증 상태 확인 (DummyJSON에 맞게 수정)
export function useAuth() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: authKeys.current(),
    queryFn: async () => {
      try {
        const response = await api.get("/auth/me");
        return response.data;
      } catch (error) {
        console.error("Auth check error:", error);
        return null;
      }
    },
    retry: false,
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  };
}

// 로그인 처리
export function useAuthLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      debugger;
      // 토큰 저장
      cookieUtils.accessToken.set(data.accessToken, null);

      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(authKeys.current(), data);

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // 홈 페이지로 리디렉션
      router.push("/");
    },
  });
}

// 로그아웃 처리
export function useAuthLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // DummyJSON은 로그아웃 엔드포인트를 제공하지 않으므로
      // 클라이언트 쪽에서만 처리

      // 토큰 삭제
      cookieUtils.clearAuthCookies(null);

      return true;
    },
    onSuccess: () => {
      // 사용자 정보 캐시 제거
      queryClient.setQueryData(authKeys.current(), null);

      // 캐시된 쿼리 초기화
      queryClient.invalidateQueries();

      // 로그인 페이지로 리디렉션
      router.push("/login");
    },
  });
}
