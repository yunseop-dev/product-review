import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "./model";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import { cookieUtils } from "@/shared/utils/cookies";

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
        // DummyJSON에는 /auth/me 엔드포인트가 없으므로
        // 토큰이 있을 경우 캐시된 사용자 정보를 직접 반환
        const token = cookieUtils.accessToken.get(null);
        if (!token) return null;

        // userId가 캐싱되어 있다면 사용자 정보 조회
        const userId = cookieUtils.userId.get(null);
        if (userId) {
          const response = await api.get(`/users/${userId}`);
          return response.data;
        }

        return null;
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
      // 토큰 저장
      cookieUtils.accessToken.set(data.token, null);

      // 사용자 ID 저장 (사용자 정보 조회 시 필요)
      if (data.id) {
        cookieUtils.userId.set(data.id.toString(), null);
      }

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
